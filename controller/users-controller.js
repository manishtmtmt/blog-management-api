require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/users-model");
const { validateUserInput, sanitizeInput } = require("../utils/validator");

const DUPLICATE_ERROR_CODE = 11000;
const JWT_SECRET = process.env.JWT_SECRET;

module.exports.registration = async (req, res) => {
  const { username = "", email = "", password = "" } = req.body;

  try {
    // Validate user inputs
    const validationErrors = validateUserInput(username, email, password);

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: validationErrors,
      });
    }

    // Sanitize the username
    const sanitizedUsername = sanitizeInput(username);

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    await UserModel.create({
      username: sanitizedUsername,
      email,
      password: hash,
    });

    return res
      .status(201)
      .json({ success: true, message: "Users successfully registered." });
  } catch (error) {
    if (error.code === DUPLICATE_ERROR_CODE) {
      return res.status(400).json({
        success: false,
        message: `${Object.keys(error.keyPattern)[0]} already exists.`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to register, Internal Server Error",
    });
  }
};

module.exports.login = async (req, res) => {
  const { username = "", password = "" } = req.body;

  try {
    // Validate user inputs
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const user = await UserModel.findOne({ username });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "Invalid Credentials" });

    const isValidPassword = bcrypt.compareSync(password, user.password);
    
    if (!isValidPassword)
      return res
        .status(404)
        .json({ success: false, message: "Invalid Credentials" });

    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    return res.status(200).json({
      success: true,
      message: "Login Successful!",
      token,
      userId: user._id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to login, Internal Server Error",
    });
  }
};

module.exports.getUserDetails = async (req, res) => {
  const { userId } = req.params;

  if (!userId)
    return res.status(404).json({ success: false, message: "No user found" });

  try {
    const user = await UserModel.findById(userId);

    if (!user)
      return res.status(404).json({ success: false, message: "No user found" });

    return res.status(200).json({ success: true, userDetails: user });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error." });
  }
};
