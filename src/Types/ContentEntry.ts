import type { Prisma } from "../generated/prisma/client.ts";
import type { User } from "./User.ts";

type JsonValue = 
  | string 
  | number 
  | boolean 
  | null 
  | { [key: string]: JsonValue } 
  | Prisma.JsonValue[];

interface IContentData {
  [key: string]: Prisma.InputJsonValue;
}

interface ContentEntry {
  id: number;
  contentTypeId: number;
  userId: number;
  user?: User;
  data_json: Prisma.JsonValue;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
}



interface RegisterContentEntry {
  contentTypeId: number;
  userId: number;
  data_json: Prisma.InputJsonValue; 
  parentId?: number | null; 
}

interface UpdateContentEntry {
  contentTypeId?: number;
  userId?: number;
  data_json?: Prisma.InputJsonValue;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export type {
    ContentEntry,
    RegisterContentEntry,
    UpdateContentEntry,
    IContentData
}