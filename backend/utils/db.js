const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

//DB
const DB =
  "mongodb+srv://smarikachaudhary10:smarika.chaudhary@cluster0.unr4u.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0";

const dbConnection = async () => {
  try {
    await mongoose.connect(DB).then(() => {
      console.log("Database connected Successfully");
    });
  } catch (error) {
    console.log(error);
    setTimeout(dbConnection, 5000);
  }
};

module.exports = dbConnection;
