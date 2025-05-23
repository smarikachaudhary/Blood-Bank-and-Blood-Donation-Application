const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["admin", "donor", "recipient"],
    },
    adminName: {
      type: String,
      required: function () {
        return this.role === "admin";
      },
      default: null,
    },
    donorName: {
      type: String,
      required: function () {
        return this.role === "donor";
      },
      default: null,
    },
    recipientName: {
      type: String,
      required: function () {
        return this.role === "recipient";
      },
      default: null,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: function () {
        // Only require password if not a Google login
        return !this.isGoogleLogin;
      },
      match: [
        /^(?=.*[A-Z])(?=.*\d)(?=.*[a-zA-Z]).{6,}$/,
        "Password must contain at least one uppercase letter, one number, and a mix of characters.",
      ],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone Number is required"],
      match: [/^\+?\d{7,15}$/, "Please provide a valid phone number"],
    },
    status: {
      type: Boolean,
      default: false,
    },
    rebutReason: {
      type: String,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    verificationCode: String,
    citizenshipDocument: {
      type: String, // This will store the file path
      default: null,
    },

    bloodGroupCard: {
      type: String, // This will store the file path
      default: null,
    },
    isGoogleLogin: {
      type: Boolean,
      default: false,
    },

  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  // Only hash the password if it's modified or new
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    console.log("Password comparison debug:");
    console.log("Candidate password present:", !!candidatePassword);
    console.log("Stored hash present:", !!this.password);

    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log("bcrypt.compare result:", isMatch);

    return isMatch;
  } catch (error) {
    console.error("Password comparison error:", error);
    throw error; // Throw the actual error for better debugging
  }
};

module.exports = mongoose.model("Users", UserSchema);
