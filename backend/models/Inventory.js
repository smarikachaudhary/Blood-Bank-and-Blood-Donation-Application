const mongoose = require("mongoose");

const BloodInventorySchema = new mongoose.Schema(
  {
    bloodType: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Available", "Low", "Critical"],
      default: "Available",
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Add index for better query performance
BloodInventorySchema.index({ bloodType: 1 });

// Pre-save middleware to update status based on quantity
BloodInventorySchema.pre("save", function (next) {
  if (this.quantity <= 100) {
    this.status = "Critical";
  } else if (this.quantity <= 300) {
    this.status = "Low";
  } else {
    this.status = "Available";
  }
  this.lastUpdated = Date.now();
  next();
});

const BloodInventory = mongoose.model("BloodInventory", BloodInventorySchema);

module.exports = BloodInventory;
