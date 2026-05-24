import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { changeUserPassword, getSavedQuestions, getUserProfile, toggleSaveQuestion, updateProfile } from "../controller/user.controller.js";
import upload from "../lib/multer.js";

const router = express.Router();

router.get("/profile/:id", protectRoute, getUserProfile);
router.put("/profile", protectRoute, upload.single("profilePic"), updateProfile);
router.put("/change-password", protectRoute, changeUserPassword)
router.patch("/:id/save", protectRoute, toggleSaveQuestion);

router.get("/saved-questions/:id", protectRoute, getSavedQuestions);
export default router;