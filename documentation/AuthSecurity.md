# Sécurité & Authentification

Le backend de Compositor implémente une architecture de sécurité robuste basée sur les standards JWT et un modèle de contrôle d'accès granulaire (RBAC).

---

## 🔐 1. Flux d'Authentification (JWT)

Compositor utilise des jetons **JSON Web Tokens** pour sécuriser les échanges.

### Connexion (`AuthController`)
1. L'utilisateur fournit son email et mot de passe.
2. Le serveur vérifie le hachage (Argon2/BCrypt).
3. Si valide, le serveur génère :
   - **Access Token** : Jeton courte durée (ex: 1h) envoyé dans les headers pour autoriser les requêtes.
   - **Refresh Token** : Jeton longue durée stocké de manière sécurisée pour renouveler la session sans redemander le mot de passe.

### Interception des Requêtes
Toutes les routes protégées passent par le middleware **`authGuard`** qui :
- Extrait le token du header `Authorization`.
- Vérifie la signature et l'expiration.
- Injecte l'objet `req.user` dans la requête pour les étapes suivantes.

---

## 🛡️ 2. Système RBAC (Roles & Permissions)

Le système de permissions est "atomique". On ne vérifie pas si un utilisateur est "Admin", mais s'il possède la permission spécifique requise (ex: `delete_media`).

### Middleware `checkPermission`
Ce middleware compare les permissions de l'utilisateur (chargées depuis la DB via Prisma) avec les permissions requises par la route.

```typescript
// Exemple d'usage dans une route
router.delete('/:id', authGuard, checkPermission(['delete_media']), mediaController.delete);
```

### Hiérarchie des Droits
1. **Permission** : L'action élémentaire (CRUD sur une ressource).
2. **Role** : Un ensemble nommé de permissions (ex: "Rédacteur" = `read_media`, `create_entry`).
3. **User** : Un compte lié à un rôle.

---

## 🔒 3. Protection des Données

### Hachage des Mots de Passe
Les mots de passe ne sont jamais stockés en clair. Le système utilise des algorithmes de hachage asymétriques avec "salt" pour prévenir les attaques par dictionnaire.

### Validation des Entrées
Chaque contrôleur valide les données entrantes (ex: types, longueurs, formats) avant de les transmettre aux services, prévenant ainsi les injections et les données corrompues.

### CORS & En-têtes de Sécurité
Le serveur est configuré pour n'autoriser que les domaines de confiance (frontend) et utilise des en-têtes de sécurité standards pour se protéger contre les attaques XSS et CSRF.
