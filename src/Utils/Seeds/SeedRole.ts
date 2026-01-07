
import prisma from "../../Utils/PrismaClient.ts";

// Définition des Rôles
const rolesData = [
    { id: 1, name: "Administrateur", description: "Gestion illimité" },
    { id: 2, name: "Manager", description: "Gestion des magasins" },
    { id: 3, name: "User", description: "Lecture seule" },
];

export async function  seedAddRole() {
    for (const role of rolesData) {
        await prisma.role.upsert({
        where: { id: role.id },
        update: { name: role.name, description: role.description },
        create: role,
        });
    }
    console.log('Rôles insérés avec success');
}