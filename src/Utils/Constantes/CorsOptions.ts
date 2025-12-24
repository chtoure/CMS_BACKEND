


export const corsOptions = {
    // L'URL de ton frontend (ex: React, Vue, Vite)
    origin: 'http://localhost:5173', 
    
    // Autorise l'envoi des cookies (indispensable pour tes tokens)
    credentials: true,
    
    // Méthodes autorisées
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    
    // Headers autorisés
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    
    // Optionnel : Gère le statut de succès pour les requêtes de pré-vérification (OPTIONS)
    optionsSuccessStatus: 204 
};