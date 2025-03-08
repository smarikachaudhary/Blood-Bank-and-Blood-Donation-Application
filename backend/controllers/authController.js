const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const dotenv = require("dotenv");
const { sendVerificationCode, welcomeEmail } = require("../middlewares/email");

dotenv.config();

// REGISTER USER
const registerController = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User already exists with this email!",
      });
    }

    if (!req.body.role) {
      return res.status(400).send({
        success: false,
        message: "Role is required.",
      });
    }

    const roleErrors = {
      admin: "Admin name is required for the admin role.",
      donor: "Donor name is required for the donor role.",
      recipient: "Recipient name is required for the recipient role.",
      hospital: "Hospital name is required for the hospital role.",
    };

    if (!req.body[`${req.body.role}Name`]) {
      return res.status(400).send({
        success: false,
        message: roleErrors[req.body.role],
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    // Generate email verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Save user in the database
    const user = new User({
      ...req.body,
      password: hashedPassword,
      verificationCode,
    });

    await user.save();

    // Send verification code to user
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

// VERIFY EMAIL
const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;

    const user = await User.findOne({ verificationCode: code });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or Expired Code" });
    }

    if (user.status) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already verified." });
    }

    user.status = true;
    user.verificationCode = undefined;
    await user.save();

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

// LOGIN USER
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
    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

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

// GET CURRENT USER
const currentUserController = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId); // Getting user from decoded JWT
    return res.status(200).send({
      success: true,
      message: "User Fetched Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Unable to get current user",
      error,
    });
  }
};

// GET ALL USERS
const getAllUsersController = async (req, res) => {
  try {
    const users = await User.find();

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "No users found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully!",
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching users.",
      error: error.message,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  currentUserController,
  verifyEmail,
  getAllUsersController,
};
