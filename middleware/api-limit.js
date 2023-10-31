const rateLimit = require("express-rate-limit");

// Define rate limiting options
const limit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

module.exports = { limit };
