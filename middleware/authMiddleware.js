const jwt = require("jsonwebtoken");

// Check user authentication
exports.auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "No token, access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store user info
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// Allow only Admin
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin access required" });

  next();
};

// Allow only Leader
exports.leaderOnly = (req, res, next) => {
  if (req.user.role !== "leader" && req.user.role !== "admin")
    return res.status(403).json({ message: "Leader access required" });

  next();
};
