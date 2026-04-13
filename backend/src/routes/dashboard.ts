import { Router } from "express";
import { authenticateToken } from '../middleware/authMiddleWare';
import prisma from "../client";

const router = Router();

router.use(authenticateToken);

router.get("/", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the station owned by the logged-in user
        const hydrationStation = await prisma.hydrationStation.findFirst({
            where: {
                userId: userId,
            }
        });

        if (!hydrationStation) {
            return res.status(404).json({ error: "Station not found" });
        }

        // Fetch the historical rows that Dom's graphs need
        const powerData = await prisma.powerUsageHistory.findMany({
            where: { stationId: 1 }, // The station id is hard-coded
            orderBy: { createdAt: 'asc' },
            select: {
                createdAt: true,
                powerKw: true,
            }
        });


        const waterData = await prisma.waterUsageHistory.findMany({
            where: { stationId: hydrationStation.id },
            orderBy: { createdAt: 'asc' }
        });

        // IMPORTANT: Format the DB 'timestamp' into a string 'date' (YYYY-MM-DD)
        // This allows Dom's aggregateDataByRange function to group them properly.
        const powerHistory = powerData.map(item => ({
            date: new Date(item.createdAt).toLocaleDateString(undefined, {
                day: "numeric",
                month: "short"
            }),
            powerLevel: item.powerKw
        }));

        const waterHistory = waterData.map(d => ({
            date: d.createdAt.toISOString().split('T')[0],
            waterUsed: d.waterFlOz // Adjust field name if Ahmed's schema differs
        }));

        return res.json({
            bottlesWashed: hydrationStation.bottlesWashed,
            lastCleaningCycleAt: hydrationStation.lastCleaningCycleAt,
            powerHistory, // This replaces Dom's purple graph mock data
            waterHistory  // This replaces Dom's cyan graph mock data
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Fetching Data Failed" });
    }
});

export default router;
