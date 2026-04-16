/*
  Warnings:

  - You are about to drop the `_EntryTaxonomies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `parentId` on the `ContentEntry` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "_EntryTaxonomies_B_index";

-- DropIndex
DROP INDEX "_EntryTaxonomies_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_EntryTaxonomies";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_EntryTaxonomyTerms" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_EntryTaxonomyTerms_A_fkey" FOREIGN KEY ("A") REFERENCES "ContentEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EntryTaxonomyTerms_B_fkey" FOREIGN KEY ("B") REFERENCES "TaxonomyTerm" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ContentEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contentTypeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "data_json" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "archivedAt" DATETIME,
    CONSTRAINT "ContentEntry_contentTypeId_fkey" FOREIGN KEY ("contentTypeId") REFERENCES "ContentType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ContentEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ContentEntry" ("archivedAt", "contentTypeId", "createdAt", "data_json", "id", "status", "updatedAt", "userId") SELECT "archivedAt", "contentTypeId", "createdAt", "data_json", "id", "status", "updatedAt", "userId" FROM "ContentEntry";
DROP TABLE "ContentEntry";
ALTER TABLE "new_ContentEntry" RENAME TO "ContentEntry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_EntryTaxonomyTerms_AB_unique" ON "_EntryTaxonomyTerms"("A", "B");

-- CreateIndex
CREATE INDEX "_EntryTaxonomyTerms_B_index" ON "_EntryTaxonomyTerms"("B");
