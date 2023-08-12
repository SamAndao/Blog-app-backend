const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");
const router = express.Router();
const {
  getPost,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  addPostComment,
  addDeletePostLike,
  deletePostComment,
  getUserPostById,
  searchPosts,
} = require("../controllers/postsController");

router
  .get("/", getAllPosts)
  .get("/searchPosts", searchPosts)
  .get("/:id", getPost)
  .get("/getUserPosts/:id", getUserPostById)
  .post("/", verifyJWT, createPost)
  .patch("/", verifyJWT, updatePost)
  .delete("/", verifyJWT, deletePost)
  .patch("/:id/addComment", verifyJWT, addPostComment)
  .patch("/:id/addLike", verifyJWT, addDeletePostLike)
  .patch("/:id/deleteComment", verifyJWT, deletePostComment);

module.exports = router;
