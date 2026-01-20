
import type { Prisma } from "../generated/prisma/client.ts";
import type { Permission } from "../Types/Permission.ts";
import prisma from "../Utils/PrismaClient.ts";


export default class PermissionService {

    static mapPermissions(permissions: any[]): Permission[] {
        return permissions.map(p => ({
            ...p,
            // On extrait l'objet 'role' de chaque entrée de la table pivot
            roles: p.roles?.map((rp: any) => rp.role) ?? []
        }));
    }


    static mapSinglePermission(permission: any): Permission {
        return {
            ...permission,
            roles: permission.roles?.map((rp: any) => rp.role) ?? []
        };
    }

    
    // Creation d'une permission
    public async createPermission(data: Prisma.PermissionUncheckedCreateInput): Promise<Permission> {
        const perms = await prisma.permission.create({
            data,
            include: {
            roles: {
                include: {
                    role: true
                }
            }
        }
        });
        return PermissionService.mapSinglePermission(perms);
    }


     // Creation de plusieurs permissions
    public async createPermissions(data: Prisma.PermissionUncheckedCreateInput[]): Promise<Prisma.BatchPayload> {
        return prisma.permission.createMany({
            data        
        });
    }


     // Recuperer tous les permissions avec pagination
    public async getAllPermissions(
        archive: boolean | null,
        skip?: number, 
        take?: number
    ): Promise<Permission[]> {

        const where: any = {};

        if (archive !== null) {
            where.archive = archive;
        }


        const options: any = {
            where: where,
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        };

        if (skip !== undefined) options.skip = skip;
        if (take !== undefined) options.take = take;

       const dataPerms = await prisma.permission.findMany(options);
       return PermissionService.mapPermissions(dataPerms);
    }

     public async countPermissions(archive: boolean | null): Promise<number> {

        const where: any = {};

        if (archive !== null) {
            where.archive = archive;
        }


        return prisma.permission.count({
             where: where
        });
    }


     // Recuperer tous les permissions sans Pagination
    public async getAllPermissionsNoPaginate(): Promise<Permission[]> {
       const dataPerms = await prisma.permission.findMany({
        where:{archive:false},
        include: {
            roles: {
                include: {
                    role: true
                }
            }
        }
       });
       return PermissionService.mapPermissions(dataPerms);
    }


    // Récupère une permission par ID
    public async getPermissionById(id: number): Promise<Permission | null> {
        const permission = await prisma.permission.findUnique({
            where:{id,archive:false},
            include: {
            roles: {
                include: {
                    role: true
                }
            }
        }
        });
        return PermissionService.mapSinglePermission(permission);
    }


    // Récupère une permission par name
    public async getPermissionByName(name: string): Promise<Permission | null> {
        const perms = await prisma.permission.findUnique({
            where:{name,archive:false},
            include: {
            roles: {
                include: {
                    role: true
                }
            }
        }
        });
        return PermissionService.mapSinglePermission(perms);
    }


    // Modifier une permission
    public async updatePermission(id:number, userData:Prisma.PermissionUpdateInput): Promise<Permission | null> {
        const permission = await prisma.permission.update({
            where:{id},
            data:userData,
            include: {
            roles: {
                include: {
                    role: true
                }
            }
        }
        });
        return PermissionService.mapSinglePermission(permission);
    }


    // Archiver une permission 
    public async deletePermission(id:number):  Promise<Permission | null>{
        const perm = await prisma.permission.update({
            where:{id,archive:false},
            include: {
                roles: {
                    include: {
                        role: true
                    }
                },
            },
            data:{
                archive:true,
                archivedAt: new Date()
            }
        })
        return PermissionService.mapSinglePermission(perm);
    }



    // Restore une permission
    public async RestorePermission(id:number):  Promise<Permission | null>{
        const perm = await prisma.permission.update({
            where:{id,archive:true},
            include: {
                roles: {
                    include: {
                        role: true
                    }
                },
            },
            data:{
                archive:false,
                archivedAt:null
            }
        })
        return PermissionService.mapSinglePermission(perm);
    } 


    // Function : Prend Un tableau(Name Permissions) et retourne un tableau(Id Permission)
    public async getPermissionsIdsByName(names:string[]): Promise<number[]> {
        const permissions = await prisma.permission.findMany({
            where: {
                name: {
                    in: names
                },
                archive:false
            },
            select: {
                id: true, // Récupère [{id: 1}, {id: 2}, ...]
            },
        });

        // On transforme le tableau d'objets en tableau de nombres
        return permissions.map(p => p.id);
    }
}