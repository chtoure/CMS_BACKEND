import prisma from "../Utils/PrismaClient.ts";
import { Prisma } from "../generated/prisma/client.ts";
import type { 
    ContentEntry, 
    IContentData, 
    RegisterContentEntry, 
    UpdateContentEntry 
} from "../Types/ContentEntry.ts";
import type { IFieldDefinition } from "../Types/InputField.ts";
import { Paginator } from "../Utils/Paginator.ts";
import type { QueryFilters } from "../Utils/queryFilter.ts";

export default class ContentEntryService {

    private buildWhereClause(contentTypeId?: number, filters?: QueryFilters): Prisma.ContentEntryWhereInput {
        const where: Prisma.ContentEntryWhereInput = {};

        if (contentTypeId) where.contentTypeId = contentTypeId;

        if (filters?.status) {
            where.status = filters.status as any;
        } else {
            where.status = { not: "ARCHIVED" } as any;
        }

        if (filters?.search?.trim()) {
            const query = filters.search.trim();
            where.OR = [
                { data_json: { path: '$.title', string_contains: query } },
                { data_json: { path: '$.name', string_contains: query } },
                { data_json: { path: '$.content', string_contains: query } },
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

    public async getEntries(contentTypeId?: number, filters?: QueryFilters) {
        return Paginator.paginate<ContentEntry>(prisma.contentEntry, {
            page: filters?.page,
            limit: filters?.limit,
            where: this.buildWhereClause(contentTypeId, filters),
            include: { user: true, contentType: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    private async syncRelations(tx: Prisma.TransactionClient, entryId: number,contentTypeId : number, dataJson: IContentData) {
        const ct = await tx.contentType.findUnique({
            where: { id: contentTypeId },
            select: { fields_schema: true }
        });

        if (!ct?.fields_schema) return;

        const fields = (typeof ct.fields_schema === 'string' 
            ? JSON.parse(ct.fields_schema) 
            : ct.fields_schema) as IFieldDefinition[];

        const relationFields = fields.filter(f => f.type === 'relation' || f.type === 'media' || f.type === 'taxonomy');
        const relationsToCreate: Prisma.ContentEntryRelationCreateManyInput[] = [];

        relationFields.forEach(field => {
            const val = dataJson[field.name];
            if (val === undefined || val === null) return;

            const ids = Array.isArray(val) ? val : [val];
            
            ids.forEach(id => {
                const numericId = Number(id);
                if (!isNaN(numericId)) {
                    relationsToCreate.push({
                        sourceId: entryId,
                        fieldName: field.name,
                        targetEntryId: field.type === 'relation' ? numericId : null,
                        targetMediaId: field.type === 'media' ? numericId : null,
                        targetTaxonomyId: field.type === 'taxonomy' ? numericId : null,
                    });
                }
            });
        });

        await tx.contentEntryRelation.deleteMany({ where: { sourceId: entryId } });
        
        if (relationsToCreate.length > 0) {
            await tx.contentEntryRelation.createMany({ data: relationsToCreate });
        }
    }

    private async syncTaxonomyTerm(tx: Prisma.TransactionClient, entryId: number, contentTypeId: number, dataJson: IContentData): Promise<void> {
        const ct = await tx.contentType.findUnique({
            where: { id: contentTypeId },
            select: { fields_schema: true }
        });

        if (!ct?.fields_schema) return;

        const fields = (typeof ct.fields_schema === 'string'
            ? JSON.parse(ct.fields_schema)
            : ct.fields_schema) as IFieldDefinition[];

        const taxonomyFields = fields.filter(f => f.type === 'taxonomy');
        const termIdsToConnect: number[] = [];

        for (const field of taxonomyFields) {
            const val = dataJson[field.name];
            if (val === undefined || val === null) continue;

            const ids = Array.isArray(val) ? val.map(Number) : [Number(val)];
            const validIds = ids.filter(id => !isNaN(id));

            if (validIds.length === 0) continue;

            const validTerms = await tx.taxonomyTerm.findMany({
                where: {
                    id: { in: validIds },
                    taxonomy: { slug: (field as any).taxonomy_slug }
                },
                select: { id: true }
            });

            termIdsToConnect.push(...validTerms.map(t => t.id));
        }

        await tx.contentEntry.update({
            where: { id: entryId },
            data: {
                taxonomyTerms: {
                    set: termIdsToConnect.map(id => ({ id }))
                }
            }
        });
    }
    

    public async createContentEntry(data: RegisterContentEntry): Promise<ContentEntry> {
        return prisma.$transaction(async (tx) => {
            const entry = await tx.contentEntry.create({
                data: data as unknown as Prisma.ContentEntryCreateInput
            });
            await this.syncRelations(tx, entry.id, data.contentTypeId, data.data_json as IContentData);
            await this.syncTaxonomyTerm(tx, entry.id, data.contentTypeId, data.data_json as IContentData);
            return entry as unknown as ContentEntry;
        });
    }

    public async updateContentEntry(id: number, data: UpdateContentEntry): Promise<ContentEntry> {
        return prisma.$transaction(async (tx) => {
            const entry = await tx.contentEntry.update({
                where: { id },
                data: data as Prisma.ContentEntryUpdateInput
            });
            if (data.data_json && entry.contentTypeId) {
                await this.syncRelations(tx, id, entry.contentTypeId, data.data_json as IContentData);
                await this.syncTaxonomyTerm(tx, id, entry.contentTypeId, data.data_json as IContentData);
            }
            return entry as unknown as ContentEntry;
        });
    }

    public async deleteContentEntry(id: number): Promise<ContentEntry> {
        const usages = await prisma.contentEntryRelation.findMany({
            where: { targetEntryId: id },
            include: { source: { select: { id: true, data_json: true } } }
        });

        if (usages.length > 0) {
            const names = usages.map(u => (u.source.data_json as any)?.title || `ID: ${u.source.id}`);
            throw new Error(`Suppression impossible : ce contenu est lié à "${names.join(', ')}"`);
        }

        return prisma.contentEntry.delete({ where: { id } });
    }

    public async getContentEntryById(id: number): Promise<ContentEntry | null> {
        const entry = await prisma.contentEntry.findUnique({
            where: { id },
            include: { 
                contentType: true, 
                user: true,
                outgoingRelations: { 
                    include: { 
                        targetEntry: true, 
                        targetMedia: true 
                    } 
                } 
            }
        });
        return entry as unknown as ContentEntry | null;
    }

    public async updateStatus(id: number, status: string): Promise<ContentEntry> {
        return prisma.contentEntry.update({
            where: { id },
            data: { 
                status: status as any,
                ...(status === "ARCHIVED" ? { archivedAt: new Date() } : { archivedAt: null })
            }
        });
    }

    public async toggleArchive(id: number): Promise<ContentEntry> {
        const currentEntry = await prisma.contentEntry.findUnique({
            where: { id },
            select: { id: true, status: true }
        });

        if (!currentEntry) throw new Error("Contenu introuvable.");

        const isCurrentlyArchived = currentEntry.status === 'ARCHIVED';

        if (!isCurrentlyArchived) {
            
            const activeUsages = await prisma.contentEntryRelation.findMany({
                where: {
                    targetEntryId: id,
                    source: {
                        status: { in: ['PUBLISHED', 'DRAFT'] }
                    }
                },
                include: {
                    source: { select: { id: true, data_json: true, status: true } }
                }
            });

            if (activeUsages.length > 0) {
                const names = activeUsages.map(u => (u.source.data_json as any)?.title || `ID: ${u.source.id}`);
                throw new Error(`Archivage bloqué : Ce contenu est utilisé par des éléments actifs : "${names.join(', ')}".`);
            }

            return this.updateStatus(id, "ARCHIVED");

        } else {

            const archivedDependencies = await prisma.contentEntryRelation.findMany({
                where: {
                    sourceId: id,
                    targetEntry: { status: 'ARCHIVED' }
                },
                include: {
                    targetEntry: { select: { id: true, data_json: true } }
                }
            });

            if (archivedDependencies.length > 0) {
                const names = archivedDependencies.map(d => (d.targetEntry?.data_json as any)?.title || `ID: ${d.targetEntryId}`);
                throw new Error(`Désarchivage impossible : Ce contenu dépend de l'élément archivé "${names.join(', ')}".`);
            }

            return this.updateStatus(id, "DRAFT");
        }
    }
}