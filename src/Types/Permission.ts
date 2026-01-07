
// Interface  Permission

import type { Role } from "./Role.ts";



export interface Permission {

    id: number;
    name: string;
    description?:  string | null;
    createdAt: Date;
    updatedAt: Date;
    roles?: Role[];
}