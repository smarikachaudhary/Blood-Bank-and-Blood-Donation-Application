const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    inventoryType: {
      type: String,
      required: [true, "Inventory type is required"],
      enum: ["in", "out"],
    },
    bloodType: {
      type: String,
      required: [true, "Blood group is required"],
      enum: ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"],
    },
    quantity: {
      type: Number,
      required: [true, "Blood quantity is required"],
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    email: {
      type: String,
      required: [true, "Admin Email is required"],
    },
    donatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      default: null,
    },
    donatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipient",
      default: null,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      default: null, // If blood is sent to a hospital
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
