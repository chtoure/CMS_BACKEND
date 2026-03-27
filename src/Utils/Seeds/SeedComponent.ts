

import { ACTIONS_BY_FAMILY, type AnyComponent } from "../../Types/component.ts";
import { ValueSource } from "../../Types/params.ts";
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
        variant: { type: "static", value: "default" },
        // bg: { type: "static", value: "#007bff" },
        padding: { type: "static", value: 10 },
      },
      params: [
        {
          name: "content",
          label: "Contenu",
          type: {
            source: ValueSource.STATIC,
            value: "Cliquez ici"
          },
          required: true,
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
    supportedActions: ACTIONS_BY_FAMILY['container'],
    defaultProps: {
      styles: {
        padding: { type: "static", value: 6 },
        bg: { type: "static", value: "#ffffff" },
        display: { type: "static", value: "block" },
        align: { type: "static", value: "center" },
        justify: { type: "static", value: "between" }
      },
      params:[],
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
            source: ValueSource.STATIC,
            value: "Ceci est un texte par défaut"
          },
          required: true,
        }
      ],
      data: {
        content: { type: "static", value: "Ceci est un texte par défaut" },
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
    supportedActions: ACTIONS_BY_FAMILY['static'],
    defaultProps: {
      styles: {
        display: { type: "static", value: "block" },
      },
      params: [
        {
          name: "src",
          label: "Source",
          type: {
            source: ValueSource.IMAGE,
            src:"/image.jpg"
          },
          required: true,
        },
        {
          name: "alt",
          label: "Alt",
          type: {
            source: ValueSource.STATIC,
            value: "Image de démonstration"
          },
          required: true,
        }
      ],
      data: {
        src: { type: "static", value: "/image.jpg" },
        alt: { type: "static", value: "Image de démonstration" },
        objectFit: { type: "static", value: "cover" }
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
        textColor: { type: "static", value: "#e2e2e2ff" },
        marginBottom: { type: "static", value: 2 }
      },
      params: [
        {
          name: "icon",
          label: "Icône",
          type: {
            source: ValueSource.STATIC,
            value: "Star"
          },
          required: true,
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
    supportedActions: ACTIONS_BY_FAMILY['complex'],
    defaultProps: {
      styles: {
        padding: { type: "static", value: 10 },
        bg: { type: "static", value: "transparent" },
        rounded: { type: "static", value: "none" }
      },
      data: { 
        autoPlay: { type: "static", value: true }, 
        speed: { type: "static", value: 3000 }, 
        showPagination: { type: "static", value: true }, 
        showArrows: { type: "static", value: true }, 
        loop: { type: "static", value: true } 
      },
      children: []
    }
  },
  {
    name: "Accordéon",
    tag: "AccordionBuilder",
    icon: "ListCollapse",
    family: "complex",
    supportedActions: ACTIONS_BY_FAMILY['complex'],
    defaultProps: {
      styles: { marginBottom: { type: "static", value: 4 } },
      params: [
        {
          name: "title",
          label: "Titre",
          type: {
            source: ValueSource.STATIC,
            value: "Nouvelle Question"
          },
          required: true,
        },
        {
          name:"reponse",
          label:"Reponse",
          type:{
            source:ValueSource.STATIC,
            value:""
          },
          required:true
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
  },{
    name: "Lien",
    tag: "LinkBuilder",
    icon: "ExternalLink",
    family: "static",
    supportedActions: ACTIONS_BY_FAMILY['static'],
    defaultProps: {
      styles: {
        textColor: {type:"static", value:"#3b82f6"},
        textAlign: {type:"static", value:"left"}
      },
      params: [
        {
          name: "text",
          label: "Texte du lien",
          type: {
            source: ValueSource.STATIC,
            value: "Lien personnalisé"
          },
          required: true,
        },
        {
          name: "url",
          label: "URL",
          type: {
            source: ValueSource.STATIC,
            value: ""
          },
          required: true,
        }
      ],
      data: {
        text: "Lien personnalisé",
        url: "",
        target: "_self"
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
