
// Interface  Permission

import type { RolePermission } from "./RolePermission.ts";



export interface Permission {

    id: number;
    name: string;
    description?:  string | null;
    createdAt: Date;
    updatedAt: Date;
    roles?: RolePermission[];
}