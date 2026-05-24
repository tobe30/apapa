import express from "express";
import { createQuestion, deleteQuestion, getQuestionById, getQuestions, getUserQuestions, incrementQuestionView, QuestionDownvote, QuestionUpvote, searchPlaces, updateQuestion } from "../controller/question.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/create", protectRoute, createQuestion);
router.get("/search", protectRoute, searchPlaces);
router.get("/", protectRoute, getQuestions);
router.get("/:id", protectRoute, getQuestionById);
router.post("/upvote/:id", protectRoute, QuestionUpvote);
router.post("/downvote/:id", protectRoute, QuestionDownvote);

router.get("/user/:userId", getUserQuestions);
router.put("/user/:id", protectRoute, updateQuestion);
router.delete("/user/:id", protectRoute, deleteQuestion);

router.post("/:id/view", incrementQuestionView);




export default router;