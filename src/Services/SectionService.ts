import prisma from "../Utils/PrismaClient.ts";
import type { ISection, IRegisterSection, IUpdateSection } from "../Types/Section.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import type { QueryFilters } from "../Utils/queryFilter.ts";
import { Paginator } from "../Utils/Paginator.ts";




export default class SectionService {
    
    static castingSection(data : any): ISection {
        return {
            ...data,   
            block_json: data.block_json as unknown as ISection['block_json'],
        } as ISection;
    }

    static castingSections(items:any[]):ISection[]{
        return items.map(item => ({
            ...item,
            block_json: item.block_json as unknown as ISection['block_json'],
        })) as ISection[];
    }

    private buildWhereClause(filter?:QueryFilters): Prisma.SectionWhereInput {
        const where: Prisma.SectionWhereInput = {};

        if (filter?.search?.trim()) {
            const query = filter.search.trim();
            where.OR = [
                // { name: { contains: query } },
                // { tag: { contains: query } },
                // { description: { contains: query } }
            ];
        }

        return where;
    }

    public async createSection(data: IRegisterSection): Promise<ISection> {
        const section = await prisma.section.create({
           data:{
            ...data,
            block_json: data.block_json as unknown as Prisma.InputJsonValue
           }
        });

        return SectionService.castingSection(section);
    }

    public async getSections(filter?:QueryFilters){
        const data = await Paginator.paginate<ISection>(prisma.section, {
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

    public async getSectionById(id: number): Promise<ISection | null> {
        const item = await prisma.section.findUnique({
            where: { id }
        });

        if (!item) return null;

        return SectionService.castingSection(item);
    }

    public async updateSection(id: number, data: IUpdateSection): Promise<ISection> {
        const sectionUpdated = await prisma.section.update({
            where: { id },
            data: {
                 ...data,
                 block_json: data.block_json as unknown as Prisma.InputJsonValue,
            }
        });

        return SectionService.castingSection(sectionUpdated);
    }

    public async deleteSection(id: number): Promise<ISection> {
        const sectionDeleted = await prisma.section.delete({
            where: { id }
        });

        return SectionService.castingSection(sectionDeleted);
    }
}