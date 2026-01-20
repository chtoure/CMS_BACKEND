
export interface Taxonomy {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    archive: boolean;
    archivedAt: Date | null;
    terms?: TaxonomyTerm[];
}



export interface TaxonomyTerm {
    id: number;
    name: string;
    slug: string;
    taxonomyId: number;
}

export interface RegisterTaxonomyTerm {
    name: string;
    slug: string;
    taxonomyId: number;
}

export interface UpdateTaxonomyTerm {
    name?: string;
    slug?: string;
}

export interface RegisterTaxonomy {
    name: string;
    slug: string;
    description?: string;
}

export interface UpdateTaxonomy {
    name?: string;
    slug?: string;
    description?: string;
}
