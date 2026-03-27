import type { Prisma } from "../generated/prisma/client.ts";
import type { ContentEntry } from "./ContentEntry.ts";
import type { IFieldDefinition } from "./InputField.ts";



export interface ContentType {
    id: number,
    name: string,
    slug: string,
    description: string | null,
    fields_schema: IFieldDefinition[],
    createdAt: Date;
    updatedAt: Date;
    archive: Boolean;
    archivedAt: Date | null;
    entries?: ContentEntry[]
}





export interface RegisterContentType {
    name: string,
    slug: string,
    description?: string,
    fields_schema: IFieldDefinition[] | Prisma.InputJsonValue,
    userId: number
}


export interface UpdateContentType {
    name?: string;
    slug?: string;
    fields_schema?: IFieldDefinition[] | Prisma.InputJsonValue;
}