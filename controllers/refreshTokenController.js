const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.rfshtkn) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const refreshToken = cookies.rfshtkn;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      const { userId } = decoded;
      if (err) return res.status(403).json({ message: "Forbidden" });
      const foundUser = await User.findById(userId);
      if (!foundUser) return res.status(403).json({ message: "Forbidden" });

      const accessToken = jwt.sign(
        { userId: foundUser._id, username: foundUser.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "2m" }
      );

      res.json({
        accessToken,
        userId: foundUser._id,
        username: foundUser.username,
      });
    }
  );
});

module.exports = { handleRefreshToken };
