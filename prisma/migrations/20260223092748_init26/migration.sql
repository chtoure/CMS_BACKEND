-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BlocTemplate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "is_custom" BOOLEAN NOT NULL DEFAULT false,
    "componentId" INTEGER NOT NULL,
    "props" JSONB NOT NULL,
    "parentId" INTEGER,
    "sectionId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BlocTemplate_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "BlocTemplate_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BlocTemplate_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "BlocTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BlocTemplate" ("componentId", "createdAt", "id", "is_custom", "name", "order", "parentId", "props", "sectionId", "updatedAt") SELECT "componentId", "createdAt", "id", "is_custom", "name", "order", "parentId", "props", "sectionId", "updatedAt" FROM "BlocTemplate";
DROP TABLE "BlocTemplate";
ALTER TABLE "new_BlocTemplate" RENAME TO "BlocTemplate";
CREATE UNIQUE INDEX "BlocTemplate_name_key" ON "BlocTemplate"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
