const express = require("express");
const multer = require("multer");
const path = require("path");
const User = require("../models/User");

const router = express.Router();

// Serve static files from 'uploads' folder
router.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage: storage });

// Upload citizenship document
router.post(
  "/upload-citizenship/:id",
  upload.single("document"),
  async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.citizenshipDocument = req.file.path; // Store the file path
      await user.save();

      res.json({
        message: "Document uploaded successfully",
        filePath: req.file.path,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// Route to get citizenship document
router.get("/get-citizenship-document/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.citizenshipDocument) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Send the document path as a URL to the frontend
    res.json({ documentUrl: user.citizenshipDocument });
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
