# Espace Maillots

`maillots.html` charge uniquement `data/maillots.json` via `maillots.js`.
Les données, filtres et cartes sont indépendants du catalogue gardien.
Ne pas ajouter ces maillots dans `data/products.json`.

Pour ajouter un maillot, ajouter un objet au tableau JSON avec un identifiant
unique et les champs `id`, `club`, `name`, `type`, `season`, `sizes`, `merchant`,
`affiliateUrl` et `image`. Les types sont `domicile`, `exterieur` et `third`.
Les clubs du filtre sont calculés automatiquement à partir des données.

Conserver les URLs Awin exactement telles que fournies, sans décoder ni réencoder
la destination. Les liens sont construits avec `setAttribute` et portent
`target="_blank"` et `rel="sponsored noopener noreferrer"`.

Laisser `image` à `null` tant que le visuel n'a pas été fourni. Le placeholder
KeeperLab est alors affiché ; une image qui échoue à charger utilise aussi ce
placeholder. Ajouter ensuite le chemin réel de l'image dans le JSON suffit.

Aucun prix, stock, remise, fiche individuelle ou score n'est calculé.
Le chargement utilise un chemin relatif compatible avec GitHub Pages.
