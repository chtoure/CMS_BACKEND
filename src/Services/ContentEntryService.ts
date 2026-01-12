


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

    // get contentEntry by id
    public async getContentEntryById(idEntry: number, idType:number): Promise<ContentEntry | null> {
        return prisma.contentEntry.findUnique({
            where: {
                 id:idEntry,
                 contentTypeId:idType,
                 archive:false
            }
        });
    }


    //get ContentEntries by contentTypeID
    public async getContentEntriesByContentTypeID(id: number): Promise<ContentEntry[]> {
        return prisma.contentEntry.findMany({
            where: { contentTypeId:id }
        });
    }




    // update
    public async updateContentEntry(id: number,idcontentType: number, data: UpdateContentEntry): Promise<ContentEntry> {
        return prisma.contentEntry.update({
            where: { id , contentTypeId:idcontentType },
            data: data as Prisma.ContentEntryUpdateInput
        });
    }

   
   // Archivage
   public async archivedContentEntry(id:number,idcontentType: number): Promise<ContentEntry>{
        return prisma.contentEntry.update({
            where: { id ,contentTypeId:idcontentType , archive:false },
            data:{
                archive:true,
                archivedAt: new Date()
            }
        });
   }



   // Restorer
   public async restoredContentEntry(id:number,idcontentType: number): Promise<ContentEntry>{
        return prisma.contentEntry.update({
            where: { id , contentTypeId:idcontentType, archive:true },
            data:{
                archive:false,
                archivedAt:null
            }
        });
   }

   
    // delete
    public async deleteContentEntry(id:number,idcontentType: number): Promise<ContentEntry> {
        return prisma.contentEntry.delete({
            where: { id, contentTypeId:idcontentType, archive:true }
        });
    }

    
    



}