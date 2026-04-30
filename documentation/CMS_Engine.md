# Moteur CMS & Gestion Dynamique du Contenu

Le module CMS est le composant le plus sophistiqué du backend. Il permet de gérer des types de contenus totalement arbitraires tout en maintenant une intégrité relationnelle SQL stricte.

---

## 🏗️ 1. Architecture Hybride (JSON + SQL)

Le défi d'un CMS flexible est de permettre des schémas qui évoluent sans changer la structure de la base de données.

### Stockage JSON
Le schéma des champs (`fields_schema`) d'un `ContentType` et les valeurs des entrées (`data_json`) d'une `ContentEntry` sont stockés dans des colonnes de type **JSON**. Cela offre une flexibilité infinie.

### La Problématique des Relations
Le JSON pur empêche les jointures SQL et les contraintes de clés étrangères (ex: "Empêcher la suppression d'un Auteur si un Article pointe vers lui").

---

## 🛡️ 2. Shadow Mirroring (Tables Pivots)

Pour résoudre le conflit entre flexibilité (JSON) et rigueur (SQL), Compositor implémente le **Shadow Mirroring**.

À chaque fois qu'une `ContentEntry` est sauvegardée, le service scanne son JSON. S'il trouve des IDs de relations (images, autres contenus, taxonomies), il les extrait et les enregistre dans une table SQL réelle : **`ContentEntryRelation`**.

### Utilité Technique
- **Performance** : Permet de trouver instantanément tous les articles liés à une catégorie sans parser des milliers de fichiers JSON.
- **Intégrité** : Le système vérifie cette table avant toute suppression pour bloquer l'action si des dépendances existent.

---

## 🔄 3. Migration de Schéma (`logiqueModContentType`)

Lorsqu'un administrateur modifie la structure d'un `ContentType` (ex: suppression d'un champ "Prix"), les données existantes en base deviennent obsolètes.

Le backend déclenche alors une procédure de **nettoyage intelligent** :
1. **Identification** : Comparaison de l'ancien et du nouveau schéma.
2. **Action DELETE** : Si un champ est supprimé, il est retiré récursivement du JSON de toutes les entrées associées.
3. **Action NULL** : Si le type d'un champ change radicalement (ex: de Texte à Relation), la valeur est mise à `null` pour éviter que le frontend ne tente d'afficher un objet complexe comme une simple chaîne.

---

## 🏷️ 4. Taxonomies et Classification

Le système de taxonomie est géré indépendamment du contenu.
- Les relations sont persistées via la table `TaxonomyTerm`.
- Cela permet un filtrage croisé puissant : on peut filtrer des contenus par plusieurs termes de taxonomies différentes (ex: "Catégorie: Blog" + "Tag: Tech").
