"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = __importDefault(require("../src/client"));
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max + min - 1)) + min;
}
async function main() {
    const hashedPassword = await bcrypt_1.default.hash('user1@HydrationStation', 10);
    // const user = await prisma.user.create({
    //     data: {
    //         email: 'user@example.com',
    //         password: hashedPassword,
    //     },
    // })
    // await prisma.hydrationStation.createMany({
    //     data: [
    //         {
    //             userId: user.id,
    //             bottlesWashed: 120,
    //             lastCleaningCycleAt: new Date(),
    //         },
    //         {
    //             userId: user.id,
    //             bottlesWashed: 60,
    //             lastCleaningCycleAt: new Date(Date.now() - 1000*60*60*24),
    //         },
    //     ],
    // });
    for (let i = 0; i < 60; i++) {
        const day = new Date();
        day.setHours(0, 0, 0);
        day.setDate(day.getDate() - i);
        await client_1.default.waterUsageHistory.upsert({
            where: {
                stationId_day: {
                    stationId: 1,
                    day: day,
                },
            },
            update: {
                waterFlOz: getRandomInt(0, 300),
                measuredAt: day,
                createdAt: day,
            },
            create: {
                stationId: 1,
                day: day,
                measuredAt: day,
                createdAt: day,
                waterFlOz: getRandomInt(0, 300),
            },
        });
    }
    // const powerHistory = [];
    // for (let i = 0; i < 60; i++)
    // {
    //     if (i < 30)
    //     {
    //         powerHistory.push({
    //             date: `Apr ${i+1}`,
    //             powerLevel: getRandomInt(0,300),
    //         })
    //     }else{
    //         powerHistory.push({
    //             date: `May ${i+1}`,
    //             powerLevel: getRandomInt(0,300),
    //         })
    //     }
    // }
    console.log("Hydration Stations seeded");
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await client_1.default.$disconnect();
});
//# sourceMappingURL=seed.js.map