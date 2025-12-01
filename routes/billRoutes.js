const express = require("express");
const router = express.Router();

const {
  createBill,
  getBills,
  getBillById,
  updateBill,
  deleteBill,
  approveBill,
  rejectBill
} = require("../controllers/billController");

const { auth, leaderOnly, adminOnly } = require("../middleware/authMiddleware");

// Leader: Create bill
router.post("/", auth, leaderOnly, createBill);

// All roles: View bills
router.get("/", auth, getBills);

// All roles: View single bill
router.get("/:id", auth, getBillById);

// Leader/Admin: Update bill
router.put("/:id", auth, updateBill);

// Admin only: Delete bill
router.delete("/:id", auth, adminOnly, deleteBill);

// Admin: Approve bill
router.put("/approve/:id", auth, adminOnly, approveBill);

// Admin: Reject bill
router.put("/reject/:id", auth, adminOnly, rejectBill);

module.exports = router;
