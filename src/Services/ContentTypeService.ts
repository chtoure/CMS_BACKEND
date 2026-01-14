
import prisma from "../Utils/PrismaClient.ts";
import type { ContentType, RegisterContentType, UpdateContentType } from "../Types/ContentType.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import type { IFieldDefinition } from "../Types/InputField.ts";



export default class ContentTypeService {


    static castingContentType(data : any): ContentType {
         return {
            ...data,   
            fields_schema: data.fields_schema as unknown as IFieldDefinition[],
            archive: Boolean(data.archive) 
        } as ContentType;
    }



    static castingContentTypes(items:any[]):ContentType[]{
        return items.map(item => ({
            ...item,
            fields_schema: item.fields_schema as unknown as IFieldDefinition[],
            archive: Boolean(item.archive)
        })) as ContentType[];
    }



    // Create
    public async createContentType (data: RegisterContentType): Promise<ContentType> {
        const itemContentType = await prisma.contentType.create({
            data:{
                ...data,
                fields_schema: data.fields_schema as unknown as Prisma.InputJsonValue
            } as Prisma.ContentTypeCreateInput
        });

        // On fait le casting
        return ContentTypeService.castingContentType(itemContentType);
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


        const intemsContent = await prisma.contentType.findMany(options);

       // On fait le casting
       return ContentTypeService.castingContentTypes(intemsContent);
    }


    // count (utile pour ta pagination côté frontend)
    public async countContentTypes(): Promise<number> {
        return prisma.contentType.count();
    }



    // Recuperer tous les contentType sans pagination
    public async getAllContentsNoPaginate(): Promise<ContentType[]> {
        
        const dataContentTypes = await prisma.contentType.findMany({
          orderBy:{createdAt:"desc"}
        });

        // on fait le casting
        return ContentTypeService.castingContentTypes(dataContentTypes);
    }


    //get by ID
    public async getContentTypeById(id: number): Promise<ContentType | null> {
        const item = await prisma.contentType.findUnique({
            where: { id , archive:false }
        });

        if (!item) return null;

       // On fait le casting
       return ContentTypeService.castingContentType(item);
    }


    // get by slug
    public async getContentTypeBySlug(slug: string): Promise<ContentType | null> {
        const content = await prisma.contentType.findUnique({
            where: { slug , archive:false}
        });

        // On fait le casting
        return ContentTypeService.castingContentType(content);
    }


    // update
    public async updateContentType(id: number, data: UpdateContentType): Promise<ContentType> {
        const contentUpdated = await prisma.contentType.update({
            where: { id },
            // On cast pour éviter les erreurs de compatibilité JSON
            data: data as Prisma.ContentTypeUpdateInput
        });

        // On fait le casting
        return ContentTypeService.castingContentType(contentUpdated);
    }

   
   // Archivage
   public async archivedContentType(id:number): Promise<ContentType>{
        const item = await prisma.contentType.update({
            where: { id , archive:false },
            data:{
                archive:true,
                archivedAt: new Date()
            }
        });

        // On fait le casting
        return ContentTypeService.castingContentType(item);
   }



   // Restorer
   public async restoredContentType(id:number): Promise<ContentType>{
        const contentRestore = await prisma.contentType.update({
            where: { id , archive:true },
            data:{
                archive:false,
                archivedAt:null
            }
        });

        // On fait le casting
        return ContentTypeService.castingContentType(contentRestore);
   }

   
    // delete
    public async deleteContentType(id: number): Promise<ContentType> {
        const contentDelete = await prisma.contentType.delete({
            where: { id,archive:true }
        });

        // On fait le casting
        return ContentTypeService.castingContentType(contentDelete);
    }

    
    



}