const Donation = require("../models/Donation");
const Request = require("../models/Request");

exports.submitDonation = async (req, res) => {
  try {
    console.log("Incoming donation data:", req.body);

    const {
      donatedBy,
      donorEmail,
      donorId,
      donationDate,
      bloodType,
      donatedQuantity,
      requestedQuantity,
    } = req.body;

    // Validate required fields
    if (!donatedBy || !bloodType || !donatedQuantity || !requestedQuantity) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (donor name, blood type, quantities)",
      });
    }

    // Convert and validate quantities
    const donatedQty = Number(donatedQuantity);
    const requestedQty = Number(requestedQuantity);

    if (isNaN(donatedQty) || isNaN(requestedQty)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity format",
      });
    }

    if (donatedQty <= 0) {
      return res.status(400).json({
        success: false,
        message: "Donation quantity must be greater than 0",
      });
    }

    // Create new donation
    const newDonation = new Donation({
      donorId,
      donatedBy,
      donorEmail,
      donationDate: donationDate || new Date(),
      bloodType,
      donatedQuantity: donatedQty,
      requestedQuantity: requestedQty,
      requestApproval: "Pending",
    });

    await newDonation.save();

    // Find matching open requests
    const matchingRequests = await Request.find({
      requestedBloodGroup: bloodType,
      $expr: { $lt: ["$donatedQuantity", "$requestedQuantity"] },
      status: { $ne: "Fulfilled" }, // Ensure we don't process already fulfilled requests
    }).sort({ neededTime: 1 });

    console.log(`Found ${matchingRequests.length} matching requests`);

    let remainingQty = donatedQty;
    const fulfilledRequestIds = [];

    for (const request of matchingRequests) {
      if (remainingQty <= 0) break;

      const neededQty = request.requestedQuantity - request.donatedQuantity;
      const allocateQty = Math.min(neededQty, remainingQty);

      request.donatedQuantity += allocateQty;
      remainingQty -= allocateQty;

      if (request.donatedQuantity >= request.requestedQuantity) {
        request.status = "Fulfilled";
        fulfilledRequestIds.push(request._id);
      }

      await request.save();
    }

    // Delete all fulfilled requests
    if (fulfilledRequestIds.length > 0) {
      await Request.deleteMany({ _id: { $in: fulfilledRequestIds } });
      console.log(`Deleted ${fulfilledRequestIds.length} fulfilled requests`);
    }

    res.status(201).json({
      success: true,
      message: "Donation submitted successfully",
      donation: newDonation,
      fulfilledRequestIds,
      remainingQuantity: remainingQty > 0 ? remainingQty : 0,
    });
  } catch (error) {
    console.error("Donation submission error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error processing donation",
      error: error.message,
    });
  }
};

exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().lean(); // Convert to plain JS objects

    const formattedDonations = donations.map((donation) => ({
      ...donation,
      requestedQuantity: donation.requestedQuantity ?? 0, // Fallback to 0
    }));

    res.status(200).json({
      success: true,
      count: formattedDonations.length,
      donations: formattedDonations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching donations",
      error: error.message,
    });
  }
};

exports.getDonationsByDonor = async (req, res) => {
  try {
    const { donorName } = req.params;
    const donations = await Donation.find({ donatedBy: donorName });
    res.status(200).json({
      success: true,
      count: donations.length,
      donations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching donor's donations",
      error: error.message,
    });
  }
};
