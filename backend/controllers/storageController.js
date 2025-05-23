const User = require("../models/User");
const EligibilityRequest = require("../models/EligibilityRequest");
const BloodStorage = require("../models/BloodStorage");

const donateBlood = async (req, res) => {
  try {
    // 1. Get email from token
    const { email } = req.user; // directly accessing from req.user set by getTokenAndEmail middleware

    // 2. Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if citizenship document is uploaded
    if (!user.citizenshipDocument) {
      return res.status(403).json({
        message: "Upload your citizenship document before donating blood",
      });
    }

    // 3. Find eligibility request and check if approved
    const eligibility = await EligibilityRequest.findOne({
      email,
      status: "Approved",
    });
    if (!eligibility) {
      return res.status(403).json({
        message:
          "You are not eligible to donate blood. Please wait for admin approval.",
      });
    }

    // 4. Create the blood storage entry
    const newDonation = new BloodStorage({
      ...req.body,
      donorEmail: email,
    });

    await newDonation.save();

    res.status(201).json({
      message: "Blood donation submitted successfully",
      data: newDonation,
    });
  } catch (error) {
    console.error("Error in donating blood:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { donateBlood };
