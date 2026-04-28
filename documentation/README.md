# Documentation Backend - Compositor

Ce répertoire contient la documentation technique du serveur **Compositor**, une API REST développée avec **Node.js**, **Express** et **TypeScript**.

## 🚀 Stack Technique

- **Runtime** : Node.js (v20+)
- **Framework API** : Express
- **Langage** : TypeScript
- **ORM** : Prisma
- **Base de Données** : SQLite (via Prisma)
- **Traitement d'Image** : Sharp
- **Authentification** : JWT (JSON Web Tokens)
- **Sécurité** : Argon2 (hachage), Middleware RBAC

---

## 📁 Structure du Projet (`src/`)

L'architecture suit un modèle **Controller-Service** pour séparer les responsabilités :

| Dossier | Rôle |
| :--- | :--- |
| **`Controllers/`** | Gestion des requêtes HTTP et validation des entrées. |
| **`Services/`** | Logique métier (calculs, interactions complexes avec la DB). |
| **`Routes/`** | Définition des endpoints et application des middlewares. |
| **`Middleware/`** | Protection des routes (Auth, Permissions, Erreurs). |
| **`generated/`** | Client Prisma généré automatiquement. |
| **`Utils/`** | Constantes (HTTP), Helpers, et Client Prisma centralisé. |
| **`Types/`** | Interfaces et types TypeScript partagés. |

---

## 🛠️ Installation et Démarrage

### 1. Installation des dépendances
```bash
npm install
```

### 2. Configuration de la base de données
Assurez-vous d'avoir un fichier `.env` configuré, puis exécutez les migrations Prisma :
```bash
npx prisma migrate dev
```

### 3. Lancer le serveur
- **Mode Développement** : `npm run dev` (avec hot-reload)
- **Mode Production** : `npm run build && npm start`

---

## 📖 Table des Matières de la Documentation

1. [Database.md](./Database.md) : Modèle de données et schéma Prisma.
2. [AuthSecurity.md](./AuthSecurity.md) : Authentification et système de permissions.
3. [MediaProcessing.md](./MediaProcessing.md) : Pipeline de traitement d'images avec Sharp.
4. [CMS_Engine.md](./CMS_Engine.md) : Moteur de contenu dynamique et tables pivots.
5. [Builder_API.md](./Builder_API.md) : API de gestion des blocs et des pages.

---
*Documentation créée en Avril 2026.*
