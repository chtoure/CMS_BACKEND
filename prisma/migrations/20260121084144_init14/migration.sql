/*
  Warnings:

  - You are about to drop the column `parentId` on the `ContentType` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ContentTypeRelation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "proprietaireId" INTEGER NOT NULL,
    "cibleId" INTEGER NOT NULL,
    CONSTRAINT "ContentTypeRelation_proprietaireId_fkey" FOREIGN KEY ("proprietaireId") REFERENCES "ContentType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContentTypeRelation_cibleId_fkey" FOREIGN KEY ("cibleId") REFERENCES "ContentType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ContentType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "fields_schema" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "archive" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" DATETIME
);
INSERT INTO "new_ContentType" ("archive", "archivedAt", "createdAt", "description", "fields_schema", "id", "name", "slug", "updatedAt") SELECT "archive", "archivedAt", "createdAt", "description", "fields_schema", "id", "name", "slug", "updatedAt" FROM "ContentType";
DROP TABLE "ContentType";
ALTER TABLE "new_ContentType" RENAME TO "ContentType";
CREATE UNIQUE INDEX "ContentType_name_key" ON "ContentType"("name");
CREATE UNIQUE INDEX "ContentType_slug_key" ON "ContentType"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ContentTypeRelation_proprietaireId_cibleId_key" ON "ContentTypeRelation"("proprietaireId", "cibleId");
