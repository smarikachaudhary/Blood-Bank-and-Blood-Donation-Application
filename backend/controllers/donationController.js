const Donation = require("../models/Donation");
const Request = require("../models/Request");
// Submit a donation
exports.submitDonation = async (req, res) => {
  try {
    const { donatedBy, donationDate, bloodType, donatedQuantity } = req.body;

    if (!donatedBy || !donationDate || !bloodType || !donatedQuantity) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Save the donation
    const newDonation = new Donation({
      donatedBy,
      donationDate,
      bloodType,
      donatedQuantity,
    });
    await newDonation.save();

    // Find the request that matches the blood type
    const request = await Request.findOne({ requestedBloodGroup: bloodType });

    if (!request) {
      return res.status(404).json({ message: "Matching request not found." });
    }

    // Update the request with the new donated quantity
    request.donatedQuantity = (request.donatedQuantity || 0) + donatedQuantity;

    // Check if the request is fully met
    if (request.donatedQuantity >= request.requestedQuantity) {
      await Request.deleteOne({ _id: request._id }); // Remove the request if fulfilled
    } else {
      await request.save(); // Save updated request if not fully met
    }

    res.status(201).json({
      message: "Donation submitted successfully.",
      donation: newDonation,
    });
  } catch (error) {
    res.status(500).json({ message: "Error submitting donation", error });
  }
};

// Get all donations
exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find();
    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donations", error });
  }
};

// Get donations by donor name
exports.getDonationsByDonor = async (req, res) => {
  try {
    const { donorName } = req.params;
    const donations = await Donation.find({ donatedBy: donorName });
    res.status(200).json(donations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching donor's donations", error });
  }
};
