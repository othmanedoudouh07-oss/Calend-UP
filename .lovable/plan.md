

# PlanSmart — Application de Planning Hebdomadaire Intelligent

## Vue d'ensemble
Application mobile native (Capacitor) de gestion de planning avec thème personnalisable (sombre/coloré), stockage local, suggestions intelligentes et rappels proactifs.

---

## Arborescence & Navigation

**Navigation principale** — Barre de navigation en bas avec 4 onglets :

1. **📅 Planning** — Vue hebdomadaire (par défaut) avec possibilité de basculer en vue jour
2. **✅ Tâches** — Liste des tâches par catégorie avec ajout rapide
3. **💊 Santé** — Gestion des traitements et rappels médicaux
4. **⚙️ Paramètres** — Thème, catégories, routines, préférences de notifications

---

## Écrans & Fonctionnalités

### 1. Planning (écran principal)
- Vue semaine avec timeline verticale, événements colorés par catégorie
- Swipe gauche/droite pour changer de semaine
- Bouton flottant "+" pour ajout rapide (tâche, événement ou prise médicament)
- Section "Suggestions" en haut : tâches récurrentes détectées + routines à appliquer en 1 tap
- Indicateur visuel des prises de médicaments du jour

### 2. Ajout rapide (bottom sheet)
- Formulaire contextuel qui pré-remplit selon l'heure et les habitudes
- Choix du type : Événement / Tâche / Prise médicament
- Sélection de catégorie avec pastilles colorées (Sport 🟢, Travail 🔵, Personnel 🟣, Santé 🔴...)
- Récurrence (quotidien, hebdomadaire, personnalisé)
- Configuration du rappel (5min, 15min, 30min, 1h avant)

### 3. Tâches
- Groupement par catégorie avec accordéons colorés
- Glisser pour compléter ou reporter
- Filtre : Aujourd'hui / Cette semaine / Toutes
- Badge compteur de tâches en retard

### 4. Module Santé
- Liste des traitements actifs avec posologie
- Formulaire d'ajout : nom du médicament, dosage, fréquence, horaires de prise, durée du traitement
- Historique des prises (pris ✅ / oublié ❌ / reporté ⏳)
- Rappels automatiques générés selon la posologie
- Vue calendrier des prises

### 5. Routines & Templates
- Créer des routines (ex: "Routine matin" = réveil + sport + petit-déj)
- Appliquer une routine en 1 tap pour remplir une journée
- Suggestions de routines basées sur les habitudes détectées

### 6. Paramètres
- **Thème** : Sombre / Coloré / Automatique (selon l'heure)
- **Catégories** : Gérer les rubriques et leurs couleurs
- **Notifications** : Niveau d'insistance (doux, normal, strict avec re-rappel)
- **Données** : Export/Import JSON pour backup

---

## Système de notifications intelligentes
- Notifications locales via Capacitor Local Notifications
- Rappels stricts : si non acquitté, re-notification à intervalle croissant (5min, 15min, 30min)
- Rappels médicaux : priorité haute, non silencieux
- Résumé matinal : notification avec aperçu de la journée
- Alerte de conflit si chevauchement d'événements

---

## Aspect prédictif
- Détection de patterns récurrents dans l'historique (ex: "sport le mardi à 18h" → suggestion)
- Pré-remplissage intelligent des formulaires selon le contexte (heure, jour)
- Alertes proactives : "Vous avez habituellement une tâche Sport le mardi, voulez-vous l'ajouter ?"

---

## Design
- Palette bicolore personnalisable avec pastilles de couleur vives par catégorie
- Mode sombre par défaut avec option colorée
- Typographie claire, espacement généreux
- Micro-animations sur les interactions (complétion de tâche, changement de vue)
- Icônes expressives pour chaque catégorie

---

## Stack technique
- **React + TypeScript + Tailwind CSS** — Interface
- **Capacitor** — Build natif iOS/Android
- **@capacitor/local-notifications** — Notifications locales
- **localStorage / IndexedDB** — Stockage persistant local
- **date-fns** — Gestion des dates
- **Framer Motion** — Animations
- **Zustand** — State management

