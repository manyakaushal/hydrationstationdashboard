import { Router } from "express";
import prisma from "../client";
import { Request, Response, NextFunction } from "express";
// import { PrismaClient } from "../generated/prisma";

/*
    POWER will be added as a constant value to calculate the energy usage (kwh) per day.
*/
const POWERPERCLEANING = 5;
const WATERPERCLEANING = 5;

const POWERPERFILLING = 10;
const WATERPERFILLING = 10;

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
        const { cleaningOrFilling, soapWeight } = req.body; // true if cleaning cycle, false if filling cycle
        if (cleaningOrFilling == null || soapWeight == null) {
            return res.status(400).json({ error: "Missing Sensor Values" });
        }

        let powerIncreaseKw: number;
        let waterIncreaseFlOz: number;
        if (cleaningOrFilling) {
            powerIncreaseKw = POWERPERCLEANING;
            waterIncreaseFlOz = WATERPERCLEANING;
        }
        else {
            powerIncreaseKw = POWERPERFILLING;
            waterIncreaseFlOz = WATERPERFILLING;
        }

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

        await prisma.hydrationStation.update({
            where: {
                id: 1,
            },
            data: {
                soapWeight: soapWeight,
            },
        })

        await prisma.powerUsageHistory.upsert({
            where: {
                stationId_day: {
                    stationId: 1,
                    day: day,
                },
            },
            update: {
                powerKw: {
                    increment: powerIncreaseKw,
                },
                measuredAt: new Date(),
            },
            create: {
                stationId: 1,
                day: day,
                measuredAt: new Date(),
                powerKw: powerIncreaseKw,
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
                waterFlOz: {
                    increment: waterIncreaseFlOz,
                },
                measuredAt: new Date(),
            },
            create: {
                stationId: 1,
                day: day,
                measuredAt: new Date(),
                waterFlOz: waterIncreaseFlOz,
            },
        });

        res.status(200).json({ message: "Data processed successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Could not fetch data from sensors." });
    }
})

export default router;