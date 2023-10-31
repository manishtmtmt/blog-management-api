const validator = require("validator");

// Validation function for username, email and password
function validateUserInput(username, email, password) {
  const errors = {};

  if (!validator.isEmail(email)) {
    errors.email = "Invalid email address";
  }

  if (!validator.isLength(username, { min: 1, max: 255 })) {
    errors.username = "Username must be between 1 and 255 characters";
  }

  if (!validator.isLength(password, { min: 8 })) {
    errors.password = "Password must be at least 8 characters";
  }

  return errors;
}

function sanitizeInput(input) {
  return input.trim();
}

module.exports = { validateUserInput, sanitizeInput };
