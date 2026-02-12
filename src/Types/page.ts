import type { IPageRevision } from "./PageRevision.ts";


interface IPage {
    id: number;
    title: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
    pageRevisions?: IPageRevision[];
}


interface IRegisterPage {
    title: string;
    slug: string;
}

interface IUpdatePage {
    title?: string;
    slug?: string;
}


export type {
    IPage,
    IRegisterPage,
    IUpdatePage
}
