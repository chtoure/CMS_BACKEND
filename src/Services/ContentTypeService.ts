
import prisma from "../Utils/PrismaClient.ts";
import type { ContentType, RegisterContentType, UpdateContentType } from "../Types/ContentType.ts";
import type { Prisma } from "../generated/prisma/client.ts";



export default class ContentTypeService {

    // Create
    public async createContentType (data: RegisterContentType): Promise<ContentType> {
         return prisma.contentType.create({
            data
        });
    }



    // get all avec pagination
    public async getAllContentTypes(skip?: number, take?: number): Promise<ContentType[]> {

        const options: any = {
            orderBy: {
                createdAt: 'desc'
            }
        };

        if (skip !== undefined) options.skip = skip;
        if (take !== undefined) options.take = take;


        return prisma.contentType.findMany(options);
    }


    // count (utile pour ta pagination côté frontend)
    public async countContentTypes(): Promise<number> {
        return prisma.contentType.count();
    }



    // Recuperer tous les contentType sans pagination
    public async getAllRolesNoPaginate(): Promise<ContentType[]> {
        return prisma.contentType.findMany({
          orderBy:{createdAt:"desc"}
        });

    }


    //get by ID
    public async getContentTypeById(id: number): Promise<ContentType | null> {
        return prisma.contentType.findUnique({
            where: { id , archive:false }
        });
    }


    // get by slug
    public async getContentTypeBySlug(slug: string): Promise<ContentType | null> {
        return prisma.contentType.findUnique({
            where: { slug }
        });
    }


    // update
    public async updateContentType(id: number, data: UpdateContentType): Promise<ContentType> {
        return prisma.contentType.update({
            where: { id },
            // On cast pour éviter les erreurs de compatibilité JSON
            data: data as Prisma.ContentTypeUpdateInput
        });
    }

   
   // Archivage
   public async archivedContentType(id:number): Promise<ContentType>{
        return prisma.contentType.update({
            where: { id , archive:false },
            data:{
                archive:true,
                archivedAt: new Date()
            }
        });
   }



   // Restorer
   public async restoredContentType(id:number): Promise<ContentType>{
        return prisma.contentType.update({
            where: { id , archive:true },
            data:{
                archive:false,
                archivedAt:null
            }
        });
   }

   
    // delete
    public async deleteContentType(id: number): Promise<ContentType> {
        return prisma.contentType.delete({
            where: { id }
        });
    }

    
    



}