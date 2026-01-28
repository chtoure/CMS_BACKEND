

import prisma from "../../Utils/PrismaClient.ts";

// Définition des Permissions
const permissionsData = [
    { id: 1, name: "create_user", description: "Creation des utilisateurs" },
    { id: 2, name: "read_page_admin", description: "Lecture page admin" },
    { id: 3, name: "update_page_admin", description: "Modifier les données de la page admin" },
];


export async function  seedAddPermission() {

    for (const perm of permissionsData) {
        await prisma.permission.upsert({
        where: { name: perm.name },
        update: { description: perm.description },
        create: perm,
        });
    }

    console.log('Permissions et relations insérées.');
}
