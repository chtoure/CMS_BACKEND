
import type { AccessTokenPayload, RefreshTokenPayload } from "../Types/Auth.ts";
import type { Role } from "../Types/Role.ts";
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import type { SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import UserService from "./UserService.ts";
import type { User } from "../Types/User.ts";

interface Token {
    accessToken: string; 
    refreshToken: string;
}

interface TokenRefreshVerify {
    payloadRefresh:RefreshTokenPayload;
    user:User
}


const userService = new UserService();


export default class AuthService{

    createAccesToken(userId: number, full_name: string, role: Role | null): string {

        // Recuperation des clés
        const ACCESS_SECRET = process.env.ACCESS_SECRET || "SECRET_ACCESS_KEY";
        const ACCESS_EXPIRY = process.env.ACCESS_EXPIRY || "15m";

        // Definition d'option jwt
        const accessOptions: SignOptions = {
            expiresIn: ACCESS_EXPIRY as any
        };

        //  Définition de Payload
        const accessPayload: AccessTokenPayload = { sub: userId, full_name, role };

        //  Création de JWT
        const accessToken = jwt.sign(accessPayload, ACCESS_SECRET , accessOptions);

        return accessToken;

    }


    async createRefreshToken(userId: number):Promise<string | null>{

        // Recuperation des clés
        const REFRESH_SECRET = process.env.REFRESH_SECRET || "SECRET_REFRESH_KEY";
        const REFRESH_EXPIRY = process.env.REFRESH_EXPIRY || "7d";

        // Definition d'option jwt
         const refreshOptions: SignOptions = {
            expiresIn: REFRESH_EXPIRY as any
        };

        //  Définition de Payload
        const refreshPayload: RefreshTokenPayload = { sub: userId, jti: uuidv4() };

        //  Création des JWT
        const refreshToken = jwt.sign(refreshPayload, REFRESH_SECRET , refreshOptions);

        // Stockage du JTI du Refresh Token en BDD
        const userMod= await userService.updateUser(userId, {"refreshToken":refreshToken});
        if (userMod==null) {
            console.log("Erreur Refresh token n'a pas été enregistrer");
            return null
        }
        
        return refreshToken;
    }

    
    // Crée un Access Token et un Refresh Token pour un utilisateur donné.
    async createTokens(userId: number, full_name: string, role: Role | null): Promise<Token | null> {

        const accessToken = this.createAccesToken(userId,full_name,role);
        const refreshToken = await this.createRefreshToken(userId);
        
        if (!accessToken || !refreshToken) {
            console.log("AccesToken ou RefreshToken est ou sont null(s)");
            return null
        }

        return { accessToken, refreshToken };
    }


    private static isAccessTokenPayload(payload: any): payload is AccessTokenPayload {
        return (
            typeof payload === "object" &&
            payload !== null &&
            typeof payload.sub === "number" &&
            typeof payload.full_name === "string"
        );
    }

    private static isRefreshTokenPayload(
        payload: unknown
    ): payload is RefreshTokenPayload {
        if (typeof payload !== "object" || payload === null) return false;

        const p = payload as any;
        return (
            typeof p.sub === "number" &&
            typeof p.jti === "string"
        );
    }


    

    // Verifier la validité de l'acces Token 
    public verifyAccesToken(token:string): AccessTokenPayload | null {
        try {

            //Recuperation de la clé secrete
            const ACCESS_SECRET:string = process.env.ACCESS_SECRET ?? "SECRET_ACCESS_KEY";

           
            const decodedAccessToken = jwt.verify(token, ACCESS_SECRET);

            if (AuthService.isAccessTokenPayload(decodedAccessToken)) {
                return decodedAccessToken; // Retourne les infos du token s'il est valide 
            }

            return null; // Le payLoad est invalide
        } catch (error) {

            console.log("Le token est invalide ou expiré", error);
            return null; // Le token est invalide ou expiré
        }
    }



    // Vérifie la validité du Refresh Token et s'il est présent en BDD.
    public async verifyAndCheckRefreshToken(token: string): Promise<TokenRefreshVerify | null> {
       
        try {
            
            const REFRESH_SECRET = process.env.REFRESH_SECRET ?? "SECRET_REFRESH_KEY";

            const payloadRefresh = jwt.verify(token, REFRESH_SECRET);

            if (!AuthService.isRefreshTokenPayload(payloadRefresh)) {
                    return null; // payload invalide, on sort
            }

            // Verfication du token en base 
            const user= await userService.getUserByToken(token);
            if (!user) {
                console.log("Erreur Refresh token n'a pas été trouver en bd");
                return null
            }

            return {payloadRefresh,user}; 
        } catch {
            return null; // token invalide cryptographiquement
        }
      
    }




    
    // Révoque le Refresh Token lors du logout ou d'une action de sécurité.
    public async revokeRefreshToken(refreshToken: string): Promise<boolean> {
        try {
            const decoded = jwt.decode(refreshToken); // string | JwtPayload | null

            if (AuthService.isRefreshTokenPayload(decoded)) {
                console.log("Révoquer le token pour user:", decoded.sub);
                const userRevoke= await userService.updateUser(decoded.sub, {"refreshToken":null});
                if (!userRevoke) {
                    console.log("Erreur lors de la revokation de  Refresh token en bd");
                    return false
                }
                
                return true; // si révoqué
            }

            return false; // payload invalide ou non conforme
        } catch (error) {
            console.error("Erreur lors de la révocation du refresh token:", error);
            return false;
        }
    }


}