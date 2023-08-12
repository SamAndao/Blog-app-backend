const User = require("../models/User");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const foundUser = await User.findOne({ username });
  if (!foundUser) {
    return res.status(401).json({ message: "User not found" });
  }

  const userId = foundUser._id;

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) return res.status(401).json({ message: "Incorrect password" });
  //create the JWTs
  const accessToken = jwt.sign(
    { userId: foundUser._id, username: foundUser.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "2m" }
  );
  const refreshToken = jwt.sign(
    { userId: foundUser._id, username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("rfshtkn", refreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.json({ accessToken, userId, username });
});

const registerUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "All input field required" });
  }

  let foundEmail = email;

  if (!email) foundEmail = null;

  const duplicate = await User.findOne({ username: username });

  if (duplicate) {
    return res.status(409).json({ message: "Username already taken" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      username: username,
      password: hashedPassword,
      email: foundEmail,
    });
    const accessToken = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2m" }
    );
    const refreshToken = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("rfshtkn", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      accessToken,
      username: newUser.username,
      userId: newUser._id,
    });
  } catch (err) {
    console.log(err);
  }
});

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.rfshtkn) {
    return res.status(203).json({ message: "No content" });
  }
  res.clearCookie("rfshtkn", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.json({ message: "User logged out" });
};

const checkUsername = async (req, res) => {
  const { username } = req.body;
  const foundUser = await User.findOne({ username: username });
  if (foundUser) return res.status(200).json({ available: false });
  res.status(200).json({ available: true });
};

module.exports = { handleLogin, registerUser, logout, checkUsername };
