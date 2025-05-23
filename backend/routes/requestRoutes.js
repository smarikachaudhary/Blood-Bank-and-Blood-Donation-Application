const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");

// Create a new blood request
router.post("/createrequest", requestController.createRequest);

// Get all blood requests
router.get("/getrequest", requestController.getAllRequests);

// Get a specific blood request by ID
router.get("/:id", requestController.getRequestById);

// Update a blood request
router.put("/:id", requestController.updateRequest);

// Delete a blood request
router.delete("/:id", requestController.deleteRequest);

module.exports = router;
