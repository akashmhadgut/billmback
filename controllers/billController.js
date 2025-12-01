const Bill = require("../models/Bill");
const Department = require("../models/Department");

// CREATE BILL (Leader only)
exports.createBill = async (req, res) => {
  try {
    const { title, description, amount, department, date } = req.body;

    // If creator is a leader, force department to be the user's department (from token)
    let deptId = department
    if (req.user.role === 'leader') {
      deptId = req.user.department?._id || req.user.department
    }

    let bill = await Bill.create({
      title,
      description,
      amount,
      department: deptId,
      date,
      createdBy: req.user.id
    });

    // Populate fields for response
    bill = await bill.populate([
      { path: 'department' },
      { path: 'createdBy', select: 'name role' }
    ]);

    res.json({ message: "Bill created successfully", bill });

    // emit real-time event
    try {
      const io = require('../utils/socket').getIo()
      io.emit('bills:created', bill)
    } catch (err) {
      console.warn('Socket emit failed on bill create', err.message)
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// GET ALL BILLS (All roles)
exports.getBills = async (req, res) => {
  try {
    // For non-admins (leader/intern), only show bills belonging to their department
    const query = {}
    if (req.user.role !== 'admin') {
      const dept = req.user.department?._id || req.user.department
      if (dept) query.department = dept
    }

    const bills = await Bill.find(query)
      .populate("department")
      .populate("createdBy", "name role");

    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// GET BILL BY ID
exports.getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate("department")
      .populate("createdBy", "name role");

    // ensure non-admins can only access bills from their department
    if (req.user.role !== 'admin') {
      const userDept = req.user.department?._id || req.user.department
      if (String(bill.department) !== String(userDept)) {
        return res.status(403).json({ message: 'Access to this bill is restricted' })
      }
    }

    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// UPDATE BILL (Leader or Admin)
exports.updateBill = async (req, res) => {
  try {
    // first load bill and check permissions
    const existing = await Bill.findById(req.params.id)
    if (!existing) return res.status(404).json({ message: 'Bill not found' })

    if (req.user.role === 'leader') {
      const userDept = req.user.department?._id || req.user.department
      if (String(existing.department) !== String(userDept)) {
        return res.status(403).json({ message: 'Leaders can only update bills in their department' })
      }
    }

    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("department").populate("createdBy", "name role");

    res.json({ message: "Bill updated", bill });
    try {
      const io = require('../utils/socket').getIo()
      io.emit('bills:updated', bill)
    } catch (err) { console.warn('Socket emit failed on bill update', err.message) }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// DELETE BILL (Admin only)
exports.deleteBill = async (req, res) => {
  try {
    await Bill.findByIdAndDelete(req.params.id);
    res.json({ message: "Bill deleted successfully" });
    try {
      const io = require('../utils/socket').getIo()
      io.emit('bills:deleted', { id: req.params.id })
    } catch (err) { console.warn('Socket emit failed on bill delete', err.message) }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};


// APPROVE BILL (Admin only)

exports.approveBill = async (req, res) => {
  try {
    let bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    // If already approved, no double update
    if (bill.status === "approved") {
      // Need to populate even if already approved to return consistent structure
      await bill.populate("department");
      await bill.populate("createdBy", "name role");
      return res.json({ message: "Bill already approved", bill });
    }

    // Update bill status to approved
    bill.status = "approved";
    await bill.save();

    // Update department usedAmount
    const dept = await Department.findById(bill.department);
    dept.usedAmount += bill.amount;
    await dept.save();

    // Populate for response
    await bill.populate("department");
    await bill.populate("createdBy", "name role");

    res.json({
      message: "Bill approved successfully",
      bill,
      updatedDepartment: dept
    });

    try {
      const io = require('../utils/socket').getIo()
      io.emit('bills:approved', bill)
      io.emit('departments:updated', dept)
    } catch (err) { console.warn('Socket emit failed on bill approve', err.message) }

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};


// REJECT BILL (Admin only)

exports.rejectBill = async (req, res) => {
  try {
    let bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    bill.status = "rejected";
    await bill.save();

    // Populate for response
    await bill.populate("department");
    await bill.populate("createdBy", "name role");

    res.json({ message: "Bill rejected successfully", bill });
    try {
      const io = require('../utils/socket').getIo()
      io.emit('bills:rejected', bill)
    } catch (err) { console.warn('Socket emit failed on bill reject', err.message) }

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
