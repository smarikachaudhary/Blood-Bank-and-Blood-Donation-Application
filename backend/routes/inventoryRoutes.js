const express = require("express");
const mongoose = require("mongoose");

const {
  createInventoryController,
  getInventoryController,
  deleteInventoryController,
} = require("../controllers/inventoryController");
const authMiddleware = require("../middlewares/authMiddleware");
const inventoryModel = require("../models/inventoryModel");

const router = express.Router();

// Create Inventory (Admin Only)
router.post("/create", authMiddleware, createInventoryController);

// Get All Inventory (Admin Only)
router.get("/list", authMiddleware, getInventoryController);

//deleting blood
router.delete("/:id", authMiddleware, deleteInventoryController);

//Fetch single record
router.get("/record/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Requested Inventory ID:", id); // Debugging log

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ID format:", id);
      return res.status(400).json({ message: "Invalid Inventory ID" });
    }

    const inventory = await inventoryModel.findById(id);
    if (!inventory) {
      console.log("Inventory not found for ID:", id);
      return res.status(404).json({ message: "Inventory not found" });
    }

    console.log("Fetched Inventory:", inventory);
    res.status(200).json(inventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/record/:id", async (req, res) => {
  try {
    const updatedInventory = await inventoryModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedInventory) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json(updatedInventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
