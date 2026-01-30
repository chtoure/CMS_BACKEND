import prisma from "../../Utils/PrismaClient.ts";
import UserService from "../../Services/UserService.ts";


const userService = new UserService()

// Ajouter L'Admin
async function  seedAddUser() {

    // Hachage du password
    const password_hash = await userService.hashPassword("defaultPassword123");
    console.log('Début du peuplement de la base de données...');

    // Creation 
    const user = await prisma.user.upsert({
        where: { email: 'chabaneu7@gmail.com' },
        update: {}, // Si l'utilisateur existe déjà, on ne fait rien
        create: {
            email: 'chabaneu7@gmail.com',
            full_name: 'TAKPAA Wella Gilbo',
            password_hash: password_hash,
            status: "ACTIVE",
            isLoggedIn: false,
            isActiveAt:new Date() 
        },
    });

    const user1 = await prisma.user.upsert({
        where: { email: 'takpaagilbert@gmail.com' },
        update: {},
        create: {
            email: 'takpaagilbert@gmail.com',
            full_name: 'TAKPAA Wella Gilbert',
            password_hash: password_hash,
            status: "ACTIVE",
            isLoggedIn: false,
            isActiveAt:new Date() 
        },
    });

    console.log({ user, user1 });
    console.log('Utilisateur créé avec succès !');

}


export { seedAddUser };
