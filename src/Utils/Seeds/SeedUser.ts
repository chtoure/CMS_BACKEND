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
            isLoggedIn: false,
        },
    });

    console.log({ user });
    console.log('Utilisateur créé avec succès !');

}


async function main() {
    await seedAddUser();
}



// Appele de la focntion principale main
main()
  .then(() => {
    console.log("Fin du script.");
  })
  .catch((e) => {
    console.error("Erreur durant le seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });