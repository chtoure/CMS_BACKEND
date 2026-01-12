
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
            include: { role: true}
        });
    }




    // Recuperer tous les utilisateurs
    public async getAllUser(
        archive: boolean | null,
        skip?: number, 
        take?: number
    ): Promise<User[]> {

        const where: any = {};

        if (archive !== null) {
            where.archive = archive;
        }

        const options: any = {
            where: where,
            include:{role:true},
            orderBy: {
                createdAt: 'desc'
            }
        };

        if (skip !== undefined) options.skip = skip;
        if (take !== undefined) options.take = take;

       return prisma.user.findMany(options);
    }

    public async countUsers(archive: boolean | null): Promise<number> {

         const where: any = {};

        if (archive !== null) {
            where.archive = archive;
        }

        return prisma.user.count({
            where: where
        });
    }


    // Récupère un utilisateur par ID
    public async getUserById(id: number): Promise<User | null> {
        return prisma.user.findUnique({
            where:{id , archive:false},
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


    // Récupère un utilisateur non archivé par email
    public async getUserByEmailNonArchive(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where:{email,archive:false},
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


    // Archiver les utilisateurs
    public async deleteUser(id:number):  Promise<User | null>{
        return prisma.user.update({
            where:{id, archive:false},
            data:{
                archive:true,
                archivedAt: new Date()
            },
            include:{role:true}
        })
    }


    // Restorer un utilisateur archiver
    public async restoreUser(id: number): Promise<User> {
         return prisma.user.update({
            where:{id, archive:true},
            data:{
                archive:false,
                archivedAt:null
            },
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
        return this.updateUser(userId, { password_hash: hashedPassword, isLoggedIn: true });
    }


    // Verifie le code de reinitialisation et la date d'expiration
    public async verifyResetCode(userId: number, code: string): Promise<User | null> {
        return prisma.user.findFirst({
            where: {
                id: userId,
                resetCode: code,
                codeExpiration: {
                    gt: new Date() // Vérifie que la date d'expiration est dans le futur
                }
            },
            include: { role: true }
        });
    }

}