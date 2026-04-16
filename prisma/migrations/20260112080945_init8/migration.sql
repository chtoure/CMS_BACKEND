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
    CONSTRAINT "ContentEntry_contentTypeId_fkey" FOREIGN KEY ("contentTypeId") REFERENCES "ContentType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ContentEntry_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ContentEntry" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ContentEntry" ("contentTypeId", "createdAt", "data_json", "id", "status", "updatedAt", "userId") SELECT "contentTypeId", "createdAt", "data_json", "id", "status", "updatedAt", "userId" FROM "ContentEntry";
DROP TABLE "ContentEntry";
ALTER TABLE "new_ContentEntry" RENAME TO "ContentEntry";
CREATE TABLE "new_ContentType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "fields_schema" JSONB NOT NULL,
    "parentId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ContentType_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ContentType" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ContentType" ("createdAt", "description", "fields_schema", "id", "name", "slug", "updatedAt") SELECT "createdAt", "description", "fields_schema", "id", "name", "slug", "updatedAt" FROM "ContentType";
DROP TABLE "ContentType";
ALTER TABLE "new_ContentType" RENAME TO "ContentType";
CREATE UNIQUE INDEX "ContentType_name_key" ON "ContentType"("name");
CREATE UNIQUE INDEX "ContentType_slug_key" ON "ContentType"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
