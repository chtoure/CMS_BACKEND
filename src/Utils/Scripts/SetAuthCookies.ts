
import type { Response } from "express";

// Définition des durées des cookies (en millisecondes)
const ACCESS_COOKIE_MAXAGE = 15 * 60 * 1000; // 15 minutes
const REFRESH_COOKIE_MAXAGE = 7 * 24 * 60 * 60 * 1000; // 7 jours

const isProd = process.env.NODE_ENV === 'production';


export function SetAccesCookie(res:Response,accessToken:string) {
    // Cookie Access Token (Court terme, HTTP-Only)
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: isProd,
        maxAge: ACCESS_COOKIE_MAXAGE,
        sameSite: 'strict'
    });
}


export function SetRefreshCookie(res:Response,refreshToken: string) {
    // Cookie Refresh Token (Long terme, HTTP-Only)
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: isProd,
        maxAge: REFRESH_COOKIE_MAXAGE,
        sameSite: 'strict'
    });
}


// Configure les cookies HTTP-Only Secure pour l'Access Token et le Refresh Token.
export default function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    SetAccesCookie(res,accessToken);
    SetRefreshCookie(res,refreshToken);
}