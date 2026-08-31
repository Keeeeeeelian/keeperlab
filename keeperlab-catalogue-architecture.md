# KeeperLab — Architecture du catalogue produit

## Objectif V1

Pour la première version de KeeperLab, le catalogue de produits ne nécessite **ni base de données serveur, ni hébergement payant**. Le site reste statique et peut être hébergé gratuitement sur **GitHub Pages** avec le domaine `keeperlab.ch`.

L’objectif est d’avoir un catalogue rapide, simple à maintenir et capable d’afficher des produits affiliés avec des filtres (marque, prix, type de coupe, etc.).

## Architecture recommandée

```text
GitHub Pages
│
├── index.html
├── catalogue.html
├── produit.html
├── style.css
├── script.js
│
└── data/
    └── products.json
```

- **GitHub Pages** : hébergement gratuit du site statique.
- **`data/products.json`** : catalogue public des produits.
- **JavaScript** : charge les données, génère les cartes produit et applique les filtres/recherches dans le navigateur.
- **HTML/CSS** : structure et design du site.

## Données produits

Chaque produit est stocké sous forme de donnée dans `data/products.json`. Exemple :

```json
[
  {
    "id": "uhlsport-absolutgrip",
    "name": "Uhlsport Absolutgrip",
    "brand": "Uhlsport",
    "category": "Gants",
    "cut": "Negative Cut",
    "price": 89.90,
    "currency": "CHF",
    "image": "images/products/uhlsport-absolutgrip.jpg",
    "affiliateUrl": "https://..."
  }
]
```

Le champ **`affiliateUrl`** contient le lien affilié du marchand. Le bouton « Voir l’offre » du site redirige vers ce lien : KeeperLab ne vend pas directement les produits et ne gère donc pas de paiement.

## Fonctionnement côté site

JavaScript doit :

1. charger `data/products.json` ;
2. générer automatiquement les cartes de produits dans le catalogue ;
3. permettre la recherche et les filtres par marque, catégorie, prix, coupe ou caractéristiques ;
4. ouvrir la fiche produit ou envoyer l’utilisateur vers le lien affilié ;
5. fonctionner entièrement côté navigateur, sans serveur.

Cette approche permet de modifier ou d’ajouter un produit en changeant simplement les données, sans recréer manuellement chaque carte HTML.

## Notion comme back-office

Notion reste le **back-office interne** de KeeperLab : il sert à gérer les produits, les marques, les liens affiliés, les contenus et le suivi du projet.

Pour la V1, la publication peut être manuelle : les informations validées dans Notion sont reportées dans `products.json`. Plus tard, un export ou une automatisation pourra synchroniser Notion vers ce fichier JSON.

```text
Notion (gestion interne)
        ↓
products.json (catalogue public)
        ↓
GitHub Pages (site KeeperLab)
        ↓
Lien affilié (marchand)
```

## Pourquoi cette solution est adaptée au lancement

- gratuite avec GitHub Pages ;
- pas de serveur à administrer ;
- pas de base de données payante ;
- très rapide et simple à déployer ;
- parfaite pour un catalogue affilié de taille raisonnable ;
- facile à faire évoluer avec Codex.

## Évolution future

Si KeeperLab grandit fortement — par exemple avec plusieurs centaines de produits, des prix et disponibilités mis à jour automatiquement, des comptes utilisateurs, des favoris, des comparaisons sauvegardées ou un véritable espace d’administration — `products.json` deviendra moins pratique.

À ce moment-là, l’architecture pourra évoluer sans changer le principe du site :

```text
Site KeeperLab (frontend)
        ↓
API
        ↓
Base de données
```

Une solution comme **Supabase / PostgreSQL** pourra alors remplacer le fichier JSON. Cette migration n’est pas nécessaire pour la V1 : commencer avec **GitHub Pages + JSON + JavaScript** permet de lancer KeeperLab rapidement et sans coût d’hébergement.
