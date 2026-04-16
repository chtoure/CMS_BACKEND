/*
  Warnings:

  - You are about to drop the column `default_props` on the `Component` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Component` table. All the data in the column will be lost.
  - Added the required column `defaultProps` to the `Component` table without a default value. This is not possible if the table is not empty.
  - Added the required column `family` to the `Component` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supportedActions` to the `Component` table without a default value. This is not possible if the table is not empty.
  - Made the column `icon` on table `Component` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "BlocTemplate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "componentId" INTEGER NOT NULL,
    "default_json" JSONB NOT NULL,
    "parentId" INTEGER,
    "sectionId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BlocTemplate_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BlocTemplate_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "BlocTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BlocTemplate_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Section" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order" INTEGER NOT NULL,
    "block_json" JSONB NOT NULL,
    "pageRevisionId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Section_pageRevisionId_fkey" FOREIGN KEY ("pageRevisionId") REFERENCES "PageRevision" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Page" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PageRevision" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "pageId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PageRevision_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Component" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "family" TEXT NOT NULL,
    "supportedActions" JSONB NOT NULL,
    "defaultProps" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Component" ("createdAt", "icon", "id", "name", "tag", "updatedAt") SELECT "createdAt", "icon", "id", "name", "tag", "updatedAt" FROM "Component";
DROP TABLE "Component";
ALTER TABLE "new_Component" RENAME TO "Component";
CREATE UNIQUE INDEX "Component_tag_key" ON "Component"("tag");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "BlocTemplate_name_key" ON "BlocTemplate"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");
