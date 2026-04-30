"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleWare_1 = require("../middleware/authMiddleWare");
const client_1 = __importDefault(require("../client"));
const router = (0, express_1.Router)();
router.use(authMiddleWare_1.authenticateToken);
router.get("/", authMiddleWare_1.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        // Find the station owned by the logged-in user
        const hydrationStation = await client_1.default.hydrationStation.findFirst({
            where: {
                userId: userId,
            }
        });
        if (!hydrationStation) {
            return res.status(404).json({ error: "Station not found" });
        }
        // Fetch the historical rows that Dom's graphs need
        const powerData = await client_1.default.powerUsageHistory.findMany({
            where: { stationId: 1 }, // The station id is hard-coded
            orderBy: { createdAt: 'asc' },
            select: {
                createdAt: true,
                powerKw: true,
            }
        });
        const waterData = await client_1.default.waterUsageHistory.findMany({
            where: { stationId: 1 }, // The station id is hard-coded
            orderBy: { createdAt: 'asc' },
            select: {
                createdAt: true,
                waterFlOz: true,
            }
        });
        // IMPORTANT: Format the DB 'timestamp' into a string 'date' (YYYY-MM-DD)
        // This allows Dom's aggregateDataByRange function to group them properly.
        const powerHistory = powerData.map(item => ({
            date: item.createdAt.toISOString().split('T')[0],
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
            waterHistory // This replaces Dom's cyan graph mock data
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Fetching Data Failed" });
    }
});
exports.default = router;
//# sourceMappingURL=dashboard.js.map