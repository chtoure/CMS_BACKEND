import type { PageRevision } from "./PageRevision.ts";
import type { User } from "./User.ts";


interface Page {
    id: number;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    userId?: number;
    user?: User;
    pageRevisions?: PageRevision[];
    navItem?: any; // To avoid circular dependency initially, or import NavItem
}


interface RegisterPage {
    name: string;
    slug: string;
    userId: number
}

interface UpdatePage {
    name?: string;
    slug?: string;
}


export type {
    Page,
    RegisterPage,
    UpdatePage
}
