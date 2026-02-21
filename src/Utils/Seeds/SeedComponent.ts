

import { ACTIONS_BY_FAMILY, type AnyComponent } from "../../Types/component.ts";
import prisma from "../../Utils/PrismaClient.ts";
import type { Prisma } from "../../generated/prisma/client.ts";




const componentsData: AnyComponent[] = [
    {
    name: "Bouton d'action",
    tag: "ButtonBuilder",
    icon: "MousePointer2",
    family: "interactive",
    supportedActions: ACTIONS_BY_FAMILY['interactive'],
    defaultProps: {
      styles: {
        variant: "default",
        // rounded: "md",
        bg: "#e2e2e2ff",
        padding: 10,
      },
      data: {
        content: "Cliquez ici",
        cliquable: {
          action: "NAVIGATE_TO",
          action_params: { url: "/" }
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
    supportedActions: ACTIONS_BY_FAMILY['container'],
    defaultProps: {
      styles: {
        padding: 6,
        // rounded: "xl",
        // shadow: "md",
        // bg: "",
        // border: "#CA2C2C",
        display:"block",
        align: "center",
        justify: "between"
      },
      data: {},
      children: []
    }
  },
  {
    name: "Texte",
    tag: "TextBuilder",
    icon: "Type",
    family: "static",
    supportedActions: ACTIONS_BY_FAMILY['static'],
    defaultProps: {
      styles: {
        fontSize: { default: "10", md: "20" },
        textColor: "#060505",
        textAlign: "left",
        marginBottom: 4
      },
      data: {
        content: "Ceci est un texte par défaut",
        tag: "p"
      },
      children: []
    }
  },
  {
    name: "Image",
    tag: "ImageBuilder",
    icon: "Image",
    family: "static",
    supportedActions: ACTIONS_BY_FAMILY['static'],
    defaultProps: {
      styles: {
        // rounded: "lg",
        // shadow: "sm",
        display: "block",
        // marginBottom: 4
      },
      data: {
        src: "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=2912&auto=format&fit=crop",
        alt: "Image de démonstration",
        // width: "100%",
        // height: 300,
        objectFit: "cover"
      },
      children: []
    }
  },
  {
    name: "Icône",
    tag: "IconBuilder",
    icon: "Sparkles",
    family: "static",
    supportedActions: ACTIONS_BY_FAMILY['static'],
    defaultProps: {
      styles: {
        textColor: "#e2e2e2ff",
        marginBottom: 2
      },
      data: {
        icon: "Star",
        size: 32,
        strokeWidth: 2
      },
      children: []
    }
  },
  {
    name: "Champ Saisie",
    tag: "InputBuilder",
    icon: "FormInput",
    family: "input",
    supportedActions: ACTIONS_BY_FAMILY['input'],
    defaultProps: {
      styles: {
        // marginBottom: 4,
        // border: "#CA2C2C",
        // rounded: "md",
        padding: 2
      },
      data: {
        type: "text",
        label: "Votre nom",
        placeholder: "Entrez votre nom...",
        name: "username",
        required: true
      },
      children: []
    }
  }
];


export async function  seedAddComponent() {

    for (const component of componentsData) {
        await prisma.component.upsert({
            where: { tag: component.tag },
            update: {
                ...component,
                defaultProps: component.defaultProps as unknown as Prisma.InputJsonValue
            },
            create: {
                ...component,
                defaultProps: component.defaultProps as unknown as Prisma.InputJsonValue
            }
        });
    }

    console.log('Components insérées.');
}
