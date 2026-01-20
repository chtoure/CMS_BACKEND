
import type { Prisma } from "../generated/prisma/client.ts";
import type { Permission } from "../Types/Permission.ts";
import type { Role } from "../Types/Role.ts";
import prisma from "../Utils/PrismaClient.ts";
import RolePermissionService from "./RolePermissionService.ts";




export default class RoleService {


  // Transforme la structure Prisma (table pivot) en structure plate (permissions directes)
  static mapRoles(roles: any[]): Role[] {
    return roles.map(role => ({
      ...role,
      // On extrait l'objet 'permission' de chaque entrée de la table pivot
      permissions: role.permissions?.map((rp: any) => rp.permission) ?? []
    }));
  }


   // Version pour un seul rôle
   static mapSingleRole(role: any): Role {
    return {
      ...role,
      permissions: role.permissions?.map((rp: any) => rp.permission) ?? []
    };
  }

  


    // Creation d'un role
    public async createRole(data: Prisma.RoleUncheckedCreateInput,permissionIds: number[] = []): Promise<Role> {
        const role = await prisma.role.create({
            data,
            include: {  
                permissions:{
                    include:{permission:true}
                },
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

        return RoleService.mapSingleRole(role);
    }


    // Recuperer tous les roles avec pagination
    public async getAllRoles(
        archive: boolean | null,
        skip?: number, 
        take?: number
    ): Promise<Role[]> {

        const where: any = {};

        if (archive !== null) {
            where.archive = archive;
        }


        const options: any = {
            where: where,
            include: {
                users: true,
                permissions: {
                    include: {
                        permission: true // On inclut l'objet Permission réel
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        };

        if (skip !== undefined) options.skip = skip;
        if (take !== undefined) options.take = take;

        const roles = await prisma.role.findMany(options);

        // On transforme (map) le résultat pour aplatir la structure
        return RoleService.mapRoles(roles)

    }

     public async countRoles(archive: boolean | null): Promise<number> {

        const where: any = {};

        if (archive !== null) {
            where.archive = archive;
        }

        return prisma.role.count({
            where: where
        });
    }



    // Recuperer tous les roles sans pagination
    public async getAllRolesNoPaginate(): Promise<Role[]> {
        const roles = await prisma.role.findMany({
            where:{archive:false},
            include: {
                users: true,
                permissions: {
                    include: {
                        permission: true // On inclut l'objet Permission réel
                    }
                }
            }
        });

        // On transforme (map) le résultat pour aplatir la structure
        return RoleService.mapRoles(roles)

    }


    // Récupère un role par ID
    public async getRoleById(id: number): Promise<Role | null> {
        const role = await prisma.role.findUnique({
            where:{id,archive:false},
            include:{
                 permissions:{
                    include:{permission:true}
                },
                users:true
            }
        });
        return RoleService.mapSingleRole(role);
    }


    // Récupère un role par name
    public async getRoleByName(name: string): Promise<Role | null> {
        const role = await prisma.role.findUnique({
            where:{name},
            include:{
                 permissions:{
                    include:{permission:true}
                },
                users:true
            }
        });
        return RoleService.mapSingleRole(role);
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


    // Archiver un  Role
    public async deleteRole(id: number): Promise<Role> {
        return prisma.role.update({
            where:{id, archive:false},
            data:{
                archive:true,
                archivedAt: new Date()
            }            
        })
    }


    // Restorer un role archivé
    public async restoreRole(id: number): Promise<Role> {
        return prisma.role.update({
            where:{id, archive:true},
            data:{
                archive:false,
                archivedAt:null
            }            
        })
    }


    // Retirer la permission d'un role (Je souhaite le gerer avec l'archivage)
    public async removePermissionFromRole(roleId: number, permissionId: number) {
        await RolePermissionService.deleteRolePermission({roleId,permissionId});
        return this.getRoleById(roleId);

    }


    // Restore la permission  d'un role retirer
     public async restorePermissionFromRole(roleId: number, permissionId: number) {
        await RolePermissionService.restoreRolePermission({roleId,permissionId});
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

    // recuperer les permission d'un role by id
    public async getPermissions(roleId: number): Promise<Permission[]> {
        const roleWithPermissions = await prisma.role.findUnique({
            where: { id: roleId,archive:false },
            include: {
                permissions: {
                    include: {
                        permission: true 
                    }
                }
            }
        });

        return roleWithPermissions?.permissions.map(rp => rp.permission) || [];
    }
}