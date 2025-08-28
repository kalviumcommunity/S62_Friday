const mongoose = require("mongoose");

const apiLogSchema = new mongoose.Schema({
  endpoint: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  statusCode: {
    type: Number,
    required: true,
  },
  responseTime: {
    type: Number, // in milliseconds
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ipAddress: {
    type: String,
  },
});

module.exports = mongoose.model("ApiLog", apiLogSchema);
