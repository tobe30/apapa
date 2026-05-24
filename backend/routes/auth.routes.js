import express from "express";
import { forgotPassword, Login, logout, Register, resetPassword } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


router.get("/me", protectRoute, (req, res)=>{
    res.status(200).json({ success: true, user: req.user});
});

export default router;