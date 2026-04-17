

## Réponse rapide

Oui, **PlanSmart est déjà préparée pour iOS** grâce à Capacitor (le fichier `capacitor.config.ts` est configuré avec l'appId `app.lovable.13b4b6f889c04eb7aebfe9535258988c`). Mais il y a quelques étapes à suivre pour la faire tourner sur un vrai iPhone.

## Deux options possibles

### Option A — Tester sur ton iPhone (développement)

Pour installer l'app sur ton propre iPhone via Xcode (gratuit, mais nécessite un Mac) :

1. **Exporter le projet vers GitHub** depuis Lovable (bouton "Export to GitHub" en haut à droite)
2. **Cloner le repo** sur ton Mac : `git clone <url>`
3. **Installer les dépendances** : `npm install`
4. **Ajouter la plateforme iOS** : `npx cap add ios`
5. **Mettre à jour iOS** : `npx cap update ios`
6. **Builder le projet web** : `npm run build`
7. **Synchroniser avec iOS** : `npx cap sync`
8. **Ouvrir dans Xcode** : `npx cap open ios`
9. Brancher ton iPhone, sélectionner ton appareil dans Xcode, et cliquer sur ▶️

**Pré-requis** : un Mac, Xcode installé (gratuit sur l'App Store), un compte Apple Developer (gratuit pour tester sur ton propre appareil, 99 €/an pour publier sur l'App Store).

### Option B — Publier sur l'App Store

Pour que d'autres personnes puissent télécharger l'app :

1. Mêmes étapes que l'option A
2. Compte **Apple Developer Program** payant (99 €/an)
3. Créer une fiche app dans **App Store Connect** (icône, captures d'écran, description, politique de confidentialité — qu'on a déjà préparée 👍)
4. Archiver et soumettre via Xcode
5. Attendre la validation Apple (souvent 1 à 3 jours)

## Alternative plus simple — PWA

Si tu veux éviter Mac/Xcode/Apple Developer, on peut transformer PlanSmart en **Progressive Web App (PWA)**. L'utilisateur ouvre le lien sur Safari iPhone → "Ajouter à l'écran d'accueil" → l'app s'installe comme une vraie app, fonctionne hors-ligne. **Limitation iOS** : les notifications locales sont restreintes par Safari (moins fiables qu'en natif), ce qui pourrait gêner les rappels de médicaments.

## Mon avis

Pour PlanSmart, vu l'importance des **notifications de prises de médicaments**, le natif (Capacitor) est le meilleur choix. La PWA serait un bon test rapide mais les rappels santé seront moins fiables sur iOS.

## Ressources

- Guide officiel Lovable + Capacitor : https://lovable.dev/blog/mobile-app-development-with-capacitor
- Doc Capacitor iOS : https://capacitorjs.com/docs/ios

## Ce que je peux faire ensuite

Aucune modification de code n'est nécessaire pour l'instant — la config Capacitor est prête. Dis-moi simplement si tu veux :
- Que je te guide pas-à-pas sur ton Mac pour le build iOS
- Ou que je convertisse PlanSmart en PWA installable (plus simple, pas besoin de Mac)
- Ou que j'ajoute une icône d'app personnalisée et un splash screen avant le build natif

