
interface IPageRevision {
    id: number;
    pageId: number;
    status: string;
    version: number;
    createdAt: Date;
    updatedAt: Date;
}

interface IRegisterPageRevision {
    pageId: number;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    version?: number;
}

interface IUpdatePageRevision {
    id: number;
    pageId?: number;
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    version?: number;
}

export type { 
    IPageRevision, 
    IRegisterPageRevision, 
    IUpdatePageRevision 
};