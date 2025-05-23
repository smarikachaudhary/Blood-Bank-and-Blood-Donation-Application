const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const dotenv = require("dotenv");
const { sendVerificationCode, welcomeEmail } = require("../middlewares/email");
const { createNotification } = require("./notificationController");

dotenv.config();

// REGISTER USER
const registerController = async (req, res) => {
  console.log("Register request body:", req.body);
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User already exists with this email!",
      });
    }

    // For Google login, skip password validation
    if (!req.body.isGoogleLogin) {
      // Validate password length and complexity
      const passwordValidationError =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[a-zA-Z]).{6,}$/;
      if (!passwordValidationError.test(req.body.password)) {
        return res.status(400).send({
          success: false,
          message:
            "Password must contain at least one uppercase letter, one number, and a mix of characters.",
        });
      }
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
    };

    if (!req.body[`${req.body.role}Name`]) {
      return res.status(400).send({
        success: false,
        message: roleErrors[req.body.role],
      });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).send({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    // Only require password for non-Google signups
    const isGoogle =
      req.body.isGoogleLogin === true || req.body.isGoogleLogin === "true";
    if (isGoogle && (!req.body.password || req.body.password.trim() === "")) {
      req.body.password = Math.random().toString(36).slice(-8) + "A1";
    }

    if (!req.body.address) {
      return res.status(400).send({
        success: false,
        message: "Address is required.",
      });
    }

    const phoneRegex = /^98\d{8}$/;
    if (!phoneRegex.test(req.body.phone)) {
      return res.status(400).send({
        success: false,
        message:
          "Please provide a valid 10-digit phone number starting with 98.",
      });
    }

    // Remove any manual hashing here!

    // Generate verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Create user object
    const userData = {
      ...req.body,
      verificationCode,
      // For Google login, set status to true as email is already verified
      status: req.body.isGoogleLogin ? true : false,
    };

    // Create new user instance
    const user = new User(userData);

    // Save user - password will be hashed by pre-save middleware
    await user.save();

    // Create notification for new user
    await createNotification(
      "new_user",
      `New ${user.role} registered: ${user[`${user.role}Name`]}`,
      {
        userId: user._id,
        name: user[`${user.role}Name`],
        role: user.role,
      }
    );

    // Only send verification code for non-Google login
    if (!req.body.isGoogleLogin) {
      sendVerificationCode(user.email, verificationCode);
    }

    // Generate token for immediate login (especially useful for Google login)
    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).send({
      success: true,
      message: "User registered successfully!",
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      token,
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
    const { email, password, role, isGoogleLogin } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    // Only check role if it was explicitly provided in the request
    if (role && role !== user.role) {
      return res.status(403).send({
        success: false,
        message: `Incorrect role. You are registered as a ${user.role}.`,
      });
    }

    if (!isGoogleLogin) {
      if (!password || password.trim() === "") {
        return res.status(400).send({
          success: false,
          message: "Password is required for login.",
        });
      }

      const isPasswordCorrect = await bcrypt.compare(
        password.toString(),
        user.password
      );

      if (!isPasswordCorrect) {
        return res.status(401).send({
          success: false,
          message: "Incorrect password!",
        });
      }
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    user.lastLogin = Date.now();
    await user.save();

    return res.status(200).send({
      success: true,
      message: "Login Successful!",
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({
      success: false,
      message: "Error in login API",
      error: error.message,
    });
  }
};

// GET CURRENT USER
const currentUserController = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
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
