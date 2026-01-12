

import type { Prisma } from "../generated/prisma/client.ts";



export interface ContentEntry {
    id: number,
    contentTypeId: number,
    userId: number,
    data_json: Prisma.JsonValue,
    status: string;
    createdAt: Date;
    updatedAt: Date;
    archive: Boolean;
    archivedAt: Date | null;
}



export interface RegisterContentEntry {
    contentTypeId: number,
    userId: number,
    data_json: Prisma.InputJsonValue,
}


export interface UpdateContentEntry {
    contentTypeId?: number,
    userId?: number,
    data_json?: Prisma.InputJsonValue;
}