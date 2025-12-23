import type { NextFunction, Request, Response } from "express";
import AuthService from "../Services/AuthService.ts";
import {HTTP_STATUS_UNAUTHORIZED } from "../Utils/Constantes/ConstantesHttp.ts";
import type { AccessTokenPayload } from "../Types/Auth.ts";



const authService = new AuthService();



export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.access_token as string;

    if (!accessToken) {
        // Le Access Token est manquant (nouvelle session ou utilisateur non connecté)
        return res.status(HTTP_STATUS_UNAUTHORIZED).json({ message: 'Access Token manquant.' });
    }

    const payload = authService.verifyAccesToken(accessToken);

    if (!payload) {
        // Le Access Token est expiré. Demander au client de tenter le renouvellement.
        return res.status(HTTP_STATUS_UNAUTHORIZED).json({ message: 'Access Token expiré.', code: 'TOKEN_EXPIRED' });
    }

    // Le token est valide, ajouter le payload à la requête pour les contrôleurs
    req.user = payload as AccessTokenPayload; 

    next();
};