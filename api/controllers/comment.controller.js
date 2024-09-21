import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";
import mongoose from "mongoose";

export const createComment = async (req, res, next) => {
  try {
    const { content, userId, postId } = req.body;
    if (!content || !userId || !postId) {
      return next(errorHandler(400, "All fields are required"));
    }
    const newComment = new Comment({
      content,
      userId,
      postId,
    });
    await newComment.save();
    res.status(201).json({ newComment });
  } catch (error) {
    next(error);
  }
};
export const getAllComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      return next(errorHandler(400, "postId Is required"));
    }
    console.log(postId);

    const getAllCommentsPipeline = [
      {
        $match: {
          postId: new mongoose.Types.ObjectId(postId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          username: "$userDetails.username",
          userId: 1,
          imgUrl: "$userDetails.profilePicture",
          postId: 1,
          createdAt: 1,
          numberOfLikes: 1,
          likes: 1,
          content: 1,
        },
      },
    ];
    const commentData = await Comment.aggregate(getAllCommentsPipeline);
    res.status(200).json(commentData);
  } catch (error) {
    return next(error);
  }
};

export const updateLikeForComment = async (req, res, next) => {
  try {
    const { userId, commentId } = req.query;
    if (!userId || !commentId) {
      return next(errorHandler(400, "All fields are required"));
    }

    const updatedComment = await Comment.findByIdAndUpdate(commentId, {
      $push: {
        likes: userId,
      },
      $inc: {
        numberOfLikes: 1,
      },
    });
    if (!updatedComment) {
      return next(errorHandler(500, "Something went wrong"));
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    return next(error);
  }
};
