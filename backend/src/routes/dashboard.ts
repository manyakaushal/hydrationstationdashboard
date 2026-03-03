import {Router} from "express";
import { authenticateToken } from '../middleware/authMiddleWare';
import prisma from "../client";

const router = Router();

router.use(authenticateToken);

router.get("/", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Find the station associated with the user
        const hydrationStation = await prisma.hydrationStation.findFirst({
            where: {
                userId : userId,
            }
        });

        if (!hydrationStation) {
            return res.status(404).json({ error: "Station not found" });
        }

        // 2. NEW: Fetch the historical data for the graphs
        // We fetch from PowerUsageHistory and WaterUsageHistory using the station's ID
        const powerHistory = await prisma.powerUsageHistory.findMany({
            where: { stationId: hydrationStation.id },
            orderBy: { timestamp: 'asc' }, // Ensure data flows from past to present
            take: 30 // Limits to the last 30 data points so the graph isn't too crowded
        });

        const waterHistory = await prisma.waterUsageHistory.findMany({
            where: { stationId: hydrationStation.id },
            orderBy: { timestamp: 'asc' },
            take: 30
        });

        // 3. Return everything to the frontend
        return res.json({
            bottlesWashed: hydrationStation.bottlesWashed,
            lastCleaningCycleAt: hydrationStation.lastCleaningCycleAt,
            powerHistory, // This replaces Dom's purple graph mock data
            waterHistory  // This replaces Dom's cyan graph mock data
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({error: "Fetching Data Failed"});
    }
});

export default router;
