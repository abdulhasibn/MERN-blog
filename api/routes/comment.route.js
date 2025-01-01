import express from "express";

import { verifyUser } from "../utils/verifyUser.js";
import {
  createComment,
  getAllComments,
  updateLikeForComment,
  editComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.route("/create").post(verifyUser, createComment);
router.route("/post/:postId").get(verifyUser, getAllComments);
router.route("/editComment/:commentId").patch(verifyUser, editComment);
router.route("/updateLikeForComments").patch(verifyUser, updateLikeForComment);

export default router;
