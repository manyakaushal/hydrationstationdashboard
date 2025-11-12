import express from "express";
import { authenticateToken } from '../middleware/authMiddleWare';

const router = express.Router();

router.get("/data", authenticateToken, (req, res) => {
    res.json({ message: "This is the dashboard page.", user: req.user});
});

export default router;