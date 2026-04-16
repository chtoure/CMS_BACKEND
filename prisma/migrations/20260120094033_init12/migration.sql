-- CreateTable
CREATE TABLE "ContentEntryRelation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sourceId" INTEGER NOT NULL,
    "targetId" INTEGER NOT NULL,
    "fieldName" TEXT NOT NULL,
    CONSTRAINT "ContentEntryRelation_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "ContentEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ContentEntryRelation_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "ContentEntry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ContentEntryRelation_targetId_idx" ON "ContentEntryRelation"("targetId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentEntryRelation_sourceId_targetId_fieldName_key" ON "ContentEntryRelation"("sourceId", "targetId", "fieldName");
