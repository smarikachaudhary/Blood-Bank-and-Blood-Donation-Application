const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["admin", "donor", "recipient", "hospital"],
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
    hospitalName: {
      type: String,
      required: function () {
        return this.role === "hospital";
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
      required: [true, "Password is required"],
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
    verificationCode: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", UserSchema);
