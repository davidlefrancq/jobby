
# 🔒 Rapport de Sécurité – Projet N8N + Web Manager (Audit Code & Workflows)
2025-06-12

## 🧭 Méthodologie
Audit effectué **fichier par fichier**, en respectant :
- l’architecture en couches,
- les bonnes pratiques de séparation des responsabilités,
- l’absence volontaire de validation de type dans les sanitizers.

Chaque fichier est évalué sur les risques directs, indirects et la robustesse globale.

---

## 📁 Backend – Dossier `src/backend`

### `controllers/JobController.ts`
- ✅ Utilisation de `JobSanitizer` en sortie
- ⚠️ Pas de `try/catch` systématique
- ⚠️ Pas de middleware d’authentification visible
- ✅ Structure claire par responsabilité

### `models/JobSanitizer.ts`
- ✅ Remplit uniquement son rôle : **pas de validation**, juste nettoyage
- ✅ Pas de propagation de champs imprévus
- ✅ Compatible avec architecture en couches stricte

### `models/Job.ts` (Mongoose)
- ✅ Définition complète et explicite des sous-documents
- ⚠️ Pas de `maxlength`, `match`, ou `min/max` sur champs texte ou numériques
- ✅ Pas de champs dynamiques ou `Schema.Types.Mixed`

### `models/IJob.ts`
- ✅ Contrat typé clair
- ⚠️ Usage mixte de `champ?: T | null` et `champ: T | null` → intention claire (null = suppression)
- ✅ Pas de validation attendue ici (normal)

### `repositories/JobRepository.ts`
- ✅ Logique DAO claire, sans logique métier
- ⚠️ Aucun contrôle sur les `filter` reçus
- ⚠️ Absence de limite de `limit`, `skip`, etc.
- ✅ Recommandé : ajout de `JobRepositoryError` pour remonter proprement

### `repositories/errors/JobRepositoryError.ts`
- ✅ Classe d’erreur personnalisée bien conçue
- ✅ Pas de fuite de stack trace côté client si bien utilisé
- ✅ Pas de risque direct

### `lib/JobRequestFilter.ts`
- ✅ Transformation contrôlée des paramètres query
- ⚠️ Pas de parsing strict (zod/yup) → comportement silencieux si mauvaise valeur
- ✅ À sécuriser davantage si champs dynamiques sont ajoutés

### `lib/dbConnect.ts`
- ✅ Connexion centralisée unique (bonne pratique)
- ⚠️ Chaîne de connexion potentiellement en dur
- ⚠️ Pas de logger explicite d’erreur de connexion
- ✅ À renforcer pour usage production

### `lib/IMongooseCache.ts`
- ✅ Interface pure : aucun risque direct
- 🔁 Les implémentations devront être auditées séparément pour :
  - TTL
  - gestion mémoire
  - respect du typage

---

## 📁 Workflows N8N

> Tous les workflows partagent la même faiblesse : **aucun processus de sanitization** n’est intégré nativement.  
> Les données extraites sont souvent HTML, dynamiques, ou issues d’emails — donc **à risque** si non nettoyées manuellement.

### `France_Travail_Workflow.json`
- ⚠️ Aucune validation des données extraites
- ⚠️ Pas de strip HTML ni contrôle des URL
- ✅ Recommandé : nœud `Function` de nettoyage intermédiaire

### `LinkedIn_Workflow.json`
- ⚠️ Faille XSS possible si données HTML affichées sans nettoyage
- ⚠️ Redirections LinkedIn non vérifiées
- ✅ Ajout conseillé : contrôle des liens & titre

### `Company_Details_Workflow.json`
- ⚠️ Entrée utilisateur non validée (ex: SIREN libre)
- ⚠️ Appels API construits dynamiquement sans filtre → vecteur SSRF
- ✅ Prévoir un `Function` de validation des paramètres

### `Companies_Details_Workflow.json`
- 🔁 Multiplie les risques du précédent par le volume
- ⚠️ Aucune protection contre boucle trop large
- ✅ Recommandé : logs d’erreurs, limite de volume, continueOnFail

### `GoogleAlerts_Workflow.json`
- ⚠️ Contenu HTML externe non nettoyé
- ⚠️ Liens redirigés ou raccourcis non vérifiés
- ✅ À filtrer, réécrire, et valider

---

## ✅ Recommandations globales

1. **Centraliser un `JobSanitizeNode` N8N**
   - À inclure dans tous les workflows traitant des emails ou contenus enrichis

2. **Ajouter des logs ou audit trail dans les workflows**
   - CSV, Mongo ou webhook selon les erreurs ou états de chaque entrée

3. **Renforcer la BLL (hors repository)**
   - Validation runtime (zod ou équivalent) uniquement à cet endroit
   - Ne pas faire confiance aux données venant des workflows

4. **Limiter les requêtes MongoDB**
   - Imposer `limit`, interdire certains opérateurs dynamiques

---

Fin du rapport.
