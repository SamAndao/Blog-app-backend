const Post = require("../models/Post");
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");

const getAllPosts = asyncHandler(async (req, res) => {
  const allPosts = await Post.find();

  if (!allPosts?.length) {
    return res.status(400).json({ message: "No posts found" });
  }

  res.json(allPosts);
});

const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(400).json({ message: "Post not found" });
  }

  res.json(post);
});

const createPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const { userId, username } = req.user;
  const date = new Date().toJSON();

  console.log(userId, username, title, content);

  if (!title || !content || !username || !userId) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const newPost = await Post.create({
      title,
      content,
      userId,
      user: username,
      date,
    });
    res.status(201).json({ message: "New post created", newPost });
  } catch (error) {
    res.status(400).json({ message: "Invalid data received" });
  }
});

const updatePost = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { content, title, postId } = req.body;

  let post = await Post.findById(postId);

  if (post.userId !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  post.content = content;
  post.title = title;
  await post.save();

  res.json({ message: "Post has been updated", post });
});

const deletePost = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { postId } = req.body;

  const post = await Post.findById(postId);

  if (post.userId !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }
  await Post.findByIdAndDelete(postId);
  res.json({ message: "Post has been deleted" });
});

const getUserPostById = asyncHandler(async (req, res) => {
  console.log("requested");
  const userId = req.params.id;
  console.log(userId);
  const userPosts = await Post.find({ userId }).exec();
  res.json(userPosts);
});

const searchPosts = asyncHandler(async (req, res) => {
  const searchString = req.query.value;

  const searchedPosts = await Post.find({ $text: { $search: searchString } });

  return res.status(200).json([...searchedPosts]);
});

// the comment is an array of objects that contains username, userId, comment, date, commentId

const addPostComment = asyncHandler(async (req, res) => {
  const { username, userId, content } = req.body;
  const commentId = crypto.randomUUID();
  const date = new Date().toJSON();
  const commentObject = {
    username,
    userId,
    content,
    date,
    commentId,
  };
  const post = await Post.findById(req.params.id);
  post.comments = [...post.comments, commentObject];
  await post.save();
  res.json({ post });
});

// the like is an array of user id

const addDeletePostLike = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const post = await Post.findById(req.params.id);
  const isLiked = post.likes.find(userId);

  if (isLiked) {
    post.likes = post.likes.filter((user) => user !== userId);
  } else {
    post.likes = [...post.likes, userId];
  }

  await post.save();

  res.json({ post });
});

const deletePostComment = asyncHandler(async (req, res) => {
  const { commentId } = req.body;
  const post = await Post.findById(req.params.id);
  post.comments = post.comments.filter((item) => item.commentId !== commentId);
  await post.save();
  res.json({ post });
});

module.exports = {
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  createPost,
  searchPosts,
  getUserPostById,
  addPostComment,
  addDeletePostLike,
  deletePostComment,
};

// router
//   .get("^/&", getAllPosts)
//   .get("/:id", getPost)
//   .post(createPost)
//   .patch(updatePost)
//   .delete(deletePost);
