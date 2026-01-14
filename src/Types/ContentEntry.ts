type JsonValue = 
  | string 
  | number 
  | boolean 
  | null 
  | { [key: string]: JsonValue } 
  | JsonValue[];

interface IContentData {
  [key: string]: JsonValue;
}

interface ContentEntry {
  id: number;
  contentTypeId: number;
  userId: number;
  data_json: IContentData;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
  archive: boolean;
  archivedAt: Date | null;
}

interface RegisterContentEntry {
  contentTypeId: number;
  userId: number;
  data_json: IContentData;
  parentId?: number | null;
}

interface UpdateContentEntry {
  contentTypeId?: number;
  userId?: number;
  data_json?: IContentData;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export type {
    ContentEntry,
    RegisterContentEntry,
    UpdateContentEntry,
    IContentData
}