var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/Utils/Paginator.ts
var Paginator = class {
  static async paginate(model, options) {
    const { page, limit, where = {}, orderBy = { createdAt: "desc" }, include } = options;
    const isPaginated = page !== void 0 && limit !== void 0;
    const skip = isPaginated ? (page - 1) * limit : void 0;
    const take = isPaginated ? limit : void 0;
    const [results, count] = await Promise.all([
      model.findMany({
        where,
        skip,
        take,
        orderBy,
        include
      }),
      model.count({ where })
    ]);
    return {
      count,
      total_pages: isPaginated ? Math.ceil(count / limit) : 1,
      current_page: page || 1,
      results
    };
  }
};

// src/generated/prisma/client.ts
import "process";
import * as path from "path";
import { fileURLToPath } from "url";
import "@prisma/client/runtime/client";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.2.0",
  "engineVersion": "0c8ef2ce45c83248ab3df073180d5eda9e8be7a3",
  "activeProvider": "sqlite",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "sqlite"\n}\n\nenum StatusUser {\n  ACTIVE\n  EN_ATTENTE\n  INACTIVE\n}\n\nenum Status {\n  DRAFT\n  PUBLISHED\n  ARCHIVED\n}\n\nenum ComponentFamily {\n  static\n  interactive\n  container\n  input\n  complex\n}\n\n//      Partie Authentification\n\nmodel User {\n  id                Int            @id @default(autoincrement())\n  full_name         String\n  email             String         @unique\n  password_hash     String\n  refreshToken      String?        @unique\n  role_id           Int?\n  isLoggedIn        Boolean\n  resetCode         String?\n  codeExpiration    DateTime?\n  createdAt         DateTime       @default(now())\n  updatedAt         DateTime       @updatedAt\n  role              Role?          @relation(fields: [role_id], references: [id])\n  entries           ContentEntry[]\n  contentTypes      ContentType[]\n  taxonomies        Taxonomy[]\n  pages             Page[]\n  pageRevisions     PageRevision[]\n  archive           Boolean        @default(false)\n  archivedAt        DateTime?\n  status            StatusUser     @default(EN_ATTENTE)\n  confirmationToken String?\n  isPendingAt       DateTime?      @default(now())\n  isActiveAt        DateTime?\n}\n\nmodel Role {\n  id          Int              @id @default(autoincrement())\n  name        String           @unique\n  description String?\n  createdAt   DateTime         @default(now())\n  updatedAt   DateTime         @updatedAt\n  users       User[]\n  permissions RolePermission[]\n  archive     Boolean          @default(false)\n  archivedAt  DateTime?\n}\n\nmodel Permission {\n  id          Int              @id @default(autoincrement())\n  name        String           @unique\n  description String?\n  createdAt   DateTime         @default(now())\n  updatedAt   DateTime         @updatedAt\n  roles       RolePermission[]\n  archive     Boolean          @default(false)\n  archivedAt  DateTime?\n}\n\nmodel RolePermission {\n  id           Int        @id @default(autoincrement())\n  roleId       Int\n  permissionId Int\n  createdAt    DateTime   @default(now())\n  updatedAt    DateTime   @updatedAt\n  permission   Permission @relation(fields: [permissionId], references: [id])\n  role         Role       @relation(fields: [roleId], references: [id])\n  archive      Boolean    @default(false)\n  archivedAt   DateTime?\n\n  @@unique([roleId, permissionId])\n}\n\n//     Partie Mediatheque\n\nmodel Media {\n  id            Int                    @id @default(autoincrement())\n  file_path     String\n  type          String\n  alt           String?\n  size          Int                    @default(0)\n  width         Int?                   @default(0)\n  height        Int?                   @default(0)\n  duration      Int?                   @default(0)\n  pageCount     Int?                   @default(0)\n  parameter     Parameter[]\n  usedInEntries ContentEntryRelation[]\n  createdAt     DateTime               @default(now())\n  updatedAt     DateTime               @updatedAt\n}\n\nenum VariableType {\n  COLOR\n  NUMBER\n  STRING\n  BOOLEAN\n}\n\n//     Partie Variables\n\nmodel Collection {\n  id        Int          @id @default(autoincrement())\n  name      String       @unique\n  type      VariableType\n  variables Variable[]\n  createdAt DateTime     @default(now())\n  updatedAt DateTime     @updatedAt\n}\n\nmodel Variable {\n  id           Int        @id @default(autoincrement())\n  name         String\n  value        String\n  collection   Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)\n  collectionId Int\n  createdAt    DateTime   @default(now())\n  updatedAt    DateTime   @updatedAt\n}\n\n//     Partie Parametrage\n\nmodel Parameter {\n  id          Int      @id @default(autoincrement())\n  entity_name String\n  title       String\n  media       Media?   @relation(fields: [mediaId], references: [id], onDelete: SetNull)\n  mediaId     Int?\n  description String?\n  family_name String?\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n}\n\n//     Partie Type de Contenu\n\nmodel ContentType {\n  id            Int     @id @default(autoincrement())\n  name          String  @unique\n  slug          String  @unique\n  description   String?\n  fields_schema Json\n\n  // Les ContentTypes dont je references(mes parents logiques)\n  parentContentTypes ContentTypeRelation[] @relation("TypeProprietaire")\n\n  // Les ContentTypes qui me references(mes enfants logiques)\n  childrenContentTypes ContentTypeRelation[] @relation("TypeCible")\n\n  entries    ContentEntry[]\n  taxonomies Taxonomy[]     @relation("ContentTypeTaxonomies")\n\n  createdAt  DateTime  @default(now())\n  updatedAt  DateTime  @updatedAt\n  userId     Int\n  user       User      @relation(fields: [userId], references: [id])\n  archive    Boolean   @default(false)\n  archivedAt DateTime?\n}\n\nmodel ContentTypeRelation {\n  id Int @id @default(autoincrement())\n\n  // Celui qui poss\xE8de le champ relation\n  proprietaireId Int\n  proprietaire   ContentType @relation("TypeProprietaire", fields: [proprietaireId], references: [id], onDelete: Cascade)\n\n  // Celui qui est point\xE9/r\xE9f\xE9renc\xE9\n  cibleId Int\n  cible   ContentType @relation("TypeCible", fields: [cibleId], references: [id], onDelete: Cascade)\n\n  @@unique([proprietaireId, cibleId])\n}\n\n//     Partie Contenu\n\nmodel ContentEntry {\n  id            Int            @id @default(autoincrement())\n  contentTypeId Int\n  contentType   ContentType    @relation(fields: [contentTypeId], references: [id])\n  userId        Int\n  user          User           @relation(fields: [userId], references: [id])\n  data_json     Json\n  status        Status         @default(DRAFT)\n  taxonomyTerms TaxonomyTerm[] @relation("EntryTaxonomyTerms")\n\n  outgoingRelations ContentEntryRelation[] @relation("OutgoingRelations")\n  incomingRelations ContentEntryRelation[] @relation("IncomingRelations")\n\n  createdAt  DateTime  @default(now())\n  updatedAt  DateTime  @updatedAt\n  archivedAt DateTime?\n}\n\nmodel ContentEntryRelation {\n  id        Int    @id @default(autoincrement())\n  fieldName String\n\n  sourceId Int\n  source   ContentEntry @relation("OutgoingRelations", fields: [sourceId], references: [id], onDelete: Cascade)\n\n  targetEntryId Int?\n  targetEntry   ContentEntry? @relation("IncomingRelations", fields: [targetEntryId], references: [id], onDelete: Cascade)\n\n  targetMediaId Int?\n  targetMedia   Media? @relation(fields: [targetMediaId], references: [id], onDelete: Cascade)\n\n  targetTaxonomyId Int?\n  targetTaxonomy   TaxonomyTerm? @relation(fields: [targetTaxonomyId], references: [id], onDelete: Cascade)\n\n  @@unique([sourceId, targetEntryId, fieldName])\n  @@unique([sourceId, targetMediaId, fieldName])\n  @@unique([sourceId, targetTaxonomyId, fieldName])\n  @@index([sourceId])\n  @@index([targetEntryId])\n  @@index([targetMediaId])\n}\n\n// Partie Taxonomie (Classification des Contenus)\n\nmodel Taxonomy {\n  id           Int            @id @default(autoincrement())\n  name         String\n  slug         String         @unique\n  description  String?\n  contentTypes ContentType[]  @relation("ContentTypeTaxonomies")\n  terms        TaxonomyTerm[]\n  createdAt    DateTime       @default(now())\n  updatedAt    DateTime       @updatedAt\n  userId       Int\n  user         User           @relation(fields: [userId], references: [id])\n  archive      Boolean        @default(false)\n  archivedAt   DateTime?\n}\n\nmodel TaxonomyTerm {\n  id   Int    @id @default(autoincrement())\n  name String // ex: "Sport"\n  slug String @unique // ex: "sport"\n\n  // La taxonomie parente\n  taxonomyId Int\n  taxonomy   Taxonomy @relation(fields: [taxonomyId], references: [id])\n\n  contentEntryRelations ContentEntryRelation[]\n\n  entries ContentEntry[] @relation("EntryTaxonomyTerms")\n}\n\n//     Partie Bulder (Blocs , Page , PageRevision)\n\nmodel Component {\n  id   Int    @id @default(autoincrement())\n  name String\n  tag  String @unique\n  icon String\n\n  family           ComponentFamily\n  supportedActions Json\n  defaultProps     Json\n\n  createdAt     DateTime       @default(now())\n  updatedAt     DateTime       @updatedAt\n  // Relations\n  blocTemplates BlocTemplate[]\n}\n\nmodel BlocTemplate {\n  id        Int     @id @default(autoincrement())\n  name      String  @unique\n  order     Int\n  is_custom Boolean @default(false)\n\n  componentId Int\n  props       Json\n  parentId    Int?\n  sectionId   Int?\n  modelId     Int?\n  section     Section? @relation("SectionBlocks", fields: [sectionId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  component           Component      @relation(fields: [componentId], references: [id])\n  parent              BlocTemplate?  @relation("SubBlocks", fields: [parentId], references: [id], onDelete: Cascade)\n  children            BlocTemplate[] @relation("SubBlocks")\n  model               BlocTemplate?  @relation("BlocTemplateModel", fields: [modelId], references: [id], onDelete: SetNull)\n  customBlocTemplates BlocTemplate[] @relation("BlocTemplateModel")\n}\n\nmodel Section {\n  id         Int  @id @default(autoincrement())\n  order      Int\n  block_json Json\n\n  blocTemplates  BlocTemplate[] @relation("SectionBlocks")\n  pageRevisionId Int\n  pageRevision   PageRevision   @relation(fields: [pageRevisionId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Page {\n  id            Int            @id @default(autoincrement())\n  slug          String         @unique\n  name          String\n  pageRevisions PageRevision[]\n  userId        Int\n  user          User           @relation(fields: [userId], references: [id])\n  createdAt     DateTime       @default(now())\n  updatedAt     DateTime       @updatedAt\n  navItem       NavItem?\n}\n\nmodel NavItem {\n  id    Int    @id @default(autoincrement())\n  label String\n  value String @unique\n\n  parentId Int?\n  parent   NavItem?  @relation("SubNavItems", fields: [parentId], references: [id], onDelete: Cascade)\n  children NavItem[] @relation("SubNavItems")\n\n  pageId Int?  @unique\n  page   Page? @relation(fields: [pageId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel PageRevision {\n  id      Int    @id @default(autoincrement())\n  status  Status @default(DRAFT)\n  version Int    @default(1)\n\n  pageId Int\n  page   Page @relation(fields: [pageId], references: [id])\n\n  userId Int\n  user   User @relation(fields: [userId], references: [id])\n\n  sections  Section[]\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"full_name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password_hash","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"role_id","kind":"scalar","type":"Int"},{"name":"isLoggedIn","kind":"scalar","type":"Boolean"},{"name":"resetCode","kind":"scalar","type":"String"},{"name":"codeExpiration","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"object","type":"Role","relationName":"RoleToUser"},{"name":"entries","kind":"object","type":"ContentEntry","relationName":"ContentEntryToUser"},{"name":"contentTypes","kind":"object","type":"ContentType","relationName":"ContentTypeToUser"},{"name":"taxonomies","kind":"object","type":"Taxonomy","relationName":"TaxonomyToUser"},{"name":"pages","kind":"object","type":"Page","relationName":"PageToUser"},{"name":"pageRevisions","kind":"object","type":"PageRevision","relationName":"PageRevisionToUser"},{"name":"archive","kind":"scalar","type":"Boolean"},{"name":"archivedAt","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"StatusUser"},{"name":"confirmationToken","kind":"scalar","type":"String"},{"name":"isPendingAt","kind":"scalar","type":"DateTime"},{"name":"isActiveAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Role":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"users","kind":"object","type":"User","relationName":"RoleToUser"},{"name":"permissions","kind":"object","type":"RolePermission","relationName":"RoleToRolePermission"},{"name":"archive","kind":"scalar","type":"Boolean"},{"name":"archivedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Permission":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"roles","kind":"object","type":"RolePermission","relationName":"PermissionToRolePermission"},{"name":"archive","kind":"scalar","type":"Boolean"},{"name":"archivedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"RolePermission":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"roleId","kind":"scalar","type":"Int"},{"name":"permissionId","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"permission","kind":"object","type":"Permission","relationName":"PermissionToRolePermission"},{"name":"role","kind":"object","type":"Role","relationName":"RoleToRolePermission"},{"name":"archive","kind":"scalar","type":"Boolean"},{"name":"archivedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Media":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"file_path","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"alt","kind":"scalar","type":"String"},{"name":"size","kind":"scalar","type":"Int"},{"name":"width","kind":"scalar","type":"Int"},{"name":"height","kind":"scalar","type":"Int"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"pageCount","kind":"scalar","type":"Int"},{"name":"parameter","kind":"object","type":"Parameter","relationName":"MediaToParameter"},{"name":"usedInEntries","kind":"object","type":"ContentEntryRelation","relationName":"ContentEntryRelationToMedia"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Collection":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"name","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"VariableType"},{"name":"variables","kind":"object","type":"Variable","relationName":"CollectionToVariable"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Variable":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"name","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"collection","kind":"object","type":"Collection","relationName":"CollectionToVariable"},{"name":"collectionId","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Parameter":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"entity_name","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToParameter"},{"name":"mediaId","kind":"scalar","type":"Int"},{"name":"description","kind":"scalar","type":"String"},{"name":"family_name","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"ContentType":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"fields_schema","kind":"scalar","type":"Json"},{"name":"parentContentTypes","kind":"object","type":"ContentTypeRelation","relationName":"TypeProprietaire"},{"name":"childrenContentTypes","kind":"object","type":"ContentTypeRelation","relationName":"TypeCible"},{"name":"entries","kind":"object","type":"ContentEntry","relationName":"ContentEntryToContentType"},{"name":"taxonomies","kind":"object","type":"Taxonomy","relationName":"ContentTypeTaxonomies"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"Int"},{"name":"user","kind":"object","type":"User","relationName":"ContentTypeToUser"},{"name":"archive","kind":"scalar","type":"Boolean"},{"name":"archivedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"ContentTypeRelation":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"proprietaireId","kind":"scalar","type":"Int"},{"name":"proprietaire","kind":"object","type":"ContentType","relationName":"TypeProprietaire"},{"name":"cibleId","kind":"scalar","type":"Int"},{"name":"cible","kind":"object","type":"ContentType","relationName":"TypeCible"}],"dbName":null},"ContentEntry":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"contentTypeId","kind":"scalar","type":"Int"},{"name":"contentType","kind":"object","type":"ContentType","relationName":"ContentEntryToContentType"},{"name":"userId","kind":"scalar","type":"Int"},{"name":"user","kind":"object","type":"User","relationName":"ContentEntryToUser"},{"name":"data_json","kind":"scalar","type":"Json"},{"name":"status","kind":"enum","type":"Status"},{"name":"taxonomyTerms","kind":"object","type":"TaxonomyTerm","relationName":"EntryTaxonomyTerms"},{"name":"outgoingRelations","kind":"object","type":"ContentEntryRelation","relationName":"OutgoingRelations"},{"name":"incomingRelations","kind":"object","type":"ContentEntryRelation","relationName":"IncomingRelations"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"archivedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"ContentEntryRelation":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"fieldName","kind":"scalar","type":"String"},{"name":"sourceId","kind":"scalar","type":"Int"},{"name":"source","kind":"object","type":"ContentEntry","relationName":"OutgoingRelations"},{"name":"targetEntryId","kind":"scalar","type":"Int"},{"name":"targetEntry","kind":"object","type":"ContentEntry","relationName":"IncomingRelations"},{"name":"targetMediaId","kind":"scalar","type":"Int"},{"name":"targetMedia","kind":"object","type":"Media","relationName":"ContentEntryRelationToMedia"},{"name":"targetTaxonomyId","kind":"scalar","type":"Int"},{"name":"targetTaxonomy","kind":"object","type":"TaxonomyTerm","relationName":"ContentEntryRelationToTaxonomyTerm"}],"dbName":null},"Taxonomy":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"contentTypes","kind":"object","type":"ContentType","relationName":"ContentTypeTaxonomies"},{"name":"terms","kind":"object","type":"TaxonomyTerm","relationName":"TaxonomyToTaxonomyTerm"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"Int"},{"name":"user","kind":"object","type":"User","relationName":"TaxonomyToUser"},{"name":"archive","kind":"scalar","type":"Boolean"},{"name":"archivedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"TaxonomyTerm":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"taxonomyId","kind":"scalar","type":"Int"},{"name":"taxonomy","kind":"object","type":"Taxonomy","relationName":"TaxonomyToTaxonomyTerm"},{"name":"contentEntryRelations","kind":"object","type":"ContentEntryRelation","relationName":"ContentEntryRelationToTaxonomyTerm"},{"name":"entries","kind":"object","type":"ContentEntry","relationName":"EntryTaxonomyTerms"}],"dbName":null},"Component":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"name","kind":"scalar","type":"String"},{"name":"tag","kind":"scalar","type":"String"},{"name":"icon","kind":"scalar","type":"String"},{"name":"family","kind":"enum","type":"ComponentFamily"},{"name":"supportedActions","kind":"scalar","type":"Json"},{"name":"defaultProps","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"blocTemplates","kind":"object","type":"BlocTemplate","relationName":"BlocTemplateToComponent"}],"dbName":null},"BlocTemplate":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"name","kind":"scalar","type":"String"},{"name":"order","kind":"scalar","type":"Int"},{"name":"is_custom","kind":"scalar","type":"Boolean"},{"name":"componentId","kind":"scalar","type":"Int"},{"name":"props","kind":"scalar","type":"Json"},{"name":"parentId","kind":"scalar","type":"Int"},{"name":"sectionId","kind":"scalar","type":"Int"},{"name":"modelId","kind":"scalar","type":"Int"},{"name":"section","kind":"object","type":"Section","relationName":"SectionBlocks"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"component","kind":"object","type":"Component","relationName":"BlocTemplateToComponent"},{"name":"parent","kind":"object","type":"BlocTemplate","relationName":"SubBlocks"},{"name":"children","kind":"object","type":"BlocTemplate","relationName":"SubBlocks"},{"name":"model","kind":"object","type":"BlocTemplate","relationName":"BlocTemplateModel"},{"name":"customBlocTemplates","kind":"object","type":"BlocTemplate","relationName":"BlocTemplateModel"}],"dbName":null},"Section":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"order","kind":"scalar","type":"Int"},{"name":"block_json","kind":"scalar","type":"Json"},{"name":"blocTemplates","kind":"object","type":"BlocTemplate","relationName":"SectionBlocks"},{"name":"pageRevisionId","kind":"scalar","type":"Int"},{"name":"pageRevision","kind":"object","type":"PageRevision","relationName":"PageRevisionToSection"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Page":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"slug","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"pageRevisions","kind":"object","type":"PageRevision","relationName":"PageToPageRevision"},{"name":"userId","kind":"scalar","type":"Int"},{"name":"user","kind":"object","type":"User","relationName":"PageToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"navItem","kind":"object","type":"NavItem","relationName":"NavItemToPage"}],"dbName":null},"NavItem":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"label","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"Int"},{"name":"parent","kind":"object","type":"NavItem","relationName":"SubNavItems"},{"name":"children","kind":"object","type":"NavItem","relationName":"SubNavItems"},{"name":"pageId","kind":"scalar","type":"Int"},{"name":"page","kind":"object","type":"Page","relationName":"NavItemToPage"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"PageRevision":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"Status"},{"name":"version","kind":"scalar","type":"Int"},{"name":"pageId","kind":"scalar","type":"Int"},{"name":"page","kind":"object","type":"Page","relationName":"PageToPageRevision"},{"name":"userId","kind":"scalar","type":"Int"},{"name":"user","kind":"object","type":"User","relationName":"PageRevisionToUser"},{"name":"sections","kind":"object","type":"Section","relationName":"PageRevisionToSection"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_bg.sqlite.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_bg.sqlite.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  }
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AnyNull: () => AnyNull2,
  BlocTemplateScalarFieldEnum: () => BlocTemplateScalarFieldEnum,
  CollectionScalarFieldEnum: () => CollectionScalarFieldEnum,
  ComponentScalarFieldEnum: () => ComponentScalarFieldEnum,
  ContentEntryRelationScalarFieldEnum: () => ContentEntryRelationScalarFieldEnum,
  ContentEntryScalarFieldEnum: () => ContentEntryScalarFieldEnum,
  ContentTypeRelationScalarFieldEnum: () => ContentTypeRelationScalarFieldEnum,
  ContentTypeScalarFieldEnum: () => ContentTypeScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  JsonNullValueInput: () => JsonNullValueInput,
  MediaScalarFieldEnum: () => MediaScalarFieldEnum,
  ModelName: () => ModelName,
  NavItemScalarFieldEnum: () => NavItemScalarFieldEnum,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PageRevisionScalarFieldEnum: () => PageRevisionScalarFieldEnum,
  PageScalarFieldEnum: () => PageScalarFieldEnum,
  ParameterScalarFieldEnum: () => ParameterScalarFieldEnum,
  PermissionScalarFieldEnum: () => PermissionScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  RolePermissionScalarFieldEnum: () => RolePermissionScalarFieldEnum,
  RoleScalarFieldEnum: () => RoleScalarFieldEnum,
  SectionScalarFieldEnum: () => SectionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TaxonomyScalarFieldEnum: () => TaxonomyScalarFieldEnum,
  TaxonomyTermScalarFieldEnum: () => TaxonomyTermScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VariableScalarFieldEnum: () => VariableScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.2.0",
  engine: "0c8ef2ce45c83248ab3df073180d5eda9e8be7a3"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Role: "Role",
  Permission: "Permission",
  RolePermission: "RolePermission",
  Media: "Media",
  Collection: "Collection",
  Variable: "Variable",
  Parameter: "Parameter",
  ContentType: "ContentType",
  ContentTypeRelation: "ContentTypeRelation",
  ContentEntry: "ContentEntry",
  ContentEntryRelation: "ContentEntryRelation",
  Taxonomy: "Taxonomy",
  TaxonomyTerm: "TaxonomyTerm",
  Component: "Component",
  BlocTemplate: "BlocTemplate",
  Section: "Section",
  Page: "Page",
  NavItem: "NavItem",
  PageRevision: "PageRevision"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  full_name: "full_name",
  email: "email",
  password_hash: "password_hash",
  refreshToken: "refreshToken",
  role_id: "role_id",
  isLoggedIn: "isLoggedIn",
  resetCode: "resetCode",
  codeExpiration: "codeExpiration",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  archive: "archive",
  archivedAt: "archivedAt",
  status: "status",
  confirmationToken: "confirmationToken",
  isPendingAt: "isPendingAt",
  isActiveAt: "isActiveAt"
};
var RoleScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  archive: "archive",
  archivedAt: "archivedAt"
};
var PermissionScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  archive: "archive",
  archivedAt: "archivedAt"
};
var RolePermissionScalarFieldEnum = {
  id: "id",
  roleId: "roleId",
  permissionId: "permissionId",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  archive: "archive",
  archivedAt: "archivedAt"
};
var MediaScalarFieldEnum = {
  id: "id",
  file_path: "file_path",
  type: "type",
  alt: "alt",
  size: "size",
  width: "width",
  height: "height",
  duration: "duration",
  pageCount: "pageCount",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CollectionScalarFieldEnum = {
  id: "id",
  name: "name",
  type: "type",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VariableScalarFieldEnum = {
  id: "id",
  name: "name",
  value: "value",
  collectionId: "collectionId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ParameterScalarFieldEnum = {
  id: "id",
  entity_name: "entity_name",
  title: "title",
  mediaId: "mediaId",
  description: "description",
  family_name: "family_name",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ContentTypeScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  description: "description",
  fields_schema: "fields_schema",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  userId: "userId",
  archive: "archive",
  archivedAt: "archivedAt"
};
var ContentTypeRelationScalarFieldEnum = {
  id: "id",
  proprietaireId: "proprietaireId",
  cibleId: "cibleId"
};
var ContentEntryScalarFieldEnum = {
  id: "id",
  contentTypeId: "contentTypeId",
  userId: "userId",
  data_json: "data_json",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  archivedAt: "archivedAt"
};
var ContentEntryRelationScalarFieldEnum = {
  id: "id",
  fieldName: "fieldName",
  sourceId: "sourceId",
  targetEntryId: "targetEntryId",
  targetMediaId: "targetMediaId",
  targetTaxonomyId: "targetTaxonomyId"
};
var TaxonomyScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  description: "description",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  userId: "userId",
  archive: "archive",
  archivedAt: "archivedAt"
};
var TaxonomyTermScalarFieldEnum = {
  id: "id",
  name: "name",
  slug: "slug",
  taxonomyId: "taxonomyId"
};
var ComponentScalarFieldEnum = {
  id: "id",
  name: "name",
  tag: "tag",
  icon: "icon",
  family: "family",
  supportedActions: "supportedActions",
  defaultProps: "defaultProps",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var BlocTemplateScalarFieldEnum = {
  id: "id",
  name: "name",
  order: "order",
  is_custom: "is_custom",
  componentId: "componentId",
  props: "props",
  parentId: "parentId",
  sectionId: "sectionId",
  modelId: "modelId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SectionScalarFieldEnum = {
  id: "id",
  order: "order",
  block_json: "block_json",
  pageRevisionId: "pageRevisionId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PageScalarFieldEnum = {
  id: "id",
  slug: "slug",
  name: "name",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var NavItemScalarFieldEnum = {
  id: "id",
  label: "label",
  value: "value",
  parentId: "parentId",
  pageId: "pageId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PageRevisionScalarFieldEnum = {
  id: "id",
  status: "status",
  version: "version",
  pageId: "pageId",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var JsonNullValueInput = {
  JsonNull: JsonNull2
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/Utils/PrismaClient.ts
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";
var adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL
});
var prisma = new PrismaClient({ adapter });
var PrismaClient_default = prisma;

export {
  Paginator,
  prismaNamespace_exports,
  PrismaClient_default
};
