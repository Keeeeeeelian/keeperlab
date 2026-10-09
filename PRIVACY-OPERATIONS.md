# Confidentialité KeeperLab — vérifications du 9 octobre 2026

## Changements proposés sur le site

- Umami est chargé uniquement après consentement. Refus et acceptation ont la même présentation. Le lien permanent « Confidentialité & choix » permet le retrait. La préférence locale expire après 180 jours ; un stockage indisponible ou invalide ne donne jamais un accord implicite.
- Le retrait bloque les nouveaux événements puis recharge la page pour retirer les écouteurs Umami. Une requête déjà envoyée ne peut pas être rappelée.
- Do Not Track est respecté. Les statistiques se limitent aux pages vues : paramètres d’URL, fragments et chemins du référent sont retirés. Les événements nommés, propriétés et identifiants sont bloqués. Les domaines de production sont explicitement autorisés ; la prévisualisation locale n’envoie pas de statistiques.
- Le formulaire Brevo utilise un POST HTML standard. Aucun script ni iframe Brevo n’est chargé sur KeeperLab. Le champ OPT_IN=1 correspond au champ du formulaire hébergé vérifié, avec une case décochée et obligatoire côté navigateur.
- Les polices sont locales ; les licences SIL OFL sont conservées dans assets/fonts. Les images distantes Adidas/Unsplash restent des appels tiers, décrits dans la politique.

## Réglages de comptes vérifiés / appliqués

Brevo : double confirmation déjà active, vers la liste Newsletter KeeperLab. Le message après soumission a été corrigé pour demander de consulter l’e-mail de confirmation. Le champ RGPD OPT_IN et son texte ont été ajoutés ; leur présence a été vérifiée sur le formulaire hébergé.

Brevo : « Consentement de suivi par contact » activé, « Suivre les contacts dont le consentement est inconnu » réglé sur Non. Sauvegarde vérifiée après rechargement. Ne pas confondre ce réglage avec le simple suivi anonyme. Le site ne collecte aucun consentement aux pixels et ne renseigne pas _PIXEL_TRACKING_CONSENT.

Umami : le compte indique EU (Frankfurt), offre Hobby, conservation de six mois. Aucun changement d’abonnement ni suppression d’historique réalisé.

## Mise en ligne coordonnée — validation du propriétaire requise

1. Valider et publier les changements du site.
2. Dans Brevo, Formulaires > Formulaire KeeperLab > Conception > champ RGPD, activer « Champ requis » puis enregistrer. Cette option serveur est volontairement encore désactivée afin de ne pas bloquer l’ancien formulaire en production, qui n’envoie pas OPT_IN. La double confirmation reste active pendant la transition.
3. Avec une adresse de test autorisée, vérifier le POST sans script, la réception de la demande de confirmation, l’absence d’abonnement à la liste avant clic, l’enregistrement OPT_IN, puis l’abonnement après clic et la désinscription. Aucun e-mail de test n’a été envoyé pendant la préparation.
4. Inspecter le HTML d’un e-mail effectivement reçu pour confirmer l’absence de suivi d’ouverture/clic avec un consentement inconnu. L’interface et la documentation Brevo confirment le réglage, mais ne remplacent pas ce test.
5. En session vierge, contrôler le réseau et le stockage avant choix, après refus, après acceptation et après retrait. Le test local vérifie l’insertion des scripts et la logique de consentement ; une capture réseau complète de production reste à faire après déploiement.

## Conservation et contrats

La politique décrit six mois pour Umami, 180 jours pour le choix local et l’utilisation de l’adresse pendant l’abonnement, avec conservation restreinte des preuves/oppositions ensuite. Aucun nettoyage automatique des contacts ou délai fixe de suppression Brevo n’a été inventé ni activé. Définir une revue périodique des abonnés inactifs et une durée de preuve adaptée avant toute purge ; conserver les oppositions pour éviter une réinscription involontaire.

Brevo indique des bases hébergées dans l’UE (France, Allemagne, Belgique). La région européenne d’Umami ne prouve pas l’absence de tout accès international. Archiver les accords de sous-traitance, garanties de transfert et listes de sous-traitants applicables aux comptes. Leur acceptation contractuelle n’a pas été réalisée dans cette intervention.

## Validation technique

`node --test tests/privacy.test.cjs` vérifie le refus, le chargement après accord, le retrait, la synchronisation inter-onglets, les préférences invalides/expirées, Do Not Track, la minimisation et les intégrations sur toutes les pages.

Contrôles dans le navigateur local : absence de balise Umami avant choix et après refus/rechargement ; chargement après acceptation ; réouverture des choix ; rendu mobile. Aucun test ne soumet de contact réel automatiquement.

Sources : [Umami configuration](https://docs.umami.is/docs/tracker-configuration), [Brevo double opt-in](https://help.brevo.com/hc/fr/articles/208771869), [Brevo consentement pixels](https://help.brevo.com/hc/fr/articles/37113920427922), [stockage Brevo](https://help.brevo.com/hc/fr/articles/360001005510).
