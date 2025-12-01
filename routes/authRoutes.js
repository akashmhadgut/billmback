const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/authController");
const { auth, adminOnly } = require("../middleware/authMiddleware");

// Login route
router.post("/login", login);

// Register user — only Admin can add users
router.post("/register", auth, adminOnly, register);

// Get all users - only Admin
const { getUsers, updateUser, deleteUser } = require("../controllers/authController");
router.get("/users", auth, adminOnly, getUsers);

// Update/Delete user - only Admin
router.put("/users/:id", auth, adminOnly, updateUser);
router.delete("/users/:id", auth, adminOnly, deleteUser);

module.exports = router;
