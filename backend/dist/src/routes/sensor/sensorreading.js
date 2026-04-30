"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// === Constants ===
const VOLTAGE = 220; // volts
const CURRENT = 5; // amps
const WATER_PER_CYCLE = 10; // liters
const HOURS_PER_CYCLE = 1; // hours per cycle
const CONSTANT_TIMESTAMP = 1700000000000; // fixed timestamp example
router.post("/", (req, res) => {
    try {
        const { numberOfCycles, doneCleaning, doneFilling, soapWeight } = req.body;
        // Use constant timestamp or Date.now()
        const timestamp = CONSTANT_TIMESTAMP; // or: Date.now();
        // === Calculations ===
        const powerPerCycle = VOLTAGE * CURRENT; // watts
        const energyPerCycle = powerPerCycle * HOURS_PER_CYCLE; // Wh
        const totalEnergy = energyPerCycle * numberOfCycles; // total energy Wh
        const totalWater = WATER_PER_CYCLE * numberOfCycles; // total water liters
        // Log data and calculations
        console.log("Sensor Data Received:", {
            numberOfCycles,
            doneCleaning,
            doneFilling,
            soapWeight,
            timestamp,
            powerPerCycle,
            totalEnergy,
            totalWater
        });
        // Respond with calculated values
        res.status(200).json({
            success: true,
            data: {
                timestamp,
                numberOfCycles,
                doneCleaning,
                doneFilling,
                soapWeight,
                powerPerCycle,
                totalEnergy,
                totalWater
            }
        });
    }
    catch (error) {
        console.error("Error processing sensor data:", error);
        res.status(500).json({
            success: false,
            message: "Server error processing sensor data"
        });
    }
});
exports.default = router;
//# sourceMappingURL=sensorreading.js.map