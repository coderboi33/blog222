import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { createComment, deleteComment, editComment, getAllCommentOnMyBlogs, getCommentsOfPost, likeComment } from "../controllers/comment.controller.js";

const router=express.Router();

// router.route("/register").post(register);
router.get('/my-blogs/comments',isAuthenticated,getAllCommentOnMyBlogs)
router.post('/:id/create',isAuthenticated, createComment)
router.delete('/:id/delete', isAuthenticated, deleteComment)
router.put('/:id/edit', isAuthenticated, editComment)
router.route('/:id/comment/all').get(isAuthenticated, getCommentsOfPost)
router.get('/:id/like',isAuthenticated,likeComment)

export default router;