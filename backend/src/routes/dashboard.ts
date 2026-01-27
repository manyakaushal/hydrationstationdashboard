import {Router} from "express";
import { authenticateToken } from '../middleware/authMiddleWare';
import prisma from "../client";

const router = Router();

router.use(authenticateToken);

router.get("/", authenticateToken, async (req, res) => {
    try{
        const userId = req.user.id;

        const hydrationStationCount = await prisma.hydrationStation.count({
            where: {
                userId: userId,
            },
        })

        return res.json({
            hydrationStationCount,
        })
    }
    catch (err) {

    }
});

export default router;
