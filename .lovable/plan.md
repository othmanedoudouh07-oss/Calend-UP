

# RGPD — Mise en conformité de PlanSmart

## Contexte

PlanSmart stocke toutes les données localement (localStorage via Zustand persist). Aucune donnée n'est envoyée à un serveur. Cela simplifie la conformité RGPD mais n'exempte pas de certaines obligations : information de l'utilisateur, consentement, droits d'accès/suppression/portabilité.

---

## Ce qui sera implémenté

### 1. Bandeau de consentement (Cookie/Data Consent)
- Composant `GDPRConsentBanner.tsx` affiché au premier lancement
- Stocke le consentement dans localStorage (`plansmart-gdpr-consent`)
- L'utilisateur peut accepter ou consulter la politique avant d'utiliser l'app
- Ne bloque pas l'usage mais reste visible tant que non accepté

### 2. Page Politique de Confidentialité
- Nouvelle page `/privacy` (`PrivacyPage.tsx`)
- Contenu en français couvrant :
  - Responsable du traitement
  - Types de données collectées (tâches, santé, profil)
  - Base légale (consentement)
  - Durée de conservation (tant que l'utilisateur ne supprime pas)
  - Stockage local uniquement — aucun transfert vers un serveur
  - Droits de l'utilisateur (accès, rectification, suppression, portabilité)
  - Données de santé : mention spécifique (données sensibles art. 9 RGPD)
  - Contact

### 3. Droits RGPD dans les Paramètres
Nouvelle section "Vie privée & RGPD" dans `SettingsPage.tsx` :
- **Voir mes données** : affiche un résumé des données stockées (nombre de tâches, médicaments, profil)
- **Exporter mes données** : déjà existant (export JSON) — sera labellisé "Droit à la portabilité"
- **Supprimer toutes mes données** : déjà existant — sera labellisé "Droit à l'effacement"
- **Retirer mon consentement** : remet le bandeau de consentement
- Lien vers la politique de confidentialité

### 4. Consentement spécifique données de santé
- Lors du premier ajout de médicament, afficher une modale d'information :
  "Vous allez renseigner des données de santé. Ces données restent stockées uniquement sur votre appareil et ne sont jamais transmises."
- Consentement stocké séparément (`plansmart-health-consent`)

---

## Fichiers impactés

| Fichier | Action |
|---------|--------|
| `src/components/GDPRConsentBanner.tsx` | Nouveau — bandeau de consentement |
| `src/components/health/HealthDataConsent.tsx` | Nouveau — modale consentement santé |
| `src/pages/PrivacyPage.tsx` | Nouveau — politique de confidentialité |
| `src/pages/SettingsPage.tsx` | Ajout section "Vie privée & RGPD" |
| `src/pages/Health.tsx` | Intégration consentement santé |
| `src/App.tsx` | Ajout route `/privacy`, ajout `GDPRConsentBanner` |

