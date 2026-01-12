


import prisma from "../Utils/PrismaClient.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import type { ContentEntry , RegisterContentEntry , UpdateContentEntry } from "../Types/ContentEntry.ts";


export default class ContentTypeService {

    // Create
    public async createContentEntry (data: RegisterContentEntry): Promise<ContentEntry> {
         return prisma.contentEntry.create({
            data
        });
    }



    // get all avec pagination
    public async getAllContentTypes(skip?: number, take?: number): Promise<ContentEntry[]> {

        const options: any = {
            orderBy: {
                createdAt: 'desc'
            }
        };

        if (skip !== undefined) options.skip = skip;
        if (take !== undefined) options.take = take;


        return prisma.contentEntry.findMany(options);
    }


    // count (utile pour ta pagination côté frontend)
    public async countContentEntrys(): Promise<number> {
        return prisma.contentEntry.count();
    }



    // Recuperer tous les ContentEntry sans pagination
    public async getAllRolesNoPaginate(): Promise<ContentEntry[]> {
        return prisma.contentEntry.findMany({
          orderBy:{createdAt:"desc"}
        });

    }


    //get by ID
    public async getContentEntryById(id: number): Promise<ContentEntry | null> {
        return prisma.contentEntry.findUnique({
            where: { id }
        });
    }




    // update
    public async updateContentEntry(id: number, data: UpdateContentEntry): Promise<ContentEntry> {
        return prisma.contentEntry.update({
            where: { id },
            data: data as Prisma.ContentEntryUpdateInput
        });
    }

   
   // Archivage
   public async archivedContentEntry(id:number): Promise<ContentEntry>{
        return prisma.contentEntry.update({
            where: { id , archive:false },
            data:{
                archive:true,
                archivedAt: new Date()
            }
        });
   }



   // Restorer
   public async restoredContentType(id:number): Promise<ContentEntry>{
        return prisma.contentEntry.update({
            where: { id , archive:true },
            data:{
                archive:false,
                archivedAt:null
            }
        });
   }

   
    // delete
    public async deleteContentType(id: number): Promise<ContentEntry> {
        return prisma.contentEntry.delete({
            where: { id }
        });
    }

    
    



}