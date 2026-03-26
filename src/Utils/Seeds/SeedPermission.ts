

import prisma from "../../Utils/PrismaClient.ts";

// Définition des Permissions
const permissionsData = [
    { id: 1, name: "create_user", description: "Creation des utilisateurs" },
    { id: 2, name: "read_page_admin", description: "Lecture page admin" },
    { id: 3, name: "update_page_admin", description: "Modifier les données de la page admin" },
    { id: 4, name: "update_parameter", description: "Modifier les parametres" },
    { id: 5, name: "create_content_type", description: "Creation des types de contenu" },
    { id: 6, name: "read_content_type", description: "Lecture des types de contenu" },
    { id: 7, name: "update_content_type", description: "Modifier les types de contenu" },
    { id: 8, name: "delete_content_type", description: "Supprimer les types de contenu" },
    { id: 9, name: "create_content_entry", description: "Creation des entrées de contenu" },
    { id: 10, name: "read_content_entry", description: "Lecture des entrées de contenu" },
    { id: 11, name: "update_content_entry", description: "Modifier les entrées de contenu" },
    { id: 12, name: "delete_content_entry", description: "Supprimer les entrées de contenu" },
    { id: 13, name: "create_taxonomy", description: "Creation des taxonomies" },
    { id: 14, name: "read_taxonomy", description: "Lecture des taxonomies" },
    { id: 15, name: "update_taxonomy", description: "Modifier les taxonomies" },
    { id: 16, name: "delete_taxonomy", description: "Supprimer les taxonomies" },
    { id: 17, name: "upload_media", description: "Upload des médias" },
    { id: 18, name: "read_media", description: "Lecture des médias" },
    { id: 19, name: "update_media", description: "Modifier les médias" },
    { id: 20, name: "delete_media", description: "Supprimer les médias" },
    { id: 21, name: "create_page", description: "Creation des pages" },
    { id: 22, name: "read_page", description: "Lecture des pages" },
    { id: 23, name: "update_page", description: "Modifier les pages" },
    { id: 24, name: "delete_page", description: "Supprimer les pages" },
    { id: 25, name: "create_role", description: "Creation des rôles" },
    { id: 26, name: "read_role", description: "Lecture des rôles" },
    { id: 27, name: "update_role", description: "Modifier les rôles" },
    { id: 28, name: "delete_role", description: "Supprimer les rôles" },
    { id: 29, name: "read_user", description: "Lecture des utilisateurs" },
    { id: 30, name: "update_user", description: "Modifier les utilisateurs" },
    { id: 31, name: "delete_user", description: "Supprimer les utilisateurs" },
    { id: 32, name: "edit_image", description: "Modifier les images" },
    { id: 33, name: "update_variable", description: "Modifier les variables" },
    { id: 34, name: "create_variable", description: "Creation des variables" },
    { id: 35, name: "delete_variable", description: "Supprimer les variables" },
    { id: 36, name: "read_variable", description: "Lecture des variables" },
    { id: 37, name: "create_collection", description: "Creation des collections" },
    { id: 38, name: "read_collection", description: "Lecture des collections" },
    { id: 39, name: "update_collection", description: "Modifier les collections" },
    { id: 40, name: "delete_collection", description: "Supprimer les collections" },
    { id: 41, name: "create_page_revision", description: "Creation des revisions de page" },
    { id: 42, name: "read_page_revision", description: "Lecture des revisions de page" },
    { id: 43, name: "update_page_revision", description: "Modifier les revisions de page" },
    { id: 44, name: "delete_page_revision", description: "Supprimer les revisions de page" },
];


export async function  seedAddPermission() {

    for (const perm of permissionsData) {
        await prisma.permission.upsert({
            where: { id: perm.id },
            update: perm,
            create: perm,
        });
    }

    console.log('Permissions et relations insérées.');
}
