const BloodRequest = require("../models/Request");

// Create a new blood request
exports.createRequest = async (req, res) => {
  try {
    const newRequest = new BloodRequest(req.body);
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating request", details: error.message });
  }
};

// Get all blood requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching requests", details: error.message });
  }
};

// Get a single blood request by ID
exports.getRequestById = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: "Request not found" });
    res.status(200).json(request);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching request", details: error.message });
  }
};

// Update a blood request
exports.updateRequest = async (req, res) => {
  try {
    const updatedRequest = await BloodRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedRequest)
      return res.status(404).json({ error: "Request not found" });
    res.status(200).json(updatedRequest);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating request", details: error.message });
  }
};

// Delete a blood request
exports.deleteRequest = async (req, res) => {
  try {
    const deletedRequest = await BloodRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest)
      return res.status(404).json({ error: "Request not found" });
    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting request", details: error.message });
  }
};
