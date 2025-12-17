
// Interface  Permission

import type { RolePermission } from "./RolePermission.ts";



export interface Permission {

    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    roles?: RolePermission[];
}