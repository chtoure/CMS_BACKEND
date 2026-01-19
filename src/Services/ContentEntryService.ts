
import prisma from "../Utils/PrismaClient.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import type { ContentEntry , RegisterContentEntry , UpdateContentEntry } from "../Types/ContentEntry.ts";


export default class ContentEntryService {

    // Create
    public async createContentEntry (data: RegisterContentEntry): Promise<ContentEntry> {
        return prisma.contentEntry.create({
            data
        });
    }


    public async getAllContentEntry(skip?: number, take?: number): Promise<ContentEntry[]> {

        const options: any = {
            orderBy: {
                createdAt: 'desc'
            }, 
            include:{
                user:true
            }
        };

        if (skip !== undefined) options.skip = skip;
        if (take !== undefined) options.take = take;


        return prisma.contentEntry.findMany(options);
    }

    public async getAllContentEntryNoPaginate(): Promise<ContentEntry[]> {
        return prisma.contentEntry.findMany({
          orderBy:{createdAt:"desc"}
        });
    }


    public async countContentEntrys(): Promise<number> {
        return prisma.contentEntry.count();
    }



    // get contentEntry by id
    public async getContentEntryById(idEntry: number): Promise<ContentEntry | null> {
        return prisma.contentEntry.findUnique({
            where: {
                 id:idEntry
            },
            include:{
                contentType:true,
                user:true
            }
        });
    }


    public async getContentEntriesByContentTypeID(
        id: number, 
        skip?: number,
        take?: number,
        status?: "PUBLISHED" | "DRAFT" | "ARCHIVED",
        search?: string
    ): Promise<ContentEntry[]> {

        const options: any = {
            where: { 
                contentTypeId: id,
                archive: false 
            },
            orderBy: {
                createdAt: "desc"
            },
            skip,
            take: take,
            include: {
                user: true,
                contentType: true
            }
        };

        if (status) {
            options.where.status = status;
        }

        if (search && search.trim() !== "") {
            const query = search.trim();

             options.where.OR = [
                { data_json: { path: '$.title', string_contains: query } },
                { data_json: { path: '$.name', string_contains: query } },
                { data_json: { path: '$.content', string_contains: query } }
             ];
        }

        return prisma.contentEntry.findMany(options);
    }




    // update
    public async updateContentEntry(id: number, data: UpdateContentEntry): Promise<ContentEntry> {
        return prisma.contentEntry.update({
            where: { id },
            data: data as Prisma.ContentEntryUpdateInput
        });
    }

    public updateStatus(id:number, status: "PUBLISHED" | "DRAFT" | "ARCHIVED"):Promise<ContentEntry>{
        return prisma.contentEntry.update({
            where: { id },
            data: {
                status:status,
            }
        });  
    }

   
   // Archivage
   public async archivedContentEntry(id:number): Promise<ContentEntry>{
        return prisma.contentEntry.update({
            where: { id , archive:false },
            data:{
                archive:true,
                status: "ARCHIVED",
                archivedAt: new Date()
            }
        });
   }



   // Restorer
   public async restoredContentEntry(id:number): Promise<ContentEntry>{
        return prisma.contentEntry.update({
            where: { id , archive:true },
            data:{
                archive:false,
                status:"DRAFT",
                archivedAt:null
            }
        });
   }

    public async deleteContentEntry(id:number): Promise<ContentEntry> {
        return prisma.contentEntry.delete({
            where: { id, archive:true }
        });
    }

    public async getArchivedContentEntry(
        skip?: number,
        take?: number,
        search?: string
    ): Promise<ContentEntry[]> {

        const options: any = {
            where: { 
                archive:true
            },
            orderBy: {
                createdAt: "desc"
            },
            skip,
            take: take,
            include: {
                user: true,
                contentType: true
            }
        };

        if (search && search.trim() !== "") {
            const query = search.trim();

             options.where.OR = [
                { data_json: { path: '$.title', string_contains: query } },
                { data_json: { path: '$.name', string_contains: query } },
                { data_json: { path: '$.content', string_contains: query } }
             ];
        }

        return prisma.contentEntry.findMany(options);
    }
}