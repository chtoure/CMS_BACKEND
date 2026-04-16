/*
  Warnings:

  - Added the required column `userId` to the `ContentType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Taxonomy` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Component" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "description" TEXT,
    "default_props" JSONB NOT NULL,
    "icon" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
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
    "userId" INTEGER NOT NULL,
    "archive" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" DATETIME,
    CONSTRAINT "ContentType_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ContentType" ("archive", "archivedAt", "createdAt", "description", "fields_schema", "id", "name", "slug", "updatedAt") SELECT "archive", "archivedAt", "createdAt", "description", "fields_schema", "id", "name", "slug", "updatedAt" FROM "ContentType";
DROP TABLE "ContentType";
ALTER TABLE "new_ContentType" RENAME TO "ContentType";
CREATE UNIQUE INDEX "ContentType_name_key" ON "ContentType"("name");
CREATE UNIQUE INDEX "ContentType_slug_key" ON "ContentType"("slug");
CREATE TABLE "new_Taxonomy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    "archive" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" DATETIME,
    CONSTRAINT "Taxonomy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Taxonomy" ("archive", "archivedAt", "createdAt", "description", "id", "name", "slug", "updatedAt") SELECT "archive", "archivedAt", "createdAt", "description", "id", "name", "slug", "updatedAt" FROM "Taxonomy";
DROP TABLE "Taxonomy";
ALTER TABLE "new_Taxonomy" RENAME TO "Taxonomy";
CREATE UNIQUE INDEX "Taxonomy_slug_key" ON "Taxonomy"("slug");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "refreshToken" TEXT,
    "role_id" INTEGER,
    "isLoggedIn" BOOLEAN NOT NULL,
    "resetCode" TEXT,
    "codeExpiration" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "archive" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "confirmationToken" TEXT,
    "isPendingAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "isActiveAt" DATETIME,
    CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("archive", "archivedAt", "codeExpiration", "createdAt", "email", "full_name", "id", "isLoggedIn", "password_hash", "refreshToken", "resetCode", "role_id", "updatedAt") SELECT "archive", "archivedAt", "codeExpiration", "createdAt", "email", "full_name", "id", "isLoggedIn", "password_hash", "refreshToken", "resetCode", "role_id", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_refreshToken_key" ON "User"("refreshToken");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Component_tag_key" ON "Component"("tag");
