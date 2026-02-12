import type { ISection } from "./Section.ts";

interface IPageRevision {
    id: number;
    pageId: number;
    status: string;
    version: number;
    createdAt: Date;
    updatedAt: Date;
    sections?: ISection[];
}

interface IRegisterPageRevision {
    pageId: number;
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    version?: number;
}

interface IUpdatePageRevision {
    pageId?: number;
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    version?: number;
}

export type { 
    IPageRevision, 
    IRegisterPageRevision, 
    IUpdatePageRevision 
};