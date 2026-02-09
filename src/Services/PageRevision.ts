import { Paginator } from "../Utils/Paginator.ts";
import type { IPageRevision, IRegisterPageRevision, IUpdatePageRevision } from "../Types/PageRevision.ts";
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
    
    public async createPageRevision(data: IRegisterPageRevision): Promise<IPageRevision> {
       return prisma.pageRevision.create({
            data
        });

    }

    public async getPageRevisions(filter?:QueryFilters){
        const data = await Paginator.paginate<IPageRevision>(prisma.pageRevision, {
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

    public async getPageRevisionById(id: number): Promise<IPageRevision | null> {
        const item = await prisma.pageRevision.findUnique({
            where: { id }
        });

        if (!item) return null;

        return item;
    }

    public async updatePageRevision(id: number, data: IUpdatePageRevision): Promise<IPageRevision> {
        const pageRevisionUpdated = await prisma.pageRevision.update({
            where: { id },
            data
        });

        return pageRevisionUpdated;
    }

    public async deletePageRevision(id: number): Promise<IPageRevision> {
        const pageRevisionDeleted = await prisma.pageRevision.delete({
            where: { id }
        });

        return pageRevisionDeleted;
    }
}