# Maillots dans le catalogue Textile

Le catalogue charge data/products.json et data/maillots.json via catalogue.js.
Les maillots sont classés dans Textile au chargement ; leurs données restent
exclusivement dans data/maillots.json.

Les filtres Type d’équipement puis Club sont disponibles dans Tout et Textile et se combinent
avec la recherche. Ils sont réinitialisés lors du passage à une autre catégorie.
Les types sont calculés à partir des produits Textile présents. Les clubs dépendent
du type sélectionné ; le filtre Club est masqué si aucun club ne correspond.
Une sélection de club incompatible est réinitialisée lors du changement de type.

Dans data/products.json, renseigner category: "textile" et equipmentType :
hauts-gardien, bas-gardien, ensembles-gardien ou sous-couches. Sans ce champ,
le produit apparaît dans Autres textiles. Les maillots de data/maillots.json
reçoivent automatiquement le type maillots-foot au chargement.
Les valeurs domicile, exterieur et third restent des informations de fiche, sans filtre.

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
