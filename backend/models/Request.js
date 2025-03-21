const mongoose = require("mongoose");

const BloodRequestSchema = new mongoose.Schema(
  {
    requestedBy: {
      type: String,
      required: true,
    },
    requestedFor: {
      type: String,
      required: true,
    },
    requestedDateTime: {
      type: Date,
      required: true,
    },
    requestedBloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
      required: true,
    },
    requestedQuantity: {
      type: Number,
      required: true,
      min: 1,
    },
    neededTime: {
      type: Date,
      required: true,
    },
    donatedQuantity: {
      type: Number,
      default: 0,
    },
    alreadyCollected: {
      type: Boolean,
      default: false,
    },
    requestType: {
      type: Boolean,
      default: false, // Checkbox selection
    },
  },
  { timestamps: true }
);

// Middleware to update alreadyCollected based on donatedQuantity
BloodRequestSchema.pre("save", function (next) {
  this.alreadyCollected = this.donatedQuantity >= this.requestedQuantity;
  next();
});

module.exports = mongoose.model("BloodRequest", BloodRequestSchema);
