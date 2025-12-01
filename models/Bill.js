const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  amount: {
    type: Number,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  },

  file: {
    type: String, 
    default: null
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Bill", BillSchema);
