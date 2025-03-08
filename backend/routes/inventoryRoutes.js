const express = require("express");
const {
  createInventoryController,
  getInventoryController,
} = require("../controllers/inventoryController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Create Inventory (Admin Only)
router.post("/create", authMiddleware, createInventoryController);

// Get All Inventory (Admin Only)
router.get("/list", authMiddleware, getInventoryController);

module.exports = router;
