const PostModel = require("../models/posts-model");
const { sanitizeInput } = require("../utils/validator");

module.exports.createPost = async (req, res) => {
  const { userId, title = "", description = "", category = "" } = req.body;

  try {
    // Validate user inputs
    if (!userId || !title || !description || !category) {
      return res.status(400).json({
        success: false,
        message:
          "UserId, title, description, and category are required fields.",
      });
    }

    // Sanitize the inputs
    const sanitizedTitle = sanitizeInput(title);
    const sanitizedDescription = sanitizeInput(description);
    const sanitizedCategory = sanitizeInput(category);

    const post = await PostModel.create({
      title: sanitizedTitle,
      description: sanitizedDescription,
      category: sanitizedCategory,
      createdBy: userId,
    });

    return res
      .status(201)
      .json({ success: true, message: "Post saved successfully!", post });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports.getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find();

    return res.status(200).json({ success: true, posts });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports.getSpecificPost = async (req, res) => {
  const { postId = "" } = req.params;

  try {
    if (!postId) {
      res.status(400).json({ success: false, message: "Post Id is required." });
    }

    const post = await PostModel.findById(postId);

    if (!post)
      return res.status(404).json({ success: false, message: "No post found" });

    return res.status(200).json({ success: true, post });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports.updatePost = async (req, res) => {
  const { userId, title = "", description = "", category = "" } = req.body;
  const { postId } = req.params;
  try {
    if (!postId)
      return res
        .status(400)
        .json({ success: false, message: "Post Id is required" });

    const post = await PostModel.findById(postId);

    if (!post)
      return res.status(404).json({ success: false, message: "No post found" });

    post.title = title ? title : post.title;
    post.description = description ? description : post.description;
    post.category = category ? category : post.category;
    post.updatedBy = userId;

    await PostModel.findByIdAndUpdate(postId, post);

    return res.status(201).json({
      success: true,
      message: "Post updated successfully!",
      post,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports.deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    if (!postId)
      return res
        .status(400)
        .json({ success: false, message: "Post Id is required" });

    const post = await PostModel.findByIdAndDelete(postId);

    if (!post)
      return res.status(404).json({ success: false, message: "No post found" });

    return res
      .status(200)
      .json({ success: true, message: "Post deleted successfully." });
  } catch (error) {
    console.log("🚀 ~ file: blog-controller.js:123 ~ module.exports.deletePost ~ error:", error)
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
