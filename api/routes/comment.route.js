import express from "express";

import { verifyUser } from "../utils/verifyUser.js";
import {
  createComment,
  getAllComments,
  updateLikeForComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.route("/create").post(verifyUser, createComment);
router.route("/comment/:postId").get(verifyUser, getAllComments);
router.route("/updateLikeForComments").patch(verifyUser, updateLikeForComment);

export default router;
