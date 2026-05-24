import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import upload from "../lib/multer.js";
import { getLeaderboard } from "../controller/leadboard.controller.js";

const router = express.Router();

router.get("/", getLeaderboard);


export default router;