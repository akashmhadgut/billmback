const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

router.get("/create-admin", async (req, res) => {
  const hashed = await bcrypt.hash("123456", 10);

  const admin = await User.create({
    name: "Admin",
    email: "admin@gmail.com",
    password: hashed,
    role: "admin"
  });

  res.json(admin);
});

module.exports = router;
