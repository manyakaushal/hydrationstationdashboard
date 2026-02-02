import {Router} from "express";
import { authenticateToken } from '../middleware/authMiddleWare';
import prisma from "../client";

const router = Router();

router.use(authenticateToken);

router.get("/", authenticateToken, async (req, res) => {
    try{
        const userId = req.user.id;

        const hydrationStation = await prisma.hydrationStation.findFirst({
            where:{
                userId : userId,
            }
        })

        const bottlesWashed = hydrationStation?.bottlesWashed;
        const lastCleaningCycleAt = hydrationStation?.lastCleaningCycleAt;

        // const hydrationStationCount = await prisma.hydrationStation.count({
        //     where: {
        //         userId: userId,
        //     },
        // })

        return res.json({
            bottlesWashed,
            lastCleaningCycleAt
        })
    }
    catch (err) {
        res.status(500).json({error: "Fetching Data Failed"});
    }
});

export default router;
