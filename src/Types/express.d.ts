

// src/types/express.d.ts

import type { AccessTokenPayload } from "./Auth.ts";


// On étend l'interface Request d'Express
declare global {
    namespace Express {
        interface Request {
            user?: AccessTokenPayload; // On ajoute la propriété optionnelle 'user'
        }
    }
}