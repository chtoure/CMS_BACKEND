-- CreateTable
CREATE TABLE "ContentType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "fields_schema" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
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
    CONSTRAINT "ContentEntry_contentTypeId_fkey" FOREIGN KEY ("contentTypeId") REFERENCES "ContentType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Taxonomy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_ContentTypeTaxonomies" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ContentTypeTaxonomies_A_fkey" FOREIGN KEY ("A") REFERENCES "ContentType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ContentTypeTaxonomies_B_fkey" FOREIGN KEY ("B") REFERENCES "Taxonomy" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EntryTaxonomies" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_EntryTaxonomies_A_fkey" FOREIGN KEY ("A") REFERENCES "ContentEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EntryTaxonomies_B_fkey" FOREIGN KEY ("B") REFERENCES "Taxonomy" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentType_name_key" ON "ContentType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ContentType_slug_key" ON "ContentType"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Taxonomy_slug_key" ON "Taxonomy"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_ContentTypeTaxonomies_AB_unique" ON "_ContentTypeTaxonomies"("A", "B");

-- CreateIndex
CREATE INDEX "_ContentTypeTaxonomies_B_index" ON "_ContentTypeTaxonomies"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EntryTaxonomies_AB_unique" ON "_EntryTaxonomies"("A", "B");

-- CreateIndex
CREATE INDEX "_EntryTaxonomies_B_index" ON "_EntryTaxonomies"("B");
