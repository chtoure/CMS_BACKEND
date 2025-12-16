
import type { RolePermission } from "./RolePermission.ts";
import type { User } from "./User.ts";



// Interface  Role

export interface Role {

    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    users?: User[];
    permissions?: RolePermission[];
}