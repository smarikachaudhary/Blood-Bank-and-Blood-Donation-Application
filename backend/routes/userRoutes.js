const express = require("express");
const mongoose = require("mongoose"); // Ensure ObjectId validation
const {
  validateDonor,
  validateRecipient,
  createDonor,
  getDonors,
  createRecipient,
  updateDonor,
  updateRecipient,
  getAllUsers,
  rebutUser,
} = require("../controllers/userController");
const { verifyToken } = require("../middlewares/verifyToken");
const User = require("../models/User");
const Donor = require("../models/Donor");
const Recipient = require("../models/Recipient");

const router = express.Router();

// Validation routes
router.post("/validate-donor/:userId", validateDonor);
router.post("/validate-recipient/:userId", validateRecipient);
router.post("/rebut-user/:userId", rebutUser);

// Fetch all donors
router.get("/donors", async (req, res) => {
  try {
    const donors = await Donor.find();
    res.status(200).json(donors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching donors", error: error.message });
  }
});

//Fetch single donor
router.get("/donors/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid donor ID" });
    }

    const donor = await Donor.findById(id);
    if (!donor) return res.status(404).json({ message: "Donor not found" });

    res.status(200).json(donor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Fetch all recipients
router.get("/recipients", async (req, res) => {
  try {
    const recipients = await Recipient.find();
    res.status(200).json(recipients);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching recipients", error: error.message });
  }
});

//Fetch single recipient
router.get("/recipients/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid recipient ID" });
    }

    const recipient = await Recipient.findById(id);
    if (!recipient)
      return res.status(404).json({ message: "Recipient not found" });

    res.status(200).json(recipient);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//deleting donor
router.delete("/donors/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid donor ID" });
    }

    const donor = await Donor.findByIdAndDelete(id);
    if (!donor) return res.status(404).json({ message: "Donor not found" });

    res.json({ message: "Donor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//deleting recipient
router.delete("/recipients/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid recipient ID" });
    }

    const recipient = await Recipient.findByIdAndDelete(id);
    if (!recipient)
      return res.status(404).json({ message: "Recipient not found" });

    res.json({ message: "Recipient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ADD DONOR
router.post("/donors", verifyToken, createDonor);

// UPDATE DONOR
router.put("/donors/:id", updateDonor);

// ADD Recipient
router.post("/recipients", verifyToken, createRecipient);

// UPDATE Recipient
router.put("/recipients/:id", updateRecipient);

// Get all users with validation status
router.get("/all-users", getAllUsers);

// Change Password Route
router.put("/change-password", verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // This comes from the verifyToken middleware

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if old password matches
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res
      .status(500)
      .json({ message: "Error changing password", error: error.message });
  }
});

module.exports = router;
