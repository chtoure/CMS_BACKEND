

import type { IRegisterComponent } from "../../Types/component.ts";
import prisma from "../../Utils/PrismaClient.ts";
import type { Prisma } from "../../generated/prisma/client.ts";




const componentsData: IRegisterComponent[] = [
   {
    name: "Bouton d'action",
    tag: "ButtonBuilder",
    icon: "MousePointer2",
    family: "interactive",
    supportedActions:['NAVIGATE_TO', 'SHOW_ALERT', 'OPEN_MODAL'],
    default_props: {
      styles: {
        variant: "default",
        rounded: "md",
        bg: "indigo-600"
      },
      data: {
        content: "Cliquez ici",
        cliquable: {
          action: "NAVIGATE_TO",
          action_params: { url: "/" }
        }
      }
    }
  }
];


export async function  seedAddComponent() {

    for (const component of componentsData) {
        await prisma.component.create({
            data: {
                ...component,
                default_props: component.default_props as unknown as Prisma.InputJsonValue
            }
        });
    }

    console.log('Components insérées.');
}
