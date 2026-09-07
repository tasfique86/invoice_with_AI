const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

//Helper: Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

//@desc Register user
//@route POST /api/auth/register
//@access Public

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    //check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });
    if (user) {
      res
        .status(201)
        .json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).jeson({ message: "Server error" });
  }
};

//@desc Login user
//@route POST /api/auth/login
//@access Public

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
  } catch (error) {
    res.status(500).jeson({ message: "Server error" });
  }
};

//@desc Get current user
//@route GET /api/auth/me
//@access Private

exports.getMe = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).jeson({ message: "Server error" });
  }
};

//@desc Update user profile
//@route PUT /api/auth/me
//@access Private

exports.updateUserProfile = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).jeson({ message: "Server error" });
  }
};
