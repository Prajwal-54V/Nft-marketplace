const mongoose = require("mongoose");

// define a schema for your data
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  metasMaskAcc: { type: String, unique: true, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isAdmin: { type: Boolean, required: true },
});

// create a model based on the schema
const User = mongoose.model("User", userSchema);

module.exports = User;
