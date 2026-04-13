import { Router } from "express";
import prisma from "../client";
import { Request, Response, NextFunction } from "express";
// import { PrismaClient } from "../generated/prisma";

/*
    POWER will be added as a constant value to calculate the energy usage (kwh) per day.
*/
const POWERPERCYCLE = 5;
const WATERPERCYCLE = 5;

const router = Router();


const authenticateDevice = (req: Request, res: Response, next: NextFunction) => {
    const key = req.headers["x-api-key"];
    if (key !== process.env.ARDUINO_KEY) {
        return res.status(403).json({ error: "Unauthorized Device" })
    }

    next();
};

router.post("/", authenticateDevice, async (req, res) => { // Request Received every cleaning cycle
    try {
        const { noOfCleaningCycles, doneCleaning, soapWeight } = req.body;
        if (noOfCleaningCycles == null || doneCleaning == null || soapWeight == null) {
            return res.status(400).json({ error: "Missing Sensor Values" });
        }

        // Calculating total power and water usage for the cycles done until now
        let powerKw = POWERPERCYCLE * noOfCleaningCycles;
        let waterFlOz = WATERPERCYCLE * noOfCleaningCycles;

        await prisma.hydrationStation.update({
            where: { id: 1 },
            data: {
                bottlesWashed: {
                    increment: 1,
                },
            },
        });

        await prisma.hydrationStation.update({
            where: { id: 1 },
            data: {
                lastCleaningCycleAt: new Date(),
            },
        });



        const now = new Date();
        const day = new Date(now);
        day.setHours(0, 0, 0, 0);

        await prisma.powerUsageHistory.upsert({
            where: {
                stationId_day: {
                    stationId: 1,
                    day: day,
                },
            },
            update: {
                powerKw: powerKw,
                measuredAt: new Date(),
            },
            create: {
                stationId: 1,
                day: day,
                measuredAt: new Date(),
                powerKw: powerKw,
            },
        });

        await prisma.waterUsageHistory.upsert({
            where: {
                stationId_day: {
                    stationId: 1,
                    day: day,
                },
            },
            update: {
                waterFlOz: waterFlOz,
                measuredAt: new Date(),
            },
            create: {
                stationId: 1,
                day: day,
                measuredAt: new Date(),
                waterFlOz: waterFlOz,
            },
        });

        res.status(200).json({ message: "Data processed successfully" });




    }
    catch (err) {
        res.status(500).json({ error: "Could not fetch data from sensors." });
    }
})

export default router;