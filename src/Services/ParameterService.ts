import type { ParameterPayload } from "../Types/Parameter.ts";
import prisma from "../Utils/PrismaClient.ts";



export default class ParameterService {
    public async getParameters() {
        return prisma.parameter.findFirst()
    }

    public async updateParameters(data: ParameterPayload) {
        return prisma.parameter.upsert({
            where: { id: 1 },
            update: data,
            create: {
                ...data
            }
        });
    }
}