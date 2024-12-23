// const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const { sendVerificationCode, welcomeEmail } = require("../middlewares/email");
dotenv.config();

//REGISTER USER
const registerController = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    // Check if user already exists
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User already exists with this email!",
      });
    }

    // Validate required fields for role
    if (!req.body.role) {
      return res.status(400).send({
        success: false,
        message: "Role is required.",
      });
    }

    if (req.body.role === "admin" && !req.body.adminName) {
      return res.status(400).send({
        success: false,
        message: "Admin name is required for the admin role.",
      });
    }

    if (req.body.role === "donor" && !req.body.donorName) {
      return res.status(400).send({
        success: false,
        message: "Donor name is required for the donor role.",
      });
    }

    if (req.body.role === "recipient" && !req.body.recipientName) {
      return res.status(400).send({
        success: false,
        message: "Recipient name is required for the recipient role.",
      });
    }

    if (req.body.role === "hospital" && !req.body.hospitalName) {
      return res.status(400).send({
        success: false,
        message: "Hospital name is required for the hospital role.",
      });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).send({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // Validate password length
    const passwordValidationError = /^(?=.*[A-Z])(?=.*\d)(?=.*[a-zA-Z]).{6,}$/;
    if (!passwordValidationError.test(req.body.password)) {
      return res.status(400).send({
        success: false,
        message:
          "Password must contain at least one uppercase letter, one number, and a mix of characters.",
      });
    }

    // Validate address
    if (!req.body.address) {
      return res.status(400).send({
        success: false,
        message: "Address is required.",
      });
    }

    // Validate phone number format
    const phoneRegex = /^\+?\d{7,15}$/;
    if (!phoneRegex.test(req.body.phone)) {
      return res.status(400).send({
        success: false,
        message: "Please provide a valid phone number.",
      });
    }

    //email verification
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    // Save new user with verification code
    const user = new User({
      ...req.body,
      password: hashedPassword,
      verificationCode,
    });
    await user.save();
    sendVerificationCode(user.email, verificationCode);

    return res.status(201).send({
      success: true,
      message: "User registered successfully!",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in register API",
      error,
    });
  }
};

// email verification
const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;

    // Find the user with the verification code
    const user = await User.findOne({ verificationCode: code });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or Expired Code" });
    }

    // Check if the user is already verified
    if (user.status) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already verified." });
    }

    // Mark user as verified and clear the verification code
    user.status = true;
    user.verificationCode = undefined;
    await user.save();

    // Send a welcome email
    await welcomeEmail(user.email, user.role);

    return res
      .status(200)
      .json({ success: true, message: "Email Verified Successfully" });
  } catch (error) {
    console.error("Verification error:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

//LOGIN USER
const loginController = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).send({
        success: false,
        message: "Incorrect password!",
      });
    }

    // Validate role
    if (req.body.role !== user.role) {
      return res.status(403).send({
        success: false,
        message: `Incorrect role. You are registered as a ${user.role}.`,
      });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Return success response
    return res.status(200).send({
      success: true,
      message: "Login Successful!",
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in login API",
      error,
    });
  }
};

//GET CURRENT USER
const currentUserController = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    return res.status(200).send({
      success: true,
      message: "User Fetched Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "unable to get current user",
      error,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  currentUserController,
  verifyEmail,
};
