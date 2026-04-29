import dotenv from "dotenv";
import prisma from "../../Utils/PrismaClient.ts";
import UserService from "../../Services/UserService.ts";

dotenv.config();

const adminEmail = process.env.ADMIN_EMAIL || ""
const adminFullName = process.env.ADMIN_FULL_NAME || ""
const adminDefaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || ""

const userService = new UserService()

// Ajouter L'Admin
async function  seedAddUser() {

    // Hachage du password
    const password_hash = await userService.hashPassword(adminDefaultPassword);
    console.log('Début du peuplement de la base de données...');

    // Creation 
    // const user = await prisma.user.upsert({
    //     where: { email: 'chabaneu7@gmail.com' },
    //     update: {
    //         email: 'chabaneu7@gmail.com',
    //         full_name: 'TOURE Chabane',
    //         password_hash: password_hash,
    //         status: "ACTIVE",
    //         role_id:3,
    //         isLoggedIn: false,
    //         isActiveAt:new Date() 
    //     }, // Si l'utilisateur existe déjà, on ne fait rien
    //     create: {
    //         email: 'chabaneu7@gmail.com',
    //         full_name: 'TOURE Chabane',
    //         password_hash: password_hash,
    //         status: "ACTIVE",
    //         role_id:3,
    //         isLoggedIn: false,
    //         isActiveAt:new Date() 
    //     },
    // });

    const user1 = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            email: adminEmail,
            full_name: adminFullName,
            password_hash: password_hash,
            status: "ACTIVE",
            role_id:1,
            isLoggedIn: false,
            isActiveAt:new Date()
        },
        create: {
            email: adminEmail,
            full_name: adminFullName,
            password_hash: password_hash,
            status: "ACTIVE",
            role_id:1,
            isLoggedIn: false,
            isActiveAt:new Date() 
        },
    });

    // console.log({ user, user1 });
    console.log('Utilisateur créé avec succès !');

}


export { seedAddUser };
