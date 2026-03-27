import prisma from "../PrismaClient.ts";
import { seedAddComponent } from "./SeedComponent.ts";
import { seedAddPage } from "./SeedPage.ts";
import { seedAddPageRevision } from "./SeedPageRevision.ts";
import { seedAddParameter } from "./SeedParameter.ts";
import { seedAddPermission } from "./SeedPermission.ts";
import { seedAddRole } from "./SeedRole.ts";
import { seedAddRolePermission } from "./SeedRolePermission.ts";
import { seedAddSection } from "./SeedSection.ts";
import { seedAddUser } from "./SeedUser.ts";
import { seedNavItems } from "./SeedNavItems.ts";

async function main() {
    try {
        await seedAddParameter();
        await seedAddPermission();
        await seedAddRole();
        await seedAddUser();
        await seedAddRolePermission();
        await seedAddComponent();
        await seedAddPage();
        await seedAddPageRevision();
        await seedAddSection();
        await seedNavItems();
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