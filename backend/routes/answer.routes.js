import express from "express";
import { AnswerDownvote, AnswerUpvote, createAnswer, deleteAnswer, getAnswersByQuestion, getUserAnswers, updateAnswer } from "../controller/answer.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";


const router = express.Router();

router.post("/create", protectRoute, createAnswer);
router.get("/question/:id", protectRoute, getAnswersByQuestion);
router.post("/upvote/:id", protectRoute, AnswerUpvote);
router.post("/downvote/:id", protectRoute, AnswerDownvote);

router.get("/user/:userId", getUserAnswers);
router.put("/user/:id", protectRoute, updateAnswer);
router.delete("/user/:id", protectRoute, deleteAnswer);


export default router;