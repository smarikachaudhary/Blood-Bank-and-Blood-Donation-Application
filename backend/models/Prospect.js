const mongoose = require("mongoose");

const ProspectSchema = mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
  address: { type: String },
  address: { type: String },
  phone: { type: String },
  bloodgroup: { type: String },
  date: { type: String },
  disease: { type: String },
  age: { type: Number },
  bloodpressure: { type: Number },
  status: { type: String, default: 0 },
});

module.exports = mongoose.model("Prospect", ProspectSchema);
