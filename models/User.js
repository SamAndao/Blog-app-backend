const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  posts: {
    type: Array,
  },
  friends: {
    type: Array,
  },
  userImage: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
