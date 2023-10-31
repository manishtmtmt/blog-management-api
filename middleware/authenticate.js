require("dotenv").config();
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token)
    return res
      .status(403)
      .json({ success: false, message: "No token provided!" });

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err)
      return res.status(401).json({ success: false, message: "Unauthorized!" });

    req.body.userId = decoded.userId;
    next();
  });
};

module.exports = { authenticate };
