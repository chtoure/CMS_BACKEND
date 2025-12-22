
import type { Prisma } from "../generated/prisma/client.ts";
import type { Role } from "../Types/Role.ts";
import prisma from "../Utils/PrismaClient.ts";
import RolePermissionService from "./RolePermissionService.ts";


export default class RoleService {


    // Creation d'un role
    public async createRole(data: Prisma.RoleUncheckedCreateInput,permissionIds: number[] = []): Promise<Role> {
        const role = await prisma.role.create({
            data,
            include: {  
                permissions:true,
                users:true
             }
        });

        if (permissionIds.length > 0) {
            // Prépare les associations entre le rôle et les permissions
            const rolePermissionData = permissionIds.map((permissionId) => ({
                roleId: role.id,
                permissionId,
            }));
            // Insère en masse les associations
            await RolePermissionService.CreateRolePermissions(rolePermissionData);
        }

        return role;
    }


    // Recuperer tous les roles
    public async getAllRoles(): Promise<Role[]> {
       return prisma.role.findMany({
        include:{
            permissions:true,
            users:true
        }
       });
    }


    // Récupère un role par ID
    public async getRoleById(id: number): Promise<Role | null> {
        return prisma.role.findUnique({
            where:{id},
            include:{
                permissions:true,
                users:true
            }
        });
    }


    // Récupère un role par name
    public async getRoleByName(name: string): Promise<Role | null> {
        return prisma.role.findUnique({
            where:{name},
            include:{
                permissions:true,
                users:true
            }
        });
    }

    // Update Role
    public async updateRole(id:number, roleData:Prisma.RoleUpdateInput,permissionIds?: number[]): Promise<Role | null> {
        const roleUpdated = await prisma.role.update({
            where:{id},
            data:roleData,
            include:{
                permissions:true,
                users:true
            }
        });

        if (permissionIds) {

            // Supprime toutes les associations existantes de cet role
            await RolePermissionService.deleteRolePermsByRoleId(roleUpdated.id);
             // Ajoute les nouvelles associations
            const rolePermissionData = permissionIds.map((permissionId) => ({
                roleId: id,
                permissionId,
            }));
            await RolePermissionService.CreateRolePermissions(rolePermissionData);
        }
        return this.getRoleById(roleUpdated.id);
    }


    // Delete Role
    public async deleteRole(id: number): Promise<Role> {
        return prisma.role.delete({
            where:{id}
        })
    }


    // Retirer la permission d'un role (Je souhaite le gerer avec l'archivage)
    public async removePermissionFromRole(roleId: number, permissionId: number) {
        await RolePermissionService.deleteRolePermission({roleId,permissionId});
        return this.getRoleById(roleId);

    }



    // Ajouter des ou une permission(s) a un role deja existant
    public async addPermissionsToRole(roleId: number, permissionIds: number[]): Promise<Role | null> {
        let addPermissions:number[] = [];
        permissionIds.forEach(async permissionId => {
            const existantRolePerms = await  RolePermissionService.VerifyRolePermission({roleId,permissionId});
            if(!existantRolePerms){
                addPermissions.push(permissionId);
            }
        });

        if (addPermissions.length > 0) {
            await RolePermissionService.createRolePermsByRoleId(roleId, addPermissions);
        }

        return this.getRoleById(roleId);
    }
}