import express from "express";
import {
  createPost,
  getPosts,
  deletePost,
} from "../controllers/post.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyUser, createPost);
router.get("/getPosts", getPosts);
router.delete("/deletePost/:postId/:userId", verifyUser, deletePost);

export default router;
