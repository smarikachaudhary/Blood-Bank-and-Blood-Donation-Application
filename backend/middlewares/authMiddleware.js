const JWT = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).send({
        success: false,
        message: "No authorization token provided",
      });
    }

    const token = authHeader.split(" ")[1]; // Get token from "Bearer <token>"
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Invalid token format",
      });
    }

    // Verify the token
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded token to req.user

    // Check if the user exists in the database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Include email and user details
    req.user.email = user.email; // Attach email to req.user
    next(); // Proceed to next middleware or route handler
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      message: "Authentication Failed",
      error: error.message,
    });
  }
};
