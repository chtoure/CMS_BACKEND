import {
  UserService
} from "../../chunk-T4HQAV4F.js";
import {
  PrismaClient_default
} from "../../chunk-A6KLEGV2.js";

// src/Types/component.ts
var ACTIONS_BY_FAMILY = {
  static: [],
  interactive: ["NAVIGATE_TO", "SHOW_ALERT", "OPEN_MODAL"],
  container: ["OPEN_MODAL"],
  input: ["SHOW_ALERT"],
  complex: ["NAVIGATE_TO", "OPEN_MODAL"]
};

// src/Utils/Seeds/SeedComponent.ts
var componentsData = [
  {
    name: "Bouton d'action",
    tag: "ButtonBuilder",
    icon: "MousePointer2",
    family: "interactive",
    supportedActions: ACTIONS_BY_FAMILY["interactive"],
    defaultProps: {
      styles: {
        variant: { type: "static", value: "default" },
        // bg: { type: "static", value: "#007bff" },
        padding: { type: "static", value: 10 }
      },
      params: [
        {
          name: "content",
          label: "Contenu",
          type: {
            source: "static" /* STATIC */,
            value: "Cliquez ici"
          },
          required: true
        }
      ],
      data: {
        content: { type: "static", value: "Cliquez ici" },
        cliquable: {
          action: "TOGGLE_VISIBILITY",
          action_params: { blockId: { type: "static", value: "" } }
        }
      },
      children: []
    }
  },
  {
    name: "Carte",
    tag: "CardBuilder",
    icon: "Square",
    family: "container",
    supportedActions: ACTIONS_BY_FAMILY["container"],
    defaultProps: {
      styles: {
        padding: { type: "static", value: 6 },
        bg: { type: "static", value: "#ffffff" },
        display: { type: "static", value: "block" },
        align: { type: "static", value: "center" },
        justify: { type: "static", value: "between" }
      },
      params: [],
      data: {},
      children: []
    }
  },
  {
    name: "Texte",
    tag: "TextBuilder",
    icon: "Type",
    family: "static",
    supportedActions: ACTIONS_BY_FAMILY["static"],
    defaultProps: {
      styles: {
        fontSize: { type: "static", value: { default: "16px", md: "18px" } },
        textColor: { type: "static", value: "#060505" },
        textAlign: { type: "static", value: "left" },
        marginBottom: { type: "static", value: 4 }
      },
      params: [
        {
          name: "content",
          label: "Contenu",
          type: {
            source: "static" /* STATIC */,
            value: "Ceci est un texte par d\xE9faut"
          },
          required: true
        }
      ],
      data: {
        content: { type: "static", value: "Ceci est un texte par d\xE9faut" },
        tag: { type: "static", value: "p" }
      },
      children: []
    }
  },
  {
    name: "Image",
    tag: "ImageBuilder",
    icon: "Image",
    family: "static",
    supportedActions: ACTIONS_BY_FAMILY["static"],
    defaultProps: {
      styles: {
        display: { type: "static", value: "block" }
      },
      params: [
        {
          name: "src",
          label: "Source",
          type: {
            source: "image" /* IMAGE */,
            src: "/image.jpg"
          },
          required: true
        },
        {
          name: "alt",
          label: "Alt",
          type: {
            source: "static" /* STATIC */,
            value: "Image de d\xE9monstration"
          },
          required: true
        }
      ],
      data: {
        src: { type: "static", value: "/image.jpg" },
        alt: { type: "static", value: "Image de d\xE9monstration" },
        objectFit: { type: "static", value: "cover" }
      },
      children: []
    }
  },
  {
    name: "Ic\xF4ne",
    tag: "IconBuilder",
    icon: "Sparkles",
    family: "static",
    supportedActions: ACTIONS_BY_FAMILY["static"],
    defaultProps: {
      styles: {
        textColor: { type: "static", value: "#e2e2e2ff" },
        marginBottom: { type: "static", value: 2 }
      },
      params: [
        {
          name: "icon",
          label: "Ic\xF4ne",
          type: {
            source: "static" /* STATIC */,
            value: "Star"
          },
          required: true
        }
      ],
      data: {
        icon: { type: "static", value: "Star" },
        size: { type: "static", value: 32 },
        strokeWidth: { type: "static", value: 2 }
      },
      children: []
    }
  },
  // {
  //   name: "Champ Saisie",
  //   tag: "InputBuilder",
  //   icon: "FormInput",
  //   family: "input",
  //   supportedActions: ACTIONS_BY_FAMILY['input'],
  //   defaultProps: {
  //     styles: {
  //       padding: { type: "static", value: 2 }
  //     },
  //     params: [
  //       {
  //         name: "label",
  //         label: "Label",
  //         type: {
  //           source: ValueSource.STATIC,
  //           value: "Votre nom"
  //         },
  //         required: true,
  //       },
  //       {
  //         name: "placeholder",
  //         label: "Placeholder",
  //         type: {
  //           source: ValueSource.STATIC,
  //           value: "Entrez votre nom..."
  //         },
  //         required: true,
  //       },
  //       {
  //         name: "name",
  //         label: "Name",
  //         type: {
  //           source: ValueSource.STATIC,
  //           value: "username"
  //         },
  //         required: true,
  //       }
  //     ],
  //     data: {
  //       type: { type: "static", value: "text" },
  //       label: { type: "static", value: "Votre nom" },
  //       placeholder: { type: "static", value: "Entrez votre nom..." },
  //       name: { type: "static", value: "username" },
  //       required: { type: "static", value: true }
  //     },
  //     children: []
  //   }
  // },
  {
    name: "Slider",
    tag: "SliderBuilder",
    icon: "SquarePlay",
    family: "complex",
    supportedActions: ACTIONS_BY_FAMILY["complex"],
    defaultProps: {
      styles: {
        padding: { type: "static", value: 10 },
        bg: { type: "static", value: "transparent" },
        rounded: { type: "static", value: "none" }
      },
      data: {
        autoPlay: { type: "static", value: false },
        speed: { type: "static", value: 3e3 },
        showPagination: { type: "static", value: false },
        showArrows: { type: "static", value: false },
        loop: { type: "static", value: false }
      },
      children: []
    }
  },
  {
    name: "Accord\xE9on",
    tag: "AccordionBuilder",
    icon: "ListCollapse",
    family: "complex",
    supportedActions: ACTIONS_BY_FAMILY["complex"],
    defaultProps: {
      styles: { marginBottom: { type: "static", value: 4 } },
      params: [
        {
          name: "title",
          label: "Titre",
          type: {
            source: "static" /* STATIC */,
            value: "Nouvelle Question"
          },
          required: true
        },
        {
          name: "reponse",
          label: "Reponse",
          type: {
            source: "static" /* STATIC */,
            value: ""
          },
          required: true
        }
      ],
      data: {
        title: { type: "static", value: "Nouvelle Question" },
        isOpen: { type: "static", value: false },
        transitionSpeed: { type: "static", value: 300 },
        reponse: { type: "static", value: "" }
      },
      children: []
    }
  },
  {
    name: "Lien",
    tag: "LinkBuilder",
    icon: "ExternalLink",
    family: "static",
    supportedActions: ACTIONS_BY_FAMILY["static"],
    defaultProps: {
      styles: {
        textColor: { type: "static", value: "#3b82f6" },
        textAlign: { type: "static", value: "left" }
      },
      params: [
        {
          name: "text",
          label: "Texte du lien",
          type: {
            source: "static" /* STATIC */,
            value: "Lien personnalis\xE9"
          },
          required: true
        },
        {
          name: "url",
          label: "URL",
          type: {
            source: "static" /* STATIC */,
            value: ""
          },
          required: true
        }
      ],
      data: {
        text: "Lien personnalis\xE9",
        url: "",
        target: "_self"
      },
      children: []
    }
  }
];
async function seedAddComponent() {
  for (const component of componentsData) {
    await PrismaClient_default.component.upsert({
      where: { tag: component.tag },
      update: {
        ...component,
        defaultProps: component.defaultProps
      },
      create: {
        ...component,
        defaultProps: component.defaultProps
      }
    });
  }
  console.log("Components ins\xE9r\xE9es.");
}

// src/Utils/Seeds/SeedParameter.ts
async function seedAddParameter() {
  console.log("D\xE9but du peuplement des param\xE8tres...");
  const parameter = await PrismaClient_default.parameter.upsert({
    where: { id: 1 },
    update: {
      entity_name: "Compositor Enterprise",
      title: "Mon Super CMS Compositor",
      mediaId: null,
      description: "Bienvenue sur votre nouveau CMS sur-mesure. Commencez \xE0 composer vos pages d\xE8s maintenant.",
      family_name: "Inter"
    },
    create: {
      id: 1,
      entity_name: "Compositor Enterprise",
      title: "Mon Super CMS Compositor",
      mediaId: null,
      description: "Bienvenue sur votre nouveau CMS sur-mesure. Commencez \xE0 composer vos pages d\xE8s maintenant.",
      family_name: "Inter"
    }
  });
  console.log({ parameter });
  console.log("Param\xE8tres initiaux cr\xE9\xE9s avec succ\xE8s !");
}

// src/Utils/Seeds/SeedPermission.ts
var permissionsData = [
  { id: 1, name: "create_user", description: "Creation des utilisateurs" },
  { id: 2, name: "read_page_admin", description: "Lecture page admin" },
  { id: 3, name: "update_page_admin", description: "Modifier les donn\xE9es de la page admin" },
  { id: 4, name: "update_parameter", description: "Modifier les parametres" },
  { id: 5, name: "create_content_type", description: "Creation des types de contenu" },
  { id: 6, name: "read_content_type", description: "Lecture des types de contenu" },
  { id: 7, name: "update_content_type", description: "Modifier les types de contenu" },
  { id: 8, name: "delete_content_type", description: "Supprimer les types de contenu" },
  { id: 9, name: "create_content_entry", description: "Creation des entr\xE9es de contenu" },
  { id: 10, name: "read_content_entry", description: "Lecture des entr\xE9es de contenu" },
  { id: 11, name: "update_content_entry", description: "Modifier les entr\xE9es de contenu" },
  { id: 12, name: "delete_content_entry", description: "Supprimer les entr\xE9es de contenu" },
  { id: 13, name: "create_taxonomy", description: "Creation des taxonomies" },
  { id: 14, name: "read_taxonomy", description: "Lecture des taxonomies" },
  { id: 15, name: "update_taxonomy", description: "Modifier les taxonomies" },
  { id: 16, name: "delete_taxonomy", description: "Supprimer les taxonomies" },
  { id: 17, name: "upload_media", description: "Upload des m\xE9dias" },
  { id: 18, name: "read_media", description: "Lecture des m\xE9dias" },
  { id: 19, name: "update_media", description: "Modifier les m\xE9dias" },
  { id: 20, name: "delete_media", description: "Supprimer les m\xE9dias" },
  { id: 21, name: "create_page", description: "Creation des pages" },
  { id: 22, name: "read_page", description: "Lecture des pages" },
  { id: 23, name: "update_page", description: "Modifier les pages" },
  { id: 24, name: "delete_page", description: "Supprimer les pages" },
  { id: 25, name: "create_role", description: "Creation des r\xF4les" },
  { id: 26, name: "read_role", description: "Lecture des r\xF4les" },
  { id: 27, name: "update_role", description: "Modifier les r\xF4les" },
  { id: 28, name: "delete_role", description: "Supprimer les r\xF4les" },
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
  { id: 45, name: "read_permission", description: "Lecture des permissions" },
  { id: 46, name: "update_permission", description: "Modifier les permissions" },
  { id: 47, name: "delete_permission", description: "Supprimer les permissions" },
  { id: 48, name: "create_permission", description: "Creation des permissions" }
];
async function seedAddPermission() {
  for (const perm of permissionsData) {
    await PrismaClient_default.permission.upsert({
      where: { id: perm.id },
      update: perm,
      create: perm
    });
  }
  console.log("Permissions et relations ins\xE9r\xE9es.");
}

// src/Utils/Seeds/SeedRole.ts
var rolesData = [
  { id: 1, name: "Administrateur", description: "Gestion illimit\xE9" },
  { id: 2, name: "Manager", description: "Gestion des magasins" },
  { id: 3, name: "User", description: "Lecture seule" }
];
async function seedAddRole() {
  for (const role of rolesData) {
    await PrismaClient_default.role.upsert({
      where: { id: role.id },
      update: { name: role.name, description: role.description },
      create: role
    });
  }
  console.log("R\xF4les ins\xE9r\xE9s avec success");
}

// src/Utils/Seeds/SeedRolePermission.ts
var relations = [
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
  { roleId: 3, permissionId: 45 }
];
async function seedAddRolePermission() {
  for (const rel of relations) {
    await PrismaClient_default.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: rel.roleId,
          permissionId: rel.permissionId
        }
      },
      update: rel,
      // Rien à mettre à jour si la liaison existe déjà
      create: rel
    });
  }
  console.log("Termin\xE9 avec succ\xE8s !");
}

// src/Utils/Seeds/SeedUser.ts
import dotenv from "dotenv";
dotenv.config();
var adminEmail = process.env.ADMIN_EMAIL || "";
var adminFullName = process.env.ADMIN_FULL_NAME || "";
var adminDefaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || "";
var userService = new UserService();
async function seedAddUser() {
  const password_hash = await userService.hashPassword(adminDefaultPassword);
  console.log("D\xE9but du peuplement de la base de donn\xE9es...");
  const user1 = await PrismaClient_default.user.upsert({
    where: { email: adminEmail },
    update: {
      email: adminEmail,
      full_name: adminFullName,
      password_hash,
      status: "ACTIVE",
      role_id: 1,
      isLoggedIn: false,
      isActiveAt: /* @__PURE__ */ new Date()
    },
    create: {
      email: adminEmail,
      full_name: adminFullName,
      password_hash,
      status: "ACTIVE",
      role_id: 1,
      isLoggedIn: false,
      isActiveAt: /* @__PURE__ */ new Date()
    }
  });
  console.log("Utilisateur cr\xE9\xE9 avec succ\xE8s !");
}

// src/Utils/Seeds/Seed.ts
async function main() {
  try {
    await seedAddParameter();
    await seedAddPermission();
    await seedAddRole();
    await seedAddUser();
    await seedAddRolePermission();
    await seedAddComponent();
  } catch (error) {
    console.error("Erreur lors de l'execution du seed :", error);
  }
}
main().then(() => {
  console.log("Fin du script de seed.");
}).catch((e) => {
  console.error("Erreur durant le seed:", e);
  process.exit(1);
}).finally(async () => {
  await PrismaClient_default.$disconnect();
});
