/*
  Warnings:

  - You are about to drop the column `default_json` on the `BlocTemplate` table. All the data in the column will be lost.
  - Added the required column `props` to the `BlocTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BlocTemplate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "componentId" INTEGER NOT NULL,
    "props" JSONB NOT NULL,
    "parentId" INTEGER,
    "sectionId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BlocTemplate_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BlocTemplate_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "BlocTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BlocTemplate_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BlocTemplate" ("componentId", "createdAt", "id", "name", "order", "parentId", "sectionId", "updatedAt") SELECT "componentId", "createdAt", "id", "name", "order", "parentId", "sectionId", "updatedAt" FROM "BlocTemplate";
DROP TABLE "BlocTemplate";
ALTER TABLE "new_BlocTemplate" RENAME TO "BlocTemplate";
CREATE UNIQUE INDEX "BlocTemplate_name_key" ON "BlocTemplate"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
