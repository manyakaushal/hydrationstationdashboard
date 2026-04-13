import { Router } from "express";
//import prisma from "../client";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../generated/prisma";

/*
    POWER will be added as a constant value to calculate the power usage (kwh) per day.
*/
const POWERKW = 5;

const router = Router();
const prisma = new PrismaClient();


const authenticateDevice = (req: Request, res: Response, next: NextFunction) => {
    const key = req.headers["x-api-key"];
    if (key !== process.env.ARDUINO_KEY) {
        return res.status(403).json({ error: "Unauthorized Device" })
    }

    next();
};

router.post("/", authenticateDevice, async (req, res) => {
    try {
        const { noOfCleaningCycles, doneCleaning, soapWeight } = req.body;

        if (!noOfCleaningCycles || doneCleaning == null || !soapWeight) {
            return res.status(400).json({ error: "Missing Sensor Values" });
        }
        const receivedAt = new Date();
        let waterUsage = 0; // This is supposed to be in a data format that fits the graphs
        waterUsage *= noOfCleaningCycles;

        const waterReading = await prisma.WaterUsageHistory.create({
            waterUsage
        });


    }
    catch (err) {
        res.status(500).json({ error: "Could not fetch data from sensors." });
    }
})

export default router;