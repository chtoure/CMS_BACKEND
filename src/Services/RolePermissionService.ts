
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


    static async createRolePermsByRoleId(roleId:number, permissionIds:number[]): Promise<Prisma.BatchPayload>{
        return prisma.rolePermission.createMany({
            data: permissionIds.map(permissionId => ({
                roleId,
                permissionId
            }))
        })
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

    // Supprimer une relation (RolePermission) spécifique
    static async deleteRolePermission(whereData:{roleId:number,permissionId:number}):Promise<Prisma.BatchPayload> {
        return prisma.rolePermission.updateMany({
            where:{roleId:whereData.roleId,permissionId:whereData.permissionId,archive:false},
            data:{
                archive: true,
                archivedAt: new Date()
            }
        })
    }


    // Restore une relation (RolePermission) spécifique
    static async restoreRolePermission(whereData:{roleId:number,permissionId:number}):Promise<Prisma.BatchPayload> {
        return prisma.rolePermission.updateMany({
            where:{roleId:whereData.roleId , permissionId:whereData.permissionId , archive:true },
            data:{
                archive: false,
                archivedAt: null
            }
        })
    }
}