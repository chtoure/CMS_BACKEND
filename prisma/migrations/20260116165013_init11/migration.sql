-- CreateTable
CREATE TABLE "TaxonomyTerm" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "taxonomyId" INTEGER NOT NULL,
    CONSTRAINT "TaxonomyTerm_taxonomyId_fkey" FOREIGN KEY ("taxonomyId") REFERENCES "Taxonomy" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Taxonomy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "archive" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" DATETIME
);
INSERT INTO "new_Taxonomy" ("createdAt", "description", "id", "name", "slug", "updatedAt") SELECT "createdAt", "description", "id", "name", "slug", "updatedAt" FROM "Taxonomy";
DROP TABLE "Taxonomy";
ALTER TABLE "new_Taxonomy" RENAME TO "Taxonomy";
CREATE UNIQUE INDEX "Taxonomy_slug_key" ON "Taxonomy"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "TaxonomyTerm_slug_key" ON "TaxonomyTerm"("slug");
