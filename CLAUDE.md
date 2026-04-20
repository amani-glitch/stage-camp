# Summer Camp CD84 — Adaptation branding

## Contexte
Site d'inscription pour le Summer Camp CD84 (Comité Départemental de Basket-ball du Vaucluse).
Le code actuel fonctionne mais les couleurs sont identiques au Grind Camp (un autre camp basket).
On doit différencier visuellement tout en restant fidèle à la charte CD84.

## Charte graphique CD84 (source : logo + présentation officielle)
- **Orange CD84** : `#E8792B` (plus chaud/cuivré que le orange Tailwind pur)
- **Orange hover** : `#D4691F` (plus foncé au hover, pas plus clair)
- **Orange clair** : `#F0A060` (pour les accents subtils)
- **Noir primaire** : `#0D0D0D`
- **Noir secondaire** : `#171717`
- **Noir tertiaire** : `#222222`
- **Accent gris chaud** : `#8C8279` (au lieu du gris neutre actuel)
- Police titre : garder Bebas Neue
- Police body : garder Inter

## Tâches à exécuter

### 1. Palette de couleurs
Modifier `tailwind.config.js` et `src/styles/index.css` :
- Remplacer `#F97316` → `#E8792B` (orange-primary)
- Remplacer `#FB923C` → `#F0A060` (orange-hover)  
- Remplacer `#EA580C` → `#D4691F` (orange-dark)
- Mettre à jour toutes les références rgba(249, 115, 22, ...) avec les nouvelles valeurs rgb de `#E8792B` = rgb(232, 121, 43) dans index.css (animations, glow, etc.)
- Ajuster les gris pour un ton plus chaud si pertinent

### 2. Logo CD84
- Le fichier `Logo_CD84.jpeg` est à la racine du projet
- Le déplacer dans `public/` (ou `src/assets/` si le dossier existe)
- L'intégrer dans le composant Navbar.jsx (à gauche, avant le titre)
- L'intégrer dans le Footer.jsx
- Taille navbar : h-10 environ
- Taille footer : h-16 environ

### 3. Vérifications (ne PAS modifier)
- NE PAS toucher au contenu textuel (dates, tarif, lieu, contact — tout est correct)
- NE PAS toucher au backend (routes, services, chatbot)
- NE PAS modifier les .env.example
- NE PAS restructurer les fichiers ou changer le stack
- NE PAS ajouter de dépendances

### 4. Test
Après modifications, lancer `npm run dev` pour vérifier que le build Vite fonctionne sans erreur.

## Stack
- Frontend: React 18 + Vite 5 + Tailwind 3 + Framer Motion
- Backend: Express + Google Sheets API + Gemini chatbot
- ES modules partout, composants fonctionnels React, pas de TypeScript

## Style de code
- Pas de commentaires inutiles
- Garder la structure identique
- Modifications chirurgicales uniquement
