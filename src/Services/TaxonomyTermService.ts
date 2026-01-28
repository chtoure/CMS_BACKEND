
import prisma from "../Utils/PrismaClient.ts";
import type { TaxonomyTerm, RegisterTaxonomyTerm, UpdateTaxonomyTerm } from "../Types/Taxonomy.ts";
import type { BatchPayload } from "../generated/prisma/internal/prismaNamespace.ts";

export default class TaxonomyTermService {

    static castingTerm(data: any): TaxonomyTerm {
        return {
            ...data
        } as TaxonomyTerm;
    }

    static castingTerms(items: any[]): TaxonomyTerm[] {
        return items.map(item => TaxonomyTermService.castingTerm(item));
    }

    // Create many terms
    public async createTerms(data: RegisterTaxonomyTerm[]): Promise<BatchPayload> {
        return await prisma.taxonomyTerm.createMany({
            data: data
        });
    }   

    // Create
    public async createTerm(data: RegisterTaxonomyTerm): Promise<TaxonomyTerm> {
        const item = await prisma.taxonomyTerm.create({
            data: data
        });

        return TaxonomyTermService.castingTerm(item);
    }

    // Get all terms by Taxonomy ID
    public async getTermsByTaxonomy(taxonomyId: number): Promise<TaxonomyTerm[]> {
        const items = await prisma.taxonomyTerm.findMany({
            where: { taxonomyId }
        });

        return TaxonomyTermService.castingTerms(items);
    }

    // Get by ID
    public async getTermById(id: number): Promise<TaxonomyTerm | null> {
        const item = await prisma.taxonomyTerm.findUnique({
            where: { id }
        });

        if (!item) return null;

        return TaxonomyTermService.castingTerm(item);
    }

    // Get by slug
    public async getTermBySlug(slug: string): Promise<TaxonomyTerm | null> {
        const item = await prisma.taxonomyTerm.findUnique({
            where: { slug }
        });

        if (!item) return null;

        return TaxonomyTermService.castingTerm(item);
    }

    // Update
    public async updateTerm(id: number, data: UpdateTaxonomyTerm): Promise<TaxonomyTerm> {
        const item = await prisma.taxonomyTerm.update({
            where: { id },
            data: data
        });

        return TaxonomyTermService.castingTerm(item);
    }


    // Dans TaxonomyTermService.ts
    public async updateTerms(taxonomyId: number, termsData: { name: string, slug: string }[]) {
        // On utilise la table Taxonomy pour mettre à jour ses relations
        return await prisma.taxonomy.update({
            where: { id: taxonomyId },
            data: {
                terms: {
                    // 1. On supprime les anciens termes liés
                    deleteMany: {}, 
                    // 2. On crée les nouveaux
                    create: termsData 
                }
            }
        });
    }




    // Delete
    public async deleteTerm(id: number): Promise<TaxonomyTerm> {
        const item = await prisma.taxonomyTerm.delete({
            where: { id }
        });

        return TaxonomyTermService.castingTerm(item);
    }



    
    public async deleteTerms(taxonomyId: number): Promise<BatchPayload> {
        return prisma.taxonomyTerm.deleteMany({
            where: { taxonomyId }
        });

    }

    public async getTaxonomyTermsByTaxonomyIds(taxonomyIds: number[]): Promise<TaxonomyTerm[] | null> {
        const item = await prisma.taxonomyTerm.findMany({
            where: { 
                taxonomyId: { in: taxonomyIds },
                taxonomy: { archive: false } },
        });
        return item;
    }
}
