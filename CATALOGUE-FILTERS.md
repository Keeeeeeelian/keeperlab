# Catalogue et fiches produit

Toutes les cartes du catalogue ouvrent `produit.html?id=…`. Les fiches détaillées existantes restent accessibles à leurs anciennes adresses ; leurs caractéristiques, compositions et conseils d’entretien sont aussi intégrés dans la fiche unifiée.

Les filtres utilisent uniquement les données présentes : `brand`, `price`, et les champs de `specs` (`cut`, `latex`, `terrain`, `conditions`, `fit`, `closure`, `fingerProtection`). Les coupes équivalentes sont regroupées dans les filtres.

Le filtre des tailles disponibles utilise `availability.selectableSizes`, avec une date `availability.checkedAt`. `specs.sizes` ou `sizes` seuls indiquent une gamme de tailles, sans confirmer le stock. Les disponibilités ne sont pas en temps réel.

Pour les chaussures, renseigner `specs.surface` (ex. « FG — gazon naturel ferme », « AG — synthétique », « SG — terrain meuble », « TF — stabilisé »), `specs.metalStuds` (booléen), et les pointures relevées dans `availability.selectableSizes`. Les contrôles restent désactivés si aucun produit de la catégorie ne possède ces informations. Ne pas déduire la présence de métal du seul code de semelle.

La galerie utilise `image` et éventuellement `images` (liste d’URLs). Le bouton Acheter utilise `affiliateUrl`, ou à défaut `sourceUrl`. Les prix absents ne sont jamais affichés comme zéro. Aucune caractéristique ou taille de substitution n’est ajoutée.

Vérification navigateur : combinaison latex/taille, navigation depuis une carte, destination du bouton Acheter, caractéristiques détaillées Adidas, textile, informations chaussures manquantes, absence de débordement mobile et d’erreurs JavaScript. Les ressources distantes ont été bloquées dans cette vérification locale ; le chargement des photos externes reste à vérifier sur le site hébergé.
