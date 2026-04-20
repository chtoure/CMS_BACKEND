-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "file_path" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "alt" TEXT,
    "size" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER DEFAULT 0,
    "height" INTEGER DEFAULT 0,
    "duration" INTEGER DEFAULT 0,
    "pageCount" INTEGER DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Media" ("alt", "createdAt", "file_path", "id", "type", "updatedAt") SELECT "alt", "createdAt", "file_path", "id", "type", "updatedAt" FROM "Media";
DROP TABLE "Media";
ALTER TABLE "new_Media" RENAME TO "Media";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
