const bcrypt = require("bcrypt");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(400).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.log(error);
  }
});

// continue later
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(400).json({ message: "User not found" });
  const { username, password, email, userImage } = req.body;
});

const searchUsers = asyncHandler(async (req, res) => {
  const searchString = req.query.value;
  const allUsers = await User.find().select("-password");
  const searchedUsers = allUsers.filter((user) => {
    return user.username.toLowerCase().includes(searchString.toLowerCase());
  });
  return res.status(200).json([...searchedUsers]);
});

module.exports = { getUser, updateUser, searchUsers };
