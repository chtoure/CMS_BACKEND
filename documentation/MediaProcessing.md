# Traitement des Médias & Pipeline Sharp

Le module de Médiathèque ne se contente pas de stocker des fichiers ; il offre un moteur de transformation d'images puissant basé sur la bibliothèque **Sharp**.

---

## 📁 1. Stockage et Upload

### Téléchargement (Multer)
Le backend utilise **Multer** pour réceptionner les fichiers via des requêtes `multipart/form-data`.
- Les fichiers sont stockés dans le répertoire physique `/media`.
- Une entrée est créée dans la table `Media` pour référencer le chemin et les métadonnées.

### Métadonnées automatiques
Lors de l'upload, le système extrait automatiquement :
- Les dimensions (Largeur/Hauteur) pour les images.
- La durée pour les vidéos.
- Le poids du fichier.

---

## 🎨 2. Moteur d'Édition d'Image

L'endpoint `POST /api/media/edit/:id` déclenche le pipeline de transformation Sharp. Ce processus est conçu pour être déterministe et garantir un résultat prévisible.

### Pipeline de Transformation (`MediaController.editImage`)
L'ordre des opérations est crucial car chaque étape modifie la matrice de pixels pour la suivante :

1.  **Extraction de l'Original** : Le serveur lit le fichier source à partir de son chemin en base.
2.  **Auto-rotation** : Sharp analyse les données EXIF pour redresser l'image si elle a été prise verticalement avec un smartphone.
3.  **Recadrage (Crop)** : Application des coordonnées `x, y, width, height`.
    > [!IMPORTANT]
    > Les coordonnées reçues du frontend sont déjà normalisées par rapport à la taille réelle des pixels de l'image source.
4.  **Rotation manuelle** : Application d'un pivot (ex: 90°, 180°).
5.  **Application de Filtres** :
    - Niveaux de gris (`grayscale`).
    - Flou (`blur`).
6.  **Génération du Fichier final** : L'image traitée est enregistrée sous un nouveau nom (versioning) pour ne pas détruire l'original si nécessaire, et les métadonnées en base sont mises à jour.

---

## 🚀 3. Optimisation et Performance

### Formats de sortie
Le système privilégie le format **WebP** pour les images transformées afin d'optimiser le temps de chargement sur le frontend sans perte de qualité visible.

### Gestion du Cache
Les images servies par le backend incluent des en-têtes de cache appropriés pour réduire la charge serveur lors des visites répétées des utilisateurs sur le site public.
