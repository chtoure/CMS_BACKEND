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
