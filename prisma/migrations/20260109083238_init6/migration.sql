/*
  Warnings:

  - You are about to drop the column `logo` on the `Parameter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Permission" ADD COLUMN "description" TEXT;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN "description" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Parameter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "entity_name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "mediaId" INTEGER,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Parameter_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Parameter" ("createdAt", "description", "entity_name", "id", "title", "updatedAt") SELECT "createdAt", "description", "entity_name", "id", "title", "updatedAt" FROM "Parameter";
DROP TABLE "Parameter";
ALTER TABLE "new_Parameter" RENAME TO "Parameter";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
