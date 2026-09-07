# Comparateur de gants

La page `comparateur.html` charge exclusivement `data/products.json` et retient les produits de catégorie `gants`. Aucune caractéristique n'est déduite du nom, du badge ou de la description, et les valeurs génériques de `produit.js` ne sont pas utilisées.

Les champs facultatifs suivants peuvent être ajoutés à un produit, directement ou dans un objet `specs` : `cut`, `latex`, `grip`, `durability`, `terrain`, `conditions`, `fit`, `closure`, `keeperlabScore`, `sizes`, `fingerProtection`. Les champs directs sont prioritaires. Les champs absents, nuls ou vides affichent « Non renseigné ». Les tableaux sont affichés avec un séparateur ; les booléens affichent Oui / Non. Utiliser des chaînes avec unités ou échelles explicites pour les notes (ex. une note vérifiée avec son dénominateur), sans inventer de score. Le prix est un nombre ; `currency` est facultatif et vaut CHF par défaut, comme dans le catalogue.

Pour ajouter une caractéristique comparable, compléter la liste `fields` dans `comparateur.js`. Les deux cellules seront toujours générées dans la même ligne. Sur mobile, le libellé occupe une ligne au-dessus des deux valeurs.

Les paramètres `left` et `right` acceptent les identifiants des gants existants pour retrouver une sélection par URL. Un identifiant inconnu laisse la sélection vide. Un même gant sélectionné deux fois affiche une indication. Une erreur réseau propose de réessayer.

Le catalogue actuel contient cinq gants de démonstration, avec des caractéristiques fictives déjà renseignées. Les autres données existantes sont conservées.

## Compléter un gant

Ouvrir `data/products.json`, rechercher le nom du gant, puis remplir son bloc `specs`. Chaque information occupe sa propre ligne. Le comparateur lit déjà ces champs : aucune modification du code n'est nécessaire pour les renseigner.

Les exemples ci-dessous illustrent uniquement la syntaxe ; ce ne sont pas des informations vérifiées sur les produits du catalogue.

| Champ | Information affichée | Exemple de saisie |
| --- | --- | --- |
| `cut` | Coupe | `"Négative"` |
| `latex` | Latex / paume | `"Nom du latex, épaisseur en mm"` |
| `grip` | Grip | `"8/10"` (uniquement si évalué) |
| `durability` | Durabilité | `"7/10"` (uniquement si évalué) |
| `terrain` | Terrain recommandé | `["Herbe naturelle", "Synthétique"]` |
| `conditions` | Météo / conditions | `["Sec", "Pluie"]` |
| `fit` | Ajustement | `"Ajusté"` |
| `closure` | Strap / fermeture | `"Sangle auto-agrippante"` |
| `keeperlabScore` | Score KeeperLab | `"8.5/10"` (uniquement si évalué) |
| `sizes` | Tailles disponibles | `["7", "8", "9", "10"]` |
| `fingerProtection` | Protection des doigts | `true` pour oui, `false` pour non |

La marque (`brand`), le modèle (`name`), le prix (`price`), le badge (`badge`) et la description (`description`) restent au-dessus du bloc `specs`. Le prix se saisit sans guillemets, avec un point décimal, par exemple `89.90`.

### Règles de saisie

- Remplacer `null` par l'information connue. Garder `null` sans guillemets si elle manque : le site affichera « Non renseigné ».
- Mettre le texte entre guillemets doubles. Ne pas ajouter de commentaires dans le JSON.
- Séparer les champs par une virgule, sauf après le dernier champ d'un objet ou d'une liste.
- Pour plusieurs valeurs, utiliser une liste entre crochets. Le comparateur les sépare automatiquement par un point médian.
- Inclure le dénominateur des notes et les unités des mesures. Ne pas attribuer une note sans évaluation.
- Conserver l'identifiant `id` d'un produit existant pour préserver les liens. Pour un nouveau gant, dupliquer un objet complet et choisir un identifiant unique, avec `category` égal à `"gants"`.
- Après modification, publier le fichier sur le site : les informations apparaîtront au prochain chargement du comparateur.

Attention : les caractéristiques et tailles des fiches `produit.html` sont encore définies par catégorie dans `produit.js`. Ce bloc `specs` alimente le comparateur ; il ne remplace pas encore ces informations génériques sur les fiches produit.
