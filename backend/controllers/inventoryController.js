const mongoose = require("mongoose");
const inventoryModel = require("../models/InventoryModel");
const userModel = require("../models/User");
const donorModel = require("../models/Donor");
const recipientModel = require("../models/Recipient");
const Donor = require("../models/Donor");
const Recipient = require("../models/Recipient");

// Create Inventory Entry (Admin only)
const createInventoryController = async (req, res) => {
  try {
    const {
      email,
      role,
      inventoryType,
      bloodType,
      quantity,
      donatedBy,
      donatedTo,
    } = req.body;

    console.log("Received Request Body:", req.body);

    // Validate role
    if (!role) {
      return res
        .status(400)
        .json({ success: false, message: "Role is required" });
    }

    // Ensure only admin can create inventory
    if (role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can manage inventory" });
    }

    // Find admin
    const admin = await userModel.findOne({ email, role });
    if (!admin) {
      return res
        .status(403)
        .json({ success: false, message: "Admin not found" });
    }

    // Find donor if inventory type is 'in'
    let donor = null;
    if (inventoryType === "in") {
      donor = await donorModel.findOne({ email: donatedBy });
      if (!donor) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid donor email" });
      }
    }

    // Validate recipient for 'out' transactions
    let recipient = null;
    if (inventoryType === "out") {
      recipient = donatedTo
        ? await recipientModel.findOne({ email: donatedTo })
        : null;
      if (!recipient) {
        return res.status(400).json({
          success: false,
          message: "Invalid recipient email",
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
          message: `Only ${availableBlood} ML available for ${bloodType}`,
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
      donatedBy: donor ? donor._id : null,
      donatedTo: recipient ? recipient._id : null,
    });
    await inventory.save();

    return res.status(201).json({
      success: true,
      message: "Inventory updated successfully",
      inventory,
    });
  } catch (error) {
    console.error("Error in creating inventory:", error);
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
    const { role, email } = req.user;

    // Ensure only admins can view inventory
    if (role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can view inventory" });
    }

    const inventory = await inventoryModel
      .find()
      .populate("donatedBy", "email")
      .populate("donatedTo", "email")
      .sort({ createdAt: -1 });
    const formattedInventory = inventory.map((record) => {
      if (record.inventoryType === "in") {
        record.donatedBy = record.donatedBy ? record.donatedBy.email : null;
        record.donatedTo = null;
      } else if (record.inventoryType === "out") {
        record.donatedBy = null;
        record.donatedTo = record.donatedTo ? record.donatedTo.email : null;
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

const deleteInventoryController = async (req, res) => {
  try {
    const { id } = req.params; // Get the inventory ID from the request params
    const inventory = await inventoryModel.findByIdAndDelete(id);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Inventory item deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error deleting inventory item",
      error: error.message,
    });
  }
};

const getBloodAnalyticsController = async (req, res) => {
  try {
    const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
    const analytics = {};

    // Initialize all blood types with 0
    bloodTypes.forEach((type) => {
      analytics[type] = 0;
    });

    // Calculate total available blood for each type
    const results = await inventoryModel.aggregate([
      {
        $group: {
          _id: "$bloodType",
          totalIn: {
            $sum: {
              $cond: [{ $eq: ["$inventoryType", "in"] }, "$quantity", 0],
            },
          },
          totalOut: {
            $sum: {
              $cond: [{ $eq: ["$inventoryType", "out"] }, "$quantity", 0],
            },
          },
        },
      },
    ]);

    // Calculate available units for each blood type
    results.forEach((result) => {
      const available = result.totalIn - result.totalOut;
      analytics[result._id] = available > 0 ? available : 0;
    });

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("Error in blood analytics:", error);
    return res.status(500).json({
      success: false,
      message: "Error calculating blood analytics",
      error: error.message,
    });
  }
};

module.exports = {
  createInventoryController,
  getInventoryController,
  deleteInventoryController,
  getBloodAnalyticsController,
};
