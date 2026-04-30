"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = __importDefault(require("../client"));
// import { PrismaClient } from "../generated/prisma";
/*
    POWER will be added as a constant value to calculate the energy usage (kwh) per day.
*/
const POWERPERCLEANING = 5;
const WATERPERCLEANING = 5;
const POWERPERFILLING = 10;
const WATERPERFILLING = 10;
const router = (0, express_1.Router)();
const authenticateDevice = (req, res, next) => {
    const key = req.headers["x-api-key"];
    if (key !== process.env.ARDUINO_KEY) {
        return res.status(403).json({ error: "Unauthorized Device" });
    }
    next();
};
router.post("/", authenticateDevice, async (req, res) => {
    try {
        const { cleaningOrFilling, /*soapWeight*/ } = req.body; // true if cleaning cycle, false if filling cycle
        if (cleaningOrFilling == null /*|| soapWeight == null */) {
            return res.status(400).json({ error: "Missing Sensor Values" });
        }
        let powerIncreaseKw;
        let waterIncreaseFlOz;
        if (cleaningOrFilling) {
            powerIncreaseKw = POWERPERCLEANING;
            waterIncreaseFlOz = WATERPERCLEANING;
        }
        else {
            powerIncreaseKw = POWERPERFILLING;
            waterIncreaseFlOz = WATERPERFILLING;
        }
        await client_1.default.hydrationStation.update({
            where: { id: 1 },
            data: {
                bottlesWashed: {
                    increment: 1,
                },
            },
        });
        await client_1.default.hydrationStation.update({
            where: { id: 1 },
            data: {
                lastCleaningCycleAt: new Date(),
            },
        });
        const now = new Date();
        const day = new Date(now);
        day.setHours(0, 0, 0, 0);
        await client_1.default.hydrationStation.update({
            where: {
                id: 1,
            },
            data: {
            // soapWeight: soapWeight,
            },
        });
        await client_1.default.powerUsageHistory.upsert({
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
        await client_1.default.waterUsageHistory.upsert({
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
});
exports.default = router;
//# sourceMappingURL=sensorData.js.map