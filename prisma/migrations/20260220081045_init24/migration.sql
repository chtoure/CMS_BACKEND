/*
  Warnings:

  - Added the required column `userId` to the `PageRevision` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PageRevision" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "pageId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PageRevision_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PageRevision_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PageRevision" ("createdAt", "id", "pageId", "status", "updatedAt", "version") SELECT "createdAt", "id", "pageId", "status", "updatedAt", "version" FROM "PageRevision";
DROP TABLE "PageRevision";
ALTER TABLE "new_PageRevision" RENAME TO "PageRevision";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
