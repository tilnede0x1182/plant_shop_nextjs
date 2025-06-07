# 🌿 PlantShop - E-commerce Botanique (Next.js 15 / PostgreSQL)

Application complète de vente de plantes développée avec Next.js.
Elle propose une interface publique pour les utilisateurs et un espace d'administration sécurisé pour la gestion des plantes et des comptes.

---

## 🛠 Stack Technique

### Backend

- **Langage** : TypeScript / JavaScript
- **Framework** : Next.js 15
- **Base de données** : PostgreSQL (pg)
- **ORM** : Prisma
- **Authentification** : NextAuth.js
- **Hashing mot de passe** : bcryptjs
- **Seed / Fake data** : Faker

### Frontend

- **Templates** : React 19 (JSX)
- **UI/UX** : Bootstrap 5.3.2 (via CDN)
- **JS dynamique** : React Client Components
- **Cart** : localStorage client-side (AJAX-free)

---

## ✨ Fonctionnalités

### Client

- Catalogue des plantes
- Fiche produit
- Panier local (localStorage)
- Validation et historique des commandes
- Profil utilisateur (édition)

### Administrateur

- Gestion des plantes (CRUD)
- Gestion des utilisateurs (CRUD, rôle admin)
- Espace admin dédié
- Protection des routes admin

### Sécurité

- Authentification NextAuth.js avec sessions JWT
- Rôles utilisateur (USER / ADMIN)
- Protection CSRF et vérifications des accès

---

## 🚀 Installation et lancement

### Prérequis

- Node.js
- PostgreSQL
- npm

### Étapes

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
