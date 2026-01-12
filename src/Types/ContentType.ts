import type { Prisma } from "../generated/prisma/client.ts";
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
}



export interface RegisterContentType {
    name: string,
    slug: string,
    description?: string,
    fields_schema: IFieldDefinition[] | Prisma.InputJsonValue,
}


export interface UpdateContentType {
    name?: string;
    slug?: string;
    fields_schema?: IFieldDefinition[] | Prisma.InputJsonValue;
}