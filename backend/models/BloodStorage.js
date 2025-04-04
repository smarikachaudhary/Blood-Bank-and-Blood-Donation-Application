// models/BloodStorage.js
const mongoose = require("mongoose");

const bloodStorageSchema = new mongoose.Schema(
  {
    bloodType: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    quantity: {
      type: Number, // in milliliters (ml)
      required: true,
      min: [20, "Minimum donation is 10ml"],
      max: [500, "Maximum donation per entry is 500ml"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    donorEmail: {
      type: String,
      required: true,
      match: [/.+\@.+\..+/, "Please enter a valid email"],
    },
    expirationDate: {
      type: Date,
      required: false, // Will be set automatically when accepted
      default: null,
    },
    rejectionReason: {
      type: String,
      required: function () {
        return this.status === "rejected";
      },
    },
    healthDeclaration: {
      type: Boolean,
      required: true,
      default: false,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    lastDonationDate: {
      // ADD THIS (to match your form)
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Automatic expiration date when accepted
bloodStorageSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "accepted") {
    this.expirationDate = new Date(Date.now() + 42 * 24 * 60 * 60 * 1000); // 42 days
  }
  next();
});

// Validation: Don't allow modifications after acceptance
bloodStorageSchema.pre("save", function (next) {
  if (this.isModified("quantity") && this.status === "accepted") {
    throw new Error("Cannot modify accepted donations");
  }
  next();
});

module.exports = mongoose.model("BloodStorage", bloodStorageSchema);
