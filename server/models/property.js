const mongoose = require("mongoose");

// define a schema for your data
const propertySchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  document: { type: String, required: true },
  price: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: Object, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tokenId: { type: Object, default: null },
  isApproved: { type: Boolean, default: false },
  isListed: { type: Boolean, default: false },
  isSold: { type: Boolean, default: false },
});

// create a model based on the schema
const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
