# Modèle de Données (Database)

Compositor utilise **SQLite** comme base de données relationnelle, pilotée par l'ORM **Prisma**. L'architecture de données est conçue pour supporter des structures de contenu hautement dynamiques.

---

## 🗺️ Vue d'Ensemble des Entités

### 👤 Authentification & Utilisateurs
- **`User`** : Entité centrale. Gère les informations de profil et l'état de connexion.
- **`Role`** & **`Permission`** : Structure RBAC. Un utilisateur a un rôle, un rôle a plusieurs permissions.
- **`RolePermission`** : Table pivot liant les rôles aux permissions atomiques.

### 🖼️ Médiathèque
- **`Media`** : Stocke les métadonnées des fichiers (chemin, type, dimensions, texte alt).
- **`ContentEntryRelation`** : Table pivot permettant de lier un média à une entrée de contenu dynamique.

### 🏗️ CMS (Moteur de Contenu)
- **`ContentType`** : Définit la structure (schéma JSON) d'un type de contenu.
- **`ContentEntry`** : Stocke les données réelles au format JSON (`data_json`).
- **`Taxonomy`** & **`TaxonomyTerm`** : Système de classification (catégories/tags).
- **`ContentTypeRelation`** : Table pivot "miroir" pour indexer les relations entre types.
- **`ContentEntryRelation`** : Table pivot "miroir" pour indexer les relations entre entrées.

### 🧱 Builder (Moteur de Rendu)
- **`Page`** : Définit une page publique avec son slug unique.
- **`PageRevision`** : Gère le versioning (Brouillon vs Publié).
- **`Section`** : Conteneur horizontal de premier niveau.
- **`BlocTemplate`** : Structure récursive (arbre) représentant les composants visuels.
- **`Component`** : Catalogue des composants disponibles (Text, Image, Button, etc.).

---

## 🔗 Relations Critiques

### Shadow Mirroring (Relations CMS)
Comme les données des entrées sont stockées en **JSON**, Prisma ne peut pas nativement garantir l'intégrité relationnelle SQL. Pour pallier cela, le backend utilise des **Tables Pivots de Synchronisation** :

1. Lorsqu'une relation est créée dans le `data_json` d'une `ContentEntry`, une ligne est ajoutée dans `ContentEntryRelation`.
2. Cela permet d'effectuer des jointures SQL performantes et de **bloquer la suppression** d'un média ou d'un contenu s'il est encore utilisé ailleurs.

### Récursivité des Blocs
Le modèle `BlocTemplate` utilise une relation d'auto-référence :
```prisma
model BlocTemplate {
  id       Int            @id @default(autoincrement())
  parentId Int?
  parent   BlocTemplate?  @relation("SubBlocks", fields: [parentId], references: [id])
  children BlocTemplate[] @relation("SubBlocks")
}
```
Cela permet de construire des arbres de composants de n'importe quelle profondeur (ex: une Grille contenant des Cartes contenant des Boutons).

---

## 🛠️ Maintenance de la Base
Les migrations sont gérées via Prisma :
- Appliquer les changements : `npx prisma migrate dev`
- Visualiser la base : `npx prisma studio`
