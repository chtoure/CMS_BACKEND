

// Interface  User

import type { Role } from "./Role.ts";


export interface User {

    id: number;
    full_name: string;
    email: string;
    password_hash: string;
    refreshToken?:  string | null;
    createdAt: Date;
    updatedAt: Date;
    role?:Role | null;
    isLoggedIn: boolean;
    resetCode?: string | null;
    codeExpiration?: Date | null;
    archive : boolean;
    status : string;
    confirmationToken?: string | null;  
}