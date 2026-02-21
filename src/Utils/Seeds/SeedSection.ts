import prisma from "../PrismaClient.ts";

export async function seedAddSection() {
  const pageRevisions = await prisma.pageRevision.findMany({
    include: { page: true },
  });

  if (pageRevisions.length === 0) {
    console.warn(
      "Aucune PageRevision trouvée. Lancez d'abord le seeder de PageRevisions."
    );
    return;
  }

  const sectionsTemplate = [
    {
      order: 1,
      block_json: {
        layout: "full-width",
        background: "#ffffff",
        padding: { top: 40, bottom: 40, left: 16, right: 16 },
      },
    },
    {
      order: 2,
      block_json: {
        layout: "centered",
        background: "#f5f5f5",
        padding: { top: 60, bottom: 60, left: 16, right: 16 },
      },
    },
  ];

  for (const revision of pageRevisions) {
    for (const tpl of sectionsTemplate) {
      // Vérifie si une section avec cet ordre existe déjà pour cette révision
      const existing = await prisma.section.findFirst({
        where: { pageRevisionId: revision.id, order: tpl.order },
      });

      if (!existing) {
        await prisma.section.create({
          data: {
            order: tpl.order,
            block_json: tpl.block_json,
            pageRevisionId: revision.id,
          },
        });
      } else {
        await prisma.section.update({
          where: { id: existing.id },
          data: { block_json: tpl.block_json },
        });
      }
    }

    console.log(
      `Sections upsertées pour la page "${revision.page.title}" (révision v${revision.version}).`
    );
  }

  console.log("Sections insérées.");
}
