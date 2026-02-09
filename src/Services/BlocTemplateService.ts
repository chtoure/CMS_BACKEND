import prisma from "../Utils/PrismaClient.ts";
import type { IBlocTemplate, IRegisterBlocTemplate, IUpdateBlocTemplate } from "../Types/BlocTemplate.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import type { QueryFilters } from "../Utils/queryFilter.ts";
import { Paginator } from "../Utils/Paginator.ts";
import { getFormattedDate } from "../Utils/FonctionsUtilitaires.ts";
import ComponentService from "./ComponentService.ts";



const componentService = new ComponentService();

export default class BlocTemplateService {
    
    static castingBlocTemplate(data : any): IBlocTemplate {
         return {
            ...data,   
            props_schema: data.props_schema as unknown as IBlocTemplate['props_schema'],
            default_json: data.default_json as unknown as IBlocTemplate['default_json'],
        } as IBlocTemplate;
    }



    static castingBlocTemplates(items:any[]):IBlocTemplate[]{
        return items.map(item => ({
            ...item,
            props_schema: item.props_schema as unknown as IBlocTemplate['props_schema'],
            default_json: item.default_json as unknown as IBlocTemplate['default_json'],
        })) as IBlocTemplate[];
    }


    private buildWhereClause(filter?:QueryFilters): Prisma.BlocTemplateWhereInput {
        const where: Prisma.BlocTemplateWhereInput = {};

        if (filter?.search?.trim()) {
            const query = filter.search.trim();
            where.OR = [
                { name: { contains: query } }
                // { tag: { contains: query } },
                // { description: { contains: query } }
            ];
        }

        return where;
    }


    private async generateNameBlocTemplate(componentId: number): Promise<string> {

        const component = await componentService.getComponentById(componentId);
        if (!component) throw new Error(`Composant avec ID ${componentId} non trouvé`);

        const nameBlocTemplate = `${component.name}-${getFormattedDate()}`;
        return nameBlocTemplate;

    }


    async createBlocTemplate(data: IRegisterBlocTemplate): Promise<IBlocTemplate> {

        const nameBlocTemplate = await this.generateNameBlocTemplate(data.componentId);
        const blocTemplate = await prisma.blocTemplate.create({
           data:{
            ...data,
            name: nameBlocTemplate,
            props_schema: data.props_schema as unknown as Prisma.InputJsonValue,
            default_json: data.default_json as unknown as Prisma.InputJsonValue
           }
        });

        return BlocTemplateService.castingBlocTemplate(blocTemplate);
    }


    public async getBlocTemplates(filter?:QueryFilters){
        const data = await Paginator.paginate<IBlocTemplate>(prisma.blocTemplate, {
            page: filter?.page,
            limit: filter?.limit,
            where: this.buildWhereClause(filter),
            orderBy: { createdAt: 'desc' }
        });

        return {
            ...data,
            results: BlocTemplateService.castingBlocTemplates(data.results)
        };
    }


    public async getBlocTemplateById(id: number): Promise<IBlocTemplate | null> {
        const item = await prisma.blocTemplate.findUnique({
            where: { id }
        });

        if (!item) return null;

       
       return BlocTemplateService.castingBlocTemplate(item);
    }


    public async updateBlocTemplate(id: number, data: IUpdateBlocTemplate): Promise<IBlocTemplate> {
        const blocTemplateUpdated = await prisma.blocTemplate.update({
            where: { id },
            // On cast pour éviter les erreurs de compatibilité JSON
            data: {
                 ...data,
                 props_schema: data.props_schema as unknown as Prisma.InputJsonValue,
                 default_json: data.default_json as unknown as Prisma.InputJsonValue,
            }
        });

        
        return BlocTemplateService.castingBlocTemplate(blocTemplateUpdated);
    }


    public async deleteBlocTemplate(id: number): Promise<IBlocTemplate> {
        const blocTemplateDeleted = await prisma.blocTemplate.delete({
            where: { id }
        });

        
        return BlocTemplateService.castingBlocTemplate(blocTemplateDeleted);
    }

}