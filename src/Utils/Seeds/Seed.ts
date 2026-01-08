import prisma from "../PrismaClient.ts";
import { seedAddParameter } from "./SeedParameter.ts";
import { seedAddPermission } from "./SeedPermission.ts";
import { seedAddRole } from "./SeedRole.ts";
import { seedAddRolePermission } from "./SeedRolePermission.ts";
import { seedAddUser } from "./SeedUser.ts";

async function main() {
    try {
        await seedAddParameter();
        await seedAddUser();
        await seedAddRole();
        await seedAddPermission();
        await seedAddRolePermission();
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