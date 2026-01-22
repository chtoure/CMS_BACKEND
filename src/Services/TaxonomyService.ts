
import prisma from "../Utils/PrismaClient.ts";
import type { Taxonomy, RegisterTaxonomy, UpdateTaxonomy } from "../Types/Taxonomy.ts";
import { AppError } from "../Utils/ErrorPrisma.ts";
import type { QueryFilters } from "../Utils/queryFilter.ts";
import type { Prisma } from "../generated/prisma/client.ts";
import { Paginator } from "../Utils/Paginator.ts";

export default class TaxonomyService {

    static castingTaxonomy(data: any): Taxonomy {
        return {
            ...data,
            archive: Boolean(data.archive)
        } as Taxonomy;
    }

    static castingTaxonomies(items: any[]): Taxonomy[] {
        return items.map(item => TaxonomyService.castingTaxonomy(item));
    }

    // Create
    public async createTaxonomy(data: RegisterTaxonomy): Promise<Taxonomy> {
        const item = await prisma.taxonomy.create({
            data: data
        });

        return TaxonomyService.castingTaxonomy(item);
    }


    private buildWhereClause(filter?:QueryFilters): Prisma.TaxonomyWhereInput {
        const where: Prisma.TaxonomyWhereInput = {};

        if (filter?.archive !== undefined) {
            where.archive = filter.archive;
        }

        if (filter?.search?.trim()) {
            const query = filter.search.trim();
            where.OR = [
                { name: { contains: query } },
                { slug: { contains: query } }
            ];
        }

        return where;
    }
    

    // get permissions
    public async getTaxonomies(filter?:QueryFilters){
        const data = await Paginator.paginate<Taxonomy>(prisma.taxonomy, {
            page: filter?.page,
            limit: filter?.limit,
            where: this.buildWhereClause(filter),
            include: {terms: true},
            orderBy: { createdAt: 'desc' }
        });

        return {
            ...data,
            results: TaxonomyService.castingTaxonomies(data.results)
        };
    }


    // Get by ID
    public async getTaxonomyById(id: number): Promise<Taxonomy | null> {
        const item = await prisma.taxonomy.findUnique({
            where: { id, archive: false },
            include: {
                terms: true
            }
        });

        if (!item) return null;

        return TaxonomyService.castingTaxonomy(item);
    }

    

    // Get by slug
    public async getTaxonomyBySlug(slug: string): Promise<Taxonomy | null> {
        const item = await prisma.taxonomy.findUnique({
            where: { slug, archive: false }
        });

        if (!item) return null;

        return TaxonomyService.castingTaxonomy(item);
    }

    // Update
    public async updateTaxonomy(id: number, data: UpdateTaxonomy): Promise<Taxonomy> {
        const item = await prisma.taxonomy.update({
            where: { id },
            data: data
        });

        return TaxonomyService.castingTaxonomy(item);
    }

    // Archive
    public async archivedTaxonomy(id: number): Promise<Taxonomy> {
        const item = await prisma.taxonomy.update({
            where: { id, archive: false },
            data: {
                archive: true,
                archivedAt: new Date()
            }
        });

        return TaxonomyService.castingTaxonomy(item);
    }

    // Restore
    public async restoredTaxonomy(id: number): Promise<Taxonomy> {
        const item = await prisma.taxonomy.update({
            where: { id, archive: true },
            data: {
                archive: false,
                archivedAt: null
            }
        });

        return TaxonomyService.castingTaxonomy(item);
    }

    // Delete
    public async deleteTaxonomy(id: number): Promise<Taxonomy> {

        const itemASupprimer = await prisma.taxonomy.findUnique({
            where: { id, archive: true },
            include: {
                _count: {
                    select: {
                        terms: true,
                        contentTypes: true
                    }
                } 
            }
        });

        if (!itemASupprimer) throw new AppError("Taxonomy non trouvé ou non archivé.");

        if (itemASupprimer._count.terms > 0) throw new AppError("Suppression impossible : ce categorie a des termes.");
        if (itemASupprimer._count.contentTypes > 0) throw new AppError("Suppression impossible : ce categorie est utilisé par des types de contenu.");

        const item = await prisma.taxonomy.delete({
            where: { id, archive: true }
        });

        return TaxonomyService.castingTaxonomy(item);
    }
}
