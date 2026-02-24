import prisma from "../Utils/PrismaClient.ts";
import type { BlocTemplate, RegisterBlocTemplate, UpdateBlocTemplate } from "../Types/BlocTemplate.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import type { QueryFilters } from "../Utils/queryFilter.ts";
import { Paginator } from "../Utils/Paginator.ts";
import { getFormattedDate } from "../Utils/FonctionsUtilitaires.ts";
import ComponentService from "./ComponentService.ts";
import type { Component } from "../Types/component.ts";
import merge from 'lodash/merge.js';


const componentService = new ComponentService();

export default class BlocTemplateService {
    
    static castingBlocTemplate(data : any): BlocTemplate {
        console.log(data);
        
        const mergedProps = this.mergeDefaultJson(data);
        const dd=  {
            ...data,   
            props: mergedProps,
        } as BlocTemplate;
        console.log('ddd',dd);
        
        return dd;
    }



    static castingBlocTemplates(items:any[]):BlocTemplate[]{
        return items.map(item => {
            return this.castingBlocTemplate(item);
        }) as BlocTemplate[];
    }


    // Fusionne les props par defaut du composant avec les props par defaut du bloc template
    static mergeDefaultJson(blocTemplate: BlocTemplate): Component['defaultProps'] {
        const mergedProps = merge(
            {},
            blocTemplate.component?.defaultProps,
            blocTemplate.props
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


      
    // private buildRecursiveTree(blocks: any[], parentId: number | null = null): BlocTemplate[] {
    //     return blocks
    //         .filter(block => block.parentId === parentId)
    //         .map(block => ({
    //             id: block.id,
    //             name: block.name,
    //             order: block.order,
    //             tag: block.component?.tag || '',
    //             props: BlocTemplateService.mergeDefaultJson(block),
    //             children: this.buildRecursiveTree(blocks, block.id)
    //         }))
    // }  
    

   

    async createBlocTemplate(data: RegisterBlocTemplate): Promise<BlocTemplate> {

        const nameBlocTemplate = await this.generateNameBlocTemplate(data.componentId);

        const component = await componentService.getComponentById(data.componentId);
        if (!component) throw new Error(`Composant avec ID ${data.componentId} non trouvé`);

        const blocTemplate = await prisma.blocTemplate.create({
           data:{
            ...data,
            name: nameBlocTemplate,
            props: component.defaultProps as unknown as Prisma.InputJsonValue,
           },
           include: { component: true }
        });

        return blocTemplate as unknown as BlocTemplate;

        // return BlocTemplateService.castingBlocTemplate(blocTemplate);
    }


    public async getBlocTemplates(filter?:QueryFilters){
        const data = await Paginator.paginate<BlocTemplate>(prisma.blocTemplate, {
            page: filter?.page,
            limit: filter?.limit,
            where: this.buildWhereClause(filter),
            include: { component: true },
            orderBy: { createdAt: 'desc' }
        });

        return data as unknown as BlocTemplate[];

        // return {
        //     ...data,
        //     results: BlocTemplateService.castingBlocTemplates(data.results)
        // };
    }

    // Recuperer les blocTemplates d'une section sous forme d'arbre 
    public async getTreeSection(sectionId: number):Promise<BlocTemplate[]> {
        const blocTemplates = await prisma.blocTemplate.findMany({
            where: { sectionId },
            include: { 
                component: true,
                children: true
            },
            orderBy: { createdAt: 'asc' },
        });

        return blocTemplates as unknown as BlocTemplate[];

        // return this.buildRecursiveTree(blocTemplates) as unknown as BlocTemplate[];
    }


    public async getBlocTemplatesCustom():Promise<BlocTemplate[]> {
        const blocTemplates = await prisma.blocTemplate.findMany({
            where: { is_custom: true },
            include: { 
                component: true,
                children: true
            },
            orderBy: { createdAt: 'asc' },
        });
        return blocTemplates as unknown as BlocTemplate[];
    }

    public async getBlocTemplateById(id: number): Promise<BlocTemplate | null> {
        const item = await prisma.blocTemplate.findUnique({
            where: { id },
            include: { component: true }
        });

        if (!item) return null;
        
        return item as unknown as BlocTemplate;
   
    //    return BlocTemplateService.castingBlocTemplate(item);
    }



    public async updateBlocTemplate(id: number, data: UpdateBlocTemplate): Promise<BlocTemplate> {
        const { sectionId, parentId, componentId, ...rest } = data;

        const updateData: Prisma.BlocTemplateUpdateInput = {
            ...rest,
            props: data.props as unknown as Prisma.InputJsonValue,
        };

        if (sectionId) {
            updateData.section = { connect: { id: sectionId } };
        }

        if (parentId) {
            updateData.parent = { connect: { id: parentId } };
        }

        if (componentId) {
            updateData.component = { connect: { id: componentId } };
        }

        const blocTemplateUpdated = await prisma.blocTemplate.update({
            where: { id },
            include: { component: true },
            data: updateData
        });

        // return BlocTemplateService.castingBlocTemplate(blocTemplateUpdated);
        return blocTemplateUpdated as unknown as BlocTemplate;
    }
        


    public async deleteBlocTemplate(id: number): Promise<BlocTemplate> {
        const blocTemplateDeleted = await prisma.blocTemplate.delete({
            where: { id },
            include: { component: true }
        });
        
        return BlocTemplateService.castingBlocTemplate(blocTemplateDeleted);
    }

}