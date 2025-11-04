import bcrypt from 'bcrypt'
import prisma from '../src/client'


async function main(){
    const hashedPassword = await bcrypt.hash('user1@HydrationStation', 10);

    const user = await prisma.user.create({
        data: {
            email: 'user@example.com',
            password: hashedPassword,
        },
    })

}

main().then(()=> {
    console.log('User Seeded');
    process.exit(0);
});