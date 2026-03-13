import type { RegisterNavItem } from "../../Types/NavItem.ts";
import prisma from "../PrismaClient.ts";


const navItems: RegisterNavItem[] = [
        { label: "Accueil", value: "/", pageId: 1 },
        { label: "À Propos", value: "/a-propos", pageId: 2 },
        { label: "Services", value: "/services", pageId: 3 },
        { label: "Contact", value: "/contact", pageId: 4 }
    ];
export const seedNavItems = async () => {
    

    for (const navItem of navItems) {
        await prisma.navItem.upsert({
            where: { value: navItem.value },
            update: { label: navItem.label},
            create: navItem
        });
    }

    console.log("NavItems insérés.");
};