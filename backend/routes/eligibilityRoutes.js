const express = require("express");
const router = express.Router();
const eligibilityController = require("../controllers/eligibilityController");
const multer = require("multer");
const path = require("path");
const Notification = require("../models/Notification");

const fs = require("fs");
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  console.log("Creating uploads directory...");
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Absolute path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "application/pdf",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type. Only PNG, JPG, JPEG, and PDF allowed."),
        false
      );
    }
  },
});

router.post(
  "/submit",
  upload.single("document"),
  eligibilityController.submitEligibilityRequest
);

router.put("/review/:id", eligibilityController.reviewEligibilityRequest);
router.get(
  "/notifications/:donorId",
  eligibilityController.getDonorNotifications
);

router.put(
  "/notifications/mark-read/:donorId",
  eligibilityController.markNotificationsAsRead
);

router.get("/requests", eligibilityController.getAllEligibilityRequests);

module.exports = router;
