import { Paginator } from "../Utils/Paginator.ts";
import type { IPage, IRegisterPage, IUpdatePage } from "../Types/page.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import type { QueryFilters } from "../Utils/queryFilter.ts";
import prisma from "../Utils/PrismaClient.ts";


export default class PageService {


    private buildWhereClause(filter?:QueryFilters): Prisma.PageWhereInput {
        const where: Prisma.PageWhereInput = {};

        if (filter?.search?.trim()) {
            const query = filter.search.trim();
            where.OR = [
                { title: { contains: query } },
                { slug: { contains: query } },
            ];
        }

        return where;
    }
    
    public async createPage(data: IRegisterPage): Promise<IPage> {
       return prisma.page.create({
            data
        });

    }

    public async getPages(filter?:QueryFilters){
        const data = await Paginator.paginate<IPage>(prisma.page, {
            page: filter?.page,
            limit: filter?.limit,
            where: this.buildWhereClause(filter),
            orderBy: { createdAt: 'desc' }
        });

        return {
            ...data,
            results: data.results
        };
    }

    public async getPageById(id: number): Promise<IPage | null> {
        const item = await prisma.page.findUnique({
            where: { id }
        });

        if (!item) return null;

        return item;
    }

    public async updatePage(id: number, data: IUpdatePage): Promise<IPage> {
        const pageUpdated = await prisma.page.update({
            where: { id },
            data
        });

        return pageUpdated;
    }

    public async deletePage(id: number): Promise<IPage> {
        const pageDeleted = await prisma.page.delete({
            where: { id }
        });

        return pageDeleted;
    }
}

