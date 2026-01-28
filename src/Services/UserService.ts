
import prisma from "../Utils/PrismaClient.ts";
import type { User } from "../Types/User.ts";
import type { UpdateUserPayload } from "../Types/UpdateUserPayload.ts";
import * as bcrypt from 'bcrypt';
import type { Prisma } from "../generated/prisma/client.ts";
import type { QueryFilters } from "../Utils/queryFilter.ts";
import { Paginator } from "../Utils/Paginator.ts";

const SALT_ROUNDS = 10; // Niveau de complexité du hachage (standard)

 


export default class UserService {



    private buildWhereClause(filter?:QueryFilters): Prisma.UserWhereInput {
        const where: Prisma.UserWhereInput = {};

        if (filter?.archive !== undefined) {
            where.archive = filter.archive;
        }

        if (filter?.search?.trim()) {
            const query = filter.search.trim();
            where.OR = [
                { email: { contains: query } },
                { full_name: { contains: query } },
                { role: { name: { contains: query } } }
            ];
        }

        return where;
    }



    // Creation d'un utilisateur
    public async createUser(data: Prisma.UserUncheckedCreateInput): Promise<User> {
        return prisma.user.create({
            data,
            include: { role: true}
        });
    }




    public async getAllUsers(filter?:QueryFilters){
        return Paginator.paginate<User>(prisma.user, {
            page: filter?.page,
            limit: filter?.limit,
            where: this.buildWhereClause(filter),
            include: { role: true },
            orderBy: { createdAt: 'desc' }
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