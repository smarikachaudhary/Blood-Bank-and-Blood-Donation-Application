const express = require("express");
const mongoose = require("mongoose"); // Ensure ObjectId validation
const {
  validateDonor,
  validateHospital,
  validateRecipient,
  createDonor,
  getDonors,
  createRecipient,
  createHospital,
  updateDonor,
  updateRecipient,
  updateHospital,
} = require("../controllers/userController");
const { verifyToken } = require("../middlewares/verifyToken");
const Donor = require("../models/Donor");
const Recipient = require("../models/Recipient");
const Hospital = require("../models/Hospital");

const router = express.Router();

// Validation routes
router.post("/validate-donor/:userId", validateDonor);
router.post("/validate-hospital/:userId", validateHospital);
router.post("/validate-recipient/:userId", validateRecipient);

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

// Fetch all hospitals
router.get("/hospitals", async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.status(200).json(hospitals);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching hospitals", error: error.message });
  }
});

//Fetch single hospital
router.get("/hospitals/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid hospital ID" });
    }

    const hospital = await Hospital.findById(id);
    if (!hospital)
      return res.status(404).json({ message: "Hospital not found" });

    res.status(200).json(hospital);
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

//deleting hospital
router.delete("/hospitals/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid hospital ID" });
    }

    const hospital = await Hospital.findByIdAndDelete(id);
    if (!hospital)
      return res.status(404).json({ message: "Hospital not found" });

    res.json({ message: "Hospital deleted successfully" });
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

// ADD Hospital
router.post("/hospitals", verifyToken, createHospital);

// UPDATE Hospital
router.put("/hospitals/:id", updateHospital);

module.exports = router;
