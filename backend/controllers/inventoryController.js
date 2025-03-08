const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/User");
const donorModel = require("../models/Donor");
const recipientModel = require("../models/Recipient");
const hospitalModel = require("../models/Hospital");

// Create Inventory Entry (Admin only)
const createInventoryController = async (req, res) => {
  try {
    const {
      email,
      inventoryType,
      bloodType,
      quantity,
      donatedBy,
      donatedTo,
      hospital,
    } = req.body;

    // Find admin
    const admin = await userModel.findOne({
      email: "smarikachaudhary10@gmail.com",
      role: "admin",
    });
    if (!admin) {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can manage inventory" });
    }

    // Find the donor using the provided email
    let donor = null;
    if (inventoryType === "in") {
      donor = await donorModel.findOne({ email: donatedBy }); // Find donor by email
      if (!donor) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid donor email" });
      }
    }

    // Validate recipient or hospital for "out" transactions
    let recipient = null;
    let hospitalData = null;
    if (inventoryType === "out") {
      // First try to find the recipient by email
      recipient = donatedTo
        ? await recipientModel.findOne({ email: donatedTo })
        : null;
      if (!recipient) {
        // If no recipient is found, try to find the hospital by email
        hospitalData = hospital
          ? await hospitalModel.findOne({ email: hospital })
          : null;
      }

      if (!recipient && !hospitalData) {
        return res.status(400).json({
          success: false,
          message: "Invalid recipient or hospital email",
        });
      }

      // Check available blood stock
      const totalIn = await inventoryModel.aggregate([
        { $match: { inventoryType: "in", bloodType } },
        { $group: { _id: "$bloodType", total: { $sum: "$quantity" } } },
      ]);
      const totalOut = await inventoryModel.aggregate([
        { $match: { inventoryType: "out", bloodType } },
        { $group: { _id: "$bloodType", total: { $sum: "$quantity" } } },
      ]);

      const availableBlood =
        (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0);
      if (availableBlood < quantity) {
        return res.status(400).json({
          success: false,
          message: "Only ${availableBlood} ML available for ${bloodType}",
        });
      }
    }

    // Create inventory record
    const inventory = new inventoryModel({
      inventoryType,
      bloodType,
      quantity,
      admin: admin._id,
      email,
      donatedBy: donor ? donor._id : null, // Store donor ObjectId
      donatedTo: recipient ? recipient._id : null, // Store recipient ObjectId or hospital ObjectId
      hospital: hospitalData ? hospitalData._id : null, // Store hospital ObjectId
    });
    await inventory.save();

    return res.status(201).json({
      success: true,
      message: "Inventory updated successfully",
      inventory,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in creating inventory",
      error: error.message,
    });
  }
};

// Get All Inventory (Admin only)
const getInventoryController = async (req, res) => {
  try {
    const { email } = req.body;

    // Verify admin
    const admin = await userModel.findOne({ email, role: "admin" });
    if (!admin) {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can view inventory" });
    }

    // Get all inventory records with populated references
    const inventory = await inventoryModel
      .find()
      .populate("donatedBy", "email") // Populate donatedBy (donor's email)
      .populate("donatedTo", "email") // Populate donatedTo (recipient's email)
      .populate("hospital", "email") // Populate hospital's email
      .sort({ createdAt: -1 });

    // Format the response based on inventoryType
    const formattedInventory = inventory.map((record) => {
      if (record.inventoryType === "in") {
        // If inventoryType is "in", show donatedBy (donor email)
        record.donatedBy = record.donatedBy ? record.donatedBy.email : null;
        record.donatedTo = null; // Clear donatedTo for "in"
        record.hospital = null; // Clear hospital for "in"
      } else if (record.inventoryType === "out") {
        // If inventoryType is "out", show donatedTo (recipient email) or hospital email
        record.donatedBy = null; // Clear donatedBy for "out"
        record.donatedTo = record.donatedTo ? record.donatedTo.email : null;
        record.hospital = record.hospital ? record.hospital.email : null;
      }

      return record;
    });

    return res
      .status(200)
      .json({ success: true, inventory: formattedInventory });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching inventory",
      error: error.message,
    });
  }
};

module.exports = { createInventoryController, getInventoryController };
