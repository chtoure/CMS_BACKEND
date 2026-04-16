/*
  Warnings:

  - You are about to drop the column `taxonomyTermId` on the `ContentEntryRelation` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ContentEntryRelation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fieldName" TEXT NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "targetEntryId" INTEGER,
    "targetMediaId" INTEGER,
    "targetTaxonomyId" INTEGER,
    CONSTRAINT "ContentEntryRelation_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "ContentEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContentEntryRelation_targetEntryId_fkey" FOREIGN KEY ("targetEntryId") REFERENCES "ContentEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContentEntryRelation_targetMediaId_fkey" FOREIGN KEY ("targetMediaId") REFERENCES "Media" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContentEntryRelation_targetTaxonomyId_fkey" FOREIGN KEY ("targetTaxonomyId") REFERENCES "TaxonomyTerm" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ContentEntryRelation" ("fieldName", "id", "sourceId", "targetEntryId", "targetMediaId") SELECT "fieldName", "id", "sourceId", "targetEntryId", "targetMediaId" FROM "ContentEntryRelation";
DROP TABLE "ContentEntryRelation";
ALTER TABLE "new_ContentEntryRelation" RENAME TO "ContentEntryRelation";
CREATE INDEX "ContentEntryRelation_sourceId_idx" ON "ContentEntryRelation"("sourceId");
CREATE INDEX "ContentEntryRelation_targetEntryId_idx" ON "ContentEntryRelation"("targetEntryId");
CREATE INDEX "ContentEntryRelation_targetMediaId_idx" ON "ContentEntryRelation"("targetMediaId");
CREATE UNIQUE INDEX "ContentEntryRelation_sourceId_targetEntryId_fieldName_key" ON "ContentEntryRelation"("sourceId", "targetEntryId", "fieldName");
CREATE UNIQUE INDEX "ContentEntryRelation_sourceId_targetMediaId_fieldName_key" ON "ContentEntryRelation"("sourceId", "targetMediaId", "fieldName");
CREATE UNIQUE INDEX "ContentEntryRelation_sourceId_targetTaxonomyId_fieldName_key" ON "ContentEntryRelation"("sourceId", "targetTaxonomyId", "fieldName");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
