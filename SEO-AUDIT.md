# Audit SEO KeeperLab — application du 24 septembre 2026

Base : `42859b2587ae64722416920248631d543a9d83ed` (main).
Correctif SEO préparé pour publication sur GitHub Pages.

## Les cinq priorités

1. Titres et titres Open Graph réécrits sur l’accueil, le catalogue, les maillots, le comparateur et Trouve ton gant.
2. Contenu HTML statique ajouté sous les grilles : 316 mots pour le catalogue, 345 pour les maillots, liens compris.
3. Quatre fiches domicile 2026/27 créées : Real Madrid, PSG, FC Barcelona et Manchester City. Données issues de `data/maillots.json`, images et liens affiliés conservés. Fiches liées depuis les cartes, depuis le contenu statique et depuis le sitemap. La fiche Predator existante est enrichie.
4. JSON-LD Product ajouté sur Predator et les quatre nouvelles fiches. Informations limitées aux données disponibles : aucune note, aucun stock ou prix inventé.
5. Deux guides enrichis : choix des gants (869 mots) et coupes (876 mots), sommaires, liens contextuels et dates de modification actualisés. Sources Markdown synchronisées.

## Vérification

- 12 pages ouvertes dans Edge automatisé ; un H1 et une canonical par page.
- JSON-LD analysé sans erreur de syntaxe ; ressources et liens locaux présents.
- Affichage contrôlé à 390 et 1440 pixels, sans débordement horizontal après correction des titres et du conteneur du comparateur.
- Filtres maillots : 21 résultats, puis 3 pour Real Madrid, puis 1 en domicile.
- Quatre liens statiques vers les fiches disponibles avec JavaScript désactivé.
- Liens affiliés des nouvelles fiches identiques aux données d’origine.
- Aucune erreur JavaScript détectée pendant ces contrôles.
- `git diff --check` réussi.

## Maintenance et limite du balisage

Le champ facultatif `detailUrl` relie quatre entrées de `data/maillots.json` à leurs pages statiques. Lors d’une modification du produit, actualiser aussi sa fiche, son JSON-LD et sa date de modification dans le sitemap. Les fiches n’affirment pas une disponibilité actuelle des tailles ni une certification d’authenticité.

Le balisage Product décrit les produits mais n’est pas éligible à lui seul aux extraits produit enrichis Google : ces derniers exigent notamment une offre ou des avis admissibles. Les données du dépôt ne permettent pas de les renseigner honnêtement. Aucun test Rich Results en ligne ni demande d’indexation Search Console n’a été effectué. Voir la [documentation Google sur les extraits produit](https://developers.google.com/search/docs/appearance/structured-data/product-snippet).
