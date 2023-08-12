const express = require("express");
const router = express.Router();
const {
  registerUser,
  checkUsername,
} = require("../controllers/authController");

router.post("/", registerUser);
router.post("/checkUsername", checkUsername);

module.exports = router;
