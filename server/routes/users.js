const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const { generateToken, authenticateToken } = require("../middleware/auth.js");

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, preferences } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Username, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User with this email or username already exists",
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      preferences: preferences || {},
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: errors.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Get current user profile (protected route)
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// UPDATE USER - PUT route (complete replacement)
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, preferences } = req.body;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check if user is updating their own profile
    if (req.user._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        error: "You can only update your own profile",
      });
    }

    // Check if new username or email already exists
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({
        username,
        _id: { $ne: id },
      });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          error: "Username already taken",
        });
      }
    }

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({
        email,
        _id: { $ne: id },
      });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          error: "Email already registered",
        });
      }
    }

    // Update user fields (complete replacement)
    user.username = username || user.username;
    user.email = email || user.email;
    if (password) user.password = password; // Will be hashed by pre-save hook
    user.preferences = preferences || user.preferences;

    await user.save();

    res.json({
      success: true,
      message: "User updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: errors.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// PARTIAL UPDATE USER - PATCH route (partial updates only)
router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check if user is updating their own profile
    if (req.user._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        error: "You can only update your own profile",
      });
    }

    // Validate username/email uniqueness if being updated
    if (updates.username && updates.username !== user.username) {
      const existingUsername = await User.findOne({
        username: updates.username,
        _id: { $ne: id },
      });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          error: "Username already taken",
        });
      }
    }

    if (updates.email && updates.email !== user.email) {
      const existingEmail = await User.findOne({
        email: updates.email,
        _id: { $ne: id },
      });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          error: "Email already registered",
        });
      }
    }

    // Apply updates (only the fields that are provided)
    Object.keys(updates).forEach((key) => {
      if (key === "preferences") {
        user.preferences = { ...user.preferences, ...updates.preferences };
      } else if (key === "password") {
        user.password = updates.password; // Will be hashed by pre-save hook
      } else if (key !== "id" && key !== "_id") {
        user[key] = updates[key];
      }
    });

    await user.save();

    res.json({
      success: true,
      message: "User updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: errors.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// GET ALL USERS (for admin purposes - protected)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const users = await User.find(
      {},
      { username: 1, email: 1, preferences: 1, createdAt: 1 }
    );

    res.json({
      success: true,
      users: users.map((user) => ({
        id: user._id,
        username: user.username,
        email: user.email,
        preferences: user.preferences,
        createdAt: user.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Change password endpoint
router.post("/change-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "New password must be at least 6 characters long",
      });
    }

    // Get user with password
    const user = await User.findById(userId).select("+password");

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

module.exports = router;
