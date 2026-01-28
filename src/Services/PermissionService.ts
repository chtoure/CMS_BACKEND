
import type { Prisma } from "../generated/prisma/client.ts";
import type { Permission } from "../Types/Permission.ts";
import { Paginator } from "../Utils/Paginator.ts";
import prisma from "../Utils/PrismaClient.ts";
import type { QueryFilters } from "../Utils/queryFilter.ts";


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


   private buildWhereClause(filter?:QueryFilters): Prisma.PermissionWhereInput {
        const where: Prisma.PermissionWhereInput = {};

        if (filter?.archive !== undefined) {
            where.archive = filter.archive;
        }

        if (filter?.search?.trim()) {
            const query = filter.search.trim();
            where.OR = [
                { name: { contains: query } },
                { description: { contains: query } }
            ];
        }

        return where;
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



    public async getPermissions(filter?:QueryFilters){
        const data = await Paginator.paginate<Permission>(prisma.permission, {
            page: filter?.page,
            limit: filter?.limit,
            where: this.buildWhereClause(filter),
            include: {
                roles: {
                    include: {
                        role: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return {
            ...data,
            results: PermissionService.mapPermissions(data.results)
        };
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