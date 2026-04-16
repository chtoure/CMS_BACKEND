/*
  Warnings:

  - You are about to drop the column `archive` on the `ContentEntry` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ContentEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contentTypeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "data_json" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "parentId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "archivedAt" DATETIME,
    CONSTRAINT "ContentEntry_contentTypeId_fkey" FOREIGN KEY ("contentTypeId") REFERENCES "ContentType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ContentEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ContentEntry_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ContentEntry" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ContentEntry" ("archivedAt", "contentTypeId", "createdAt", "data_json", "id", "parentId", "status", "updatedAt", "userId") SELECT "archivedAt", "contentTypeId", "createdAt", "data_json", "id", "parentId", "status", "updatedAt", "userId" FROM "ContentEntry";
DROP TABLE "ContentEntry";
ALTER TABLE "new_ContentEntry" RENAME TO "ContentEntry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
