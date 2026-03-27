


import prisma from "../../Utils/PrismaClient.ts";

// Liaison via RolePermission
// On définit quelle permission (ID) appartient à quel rôle (ID)
const relations = [
    { roleId: 1, permissionId: 1 },
    { roleId: 1, permissionId: 2 },
    { roleId: 1, permissionId: 3 },
    { roleId: 1, permissionId: 4 },
    { roleId: 1, permissionId: 5 },
    { roleId: 1, permissionId: 6 },
    { roleId: 1, permissionId: 7 },
    { roleId: 1, permissionId: 8 },
    { roleId: 1, permissionId: 9 },
    { roleId: 1, permissionId: 10 },
    { roleId: 1, permissionId: 11 },
    { roleId: 1, permissionId: 12 },
    { roleId: 1, permissionId: 13 },
    { roleId: 1, permissionId: 14 },
    { roleId: 1, permissionId: 15 },
    { roleId: 1, permissionId: 16 },
    { roleId: 1, permissionId: 17 },
    { roleId: 1, permissionId: 18 },
    { roleId: 1, permissionId: 19 },
    { roleId: 1, permissionId: 20 },
    { roleId: 1, permissionId: 21 },
    { roleId: 1, permissionId: 22 },
    { roleId: 1, permissionId: 23 },
    { roleId: 1, permissionId: 24 },
    { roleId: 1, permissionId: 25 },
    { roleId: 1, permissionId: 26 },
    { roleId: 1, permissionId: 27 },
    { roleId: 1, permissionId: 28 },
    { roleId: 1, permissionId: 29 },
    { roleId: 1, permissionId: 30 },
    { roleId: 1, permissionId: 31 },
    { roleId: 1, permissionId: 32 },
    { roleId: 1, permissionId: 33 },
    { roleId: 1, permissionId: 34 },
    { roleId: 1, permissionId: 35 },
    { roleId: 1, permissionId: 36 },
    { roleId: 1, permissionId: 37 },
    { roleId: 1, permissionId: 38 },
    { roleId: 1, permissionId: 39 },
    { roleId: 1, permissionId: 40 },
    { roleId: 1, permissionId: 41 },
    { roleId: 1, permissionId: 42 },
    { roleId: 1, permissionId: 43 },
    { roleId: 1, permissionId: 44 },
    { roleId: 1, permissionId: 45 },
    { roleId: 1, permissionId: 46 },
    { roleId: 1, permissionId: 47 },
    { roleId: 1, permissionId: 48 },
    { roleId: 2, permissionId: 2 },
    { roleId: 2, permissionId: 3 },
    { roleId: 3, permissionId: 2 },
    { roleId: 3, permissionId: 6 },
    { roleId: 3, permissionId: 10 },
    { roleId: 3, permissionId: 14 },
    { roleId: 3, permissionId: 18 },
    { roleId: 3, permissionId: 22 },
    { roleId: 3, permissionId: 26 },
    { roleId: 3, permissionId: 29 },
    { roleId: 3, permissionId: 36 },
    { roleId: 3, permissionId: 38 },
    { roleId: 3, permissionId: 42 },
    { roleId: 3, permissionId: 45 },
    

];

export async function  seedAddRolePermission() {

    for (const rel of relations) {
        await prisma.rolePermission.upsert({
        where: {
            roleId_permissionId: {
            roleId: rel.roleId,
            permissionId: rel.permissionId,
            },
        },
        update: rel, // Rien à mettre à jour si la liaison existe déjà
        create: rel,
        });
    }

    console.log('Terminé avec succès !');
}
