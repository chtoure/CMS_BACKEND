

import prisma from "../../Utils/PrismaClient.ts";


interface Component {
    name: string;
    tag: string;
    description: string;
    default_props: any;
}

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
            action: "navigate"
        }
    },
    {
        name:"Text",
        tag:"TextBuilder",
        description:"Text component",
        default_props:{
            content:"Texte",
            variant:"default",
            size:"default",
            styles:""
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
