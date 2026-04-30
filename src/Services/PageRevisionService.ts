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

    public async syncPageRevisionTree(pageRevisionId: number, data: { sections: any[] }): Promise<any[]> {
        const { default: SectionService } = await import("./SectionService.ts");
        const { default: BlocTemplateService } = await import("./BlocTemplateService.ts");

        const sectionService = new SectionService();
        const blocTemplateService = new BlocTemplateService();

        // 1. Collect valid IDs from payload
        const validSectionIds: number[] = [];
        const validBlocIds: number[] = [];

        function collectBlocIds(blocks: any[]) {
            for (const b of blocks) {
                if (typeof b.blocTemplateId === 'number') {
                    validBlocIds.push(b.blocTemplateId);
                }
                if (b.children && Array.isArray(b.children)) {
                    collectBlocIds(b.children);
                }
            }
        }

        for (const s of data.sections) {
            if (typeof s.sectionId === 'number') validSectionIds.push(s.sectionId);
            if (s.children && Array.isArray(s.children)) {
                collectBlocIds(s.children);
            }
        }

        // 2. Delete removed sections & blocks
        // Retrieve existing sections
        const existingSections = await prisma.section.findMany({
            where: { pageRevisionId }
        });
        const existingSectionIds = existingSections.map(s => s.id);

        // Delete blocks of these sections that are not in validBlocIds
        if (existingSectionIds.length > 0) {
            await prisma.blocTemplate.deleteMany({
                where: {
                    sectionId: { in: existingSectionIds },
                    id: { notIn: validBlocIds }
                }
            });
        }

        // Delete sections not in validSectionIds
        await prisma.section.deleteMany({
            where: {
                pageRevisionId,
                id: { notIn: validSectionIds }
            }
        });

        // 3. Upsert Sections and Blocks
        async function syncBlocks(blocks: any[], parentId: number | null, sectionId: number | undefined, is_custom: boolean) {
            for (let i = 0; i < blocks.length; i++) {
                const node = blocks[i];
                let currentBlocId = node.blocTemplateId;

                const payload = {
                    componentId: node.componentDefinitionId || node.componentId, // Fallback
                    order: node.order ?? i,
                    parentId,
                    sectionId: is_custom ? undefined : sectionId,
                    is_custom,
                    props: {
                        styles: node.styles || {},
                        data: node.data || {},
                        params: node.params || []
                    },
                    modelId: node.modelId ?? null
                };

                if (typeof currentBlocId !== 'number') {
                    // Create
                    const newBloc = await blocTemplateService.createBlocTemplate(payload as any);
                    currentBlocId = newBloc.id;
                    node.blocTemplateId = currentBlocId;
                    // Force update to handle props natively since create ignores them in service sometimes
                    await blocTemplateService.updateBlocTemplate(currentBlocId, payload as any);
                } else {
                    // Update: on gère les race conditions si le bloc a été supprimé localement mais qu'un undo le renvoie
                    try {
                        await blocTemplateService.updateBlocTemplate(currentBlocId, payload as any);
                    } catch (error: any) {
                        if (error.code === 'P2025') {
                            // Le bloc n'existe plus en BDD, on le recrée silencieusement au lieu de crasher
                            const recreatedBloc = await blocTemplateService.createBlocTemplate(payload as any);
                            node.blocTemplateId = recreatedBloc.id;
                            await blocTemplateService.updateBlocTemplate(node.blocTemplateId, payload as any);
                        } else {
                            throw error;
                        }
                    }
                }

                if (node.children && Array.isArray(node.children)) {
                    await syncBlocks(node.children, currentBlocId, sectionId, is_custom);
                }
            }
        }

        for (let i = 0; i < data.sections.length; i++) {
            const sectionNode = data.sections[i];
            let currentSectionId = sectionNode.sectionId;

            const sectionPayload = {
                pageRevisionId,
                order: sectionNode.order ?? i,
                block_json: { styles: sectionNode.styles || {} }
            };

            if (typeof currentSectionId !== 'number') {
                const newSection = await sectionService.createSection(sectionPayload as any);
                currentSectionId = newSection.id;
                sectionNode.sectionId = currentSectionId;
                await sectionService.updateSection(currentSectionId, sectionPayload as any);
            } else {
                try {
                    await sectionService.updateSection(currentSectionId, sectionPayload as any);
                } catch (error: any) {
                    if (error.code === 'P2025') {
                        const newSection = await sectionService.createSection(sectionPayload as any);
                        currentSectionId = newSection.id;
                        sectionNode.sectionId = currentSectionId;
                        await sectionService.updateSection(currentSectionId, sectionPayload as any);
                    } else {
                        throw error;
                    }
                }
            }

            if (sectionNode.children && Array.isArray(sectionNode.children)) {
                await syncBlocks(sectionNode.children, null, currentSectionId, false);
            }
        }

        // 4. Construct response tree (same as `fetchAll` inside frontend)
        const updatedSections = await prisma.section.findMany({
            where: { pageRevisionId },
            orderBy: { order: 'asc' }
        });

        const syncedTree = [];
        for (const s of updatedSections) {
            const rootNodesJSON = await blocTemplateService.getTreeSection(s.id);
            // buildTreeFromTemplates in frontend transforms this, but we'll return what frontend `fetchTree` parses.
            // Oh, wait, frontend `fetchTree` expects flat array & `buildTreeFromTemplates`. 
            // Better yet, we can rebuild the hydrated nodes exactly like building tree from templates, 
            // OR we just return the flat arrays inside the section and the frontend will do its exact normal parsing logic!
            
            syncedTree.push({
                id: sectionNodeIdOverride(s.id), // UUID generator can't be used securely here, frontend reconstructs the UUIDs on fetchAll
                sectionId: s.id,
                order: s.order,
                family: 'section',
                styles: (s.block_json as any)?.styles || {},
                children: rootNodesJSON // For the moment, we return it. Frontend `buildTreeFromTemplates` will process this
            });
        }

        return syncedTree;
    }
}

function sectionNodeIdOverride(sectionId: number) {
    return 'temp-' + sectionId;
}