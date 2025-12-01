const express = require("express");
const router = express.Router();

const {
  createDepartment,
  getDepartments,
  updateDepartment
} = require("../controllers/departmentController");

const { auth, adminOnly } = require("../middleware/authMiddleware");

// Admin: Add department
router.post("/", auth, adminOnly, createDepartment);

// Get all departments (authenticated users)
router.get("/", auth, getDepartments);

// Admin: Update department (budget, name)
router.put("/:id", auth, adminOnly, updateDepartment);

module.exports = router;
