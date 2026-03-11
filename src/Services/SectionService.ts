import prisma from "../Utils/PrismaClient.ts";
import type { Section, RegisterSection, UpdateSection, SectionProps } from "../Types/Section.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import type { QueryFilters } from "../Utils/queryFilter.ts";
import { Paginator } from "../Utils/Paginator.ts";
import BlocTemplateService from "./BlocTemplateService.ts";

export default class SectionService {
    
    static castingSection(data : any): Section {
        // Casting des blocs inclus dans la section si présents
        let blocTemplates = data.blocTemplates;
        if (blocTemplates) {
            blocTemplates = BlocTemplateService.castingBlocTemplates(blocTemplates);
        }

        return {
            ...data,   
            block_json: data.block_json as unknown as SectionProps,
            blocTemplates: blocTemplates
        } as Section;
    }

    static castingSections(items:any[]):Section[]{
        return items.map(item => this.castingSection(item));
    }

    private buildWhereClause(filter?:QueryFilters): Prisma.SectionWhereInput {
        const where: Prisma.SectionWhereInput = {};

        if (filter?.search?.trim()) {
            const query = filter.search.trim();
            where.OR = [];
        }

        return where;
    }

    public async createSection(data: RegisterSection): Promise<Section> {
        const section = await prisma.section.create({
           data:{
            ...data,
            block_json: data.block_json as unknown as Prisma.InputJsonValue || {}
           }
        });

        return SectionService.castingSection(section);
    }

    public async getSections(filter?:QueryFilters){
        const data = await Paginator.paginate<Section>(prisma.section, {
            page: filter?.page,
            limit: filter?.limit,
            // where: this.buildWhereClause(filter),
            orderBy: { createdAt: 'desc' }
        });

        return {
            ...data,
            results: SectionService.castingSections(data.results)
        };
    }

    public async getSectionById(id: number): Promise<Section | null> {
        const item = await prisma.section.findUnique({
            where: { id },
            include: {
                blocTemplates: {
                    include: {
                        component: true,
                        model: true,
                        children: true
                    }
                }
            }
        });

        if (!item) return null;

        return SectionService.castingSection(item);
    }

    public async getSectionByRevisionId(revisionId: number):Promise<Section[]> {
        const sections = await prisma.section.findMany({
            where: { pageRevisionId: revisionId },
            include: { 
                blocTemplates: {
                    where: { parentId: null }, // Uniquement les blocs racines
                    include: { 
                        component: true,
                        model: true,
                        children: {
                            include: {
                                component: true,
                                model: true,
                                children: true
                            }
                        }
                    }
                }
            }
        });

        if (!sections) return [];

        return SectionService.castingSections(sections);
    }

    public async updateSection(id: number, data: UpdateSection): Promise<Section> {
        const sectionUpdated = await prisma.section.update({
            where: { id },
            data: {
                 ...data,
                 block_json: data.block_json as unknown as Prisma.InputJsonValue,
            },
            include: {
                blocTemplates: {
                    include: {
                        component: true,
                        model: true,
                        children: true
                    }
                }
            }
        });

        return SectionService.castingSection(sectionUpdated);
    }

    public async deleteSection(id: number): Promise<Section> {
        const sectionDeleted = await prisma.section.delete({
            where: { id }
        });

        return SectionService.castingSection(sectionDeleted);
    }
}