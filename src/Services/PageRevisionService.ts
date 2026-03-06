import { Paginator } from "../Utils/Paginator.ts";
import type { PageRevision, RegisterPageRevision, UpdatePageRevision } from "../Types/PageRevision.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import type { QueryFilters } from "../Utils/queryFilter.ts";
import prisma from "../Utils/PrismaClient.ts";


export default class PageRevisionService {


    private buildWhereClause(filter?:QueryFilters): Prisma.PageRevisionWhereInput {
        const where: Prisma.PageRevisionWhereInput = {};

        if (filter?.status) {
            where.status = filter.status as any;
        } else {
            where.status = { not: "ARCHIVED" } as any;
        }


        return where;
    }
    
    public async createPageRevision(data: RegisterPageRevision): Promise<PageRevision> {
       return prisma.pageRevision.create({
            data
        });

    }

    public async getPageRevisions(filter?:QueryFilters){
        const data = await Paginator.paginate<PageRevision>(prisma.pageRevision, {
            page: filter?.page,
            limit: filter?.limit,
            where: this.buildWhereClause(filter),
            orderBy: { createdAt: 'desc' },
            include: { sections: true }
        });

        return {
            ...data,
            results: data.results
        };
    }

    public async getPageRevisionById(id: number): Promise<PageRevision | null> {
        const item = await prisma.pageRevision.findUnique({
            where: { id },
            include:{ sections: true}
        });

        if (!item) return null;

        return item as unknown as PageRevision;
    }

    public async getPageRevisionsByPageId(id: number, filter?:QueryFilters) {
        const data = await Paginator.paginate<PageRevision>(prisma.pageRevision, {
            page: filter?.page,
            limit: filter?.limit,
            where: {
                ...this.buildWhereClause(filter),
                pageId: id
            },
            orderBy: { createdAt: 'desc' },
            include: { 
                sections: true,
                user: true
            }
        });

        return {
            ...data,
            results: data.results
        };

    }

    public async updatePageRevision(id: number, data: UpdatePageRevision): Promise<PageRevision> {
        const pageRevisionUpdated = await prisma.pageRevision.update({
            where: { id },
            data
        });

        return pageRevisionUpdated;
    }

    public async deletePageRevision(id: number): Promise<PageRevision> {
        const pageRevisionDeleted = await prisma.pageRevision.delete({
            where: { id }
        });

        return pageRevisionDeleted;
    }

}