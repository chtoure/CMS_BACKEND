import prisma from "../Utils/PrismaClient.ts";
import type { BlocTemplate, RegisterBlocTemplate, UpdateBlocTemplate } from "../Types/BlocTemplate.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import type { QueryFilters } from "../Utils/queryFilter.ts";
import { Paginator } from "../Utils/Paginator.ts";
import { getFormattedDate } from "../Utils/FonctionsUtilitaires.ts";
import ComponentService from "./ComponentService.ts";
import type { Component } from "../Types/component.ts";
import merge from 'lodash/merge.js';
import { ValueSource, type IComponentParams } from "../Types/params.ts";
import MediaService from "./MediaService.ts";
import ContentEntryService from "./ContentEntryService.ts";


const componentService = new ComponentService();
const mediaService = new MediaService();
const contentEntryService = new ContentEntryService();

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
        console.log('blocTemplate', blocTemplate.props.styles);
        console.log('mergedProps', mergedProps.styles);
        
        
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
        console.log(nameBlocTemplate);

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


    private async hydrateParams(params: IComponentParams[], currentData: any, context: any): Promise<any> {
        const data = { ...currentData };

        for (const param of params) {
            const type = param.type;

            switch(type.source) {
                // Cas : Source PARENT
                case ValueSource.PARENT:
                    if (context && type.parentKey) {
                        let val = context[type.parentKey];

                        // SI C'EST UN MÉDIA : On transforme l'ID en URL
                        if (type.targetType === ValueSource.IMAGE && typeof val === 'number') { 
                            const media = await mediaService.getMediaById(val);
                            data[param.name] = media?.file_path;
                        } else {
                            data[param.name] = val;
                        }
                    }
                    break;

                // Cas : Source IMAGE
                case ValueSource.IMAGE:
                    data[param.name] = type.src;
                    break;

                // Cas : Source STATIC
                case ValueSource.STATIC:
                    data[param.name] = type.value;
                    break;
            }
        }
        return data;
    }


    private async resolveCMSData(block: any): Promise<any> {
        // On cherche s'il y a un paramètre de type CONTENUS
        const contenuParam = block.params?.find((p: IComponentParams) => p.type.source === ValueSource.CONTENUS);

        if (!contenuParam) return null;

        const config = contenuParam.type.config;

        if (config.mode === 'single') {
            // Récupération d'une seule entrée
            return await contentEntryService.getContentEntryById(config.entryId);
        } 
        
        if (config.mode === 'query') {
            // Récupération d'une liste d'entrées
            const items = await contentEntryService.getEntriesByContentTypeIdControl(contenuParam.type.contentTypeId, config);
            // On injecte directement les items dans le bloc pour que le front puisse v-for
            block.data.item = items;
            block.data.is_collection = true;
            return null; // Les data sont dans items, pas besoin de contexte unique
        }

        return null;
    }



    public async buildRecursiveTree(
        blocks: any[], 
        parentId: number | null = null, 
        parentContext: any = null
    ): Promise<any[]> {
        // On filtre les blocs du niveau actuel
        const currentLevelBlocks = blocks.filter(block => block.parentId === parentId);
        const hydratedBlocks = [];

        for (const block of currentLevelBlocks) {
            // Fusion des props par défaut (ta logique actuelle)
            const baseProps = BlocTemplateService.mergeDefaultJson(block);

            // Cette étape récupère le contenu ou liste de contenu
            const blockInjectedData = await this.resolveCMSData(block);

            // On utilise parentContext (donné par le parent) ou blockInjectedData (propre au bloc)
            const resolvedData = await this.hydrateParams(
                block.params || [], 
                baseProps.data || {}, 
                parentContext || blockInjectedData
            );

            // Construction du bloc hydraté
            hydratedBlocks.push({
                id: block.id,
                name: block.name,
                order: block.order,
                tag: block.component?.tag || '',
                family: block.component?.family || '',
                styles: baseProps.styles, // On garde les styles tels quels
                data: {
                    ...resolvedData,
                    // On injecte les items si c'est une requête de collection
                    ...(blockInjectedData?.items ? { items: blockInjectedData.items, is_collection: true } : {})
                },
                // Récursivité : on descend en passant le contexte actuel aux enfants
                children: await this.buildRecursiveTree(blocks, block.id, blockInjectedData)
            });
        }

        return hydratedBlocks;
    }

}