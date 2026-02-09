

import type { Component } from "../../Types/component.ts";
import prisma from "../../Utils/PrismaClient.ts";

const componentsData: Component[] = [
    { 
        name: "Button", 
        tag: "ButtonBuilder", 
        description: "Button component",
        default_props: {
            content: "Bouton",
            variant: "default",
            size: "default",
            styles: "",
            onClick: () => {},
        }
    }
];


export async function  seedAddComponent() {

    for (const component of componentsData) {
        await prisma.component.create({
            data: component,
        });
    }

    console.log('Components insérées.');
}
