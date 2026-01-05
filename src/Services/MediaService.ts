import type  { Media, MediaPayload } from "../Types/Media.ts"
import prisma from "../Utils/PrismaClient.ts"


export default class MediaService {

    public async createMedia(media:MediaPayload): Promise<Media | null>{
        return prisma.media.create({
            data: media
        }); 
    }

    public async updateMedia(id:number, media:MediaPayload): Promise<Media | null>{
        return prisma.media.update({
            where:{id},
            data:media
        })
    }

    public async deleteMedia(id:number):Promise<Media | null>{
        return prisma.media.delete({
            where:{id}
        })
    }

    public async deleteMedias(ids:number[]):Promise< number | null >{
        const result = await prisma.media.deleteMany({
            where: {
                id: { in: ids }
            }
        });
        return result.count;
    }

    public async getMediaById(id:number): Promise<Media | null>{
        return prisma.media.findUnique({
            where:{id}
        })
    }

    public async getMediaByIds(ids:number[]): Promise<Media[]>{
        return prisma.media.findMany({
            where:{
                id: { in: ids }
            }
        });
    }

    public async getAllMedia(type:'video' | 'image' | null): Promise<Media[]>{
        return prisma.media.findMany({
            where: type ? { type } : {}
        });
    }
}