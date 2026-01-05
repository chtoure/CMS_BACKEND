import prisma from "../Utils/PrismaClient.ts"
import type { CollectionPayload } from "../Types/Collection.ts"

export default class CollectionService {
    public async createCollection(data: CollectionPayload) {
        return prisma.collection.create({
            data,
            include: { variables: true }
        });
    }

    // public async getAllCollections() {
    //     return prisma.collection.findMany({
    //         include: { 
    //             variables: true 
    //         },
    //         orderBy: { createdAt: 'desc' }
    //     });
    // }


    // CollectionService.ts

    public async getAllCollections(search?: string) {
        if (!search || search.trim() === "") {
            return prisma.collection.findMany({
                include: { variables: true },
                orderBy: { createdAt: 'desc' }
            });
        }

        const query = search.trim();

        return prisma.collection.findMany({
            where: {
                variables: {
                    some: {
                        OR: [
                            { name: { contains: query } }, // 'mode' supprimé ici
                            { value: { contains: query } } // 'mode' supprimé ici
                        ]
                    }
                }
            },
            include: {
                variables: {
                    where: {
                        OR: [
                            { name: { contains: query } },
                            { value: { contains: query } }
                        ]
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    public async getCollectionById(id: number) {
        return prisma.collection.findUnique({
            where: { id },
            include: { variables: true }
        });
    }

    public async deleteCollection(id: number) {
        return prisma.collection.delete({
            where: { id }
        });
    }
}