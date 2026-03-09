import prisma from "../Utils/PrismaClient.ts";
import type { BlocTemplate, RegisterBlocTemplate, UpdateBlocTemplate } from "../Types/BlocTemplate.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import type { QueryFilters } from "../Utils/queryFilter.ts";
import { Paginator } from "../Utils/Paginator.ts";
import { getFormattedDate } from "../Utils/FonctionsUtilitaires.ts";
import ComponentService from "./ComponentService.ts";
import { StyleInheritance } from "../Utils/StyleInheritance.ts";

const componentService = new ComponentService();

export default class BlocTemplateService {

    static castingBlocTemplate(data: any): BlocTemplate {
        // Applique l'héritage prototypal (merge model.props + instance.props)
        return StyleInheritance.applyInheritance(data) as BlocTemplate;
    }

    static castingBlocTemplates(items: any[]): BlocTemplate[] {
        return items.map(item => BlocTemplateService.castingBlocTemplate(item));
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


    private async generateNameBlocTemplate(componentId: number): Promise<string> {
        const component = await componentService.getComponentById(componentId);
        if (!component) throw new Error(`Composant avec ID ${componentId} non trouvé`);
        return `${component.name}-${getFormattedDate()}`;
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
        const blocTemplates = await prisma.blocTemplate.findMany({
            where: { sectionId, parentId: null }, // On ne prend que les racines pour l'arbre
            include: {
                component: true,
                model: true,
                children: {
                    include: {
                        component: true,
                        model: true,
                        children: true // On pourrait avoir besoin d'une récursion plus profonde
                    }
                }
            },
            orderBy: { order: 'asc' },
        });

        return BlocTemplateService.castingBlocTemplates(blocTemplates);
    }


    public async getBlocTemplatesCustom(): Promise<BlocTemplate[]> {
        const blocTemplates = await prisma.blocTemplate.findMany({
            where: { is_custom: true },
            include: {
                component: true,
                model: true,
                children: true
            },
            orderBy: { createdAt: 'asc' },
        });
        return BlocTemplateService.castingBlocTemplates(blocTemplates);
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

        return BlocTemplateService.castingBlocTemplate(item);
    }


    public async updateBlocTemplate(id: number, data: UpdateBlocTemplate): Promise<BlocTemplate> {

        console.log('mis ajour du bloc', data);
        
        const { sectionId, parentId, componentId, props, ...rest } = data;

        const updateData: Prisma.BlocTemplateUpdateInput = {
            ...rest,
        };

        if (rest.is_custom === true) {
            updateData.section = { disconnect: true };
        }else if (sectionId) {
            updateData.section = { connect: { id: sectionId } };
        }

        if (parentId) {
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

}