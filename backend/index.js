const dotenv = require("dotenv");

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
