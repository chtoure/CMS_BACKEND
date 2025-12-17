
import type { Prisma } from "../generated/prisma/client.ts";
import type { RolePermission } from "../Types/RolePermission.ts";
import prisma from "../Utils/PrismaClient.ts";



export default class RolePermissionService {


    static async CreateRolePermission(dataPermission:Prisma.RolePermissionUncheckedCreateInput): Promise<RolePermission>{
        return prisma.rolePermission.create({
            data:dataPermission
        });
    }


    static async CreateRolePermissions(dataPermissions:Prisma.RolePermissionUncheckedCreateInput[]): Promise<Prisma.BatchPayload> {
        return prisma.rolePermission.createMany({
            data:dataPermissions,
            //skipDuplicates: true, // Ignore les associations déjà existantes
        });
    }


    static async VerifyRolePermission(dataPermissions:Prisma.RolePermissionUncheckedCreateInput): Promise<RolePermission | null>{
        return prisma.rolePermission.findFirst({
            where:{
                roleId:dataPermissions.roleId,
                permissionId:dataPermissions.permissionId
            }
        });
    }


    static async updateRolePermission(id:number, dataRolePerms:{roleId?:number,permissionId?:number}): Promise<RolePermission | null> {
        return prisma.rolePermission.update({
            where:{id},
            data:dataRolePerms        
        })
    }

    // Supprimer toutes les relations (RolePermission) de role_id
    static async deleteRolePermsByRoleId(role_id:number):Promise<Prisma.BatchPayload> {
        return prisma.rolePermission.deleteMany({
            where:{roleId:role_id}
        })
    }

    
}