
const User = require("../models/User");
const Donor = require("../models/Donor");
const Hospital = require("../models/Hospital");
const Recipient = require("../models/Recipient");

const { createNotification } = require("./notificationController");
const { sendWebSocketNotification } = require("../utils/websocket");
const mongoose = require("mongoose");
const User = require("../models/User");
const Donor = require("../models/Donor");
const Recipient = require("../models/Recipient");
const Request = require("../models/Request");


exports.validateDonor = async (req, res) => {
  try {
    const { userId } = req.params;

    const { bloodType } = req.body;

    // Validate blood type
    if (!bloodType) {
      return res.status(400).json({ message: "Blood type is required" });
    }

    // Check if blood type is valid
    const validBloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    if (!validBloodTypes.includes(bloodType)) {
      return res.status(400).json({ message: "Invalid blood type" });
    }


    // Find user by ID
    const user = await User.findById(userId);
    if (!user || user.role !== "donor") {
      return res.status(400).json({ message: "User not found or not a donor" });
    }


    // Check if donor already exists
    const existingDonor = await Donor.findOne({ userId });
    if (existingDonor) {
      return res.status(400).json({ message: "Donor is already validated" });

    // Check if donor already exists by userId
    
    const existingDonorByUserId = await Donor.findOne({ userId });
    if (existingDonorByUserId) {
      return res.status(400).json({ message: "Donor already validated" });
    }

    // Check if donor already exists by email
    const existingDonorByEmail = await Donor.findOne({ email: user.email });
    if (existingDonorByEmail) {
      return res.status(400).json({ message: "Donor already validated" });

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

      bloodType: bloodType, // Using the blood type from the request
      status: "Validated",

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

    // Send verification notification to donor
    try {
      // Create donor notification
      const Notification = require('../models/Notification');
      
      // Create the notification for the donor
      const notification = await Notification.create({
        userId: user._id,
        message: 'Your account has been verified!',
        type: 'account_verified',
        isRead: false,
        createdAt: new Date(),
      });
      
      // Send notification via WebSocket
      const wsNotification = {
        _id: notification._id,
        message: 'Your account has been verified!',
        type: 'account_verified',
        isRead: false,
        createdAt: new Date()
      };
      
      sendWebSocketNotification(user._id, wsNotification);
    } catch (error) {
      console.error('Error sending verification notification to donor:', error);
      // Continue execution even if notification fails
    }

    res.status(200).json({
      message: "Donor validated successfully",
      donor: newDonor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });

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


    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if recipient already exists by userId
    const existingRecipientByUserId = await Recipient.findOne({
      userId: user._id,
    });
    if (existingRecipientByUserId) {
      return res.status(400).json({ message: "Recipient already validated" });
    }

    // Check if recipient already exists by email
    const existingRecipientByEmail = await Recipient.findOne({
      email: user.email,
    });
    if (existingRecipientByEmail) {
      return res
        .status(400)
        .json({ message: "Recipient with this email already exists" });
    }

    // Create new recipient with guaranteed userId
    const newRecipient = new Recipient({
      userId: user._id || new mongoose.Types.ObjectId(), // Generate a new ObjectId if user._id is not available
      recipientName: user.recipientName || user.name || "Unknown Recipient",
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
      status: "Validated",
    });
    
    // Ensure userId is set before saving
    if (!newRecipient.userId) {
      console.log('Generating new ObjectId for recipient userId');
      newRecipient.userId = new mongoose.Types.ObjectId();
    }

    // Save the new recipient
    await newRecipient.save();

    // Update user role to recipient
    user.role = "recipient";
    await user.save();
    
    // Send verification notification to recipient
    try {
      const RecipientNotification = require('../models/RecipientNotification');
      
      // Create the notification
      const notification = new RecipientNotification({
        recipientId: newRecipient._id,
        recipientEmail: user.email,
        message: 'Your account has been verified!',
        type: 'account_verified',
        read: false,
        createdAt: new Date(),
      });
      
      // Save the notification
      await notification.save();
      
      // Add the notification to the recipient's notifications array
      await Recipient.findByIdAndUpdate(
        newRecipient._id,
        { $push: { notifications: notification._id } },
        { new: true }
      );
      
      // Send notification via WebSocket
      const wsNotification = {
        _id: notification._id,
        message: 'Your account has been verified!',
        type: 'account_verified',
        read: false,
        createdAt: new Date()
      };
      
      sendWebSocketNotification(user._id, wsNotification);
    } catch (error) {
      console.error('Error sending verification notification to recipient:', error);
      // Continue execution even if notification fails
    }


    res.status(200).json({
      message: "Recipient validated successfully",
      recipient: newRecipient,
    });
  } catch (error) {

    res.status(500).json({ message: "Server error", error: error.message });

    console.error("Error validating recipient:", error);
    res.status(500).json({
      message: "Error validating recipient",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });

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


// Create a refutation notification for a donor
const createDonorRefutationNotification = async (userId, reason) => {
  try {
    const Notification = require('../models/Notification');
    
    // Create the notification for the donor
    const message = `Your account has been refuted by an admin. Reason: ${reason}`;
    
    const notification = await Notification.create({
      userId,
      message,
      type: 'account_refuted',
      isRead: false,
      createdAt: new Date(),
    });
    
    console.log(`Donor refutation notification created for user ${userId}`);    
    return notification;
  } catch (error) {
    console.error('Error creating donor refutation notification:', error);
    return null;
  }
};

// Create a refutation notification for a recipient
const createRecipientRefutationNotification = async (userId, email, reason) => {
  try {
    const RecipientNotification = require('../models/RecipientNotification');
    const Recipient = require('../models/Recipient');
    const mongoose = require('mongoose');
    
    console.log(`Creating refutation notification for recipient: ${email}`);
    
    // Try to find the recipient first
    let recipient = await Recipient.findOne({ email });
    
    // If recipient doesn't exist, create a temporary one
    // This handles refutation of users who haven't been validated yet
    if (!recipient) {
      console.log(`No existing recipient found for ${email}, creating temporary recipient`);
      
      try {
        // Create a temporary recipient entry
        // IMPORTANT: Always use the actual userId to respect the unique constraint
        recipient = new Recipient({
          userId: userId, // Use the actual user ID to prevent duplicate key errors
          recipientName: "Unvalidated Recipient",
          email: email,
          status: false,
          rebutReason: reason
        });
        
        await recipient.save();
        console.log(`Created temporary recipient with ID ${recipient._id} and userId ${userId}`);
      } catch (recipientError) {
        console.error('Error creating temporary recipient:', recipientError);
        // If we fail to create a recipient, create notification without recipientId
        
        const notification = new RecipientNotification({
          recipientEmail: email,
          message: `Your account has been refuted by an admin. Reason: ${reason}`,
          type: 'account_refuted',
          read: false,
          createdAt: new Date(),
        });
        
        await notification.save();
        console.log(`Created notification without recipient ID for ${email}`);
        return notification;
      }
    }
    
    // Now we should have a recipient (either existing or newly created)
    // Create the notification
    const notification = new RecipientNotification({
      recipientId: recipient._id,
      recipientEmail: email,
      message: `Your account has been refuted by an admin. Reason: ${reason}`,
      type: 'account_refuted',
      read: false,
      createdAt: new Date(),
    });
    
    // Save the notification
    await notification.save();
    
    // Add the notification to the recipient's notifications array
    await Recipient.findByIdAndUpdate(
      recipient._id,
      { $push: { notifications: notification._id } },
      { new: true }
    );
    
    console.log(`Recipient refutation notification created for user ${userId}`);
    return notification;
  } catch (error) {
    console.error('Error creating recipient refutation notification:', error);
    return null;
  }
};

// Rebut User
exports.rebutUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Clear KYC documents so the user can upload again
    user.citizenshipDocument = null;
    user.bloodGroupCard = null;
    
    // Update user status and add rebut reason
    user.status = false;
    user.rebutReason = reason;
    await user.save();
    
    // If user is a donor, also clear any validated donor records
    if (user.role === 'donor') {
      // Remove from Donor model if exists
      await Donor.findOneAndDelete({ email: user.email });
    } else if (user.role === 'recipient') {
      // Remove from Recipient model if exists
      await Recipient.findOneAndDelete({ email: user.email });
    }

    // We're no longer sending refutation notifications to the admin panel
    // to prevent duplicate notifications
    
    // Create a role-specific notification for the refuted user
    if (user.role === "donor") {
      // Create donor notification
      const donorNotification = await createDonorRefutationNotification(user._id, reason);
      
      // Send WebSocket notification to donor
      try {
        // Send the notification via WebSocket
        const wsNotification = {
          _id: donorNotification?._id || new mongoose.Types.ObjectId(),
          message: `Your account has been refuted by an admin. Reason: ${reason}`,
          type: 'account_refuted',
          isRead: false,
          createdAt: new Date(),
          reason: reason  // Explicitly include the reason as a separate field
        };
        
        sendWebSocketNotification(user._id, wsNotification);
      } catch (error) {
        console.error("Error sending donor WebSocket notification:", error);
        // Continue execution even if this fails
      }
    } else if (user.role === "recipient") {
      // Create recipient notification
      const recipientNotification = await createRecipientRefutationNotification(user._id, user.email, reason);
      
      // Send a WebSocket notification
      try {
        // Send the notification via WebSocket
        const wsNotification = {
          _id: recipientNotification?._id || new mongoose.Types.ObjectId(),
          message: `Your account has been refuted by an admin. Reason: ${reason}`,
          type: 'account_refuted',
          read: false,
          createdAt: new Date(),
          reason: reason  // Explicitly include the reason as a separate field
        };
        
        sendWebSocketNotification(user._id, wsNotification);
        
        // If this is a recipient user, also notify the donor who made the request
        const request = await Request.findOne({ recipientEmail: user.email });
        if (request) {
          // Find the donor who made this request
          const donor = await User.findOne({ email: request.requestedBy });
          if (donor) {
            // Create notification for the donor
            await createNotification(
              "new_user",
              `Your request for ${request.requestedFor} has been refuted: ${reason}`,
              {
                userId: donor._id,
                reason: reason,
              }
            );
          }
        }
      } catch (error) {
        console.error("Error sending additional notifications:", error);
        // Continue execution even if this part fails
      }
    }

    res.status(200).json({
      message: "User rebutted successfully",
      user: user,
    });
  } catch (error) {
    console.error("Error rebutting user:", error);
    res.status(500).json({
      message: "Error rebutting user",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
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
=======
// Get all donors
exports.getDonors = async (req, res) => {
  try {
    const donors = await Donor.find();
    res.status(200).json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if user is validated
const checkUserValidation = async (userId, role) => {
  try {
    switch (role) {
      case "donor":
        const donor = await Donor.findOne({ userId });
        if (donor) {
          return {
            isValidated: true,
            message: "Donor already validated",
            validatedData: donor,
          };
        }
        // Check by email as well
        const user = await User.findById(userId);
        const donorByEmail = await Donor.findOne({ email: user.email });
        if (donorByEmail) {
          return {
            isValidated: true,
            message: "Donor with this email already exists",
            validatedData: donorByEmail,
          };
        }
        break;
      case "recipient":
        const recipient = await Recipient.findOne({ userId });
        if (recipient) {
          return {
            isValidated: true,
            message: "Recipient already validated",
            validatedData: recipient,
          };
        }
        // Check by email as well
        const userForRecipient = await User.findById(userId);
        const recipientByEmail = await Recipient.findOne({
          email: userForRecipient.email,
        });
        if (recipientByEmail) {
          return {
            isValidated: true,
            message: "Recipient with this email already exists",
            validatedData: recipientByEmail,
          };
        }
        break;
    }
    return {
      isValidated: false,
      message: "Not validated yet",
    };
  } catch (error) {
    console.error("Error checking validation:", error);
    return {
      isValidated: false,
      message: "Error checking validation status",
    };
  }
};

// Get all users with validation status
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } });

    // Add validation status to each user
    const usersWithValidation = await Promise.all(
      users.map(async (user) => {
        const validationStatus = await checkUserValidation(user._id, user.role);
        return {
          ...user.toObject(),
          ...validationStatus,
        };
      })
    );

    res.status(200).json({ users: usersWithValidation });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// Inside your user registration function
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ... existing user creation code ...
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // Create notification for new user
    await createNotification("new_user", `New ${role} registered: ${name}`, {
      userId: user._id,
      name: user.name,
      role: user.role,
    });

    // ... rest of the code ...
  } catch (error) {
    // ... error handling ...

  }
};
