/*
  Warnings:

  - Added the required column `updatedAt` to the `Variable` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Parameter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "entity_name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Variable" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "collectionId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Variable_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Variable" ("collectionId", "id", "name", "value") SELECT "collectionId", "id", "name", "value" FROM "Variable";
DROP TABLE "Variable";
ALTER TABLE "new_Variable" RENAME TO "Variable";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
