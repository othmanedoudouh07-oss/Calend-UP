

# Améliorations : Thème coloré personnalisable, Notifications interactives, Catégories éditables, Interface Santé

## 1. Thème coloré avec choix de couleurs

**Settings store** : Ajouter un champ `colorfulAccent` (ex: `'purple' | 'blue' | 'pink' | 'green' | 'orange'`) dans le store settings.

**CSS** : Créer des variantes `.colorful-purple`, `.colorful-blue`, `.colorful-pink`, `.colorful-green`, `.colorful-orange` dans `index.css`, chacune avec sa propre palette HSL (primary, accent, secondary).

**UI Settings** : Quand le thème "Coloré" est sélectionné, afficher une rangée de cercles colorés cliquables pour choisir l'accent. Animation de sélection avec un check au centre.

**useTheme hook** : Appliquer la classe composée (ex: `colorful colorful-pink`) sur `<html>`.

## 2. Notifications interactives (Settings)

Remplacer les boutons statiques par des cartes interactives avec :
- Un **switch toggle** pour activer/désactiver les notifications globalement
- Pour chaque niveau (Doux/Normal/Strict), afficher un **aperçu visuel** animé simulant le comportement (ex: 1 bulle pour doux, 3 bulles qui rebondissent pour strict)
- Ajouter des options granulaires : toggle par catégorie (recevoir les notifs Sport, Travail, etc.)
- Ajouter un **sélecteur d'heure** pour le résumé matinal

## 3. Catégories interactives (Settings)

Remplacer les badges statiques par une liste éditable :
- Chaque catégorie affichée comme une carte avec son icône, nom, et couleur
- Bouton **modifier** (ouvre un mini-formulaire inline pour changer nom/icône/couleur)
- Bouton **supprimer** avec confirmation
- Bouton **"+ Nouvelle catégorie"** en bas avec un formulaire : nom, choix d'icône (grille d'emojis), choix de couleur (palette)
- Drag-and-drop pour réordonner (optionnel, via framer-motion reorder)

## 4. Interface Santé améliorée

**Page Health.tsx** :
- Ajouter un **header avec statistiques** : cercle de progression des prises du jour (X/Y prises), streak de jours consécutifs
- Séparer visuellement les prises par moment de la journée (Matin / Midi / Soir) avec des icônes ☀️ 🌤️ 🌙
- Ajouter un **onglet Historique** avec un mini-calendrier montrant les jours verts (tout pris) / orange (partiel) / rouge (manqué)
- Animations Framer Motion sur le changement de statut des prises (scale bounce)

**Formulaire ajout médicament** (Sheet) :
- Formulaire en **étapes** (stepper) : 1) Nom + dosage, 2) Fréquence + horaires, 3) Durée + notes
- Ajout d'un champ **date de fin** (optionnel) avec un toggle "Durée indéterminée"
- Champ **notes** pour instructions spéciales (ex: "à prendre pendant le repas")
- Choix de **couleur/icône** pour le médicament
- Preview du médicament en bas du formulaire avant validation

## Fichiers modifiés

| Fichier | Changement |
|---------|-----------|
| `src/types/index.ts` | Ajouter `ColorfulAccent` type, champ `notes`/`color`/`icon` sur Medication |
| `src/stores/useSettingsStore.ts` | Ajouter `colorfulAccent`, `notificationsEnabled`, `morningDigestTime`, `notifByCategory` |
| `src/hooks/useTheme.ts` | Appliquer la sous-classe colorful |
| `src/index.css` | 5 variantes de thème coloré |
| `src/pages/SettingsPage.tsx` | Refonte sections thème, notifications, catégories |
| `src/pages/Health.tsx` | Refonte complète avec stats, timeline par moment, historique |
| `src/components/health/MedicationStepper.tsx` | Nouveau : formulaire multi-étapes |
| `src/components/health/IntakeCalendar.tsx` | Nouveau : mini-calendrier historique |
| `src/components/settings/CategoryEditor.tsx` | Nouveau : éditeur de catégories |
| `src/components/settings/ColorPicker.tsx` | Nouveau : sélecteur de couleur accent |

