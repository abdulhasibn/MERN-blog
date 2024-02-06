import { errorHandler } from "../utils/error.js";
import Post from "../models/post.model.js";

export const createPost = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(
      errorHandler(401, "You are not authorized to perform this action")
    );
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Provide value for all the fields"));
  }

  const title = req.body.title + Math.floor(Math.random() * 90 + 10);

  const slug = title
    .split(" ")
    .join("-")
    .replace(/[^a-zA-Z0-9-]/g, "");

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};
