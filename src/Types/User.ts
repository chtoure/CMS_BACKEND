

// Interface  User

import type { Role } from "./Role.ts";


export interface User {

    id: number;
    full_name: string;
    email: string;
    password_hash: string;
    refreshToken?:  string | null;
    role_id:number | null;
    createdAt: Date;
    updatedAt: Date;
    role:Role | null;
    
}