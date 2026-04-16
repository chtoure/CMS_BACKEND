/*
  Warnings:

  - Added the required column `name` to the `ContentEntry` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ContentEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contentTypeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "data_json" JSONB NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "parentId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "archive" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" DATETIME,
    CONSTRAINT "ContentEntry_contentTypeId_fkey" FOREIGN KEY ("contentTypeId") REFERENCES "ContentType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ContentEntry_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ContentEntry" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ContentEntry" ("contentTypeId", "createdAt", "data_json", "id", "parentId", "status", "updatedAt", "userId") SELECT "contentTypeId", "createdAt", "data_json", "id", "parentId", "status", "updatedAt", "userId" FROM "ContentEntry";
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
    "archive" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" DATETIME,
    CONSTRAINT "ContentType_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ContentType" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ContentType" ("createdAt", "description", "fields_schema", "id", "name", "parentId", "slug", "updatedAt") SELECT "createdAt", "description", "fields_schema", "id", "name", "parentId", "slug", "updatedAt" FROM "ContentType";
DROP TABLE "ContentType";
ALTER TABLE "new_ContentType" RENAME TO "ContentType";
CREATE UNIQUE INDEX "ContentType_name_key" ON "ContentType"("name");
CREATE UNIQUE INDEX "ContentType_slug_key" ON "ContentType"("slug");
CREATE TABLE "new_Permission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "archive" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" DATETIME
);
INSERT INTO "new_Permission" ("createdAt", "description", "id", "name", "updatedAt") SELECT "createdAt", "description", "id", "name", "updatedAt" FROM "Permission";
DROP TABLE "Permission";
ALTER TABLE "new_Permission" RENAME TO "Permission";
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");
CREATE TABLE "new_Role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "archive" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" DATETIME
);
INSERT INTO "new_Role" ("createdAt", "description", "id", "name", "updatedAt") SELECT "createdAt", "description", "id", "name", "updatedAt" FROM "Role";
DROP TABLE "Role";
ALTER TABLE "new_Role" RENAME TO "Role";
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");
CREATE TABLE "new_RolePermission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "archive" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" DATETIME,
    CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RolePermission" ("createdAt", "id", "permissionId", "roleId", "updatedAt") SELECT "createdAt", "id", "permissionId", "roleId", "updatedAt" FROM "RolePermission";
DROP TABLE "RolePermission";
ALTER TABLE "new_RolePermission" RENAME TO "RolePermission";
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");
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
    CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("codeExpiration", "createdAt", "email", "full_name", "id", "isLoggedIn", "password_hash", "refreshToken", "resetCode", "role_id", "updatedAt") SELECT "codeExpiration", "createdAt", "email", "full_name", "id", "isLoggedIn", "password_hash", "refreshToken", "resetCode", "role_id", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_refreshToken_key" ON "User"("refreshToken");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
