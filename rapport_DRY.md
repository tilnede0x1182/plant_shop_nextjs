# RAPPORT D'ANALYSE DES DUPLICATIONS DE CODE (Principe DRY)

## Introduction
Projet Next.js 14 (App Router + Prisma + NextAuth).

---

## Violations DRY

### 1. Instanciations PrismaClient partout - 🔴 Critique
Chaque handler (`src/app/api/plants/route.ts`, `.../plants/[id]/route.ts`, `.../users/[id]/route.ts`, etc.) exécute `const prisma = new PrismaClient()`. On crée donc un client par requête et on duplique l’initialisation. **Action** : exposer un module `lib/prisma.ts` qui instancie un seul client (pattern singleton en dev + globalThis) et l’importer dans tous les route handlers.

### 2. CRUD REST dupliqué par ressource - 🟠 Haute
Les fichiers `src/app/api/plants/[id]/route.ts` et `src/app/api/users/[id]/route.ts` partagent exactement le même squelette : `GET` (findUnique + 404), `PUT` (update), `DELETE` (delete). Même chose pour `api/plants/route.ts` et `api/admin/plants/route.ts` qui ne diffèrent que par un `where`/`orderBy`. **Action** : déplacer les opérations Prisma dans des services (`PlantService`, `UserService`) ou créer des utilitaires `buildCrudRoutes(model, options)` pour éviter ce copier/coller.

### 3. Pages d’administration clonées (plantes vs utilisateurs) - 🟠 Haute
`src/app/admin/plants/page.tsx` et `src/app/admin/users/page.tsx` répliquent la même structure : `useEffect` pour `fetch`, tableau Bootstrap, boutons Modifier/Supprimer s’appuyant sur `deleteAndCheck`. La seule différence réside dans les colonnes et les URLs. **Action** : créer un composant `AdminTable` générique prenant une liste et des colonnes, ainsi qu’un hook `useAdminList(url, deleteUrlBuilder)` : cela évitera de maintenir deux composants quasi identiques.

---

## Impact estimé

| Refactoring proposé                                         | Lignes supprimées | Complexité |
|-------------------------------------------------------------|-------------------|------------|
| Module Prisma partagé (singleton)                           | ~20 fichiers touchés | Faible |
| Services/utilitaires CRUD pour les handlers API             | ~120              | Moyenne    |
| Composant/hook partagé pour les listes admin                | ~80               | Faible     |

---

## Conclusion
Les duplications concernent surtout l’accès aux données (instanciation Prisma + handlers CRUD) et les écrans d’administration. En introduisant des services/utilitaires communs, on évite la multiplication des blocs identiques et on respecte le principe DRY.***
