# Maillots dans le catalogue Textile

Le catalogue charge data/products.json et data/maillots.json via catalogue.js.
Les maillots sont classés dans Textile au chargement ; leurs données restent
exclusivement dans data/maillots.json.

Les filtres Club et Tenue sont disponibles dans Tout et Textile et se combinent
avec la recherche. Ils sont réinitialisés lors du passage à une autre catégorie.
Les clubs sont calculés automatiquement à partir des données.

Pour ajouter un maillot, ajouter un objet avec un identifiant unique et les champs
id, club, name, type, season, sizes, merchant, affiliateUrl et image.
Les types sont domicile, exterieur et third. Fournir le chemin du visuel dans image.
Le champ optionnel detailUrl pointe vers une fiche individuelle existante.

Conserver les URLs Awin exactement telles que fournies, sans décoder ni réencoder
la destination. Les liens partenaires ouvrent un nouvel onglet et portent
rel="sponsored noopener noreferrer". Aucun prix ni score n'est inventé.

L'ancienne page maillots.html redirige vers catalogue.html?category=textile,
avec un lien de secours. Les fiches individuelles sont conservées.
Les anciens fichiers maillots.js et maillots.css ne sont plus chargés.
