const Department = require("../models/Department");

// Create department
exports.createDepartment = async (req, res) => {
  try {
    const { name, budgetAmount } = req.body;

    const exists = await Department.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Department already exists" });
    }

    const dept = await Department.create({
      name,
      budgetAmount,
      usedAmount: 0
    });

    res.json({ message: "Department created successfully", dept });
    try {
      const io = require('../utils/socket').getIo()
      io.emit('departments:created', dept)
    } catch (err) { console.warn('Socket emit failed on department create', err.message) }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get all departments
exports.getDepartments = async (req, res) => {
  try {
    const depts = await Department.find();
    res.json(depts);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Update department (name/budget)
exports.updateDepartment = async (req, res) => {
  try {
    const { name, budgetAmount } = req.body;

    const dept = await Department.findByIdAndUpdate(
      req.params.id,
      { name, budgetAmount },
      { new: true }
    );

    res.json({ message: "Department updated", dept });
    try {
      const io = require('../utils/socket').getIo()
      io.emit('departments:updated', dept)
    } catch (err) { console.warn('Socket emit failed on department update', err.message) }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
