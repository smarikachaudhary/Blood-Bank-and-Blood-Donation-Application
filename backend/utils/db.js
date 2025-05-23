const mongoose = require("mongoose");

const dbConnection = async () => {
  const DB = process.env.DB;

  if (!DB) {
    console.error(
      "Error: DB connection string is not defined in the .env file."
    );
    process.exit(1); // Exit if DB is undefined
  }

  let retries = 5;

  while (retries) {
    try {
      await mongoose.connect(DB);
      console.log("Database connected successfully");
      break; // Exit the loop if connection is successful
    } catch (error) {
      console.error("Database connection failed. Retrying...", error.message);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      if (retries === 0) {
        console.error("All retries failed. Exiting...");
        process.exit(1); // Exit if retries are exhausted
      }
      await new Promise((res) => setTimeout(res, 5000)); // Wait 5 seconds before retrying
    }
  }
};

module.exports = dbConnection;
