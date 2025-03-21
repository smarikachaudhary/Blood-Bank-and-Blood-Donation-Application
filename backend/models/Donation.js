const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donatedBy: {
      type: String,
      required: true,
    },
    donationDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    bloodType: {
      type: String,
      required: true,
    },
    donatedQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;
