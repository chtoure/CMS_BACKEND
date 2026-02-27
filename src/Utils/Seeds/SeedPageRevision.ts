import prisma from "../PrismaClient.ts";

export async function seedAddPageRevision() {
  // Récupère toutes les pages existantes
  const pages = await prisma.page.findMany();

  if (pages.length === 0) {
    console.warn("Aucune Page trouvée. Lancez d'abord le seeder de pages.");
    return;
  }

  for (const page of pages) {
    // Cherche si une révision v1 existe déjà pour cette page
    const existing = await prisma.pageRevision.findFirst({
      where: { pageId: page.id, version: 1 },
    });

    if (!existing) {
      await prisma.pageRevision.create({
        data: {
          pageId: page.id,
          status: "DRAFT",
          version: 1,
          userId:1
        },
      });
      console.log(`PageRevision v1 créée pour la page "${page.name}".`);
    } else {
      console.log(
        `PageRevision v1 déjà existante pour la page "${page.name}", ignorée.`
      );
    }
  }

  console.log("PageRevisions insérées.");
}
