const { User } = require("../models/user");

module.exports = function(req, res, next) {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ message: "unauthorized" });
    const payload = User.verifyToken(token);
    if (!payload)
      if (!token) return res.status(401).json({ message: "unauthorized" });
    req.user = payload;
    next();
  } else {
    return res.status(401).json({ message: "unauthorized" });
  }
};
