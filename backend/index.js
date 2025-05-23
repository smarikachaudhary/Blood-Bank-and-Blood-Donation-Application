const dotenv = require("dotenv");
const express = require("express"); // Import express
const path = require("path"); // Import path module (optional but good practice)

const app = require("./app");
const dbConnection = require("./utils/db");

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 8000;
const DB = process.env.DB;

if (!DB) {
  console.error("Error: DB is not defined in the .env file.");
  process.exit(1);
}

dbConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err.message);
  });

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to DonateHope",
  });
});

app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/users", require("./routes/userRoutes"));
app.use("/api/v1/inventory", require("./routes/inventoryRoutes"));
app.use("/api/v1/eligibility", require("./routes/eligibilityRoutes"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/v1/request", require("./routes/requestRoutes"));
app.use("/api/v1/donation", require("./routes/donationRoutes"));
app.use("/api/v1/upload", require("./routes/uploadRoutes"));
