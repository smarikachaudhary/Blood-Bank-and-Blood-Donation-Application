const express = require("express");
const {
  registerController,
  loginController,
  currentUserController,
  verifyEmail,
  getAllUsersController,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

//routes
//Register POST
router.post("/register", registerController);

//Login POST
router.post("/login", loginController);

//All Users
router.get("/all-users", getAllUsersController);

//verify email
router.post("/verify-email", verifyEmail);

//Get Current User //GET
router.get("/current-user", authMiddleware, currentUserController);

module.exports = router;
