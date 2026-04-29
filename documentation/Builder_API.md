# API du Constructeur (Builder)

L'API du Builder gère la persistance de la structure visuelle des pages, des sections et de l'arbre récursif de composants.

---

## 🌳 1. Structure Récursive des Blocs

Le cœur du Builder est le modèle **`BlocTemplate`**. Contrairement à une structure à plat, les blocs peuvent contenir d'autres blocs, créant une arborescence.

### Auto-référence
Chaque bloc peut avoir un `parentId`. Cette structure permet au frontend de rendre la page de manière récursive :
1. Charger la section.
2. Parcourir les blocs de niveau 1.
3. Pour chaque bloc, rendre ses enfants, et ainsi de suite.

### Modèles vs Instances
- **Bloc Modèle** : Un bloc prédéfini (ex: un Hero Banner standard) avec des styles par défaut.
- **Bloc Instance** : Un bloc posé sur une page qui hérite de son modèle mais possède ses propres surcharges (`props` JSON).

---

## 📄 2. Pages et Sections

### Le Modèle `Section`
Une section est le conteneur de plus haut niveau dans une page. Elle porte les styles de mise en page globaux (Flexbox/Grid) et contient une liste ordonnée de `BlocTemplates`.

### Gestion des Versions (`PageRevision`)
Pour permettre de travailler sur des modifications sans casser le site en ligne, Compositor utilise des **Révisions** :
- **DRAFT** : La version en cours d'édition dans le builder.
- **PUBLISHED** : La version active servie aux visiteurs.
- Lorsqu'une page est publiée, une nouvelle révision est créée ou l'ancienne est marquée comme active.

---

## 🛠️ 3. Catalogue de Composants

Le modèle **`Component`** sert de registre central pour le Builder. Il définit :
- Le `tag` HTML ou Vue utilisé pour le rendu.
- La `family` (statut, interactif, conteneur).
- Les `defaultProps` : la configuration initiale du composant lors de sa création.

---

## 🔄 4. Synchronisation Frontend/Backend

Le Builder transmet des objets JSON complexes représentant les styles et les paramètres. Le backend ne valide pas le détail du CSS (laissé au frontend), mais il garantit :
1. Que les relations vers les médias ou les variables existent.
2. Que l'ordre (`order`) des blocs est cohérent pour le rendu.
3. Que la hiérarchie parent/enfant est préservée.
