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

import { StyleInheritance } from "../Utils/StyleInheritance.ts";

const componentService = new ComponentService();
const mediaService = new MediaService();
const contentEntryService = new ContentEntryService();

export default class BlocTemplateService {

    static castingBlocTemplate(data: any): BlocTemplate {
        // Applique l'héritage prototypal (merge model.props + instance.props)
        return StyleInheritance.applyInheritance(data) as BlocTemplate;
    }

    // static castingBlocTemplates(items:any[]):BlocTemplate[]{
    //     return items.map(item => {
    //         return this.castingBlocTemplate(item);
    //     }) as BlocTemplate[];
    // }


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
    static castingBlocTemplates(items: any[]): BlocTemplate[] {
        return items.map(item => BlocTemplateService.castingBlocTemplate(item));
    }

    /**
     * Parcourt récursivement un objet de props pour collecter tous les mediaId distincts.
     */
    static collectMediaIds(obj: any, ids: Set<number> = new Set()): Set<number> {
        if (!obj || typeof obj !== 'object') return ids;
        if (obj.type === 'media' && typeof obj.mediaId === 'number') {
            ids.add(obj.mediaId);
            return ids;
        }
        for (const val of Object.values(obj)) {
            BlocTemplateService.collectMediaIds(val, ids);
        }
        return ids;
    }

    /**
     * Injecte les `url` dans toutes les MediaProperty d'un objet de props.
     * Ne modifie que les clés { type: 'media' }, laisse tout le reste intact.
     */
    static injectMediaUrls(obj: any, urlMap: Map<number, string>): any {
        if (!obj || typeof obj !== 'object') return obj;
        if (obj.type === 'media' && typeof obj.mediaId === 'number') {
            return { ...obj, url: urlMap.get(obj.mediaId) ?? null };
        }
        if (Array.isArray(obj)) return obj.map(v => BlocTemplateService.injectMediaUrls(v, urlMap));
        const result: any = {};
        for (const [k, v] of Object.entries(obj)) {
            result[k] = BlocTemplateService.injectMediaUrls(v, urlMap);
        }
        return result;
    }

    /**
     * Résout tous les mediaId présents dans une liste de BlocTemplates (en une seule requête SQL).
     * Retourne les BlocTemplates avec les urls Media injectées dans leurs props.
     */
    static async resolveMediaProps(blocs: BlocTemplate[]): Promise<BlocTemplate[]> {
        const ids = new Set<number>();
        for (const bloc of blocs) {
            BlocTemplateService.collectMediaIds(bloc.props, ids);
        }
        if (ids.size === 0) return blocs;

        const medias = await mediaService.getMediaByIds([...ids]);
        const urlMap = new Map(medias.map(m => [m.id, m.file_path]));

        return blocs.map(bloc => ({
            ...bloc,
            props: BlocTemplateService.injectMediaUrls(bloc.props, urlMap),
            children: bloc.children
                ? (BlocTemplateService.resolveMediaProps(bloc.children as any) as any)
                : undefined,
        }));
    }



    private buildWhereClause(filter?: QueryFilters): Prisma.BlocTemplateWhereInput {
        const where: Prisma.BlocTemplateWhereInput = {};

        if (filter?.search?.trim()) {
            const query = filter.search.trim();
            where.OR = [
                { name: { contains: query } }
            ];
        }

        return where;
    }


    // private async generateNameBlocTemplate(componentId: number): Promise<string> {
    //     const component = await componentService.getComponentById(componentId);
    //     if (!component) throw new Error(`Composant avec ID ${componentId} non trouvé`);
    //     return `${component.name}-${getFormattedDate()}`;
    // }


    private async generateNameBlocTemplate(componentId: number): Promise<string> {
        const component = await componentService.getComponentById(componentId);
        if (!component) throw new Error(`Composant avec ID ${componentId} non trouvé`);
        const randomSuffix = Math.random().toString(36).substring(2, 7); // Ex: "7x9a2"
        return `${component.name}-${getFormattedDate()}-${randomSuffix}`;
    }



    async createBlocTemplate(data: RegisterBlocTemplate): Promise<BlocTemplate> {

        // console.log("create de bloc", data);
        
        const nameBlocTemplate = await this.generateNameBlocTemplate(data.componentId);

        const component = await componentService.getComponentById(data.componentId);
        if (!component) throw new Error(`Composant avec ID ${data.componentId} non trouvé`);

        const blocTemplate = await prisma.blocTemplate.create({
            data: {
                ...data,
                name: nameBlocTemplate,
                props: component.defaultProps as unknown as Prisma.InputJsonValue,
            },
            include: { 
                component: true,
                model: true 
            }
        });

        return BlocTemplateService.castingBlocTemplate(blocTemplate);
    }


    public async getBlocTemplates(filter?: QueryFilters) {
        const data = await Paginator.paginate<any>(prisma.blocTemplate, {
            page: filter?.page,
            limit: filter?.limit,
            where: this.buildWhereClause(filter),
            include: { 
                component: true,
                model: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return {
            ...data,
            results: BlocTemplateService.castingBlocTemplates(data.results)
        } as any;
    }


    public async getTreeSection(sectionId: number): Promise<BlocTemplate[]> {
        const allNodes = await prisma.blocTemplate.findMany({
            where: { sectionId },
            include: {
                component: true,
                model: true,
            },
            orderBy: { order: 'asc' },
        });

        const nodeMap = new Map<number, any>();
        const roots: any[] = [];

        for (const node of allNodes) {
            (node as any).children = [];
            nodeMap.set(node.id, node);
        }

        for (const node of allNodes) {
            if (node.parentId) {
                const parent = nodeMap.get(node.parentId);
                if (parent) {
                    parent.children.push(node);
                } else {
                    roots.push(node);
                }
            } else {
                roots.push(node);
            }
        }

        for (const node of allNodes) {
            (node as any).children.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
        }
        roots.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        const casted = BlocTemplateService.castingBlocTemplates(roots);
        return BlocTemplateService.resolveMediaProps(casted);
    }


    public async getBlocTemplatesCustom(): Promise<BlocTemplate[]> {
        const allNodes = await prisma.blocTemplate.findMany({
            where: { is_custom: true },
            include: {
                component: true,
                model: true,
            },
            orderBy: { createdAt: 'asc' },
        });

        const nodeMap = new Map<number, any>();
        const roots: any[] = [];

        for (const node of allNodes) {
            (node as any).children = [];
            nodeMap.set(node.id, node);
        }

        for (const node of allNodes) {
            if (node.parentId) {
                const parent = nodeMap.get(node.parentId);
                if (parent) {
                    parent.children.push(node);
                } else {
                    roots.push(node);
                }
            } else {
                roots.push(node);
            }
        }

        for (const node of allNodes) {
            (node as any).children.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
        }
        roots.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

        const casted = BlocTemplateService.castingBlocTemplates(roots);
        return BlocTemplateService.resolveMediaProps(casted);
    }


    public async getBlocTemplateById(id: number): Promise<BlocTemplate | null> {
        const item = await prisma.blocTemplate.findUnique({
            where: { id },
            include: { 
                component: true,
                model: true
            }
        });

        if (!item) return null;

        const casted = BlocTemplateService.castingBlocTemplate(item);
        const resolved = await BlocTemplateService.resolveMediaProps([casted]);
        return resolved[0] ?? null;

    }


    public async updateBlocTemplate(id: number, data: UpdateBlocTemplate): Promise<BlocTemplate> {

        // console.log('mis ajour du bloc', data);
        
        const { sectionId, parentId, componentId, modelId, props, ...rest } = data;

        const updateData: Prisma.BlocTemplateUpdateInput = {
            ...rest,
        };

        if (modelId === null) {
            updateData.model = { disconnect: true };
        } else if (modelId !== undefined) {
            updateData.model = { connect: { id: modelId } };
        }

        if (rest.is_custom === true) {
            updateData.section = { disconnect: true };
        } else if (sectionId === null) {
            updateData.section = { disconnect: true };
        } else if (sectionId !== undefined) {
            updateData.section = { connect: { id: sectionId } };
        }

        if (parentId === null) {
            updateData.parent = { disconnect: true };
        } else if (parentId !== undefined) {
            updateData.parent = { connect: { id: parentId } };
        }

        if (componentId) {
            updateData.component = { connect: { id: componentId } };
        }

        if (props !== undefined || data.is_custom !== undefined) {
            const current = await prisma.blocTemplate.findUnique({
                where: { id },
                include: { 
                    model: {
                        include: { model: true } // Supporte au moins 2 niveaux d'héritage pour le merge d'update
                    }
                }
            });

            if (current) {
                const isNowCustom = current.is_custom;
                
                // On calcule le style "complet" tel qu'il serait AVANT cet update
                const currentFullStyle = StyleInheritance.computeEffectiveProps(current);
                
                // On fusionne avec les nouvelles propriétés envoyées (si présentes)
                // Note : si props est {}, on considère que c'est une volonté de vider les styles ? 
                // Généralement, le front envoie l'objet complet qu'il voit.
                const newFullStyle = props ? StyleInheritance.merge(currentFullStyle, props) : currentFullStyle;

                if (isNowCustom) {
                    // APLATISSEMENT : On enregistre le style COMPLET et on déconnecte
                    updateData.props = newFullStyle as unknown as Prisma.InputJsonValue;
                    updateData.model = { disconnect: true };
                } else if (current.modelId) {
                    // INSTANCE : On calcule le DIFF par rapport au modèle parent pour ne stocker que les surcharges
                    // On récupère les props du modèle parent direct
                    const modelProps = (current.model as any)?.props || {};
                    const diffProps = StyleInheritance.computeOverrides(modelProps, newFullStyle);
                    updateData.props = diffProps as unknown as Prisma.InputJsonValue;
                } else if (props !== undefined) {
                    updateData.props = props as unknown as Prisma.InputJsonValue;
                }
            }
        }

        const updated = await prisma.blocTemplate.update({
            where: { id },
            include: { 
                component: true,
                model: true
            },
            data: updateData,
        });

        return BlocTemplateService.castingBlocTemplate(updated);
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
                            data[param.name] = media ? `${process.env.APP_URL || ''}${media.file_path}` : null;
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
        const contenuParam = block.props.params?.find((p: IComponentParams) => p.type.source === ValueSource.CONTENUS);

        if (!contenuParam) return null;

        const config = contenuParam.type.config;


       if (config.mode === 'single') {
            const entry = await contentEntryService.getContentEntryById(config.entryId);
            // Retourner les données aplaties de l'entrée
            return entry ? { id: entry.id, ...(entry.data_json as any || {}) } : null;
        } 
        
        if (config.mode === 'query') {
            const items = await contentEntryService.getEntriesByContentTypeIdControl(contenuParam.type.contentTypeId, config);
            
            // On récupère le schéma pour identifier les champs de type média
            const ct = await prisma.contentType.findUnique({
                where: { id: contenuParam.type.contentTypeId },
                select: { fields_schema: true }
            });
            const fields = ct?.fields_schema ? (typeof ct.fields_schema === 'string' ? JSON.parse(ct.fields_schema) : ct.fields_schema) : [];
            const mediaFields = fields.filter((f: any) => f.type === 'media' || f.type === 'FieldType.MEDIA');

            // On collecte tous les IDs de médias
            const mediaIds = new Set<number>();
            items.forEach((item: any) => {
                const data = item.data_json || {};
                mediaFields.forEach((f: any) => {
                    const val = data[f.name];
                    if (typeof val === 'number') mediaIds.add(val);
                });
            });

            // On récupère les URLs depuis le MediaService
            const medias = await mediaService.getMediaByIds(Array.from(mediaIds));

            // On retourne un objet collection avec les items aplatis et les images résolues
            return {
                items: items.map((item: any) => {
                    const resolvedData = { ...(item.data_json || {}) };
                    mediaFields.forEach((f: any) => {
                       const val = resolvedData[f.name];
                       if (typeof val === 'number') {
                           const media = medias.find((m: any) => m.id === val);
                           if (media) resolvedData[f.name] = `${process.env.APP_URL || ''}${media.file_path}`;
                       }
                    });

                    return {
                        id: item.id,
                        ...resolvedData
                    };
                }),
                is_collection: true
            };
        }

        return null;
    }



    public async buildRecursiveTree(
        blocks: any[], 
        parentId: number | null = null, 
        parentContext: any = null
    ): Promise<any[]> {
        // On filtre les blocs du niveau actuel
        const currentLevelBlocks = blocks
            .filter(block => block.parentId === parentId)
            // Ajout du tri ascendant pour respecter la disposition Builder
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        
        const hydratedBlocks = [];

        for (const block of currentLevelBlocks) {
            // Fusion des props par défaut (ta logique actuelle)
            const baseProps = BlocTemplateService.mergeDefaultJson(block);

            // Cette étape récupère le contenu ou liste de contenu
            const blockInjectedData = await this.resolveCMSData(block);

            // On utilise parentContext (donné par le parent) ou blockInjectedData (propre au bloc)
            const resolvedData = await this.hydrateParams(
                baseProps.params || [], 
                baseProps.data || {}, 
                parentContext || blockInjectedData
            );

            // Construction du bloc hydraté
            hydratedBlocks.push({
                id: block.id,
                blocTemplateId: block.id,
                name: block.name,
                order: block.order,
                tag: block.component?.tag || '',
                family: block.component?.family || '',
                styles: baseProps.styles, // On garde les styles tels quels
                params: baseProps.params || [],
                data: {
                    ...resolvedData,
                    // On injecte les items si c'est une requête de collection
                    ...(blockInjectedData?.items ? { items: blockInjectedData.items, is_collection: true } : {})
                },
                componentDefinitionId: block.componentId,
                // Récursivité : on descend en passant le contexte actuel aux enfants
                children: await this.buildRecursiveTree(blocks, block.id, blockInjectedData)
            });
        }

        return hydratedBlocks;
    }

}