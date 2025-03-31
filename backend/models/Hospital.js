const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema(
  {
    hospitalName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    bloodStock: {
      type: Map,
      of: Number, // Example: { "A+": 10, "O-": 5 }
      default: {},
    },
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hospital", HospitalSchema);
