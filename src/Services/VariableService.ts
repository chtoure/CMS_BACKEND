import prisma from "../Utils/PrismaClient.ts"
import type { VariablePayload } from "../Types/Variable.ts"

export default class VariableService {
    public async createVariable(data: VariablePayload) {
        return prisma.variable.create({
            data
        });
    }

    public async updateVariable(id: number, data: Partial<VariablePayload>) {
        return prisma.variable.update({
            where: { id },
            data
        });
    }

    public async deleteVariable(id: number) {
        return prisma.variable.delete({
            where: { id }
        });
    }

    public async deleteVariables(ids: number[]): Promise<number> {
        const result = await prisma.variable.deleteMany({
            where: {
                id: { in: ids }
            }
        });
        return result.count;
    }

    public async getVariablesByCollection(collectionId: number) {
        return prisma.variable.findMany({
            where: { collectionId },
            orderBy: { name: 'asc' }
        });
    }

    public async getVariableById(id: number) {
        return prisma.variable.findUnique({
            where : {id}
        })
    }

    public async getAllVariables() {
        return prisma.variable.findMany({
            orderBy: { name: 'asc' }
        });
    }
}