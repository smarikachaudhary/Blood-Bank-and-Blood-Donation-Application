const express = require("express");
const router = express.Router();
const dondonationController = require("../controllers/donationController");

// Post all blood requests
router.post("/submit", dondonationController.submitDonation);

module.exports = router;
