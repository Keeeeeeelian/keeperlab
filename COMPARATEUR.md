# Comparateur de gants

La page `comparateur.html` charge exclusivement `data/products.json` et retient les produits de catégorie `gants`. Aucune caractéristique n'est déduite du nom, du badge ou de la description, et les valeurs génériques de `produit.js` ne sont pas utilisées.

Les champs facultatifs suivants peuvent être ajoutés à un produit, directement ou dans un objet `specs` : `cut`, `latex`, `grip`, `durability`, `terrain`, `conditions`, `fit`, `closure`, `keeperlabScore`, `sizes`, `fingerProtection`, `weight`. Les champs directs sont prioritaires. Les champs absents, nuls ou vides affichent « Non renseigné ». Les tableaux sont affichés avec un séparateur ; les booléens affichent Oui / Non. Utiliser des chaînes avec unités ou échelles explicites pour les notes et le poids (ex. une note vérifiée avec son dénominateur), sans inventer de score. Le prix est un nombre ; `currency` est facultatif et vaut CHF par défaut, comme dans le catalogue.

Pour ajouter une caractéristique comparable, compléter la liste `fields` dans `comparateur.js`. Les deux cellules seront toujours générées dans la même ligne. Sur mobile, le libellé occupe une ligne au-dessus des deux valeurs.

Les paramètres `left` et `right` acceptent les identifiants des gants existants pour retrouver une sélection par URL. Un identifiant inconnu laisse la sélection vide. Un même gant sélectionné deux fois affiche une indication. Une erreur réseau propose de réessayer.

Le catalogue actuel contient cinq gants, mais aucune note technique structurée. Les descriptions existantes restent accessibles dans la comparaison ; les données sources ne sont pas modifiées.
