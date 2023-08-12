const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");

const {
  getUser,
  updateUser,
  searchUsers,
} = require("../controllers/usersController");

router
  .get("/searchUsers", searchUsers)
  .get("/:id", getUser)
  .patch("/updateUser/:id", verifyJWT, updateUser);

module.exports = router;
