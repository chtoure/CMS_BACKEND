
// Interface  User

import type { Permission } from "./Permission.ts";
import type { Role } from "./Role.ts";



export interface RolePermission {

    id: number;
    roleId:number;
    permissionId:number;
    createdAt: Date;
    updatedAt: Date;
    role?: Role; // Relation vers le rôle
    permission?: Permission; // Relation vers la permission
    
}