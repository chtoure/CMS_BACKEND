

interface IPage {
    id: number;
    title: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
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
