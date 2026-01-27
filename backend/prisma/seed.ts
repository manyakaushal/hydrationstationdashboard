import bcrypt from 'bcrypt'
import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();
async function main(){
    const hashedPassword = await bcrypt.hash('user1@HydrationStation', 10);

    const user = await prisma.user.create({
        data: {
            email: 'user@example.com',
            password: hashedPassword,
        },
    })

    await prisma.hydrationStation.createMany({
        data: [
            {
                userId: user.id,
                bottlesWashed: 120,
                lastCleaningCycleAt: new Date(),
            },
            {
                userId: user.id,
                bottlesWashed: 60,
                lastCleaningCycleAt: new Date(Date.now() - 1000*60*60*24),
            },
        ],
    });
    console.log("Hydration Stations seeded");

}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async() => {
        await prisma.$disconnect();
    });