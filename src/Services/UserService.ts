
import prisma from "../Utils/PrismaClient.ts";
import type { User } from "../Types/User.ts";
import type { UpdateUserPayload } from "../Types/UpdateUserPayload.ts";

 


export default class UserService {

    // Recuperer tous les utilisateurs
    public async getAllUser(): Promise<User[]> {
       return prisma.user.findMany({
        include:{role:true}
       });
    }



    // Récupère un utilisateur par ID
    public async getUserById(id: number): Promise<User | null> {
        return prisma.user.findUnique({
            where:{id},
            include:{role:true}
        });
    }


    // Récupère un utilisateur par email
    public async getUserByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where:{email},
            include:{role:true} 
        });
    }

    
    
    // Recuperer un user par RefreshToken 
    public async getUserByToken(refreshToken: string):  Promise<User | null> {
       return prisma.user.findUnique({
            where:{refreshToken},
            include:{role:true}
       })
    }


    // Modifier un utilisateur
    public async updateUser(id:number, userData:UpdateUserPayload): Promise<User | null> {
        return prisma.user.update({
            where:{id},
            data:userData,
            include:{role:true}
        })
    }


    // Supprimer un utilisateur 
    public async deleteUser(id:number):  Promise<User | null>{
        return prisma.user.delete({
            where:{id},
            include:{role:true}
        })
    }
    
}