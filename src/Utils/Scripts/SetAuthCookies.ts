
import type { Response } from "express";

// Définition des durées des cookies (en millisecondes)
const ACCESS_COOKIE_MAXAGE = 15 * 60 * 1000; // 15 minutes
const REFRESH_COOKIE_MAXAGE = 7 * 24 * 60 * 60 * 1000; // 7 jours

// const isProd = process.env.NODE_ENV === 'production';



export function SetAccesCookie(res:Response,accessToken:string) {

    // On vérifie si la requête est sécurisée
    // Note: 'proxy: true' doit être activé dans Express si tu es derrière un Load Balancer (Nginx, Vercel, etc.)
    const isSecure = res.req.secure || res.req.get('x-forwarded-proto') === 'https';

    // Cookie Access Token (Court terme, HTTP-Only)
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: isSecure,
        maxAge: ACCESS_COOKIE_MAXAGE,
        // Si c'est sécurisé, on met 'none' pour le cross-domain
        // Si c'est HTTP, on met 'lax' (sinon le cookie sera rejeté)
        sameSite: isSecure ? 'none' : 'lax'
    });
}


export function SetRefreshCookie(res:Response,refreshToken: string) {
    const isSecure = res.req.secure || res.req.get('x-forwarded-proto') === 'https';

    // Cookie Refresh Token (Long terme, HTTP-Only)
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: isSecure,
        maxAge: REFRESH_COOKIE_MAXAGE,
        sameSite: isSecure ? 'none' : 'lax'
    });
}


// Configure les cookies HTTP-Only Secure pour l'Access Token et le Refresh Token.
export default function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    SetAccesCookie(res,accessToken);
    SetRefreshCookie(res,refreshToken);
}