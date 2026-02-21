import { Paginator } from "../Utils/Paginator.ts";
import type { Page, RegisterPage, UpdatePage } from "../Types/page.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import type { QueryFilters } from "../Utils/queryFilter.ts";
import prisma from "../Utils/PrismaClient.ts";


export default class PageService {

    private buildWhereClause(filter?:QueryFilters): Prisma.PageWhereInput {
        const where: Prisma.PageWhereInput = {};

        if (filter?.search?.trim()) {
            const query = filter.search.trim();
            where.OR = [
                { name: { contains: query } },
                { slug: { contains: query } },
                { 
                    user: { 
                        full_name: { 
                            contains: query,
                        } 
                    } 
                }
            ];
        }

        return where;
    }
    
    public async createPage(data: RegisterPage): Promise<Page> {
       return prisma.page.create({
            data:{
                ...data,
                pageRevisions:{
                    create:{
                        userId: data.userId
                    }
                }
            },
            include: { pageRevisions: true } 
        });
    }

    public async getPages(filter?:QueryFilters){
        const data = await Paginator.paginate<Page>(prisma.page, {
            page: filter?.page,
            limit: filter?.limit,
            where: this.buildWhereClause(filter),
            orderBy: { createdAt: 'desc' },
            include: { 
                pageRevisions: true,
                user: true
             }
        });

        return {
            ...data,
            results: data.results
        };
    }

    public async getPageById(id: number): Promise<Page | null> {
        const item = await prisma.page.findUnique({
            where: { id },
            include: { 
                pageRevisions: true, 
                user: true
            }
        });

        if (!item) return null;

        return item;
    }

    public async updatePage(id: number, data: UpdatePage): Promise<Page> {
        const pageUpdated = await prisma.page.update({
            where: { id },
            data
        });

        return pageUpdated;
    }

    public async deletePage(id: number): Promise<Page> {
        const pageDeleted = await prisma.page.delete({
            where: { id }
        });

        return pageDeleted;
    }
}

