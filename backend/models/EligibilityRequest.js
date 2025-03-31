const mongoose = require("mongoose");

const EligibilityRequestSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
      required: true,
    },
    name: String,
    email: String,
    age: Number,
    weight: Number,
    document: String, // Path to uploaded document
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    rejectionReason: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("EligibilityRequest", EligibilityRequestSchema);
