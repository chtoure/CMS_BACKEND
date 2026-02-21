import type { Section } from "./Section.ts";

interface PageRevision {
    id: number;
    pageId: number;
    status: string;
    version: number;
    createdAt: Date;
    updatedAt: Date;
    sections?: Section[];
}

interface RegisterPageRevision {
    pageId: number;
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    version?: number;
    userId: number;
}

interface UpdatePageRevision {
    pageId?: number;
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    version?: number;
}

export type { 
    PageRevision, 
    RegisterPageRevision, 
    UpdatePageRevision 
};