// auth.interface.ts

import type { Role } from "./Role.ts";


// Interface de base pour le Payload des deux Tokens.

export interface TokenPayload {
    sub: number; // Identifiant unique de l'utilisateur (Subject)
    iat?: number; // Issued At
    exp?: number; // Expiration Time
}


//  Interface pour le Jeton d'Accès (Access Token)
// Contient les informations pour l'autorisation immédiate.

export interface AccessTokenPayload extends TokenPayload {
    role?: Role; // Rôle de l'utilisateur
    full_name: string; // Nom d'utilisateur (pour l'affichage)
}


// Interface pour le Jeton de Rafraîchissement (Refresh Token)
// Doit être minimaliste et contenir un JTI pour la révocation.

export interface RefreshTokenPayload extends TokenPayload {
    jti: string; // Identifiant unique du jeton (JWT ID) - CLÉ BDD
}

// Interface de la réponse envoyée au client après login ou refresh.

export interface AuthResponse {
    message: string;
    user: {
        id: number;
        username: string;
        roles: Role;
    };
    // Note: Les tokens sont envoyés via cookies HTTP-Only et ne sont pas ici.
}