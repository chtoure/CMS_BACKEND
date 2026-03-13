export interface NavItem {
    id: number;
    label: string;
    value: string;
    parentId: number | null;
    pageId: number | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface RegisterNavItem {
    label: string;
    value: string;
    parentId?: number;
    pageId?: number;
}

export interface UpdateNavItem {
    label?: string;
    value?: string;
    parentId?: number;
    pageId?: number;
}
