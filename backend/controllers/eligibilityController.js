const EligibilityRequest = require("../models/EligibilityRequest");
const Notification = require("../models/Notification");
const path = require("path");

exports.submitEligibilityRequest = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Debug request body
    console.log("Uploaded File:", req.file); // Debug uploaded file

    const { donorId, name, email, age, weight } = req.body;

    if (!donorId || !name || !email || !age || !weight || !req.file) {
      return res
        .status(400)
        .json({ error: "All fields are required, including a document." });
    }

    const request = new EligibilityRequest({
      donorId,
      name,
      email,
      age,
      weight,
      document: req.file.path,
      status: "Pending",
    });

    await request.save();
    res
      .status(201)
      .json({ message: "Eligibility request submitted successfully." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.reviewEligibilityRequest = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const request = await EligibilityRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = status;
    request.rejectionReason = status === "Rejected" ? rejectionReason : "";
    await request.save();

    const notification = new Notification({
      userId: request.donorId,
      message:
        status === "Approved"
          ? "You are eligible to donate blood."
          : `Not eligible: ${rejectionReason}`,
    });

    await notification.save();
    res.status(200).json({ message: "Request updated successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDonorNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.params.donorId,
    }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.params.donorId, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ message: "Notifications marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllEligibilityRequests = async (req, res) => {
  try {
    console.log("Fetching eligibility requests...");
    const requests = await EligibilityRequest.find().sort({ createdAt: -1 });

    if (!requests.length) {
      console.log("No requests found in the database.");
      return res.status(404).json({ message: "No eligibility requests found" });
    }

    console.log("Found requests:", requests);

    const requestsWithFileURLs = requests.map((request) => ({
      ...request._doc,
      documentUrl: request.document
        ? `${process.env.BASE_URL}/uploads/${path.basename(request.document)}`
        : null,
    }));

    res.status(200).json(requestsWithFileURLs);
  } catch (error) {
    console.error("Error fetching eligibility requests:", error.stack);
    res.status(500).json({ error: error.message });
  }
};

exports.updateEligibilityStatus = async (req, res) => {
  try {
    const { status } = req.body;
    console.log(
      "Received update request for ID:",
      req.params.id,
      "with status:",
      status
    );

    const request = await EligibilityRequest.findById(req.params.id);
    if (!request) {
      console.log("Request not found in database");
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status;
    await request.save();

    console.log("Updated request:", request);

    res.status(200).json({ message: "Status updated successfully", request });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: error.message });
  }
};
