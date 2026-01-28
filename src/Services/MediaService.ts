import type { Prisma } from "../generated/prisma/client.ts";
import type { Media, MediaPayload } from "../Types/Media.ts"
import { Paginator } from "../Utils/Paginator.ts";
import prisma from "../Utils/PrismaClient.ts"
import type { QueryFilters } from "../Utils/queryFilter.ts";

export default class MediaService {

    private buildWhereClause(filters?: QueryFilters): Prisma.MediaWhereInput {

        const where: Prisma.MediaWhereInput = {};
        if(filters?.type && filters.type.length > 0) where.type = { in: filters.type };

        if (filters?.search?.trim()) {
            const query = filters.search.trim();
            where.OR = [
                { file_path: { contains: query } }
            ];
        }

        return where;
    }

    public async createMedia(media: MediaPayload): Promise<Media | null> {
        return prisma.media.create({
            data: media
        });
    }

    public async updateMedia(id: number, media: MediaPayload): Promise<Media | null> {
        return prisma.media.update({
            where: { id },
            data: media
        })
    }

    public async deleteMedia(id: number): Promise<Media | null> {
        return prisma.media.delete({
            where: { id }
        })
    }

    public async deleteMedias(ids: number[]): Promise<number | null> {
        const result = await prisma.media.deleteMany({
            where: {
                id: { in: ids }
            }
        });
        return result.count;
    }

    public async getMediaById(id: number): Promise<Media | null> {
        return prisma.media.findUnique({
            where: { id }
        })
    }

    public async getMediaByIds(ids: number[]): Promise<Media[]> {
        return prisma.media.findMany({
            where: {
                id: { in: ids }
            }
        });
    }

    public async getAllMedia(filters?: QueryFilters) {
        return Paginator.paginate<Media>(prisma.media, {
            page: filters?.page,
            limit: filters?.limit,
            where:this.buildWhereClause(filters),
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    public async countMedia(type: 'video' | 'image' | 'document' | 'archive' | null): Promise<number> {
        return prisma.media.count({
            where: type ? { type } : {}
        });
    }
}