
import type { Prisma } from "../generated/prisma/client.ts";
import type { Permission } from "../Types/Permission.ts";
import prisma from "../Utils/PrismaClient.ts";


export default class PermissionService {

    // Creation d'une permission
    public async createPermission(data: Prisma.PermissionUncheckedCreateInput): Promise<Permission> {
        return prisma.permission.create({
            data,
            include: { roles: true }
        });
    }


     // Creation de plusieurs permissions
    public async createPermissions(data: Prisma.PermissionUncheckedCreateInput[]): Promise<Prisma.BatchPayload> {
        return prisma.permission.createMany({
            data        
        });
    }


     // Recuperer tous les permissions
    public async getAllPermissions(): Promise<Permission[]> {
       return prisma.permission.findMany({
        include:{roles:true}
       });
    }


    // Récupère une permission par ID
    public async getPermissionById(id: number): Promise<Permission | null> {
        return prisma.permission.findUnique({
            where:{id},
            include:{roles:true}
        });
    }


    // Récupère une permission par name
    public async getPermissionByName(name: string): Promise<Permission | null> {
        return prisma.permission.findUnique({
            where:{name},
            include:{roles:true}
        });
    }


    // Modifier une permission
    public async updatePermission(id:number, userData:Prisma.PermissionUpdateInput): Promise<Permission | null> {
        return prisma.permission.update({
            where:{id},
            data:userData,
            include:{roles:true}
        })
    }


    // Supprimer un utilisateur 
    public async deletePermission(id:number):  Promise<Permission | null>{
        return prisma.permission.delete({
            where:{id},
            include:{roles:true}
        })
    }


    // Function : Prend Un tableau(Name Permissions) et retourne un tableau(Id Permission)
    public async getPermissionsIdsByName(names:string[]): Promise<number[]> {
        const permissions = await prisma.permission.findMany({
            where: {
                name: {
                    in: names
                }
            },
            select: {
                id: true, // Récupère [{id: 1}, {id: 2}, ...]
            },
        });

        // On transforme le tableau d'objets en tableau de nombres
        return permissions.map(p => p.id);
    }
}