
import prisma from "../Utils/PrismaClient.ts";
import type { User } from "../Types/User.ts";
import type { UpdateUserPayload } from "../Types/UpdateUserPayload.ts";
import * as bcrypt from 'bcrypt';
import type { Prisma } from "../generated/prisma/client.ts";
import type { QueryFilters } from "../Utils/queryFilter.ts";
import { Paginator } from "../Utils/Paginator.ts";
import crypto from "crypto";
import { EmailService } from "./EmailService.ts";
import { AppError } from "../Utils/ErrorPrisma.ts";

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
            where:{email,archive:false,status:"ACTIVE"},
            include:{
                role: true  // Seuls id + name du rôle sont nécessaires pour le token
            } 
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
                archivedAt: new Date(),
                isActiveAt:null,
                status:"INACTIVE"            
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
                archivedAt:null,
                isActiveAt:new Date(),
                status:"ACTIVE"
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


    public generateTemporaryPassword(): string {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
        let password = "Default-"; // Préfixe pour personnaliser au nom de votre app
        
        // Génère 8 caractères aléatoires parmi la liste sécurisée
        for (let i = 0; i < 8; i++) {
            const randomIndex = crypto.randomInt(0, chars.length);
            password += chars.charAt(randomIndex);
            
            // Ajoute un tiret au milieu pour la lisibilité
            if (i === 3) password += "-";
        }
        
        return password;
    }


    public async resendConfirmationEmail(userId: number): Promise<boolean> {
    try {
        const newToken = crypto.randomBytes(32).toString('hex');
        
        const user = await prisma.user.update({
            where: { 
                id: userId,
                status: "EN_ATTENTE" 
            },
            data: { confirmationToken: newToken }
        });

        return await EmailService.sendVerificationEmail(user.email, newToken);

    } catch (error: any) {
        if (error.code === 'P2025') {
            throw new Error("Impossible de renvoyer l'email : le compte est déjà validé ou inexistant.");
        }
        throw error; 
    }
}


    public async confirmEmail(token: string, email: string): Promise<{user:User,password:string} | null> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        if (user.confirmationToken !== token) return null;

        const password = this.generateTemporaryPassword();
        await prisma.user.update({
            where: { id: user.id },
            data: {
                status:"ACTIVE",
                confirmationToken:null,
                isPendingAt:null,
                isActiveAt:new Date(),
                password_hash:await this.hashPassword(password) 
            } 
        });
        return {user,password};
    }



    public async deleteDefinitivelyUser(id:number): Promise<User>{
        const user = await prisma.user.findUnique({
            where: { id },
            include:{
                role:true,
                _count:{
                    select:{
                        entries:true,
                        contentTypes:true,
                        taxonomies:true
                    }
                }
            } 
        });
        
        if (!user) throw new AppError("Utilisateur non trouvé ou non archivé.");
        if (user.archive === false || user.status === "ACTIVE") throw new AppError("Utilisateur non archivé ou non en attente.");
        if (user.role?.name) throw new AppError("Impossible de supprimer : l'utilisateur a un Rôle.");
        if (user._count.entries > 0) throw new AppError("Impossible de supprimer : l'utilisateur a créé des entrées.");
        if (user._count.contentTypes > 0) throw new AppError("Impossible de supprimer : l'utilisateur a créé des types.");
        
        return await prisma.user.delete({
            where:{id}
        })
    }       

}