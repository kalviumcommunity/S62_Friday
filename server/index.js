const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = require("./config/database.js");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Simple request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
// app.use("/api/chat", require("./routes/chat"));
// app.use("/api/conversations", require("./routes/conversations"));
app.use("/api/users", require("./routes/users.js"));

// Basic health check route
app.get("/api/health", (req, res) => {
  res.json({
    message: "Friday API is running!",
    status: "OK",
    timestamp: new Date().toISOString(),
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// 404 handler
app.use(/.*/, (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Friday server is running on port ${PORT}`);
});
