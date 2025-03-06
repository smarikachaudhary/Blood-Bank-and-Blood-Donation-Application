const User = require("../models/User");
const Donor = require("../models/Donor");
const Hospital = require("../models/Hospital");
const Recipient = require("../models/Recipient");

exports.validateDonor = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user || user.role !== "donor") {
      return res.status(400).json({ message: "User not found or not a donor" });
    }

    // Check if donor already exists
    const existingDonor = await Donor.findOne({ userId });
    if (existingDonor) {
      return res.status(400).json({ message: "Donor is already validated" });
    }

    // Create a new donor entry
    const newDonor = new Donor({
      userId: user._id,
      name: user.donorName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      bloodType: "O+", // This should be fetched from user input
      status: "approved",
    });

    await newDonor.save();

    res
      .status(200)
      .json({ message: "Donor validated successfully", donor: newDonor });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Validate Hospital
exports.validateHospital = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user || user.role !== "hospital") {
      return res
        .status(400)
        .json({ message: "User not found or not a hospital" });
    }

    // Check if hospital already exists
    const existingHospital = await Hospital.findOne({ userId });
    if (existingHospital) {
      return res.status(400).json({ message: "Hospital is already validated" });
    }

    // Create a new hospital entry
    const newHospital = new Hospital({
      userId: user._id,
      hospitalName: user.hospitalName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      bloodStock: {},
      status: "approved",
    });

    await newHospital.save();

    res.status(200).json({
      message: "Hospital validated successfully",
      hospital: newHospital,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Validate Recipient
exports.validateRecipient = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user || user.role !== "recipient") {
      return res
        .status(400)
        .json({ message: "User not found or not a recipient" });
    }

    // Check if recipient already exists
    const existingRecipient = await Recipient.findOne({ userId });
    if (existingRecipient) {
      return res
        .status(400)
        .json({ message: "Recipient is already validated" });
    }

    // Create a new recipient entry
    const newRecipient = new Recipient({
      userId: user._id,
      recipientName: user.recipientName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      status: "approved",
    });

    await newRecipient.save();

    res.status(200).json({
      message: "Recipient validated successfully",
      recipient: newRecipient,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// CREATE newDONOR

exports.createDonor = async (req, res) => {
  try {
    const newDonor = new Donor(req.body);
    const donor = await newDonor.save();
    res.status(201).json(donor);
  } catch (error) {
    console.error("Error creating donor:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE DONOR

exports.updateDonor = async (req, res) => {
  try {
    const updatedDonor = await Donor.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedDonor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    res.status(200).json(updatedDonor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE newRecipient

exports.createRecipient = async (req, res) => {
  try {
    const newRecipient = new Recipient(req.body);
    const recipient = await newRecipient.save();
    res.status(201).json(recipient);
  } catch (error) {
    console.error("Error creating recipient:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE Recipient
exports.updateRecipient = async (req, res) => {
  try {
    const updatedRecipient = await Recipient.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedRecipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }
    res.status(201).json(updatedRecipient);
  } catch (error) {
    res.status(500).json(error);
  }
};

// CREATE newHospital

exports.createHospital = async (req, res) => {
  try {
    const newHospital = new Hospital(req.body);
    const hospital = await newHospital.save();
    res.status(201).json(hospital);
  } catch (error) {
    console.error("Error creating hospital:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE Hospital

exports.updateHospital = async (req, res) => {
  try {
    const updatedHospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedHospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    res.status(201).json(updatedHospital);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Get all donors
exports.getDonors = async (req, res) => {
  try {
    const donors = await Donor.find();
    res.status(200).json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
