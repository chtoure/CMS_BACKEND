
import prisma from "../Utils/PrismaClient.ts";
import type { ContentType, RegisterContentType, UpdateContentType } from "../Types/ContentType.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import { FieldType, type IBaseField, type IFieldDefinition, type IRelationConfig } from "../Types/InputField.ts";
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_NOT_FOUND } from "../Utils/Constantes/ConstantesHttp.ts";
import { AppError } from "../Utils/ErrorPrisma.ts";
import type { QueryFilters } from "../Utils/queryFilter.ts";
import { Paginator } from "../Utils/Paginator.ts";



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



    private buildWhereClause(filter?:QueryFilters): Prisma.ContentTypeWhereInput {
        const where: Prisma.ContentTypeWhereInput = {};

        if (filter?.archive !== undefined) {
            where.archive = filter.archive;
        }

        if (filter?.search?.trim()) {
            const query = filter.search.trim();
            where.OR = [
                { name: { contains: query } },
                { slug: { contains: query } }
            ];
        }

        return where;
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


    // get permissions
    public async getContentTypes(filter?:QueryFilters){
        const data = await Paginator.paginate<ContentType>(prisma.contentType, {
            page: filter?.page,
            limit: filter?.limit,
            where: this.buildWhereClause(filter),
            orderBy: { createdAt: 'desc' }
        });

        return {
            ...data,
            results: ContentTypeService.castingContentTypes(data.results)
        };
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



    // get contentTypes excepted the one with id
    public async getContentTypesExcepted(id: number): Promise<ContentType[]> {
        const contentTypes = await prisma.contentType.findMany({
            where: { archive:false, NOT: { id } }
        });

        // on fait le casting
        return ContentTypeService.castingContentTypes(contentTypes);
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

        const typeASupprimer = await prisma.contentType.findUnique({    
            where: { id , archive:true},
            include: {
                _count: {
                select: { 
                    childrenContentTypes: true, 
                    entries: true               
                    }
                }
                

            }
        });

        console.log(typeASupprimer);

        if (!typeASupprimer) throw new AppError("Type non trouvé ou non archivé.");

        if (typeASupprimer._count.childrenContentTypes > 0) throw new AppError("Suppression impossible : ce type est le 'Parent' relationnel d'autres types.");

        if (typeASupprimer._count.entries > 0) throw new AppError("Suppression impossible : ce type a des entrées.");
                
        const contentDelete = await prisma.contentType.delete({ where: { id } });
        return ContentTypeService.castingContentType(contentDelete);
    }

    
    
    // synchronisation des relations entre les content types
    async syncRelationsContentTypeCreate(proprietaireId: number, fieldsSchema: IFieldDefinition[]) {
        
        // On filtre uniquement les champs de type RELATION
        const cibleIds = [...new Set(
            fieldsSchema
                .filter((f): f is (IBaseField & IRelationConfig) => f.type === FieldType.RELATION)
                .map(f => Number(f.contentTypeId))
        )];

        // Création des nouveaux index relationnels
        if (cibleIds.length > 0) {
            await prisma.contentTypeRelation.createMany({
                data: cibleIds.map(id => ({
                    proprietaireId: proprietaireId,
                    cibleId: id
                }))
            });
        }
    }



    async syncRelationsContentTypeUpdate(proprietaireId: number, fieldsSchema: IFieldDefinition[]) {
        
        // On filtre uniquement les champs de type RELATION
        const cibleIds = [...new Set(
            fieldsSchema
                .filter((f): f is (IBaseField & IRelationConfig) => f.type === FieldType.RELATION)
                .map(f => Number(f.contentTypeId))
        )];

        // Nettoyage des anciens liens pour ce propriétaire
        await prisma.contentTypeRelation.deleteMany({
            where: { proprietaireId: proprietaireId }
        });

        // Création des nouveaux index relationnels
        if (cibleIds.length > 0) {
            await prisma.contentTypeRelation.createMany({
                data: cibleIds.map(id => ({
                    proprietaireId: proprietaireId,
                    cibleId: id
                }))
            });
        }
    }

}