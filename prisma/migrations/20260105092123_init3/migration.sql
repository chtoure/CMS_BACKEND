/*
  Warnings:

  - Added the required column `isLoggedIn` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "email", "full_name", "id", "password_hash", "refreshToken", "role_id", "updatedAt") SELECT "createdAt", "email", "full_name", "id", "password_hash", "refreshToken", "role_id", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_refreshToken_key" ON "User"("refreshToken");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
