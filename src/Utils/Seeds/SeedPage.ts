import type {RegisterPage } from "../../Types/page.ts";
import prisma from "../PrismaClient.ts";

const pagesData:RegisterPage[] = [
  { slug: "/", name: "Accueil", userId:1},
  { slug: "/a-propos", name: "À Propos", userId:1},
  { slug: "/services", name: "Services", userId:1},
  { slug: "/contact", name: "Contact", userId:1},
];

export async function seedAddPage() {
  for (const page of pagesData) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: { name: page.name },
      create: {
        slug: page.slug,
        name: page.name,
        userId:1
      },
    });
  }

  console.log("Pages insérées.");
}
