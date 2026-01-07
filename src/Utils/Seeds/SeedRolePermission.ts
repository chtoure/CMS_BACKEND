


import prisma from "../../Utils/PrismaClient.ts";

// Liaison via RolePermission
// On définit quelle permission (ID) appartient à quel rôle (ID)
const relations = [
    { roleId: 1, permissionId: 1 }, // Admin -> create_user
    { roleId: 1, permissionId: 2 }, // Admin -> read_page_admin
    { roleId: 1, permissionId: 3 }, // Admin -> update_page_admin
    { roleId: 2, permissionId: 2 }, // Manager -> read_page_admin
    { roleId: 2, permissionId: 3 }, // Manager -> update_page_admin
    { roleId: 3, permissionId: 2 }, // User -> read_page_admin
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
        update: {}, // Rien à mettre à jour si la liaison existe déjà
        create: rel,
        });
    }

    console.log('Terminé avec succès !');
}
