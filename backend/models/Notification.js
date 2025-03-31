const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model (Donor in this case)
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false, // By default, the notification is unread
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
