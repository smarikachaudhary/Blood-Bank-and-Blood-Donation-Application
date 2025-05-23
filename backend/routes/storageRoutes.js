const express = require("express");
const router = express.Router();
const getTokenAndEmail = require("../middlewares/getTokenAndEmail");
const { donateBlood } = require("../controllers/storageController"); // importing correctly

// POST route to donate blood
router.post("/donate", getTokenAndEmail, donateBlood);

module.exports = router;
