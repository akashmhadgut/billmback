const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  budgetAmount: {
    type: Number,
    required: true
  },

  usedAmount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Department", DepartmentSchema);
