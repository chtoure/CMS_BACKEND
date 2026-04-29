import type { NextFunction, Request, Response } from "express";
import AuthService from "../Services/AuthService.ts";
import { HTTP_STATUS_UNAUTHORIZED } from "../Utils/Constantes/ConstantesHttp.ts";
import type { AccessTokenPayload } from "../Types/Auth.ts";



const authService = new AuthService();



export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // 1. On tente de récupérer le token depuis les cookies
    let accessToken: string | undefined = req.cookies.access_token;

    // 2. Fallback : Header Authorization: Bearer <token>
    if (!accessToken) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            accessToken = authHeader.substring(7);
        }
    }


    if (!accessToken) {
        return res.status(HTTP_STATUS_UNAUTHORIZED).json({ 
            message: 'Access Token manquant.'
        });
    }

    const payload = authService.verifyAccesToken(accessToken);

    if (!payload) {
        return res.status(HTTP_STATUS_UNAUTHORIZED).json({ 
            message: 'Access Token expiré.' 
        });
    }

    req.user = payload as AccessTokenPayload; 
    next();
};