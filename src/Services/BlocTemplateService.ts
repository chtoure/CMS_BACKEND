import prisma from "../Utils/PrismaClient.ts";
import type { IBlocTemplate, IGetBlocTemplates, IRegisterBlocTemplate, IUpdateBlocTemplate } from "../Types/BlocTemplate.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import type { QueryFilters } from "../Utils/queryFilter.ts";
import { Paginator } from "../Utils/Paginator.ts";
import { getFormattedDate } from "../Utils/FonctionsUtilitaires.ts";
import ComponentService from "./ComponentService.ts";
import type { IComponent } from "../Types/component.ts";
import type { IComponentPropsType } from "../Types/PropsBuilder.ts";
import { merge } from 'lodash'; // Très performant pour le deep merge



const componentService = new ComponentService();

export default class BlocTemplateService {
    
    static castingBlocTemplate(data : any): IBlocTemplate {
        const mergedProps = this.mergeDefaultJson(data);
         return {
            ...data,   
            default_json: mergedProps,
        } as IBlocTemplate;
    }



    static castingBlocTemplates(items:any[]):IBlocTemplate[]{
        return items.map(item => {
            return this.castingBlocTemplate(item);
        }) as IBlocTemplate[];
    }


    // Fusionne les props par defaut du composant avec les props par defaut du bloc template
    static mergeDefaultJson(blocTemplate: IBlocTemplate): IComponent['default_props'] {

        const mergedProps = merge(
            {},
            blocTemplate.component?.default_props,
            blocTemplate.default_json
        );
        return mergedProps;

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


      
    private buildRecursiveTree(blocks: any[], parentId: number | null = null): IGetBlocTemplates[] {
        return blocks
            .filter(block => block.parentId === parentId)
            .map(block => ({
                id: block.id,
                name: block.name,
                order: block.order,
                tag: block.component?.tag || '',
                defaultProps: BlocTemplateService.mergeDefaultJson(block),
                children: this.buildRecursiveTree(blocks, block.id)
            }))
    }  

   

    async createBlocTemplate(data: IRegisterBlocTemplate): Promise<IBlocTemplate> {

        const nameBlocTemplate = await this.generateNameBlocTemplate(data.componentId);
        const blocTemplate = await prisma.blocTemplate.create({
           data:{
            ...data,
            name: nameBlocTemplate,
            default_json: {}
           }
        });

        return BlocTemplateService.castingBlocTemplate(blocTemplate);
    }


    public async getBlocTemplates(filter?:QueryFilters){
        const data = await Paginator.paginate<IBlocTemplate>(prisma.blocTemplate, {
            page: filter?.page,
            limit: filter?.limit,
            where: this.buildWhereClause(filter),
            include: { component: true },
            orderBy: { createdAt: 'desc' }
        });

        return {
            ...data,
            results: BlocTemplateService.castingBlocTemplates(data.results)
        };
    }

    // Recuperer les blocTemplates d'une section sous forme d'arbre 
    public async getTreeSection(sectionId: number):Promise<IGetBlocTemplates[]> {
        const blocTemplates = await prisma.blocTemplate.findMany({
            where: { sectionId },
            include: { component: true },
            orderBy: { createdAt: 'asc' }
        });

        return this.buildRecursiveTree(blocTemplates);
    }


    public async getBlocTemplateById(id: number): Promise<IBlocTemplate | null> {
        const item = await prisma.blocTemplate.findUnique({
            where: { id },
            include: { component: true }
        });

        if (!item) return null;
   
       return BlocTemplateService.castingBlocTemplate(item);
    }



    public async updateBlocTemplate(id: number, data: IUpdateBlocTemplate): Promise<IBlocTemplate> {
        const blocTemplateUpdated = await prisma.blocTemplate.update({
            where: { id },
            include: { component: true },
            // On cast pour éviter les erreurs de compatibilité JSON
            data: {
                 ...data,
                 default_json: data.default_json as unknown as Prisma.InputJsonValue,
            }
        });
        
        return BlocTemplateService.castingBlocTemplate(blocTemplateUpdated);
    }


    public async deleteBlocTemplate(id: number): Promise<IBlocTemplate> {
        const blocTemplateDeleted = await prisma.blocTemplate.delete({
            where: { id },
            include: { component: true }
        });
        
        return BlocTemplateService.castingBlocTemplate(blocTemplateDeleted);
    }

}