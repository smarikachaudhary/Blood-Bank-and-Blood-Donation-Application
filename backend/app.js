const express = require("express");
const cors = require("cors");
const app = express();

//CORS
app.use(cors());

//JSON
app.use(express.json());

module.exports = app;
