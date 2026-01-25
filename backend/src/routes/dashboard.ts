import express from "express";
import { authenticateToken } from '../middleware/authMiddleWare';
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/dashboard/data
 * Combines user info and the very latest sensor reading.
 * Useful for the main dashboard header/status.
 */
router.get("/data", authenticateToken, async (req, res) => {
    try {
        const latestReading = await prisma.reading.findFirst({
            orderBy: { createdAt: 'desc' }
        });

        res.json({ 
            message: "Hydration Station Dashboard Data", 
            user: req.user,
            currentReading: latestReading 
        });
    } catch (error) {
        res.status(500).json({ error: "Internal server error fetching dashboard data." });
    }
});

/**
 * GET /api/dashboard/graph
 * Fetches historical data for the frontend charts.
 */
router.get("/graph", authenticateToken, async (req, res) => {
    try {
        // Fetches the last 50 readings to display in a trend graph
        const readings = await prisma.reading.findMany({
            take: 50,
            orderBy: { createdAt: 'desc' }
        });

        // We reverse it so the graph displays left-to-right (oldest to newest)
        res.json(readings.reverse());
    } catch (error) {
        res.status(500).json({ error: "Internal server error fetching graph data." });
    }
});

export default router;
