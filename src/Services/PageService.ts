import { Paginator } from "../Utils/Paginator.ts";
import type { Page, RegisterPage, UpdatePage } from "../Types/page.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import type { QueryFilters } from "../Utils/queryFilter.ts";
import prisma from "../Utils/PrismaClient.ts";
import BlocTemplateService from "./BlocTemplateService.ts";

const blocTemplateService = new BlocTemplateService();

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
                },
                navItem: {
                    create: {
                        label: data.name,
                        value: `${data.slug}`
                    }
                }
            },
            include: { pageRevisions: true, navItem: true } 
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


    public async renderPage(slug: string) {
        const page = await prisma.page.findUnique({
            where: { slug },
            include: { 
                pageRevisions: {
                    where: { status: 'PUBLISHED' },
                    include: {
                        sections: {
                            include: {
                                blocTemplates: {
                                    include: { component: true, model: true } // Important pour le tag
                                }
                            }
                        }
                    }
                }, 
            }
        });

        if (!page || !page.pageRevisions[0]) return null;

        const revision = page.pageRevisions[0];

        // Dans ton service Backend
        const layout = await Promise.all(
            revision.sections.map(async (section) => {
                // On récupère le JSON brut de la section
                const sectionProps = typeof section.block_json === 'string' 
                    ? JSON.parse(section.block_json) 
                    : section.block_json;

                return {
                    id: section.id,
                    order: section.order,
                    styles: sectionProps, 
                    data: {}, 
                    children: await blocTemplateService.buildRecursiveTree(
                        section.blocTemplates, 
                        null
                    )
                };
            })
        );

        // console.log('layout', JSON.stringify(layout, null, 2)); 

        // On retourne la page avec les sections transformées
        return {
            slug: page.slug,
            layout: layout // C'est ce JSON que le Frontend recevra
        };
    }
}

