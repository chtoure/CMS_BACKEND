import prisma from "../PrismaClient.ts";
import { seedAddParameter } from "./SeedParameter.ts";
import { seedAddUser } from "./SeedUser.ts";

async function main() {
    try {
        await seedAddParameter();
        await seedAddUser();
    } catch (error) {
        console.error("Erreur lors de l'execution du seed :", error);
    }
}

main()
  .then(() => {
    console.log("Fin du script de seed.");
  })
  .catch((e) => {
    console.error("Erreur durant le seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });