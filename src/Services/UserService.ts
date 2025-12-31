
import prisma from "../Utils/PrismaClient.ts";
import type { User } from "../Types/User.ts";
import type { UpdateUserPayload } from "../Types/UpdateUserPayload.ts";
import * as bcrypt from 'bcrypt';
import type { Prisma } from "../generated/prisma/client.ts";

const SALT_ROUNDS = 10; // Niveau de complexité du hachage (standard)

 


export default class UserService {


    // Creation d'un utilisateur
    public async createUser(data: Prisma.UserUncheckedCreateInput): Promise<User> {
        return prisma.user.create({
            data,
            include: { role: true }
        });
    }




    // Recuperer tous les utilisateurs
    public async getAllUser(): Promise<User[]> {
       return prisma.user.findMany({
        include:{role:true},
        orderBy: {
            createdAt: 'desc' // 'desc' pour descendant (le plus récent en premier)
        }
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
    

    
    // Hache un mot de passe en texte clair.
    public async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, SALT_ROUNDS);
    }



    // Compare le mot de passe fourni avec le hachage stocké.
    public async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    // Change mot de passe d'un utilisateur
    public async changeUserPassword(userId: number, newPassword: string): Promise<User | null> {
        const hashedPassword = await this.hashPassword(newPassword);
        return this.updateUser(userId, { password_hash: hashedPassword });
    }

}