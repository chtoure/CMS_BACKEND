-- CreateTable
CREATE TABLE "User" (
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

-- CreateTable
CREATE TABLE "Role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "archive" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" DATETIME
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "archive" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" DATETIME
);

-- CreateTable
CREATE TABLE "RolePermission" (
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

-- CreateTable
CREATE TABLE "Media" (
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

-- CreateTable
CREATE TABLE "Collection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Variable" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "collectionId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Variable_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Parameter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "entity_name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "mediaId" INTEGER,
    "description" TEXT,
    "family_name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Parameter_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContentType" (
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

-- CreateTable
CREATE TABLE "ContentTypeRelation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "proprietaireId" INTEGER NOT NULL,
    "cibleId" INTEGER NOT NULL,
    CONSTRAINT "ContentTypeRelation_proprietaireId_fkey" FOREIGN KEY ("proprietaireId") REFERENCES "ContentType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContentTypeRelation_cibleId_fkey" FOREIGN KEY ("cibleId") REFERENCES "ContentType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContentEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contentTypeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "data_json" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "archivedAt" DATETIME,
    CONSTRAINT "ContentEntry_contentTypeId_fkey" FOREIGN KEY ("contentTypeId") REFERENCES "ContentType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ContentEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContentEntryRelation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fieldName" TEXT NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "targetEntryId" INTEGER,
    "targetMediaId" INTEGER,
    "targetTaxonomyId" INTEGER,
    CONSTRAINT "ContentEntryRelation_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "ContentEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContentEntryRelation_targetEntryId_fkey" FOREIGN KEY ("targetEntryId") REFERENCES "ContentEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContentEntryRelation_targetMediaId_fkey" FOREIGN KEY ("targetMediaId") REFERENCES "Media" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContentEntryRelation_targetTaxonomyId_fkey" FOREIGN KEY ("targetTaxonomyId") REFERENCES "TaxonomyTerm" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Taxonomy" (
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

-- CreateTable
CREATE TABLE "TaxonomyTerm" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "taxonomyId" INTEGER NOT NULL,
    CONSTRAINT "TaxonomyTerm_taxonomyId_fkey" FOREIGN KEY ("taxonomyId") REFERENCES "Taxonomy" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Component" (
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

-- CreateTable
CREATE TABLE "BlocTemplate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "is_custom" BOOLEAN NOT NULL DEFAULT false,
    "componentId" INTEGER NOT NULL,
    "props" JSONB NOT NULL,
    "parentId" INTEGER,
    "sectionId" INTEGER,
    "modelId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BlocTemplate_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "BlocTemplate_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BlocTemplate_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "BlocTemplate" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BlocTemplate_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "BlocTemplate" ("id") ON DELETE SET NULL ON UPDATE CASCADE
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
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Page_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NavItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "parentId" INTEGER,
    "pageId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "NavItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "NavItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "NavItem_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PageRevision" (
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

-- CreateTable
CREATE TABLE "_ContentTypeTaxonomies" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ContentTypeTaxonomies_A_fkey" FOREIGN KEY ("A") REFERENCES "ContentType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ContentTypeTaxonomies_B_fkey" FOREIGN KEY ("B") REFERENCES "Taxonomy" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EntryTaxonomyTerms" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_EntryTaxonomyTerms_A_fkey" FOREIGN KEY ("A") REFERENCES "ContentEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EntryTaxonomyTerms_B_fkey" FOREIGN KEY ("B") REFERENCES "TaxonomyTerm" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_refreshToken_key" ON "User"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_name_key" ON "Collection"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ContentType_name_key" ON "ContentType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ContentType_slug_key" ON "ContentType"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ContentTypeRelation_proprietaireId_cibleId_key" ON "ContentTypeRelation"("proprietaireId", "cibleId");

-- CreateIndex
CREATE INDEX "ContentEntryRelation_sourceId_idx" ON "ContentEntryRelation"("sourceId");

-- CreateIndex
CREATE INDEX "ContentEntryRelation_targetEntryId_idx" ON "ContentEntryRelation"("targetEntryId");

-- CreateIndex
CREATE INDEX "ContentEntryRelation_targetMediaId_idx" ON "ContentEntryRelation"("targetMediaId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentEntryRelation_sourceId_targetEntryId_fieldName_key" ON "ContentEntryRelation"("sourceId", "targetEntryId", "fieldName");

-- CreateIndex
CREATE UNIQUE INDEX "ContentEntryRelation_sourceId_targetMediaId_fieldName_key" ON "ContentEntryRelation"("sourceId", "targetMediaId", "fieldName");

-- CreateIndex
CREATE UNIQUE INDEX "ContentEntryRelation_sourceId_targetTaxonomyId_fieldName_key" ON "ContentEntryRelation"("sourceId", "targetTaxonomyId", "fieldName");

-- CreateIndex
CREATE UNIQUE INDEX "Taxonomy_slug_key" ON "Taxonomy"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TaxonomyTerm_slug_key" ON "TaxonomyTerm"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Component_tag_key" ON "Component"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "BlocTemplate_name_key" ON "BlocTemplate"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "NavItem_value_key" ON "NavItem"("value");

-- CreateIndex
CREATE UNIQUE INDEX "NavItem_pageId_key" ON "NavItem"("pageId");

-- CreateIndex
CREATE UNIQUE INDEX "_ContentTypeTaxonomies_AB_unique" ON "_ContentTypeTaxonomies"("A", "B");

-- CreateIndex
CREATE INDEX "_ContentTypeTaxonomies_B_index" ON "_ContentTypeTaxonomies"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EntryTaxonomyTerms_AB_unique" ON "_EntryTaxonomyTerms"("A", "B");

-- CreateIndex
CREATE INDEX "_EntryTaxonomyTerms_B_index" ON "_EntryTaxonomyTerms"("B");
