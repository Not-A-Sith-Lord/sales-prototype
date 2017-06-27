const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const leadSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  zip: String,
  address: String,
  city: String,
  company: String,
  keywords: [String]

}, {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;
