# JobBy - Plateforme d'automatisation et d'intelligence artificielle

JobBy est une plateforme complète d'automatisation utilisant [n8n](https://n8n.io/) pour l'orchestration de workflows, intégrée avec une IA locale via Ollama, une interface web Next.js, et un système de monitoring complet. L'ensemble est orchestré via Docker Compose pour faciliter le déploiement et la gestion.8n - Automatisation & Agent IA locale avec Docker & Ollama

Ce projet utilise [n8n](https://n8n.io/) pour l'automatisation de workflows via Docker Compose. L'objectif est de gérer facilement un environnement n8n auto-hébergé à l’aide de commandes `npm`.

## Prérequis

### Matériel
- Carte graphique [compatible](https://github.com/ollama/ollama/blob/main/docs/gpu.md) avec 10 Go de VRAM minimum.
- 32 Go de RAM

### Logiciel
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) (pour exécuter les scripts `npm`)

**Optionnel** (NVIDIA AI Tools) :
- [CUDNN Library](https://developer.nvidia.com/cudnn)
- [CUDA Toolkit](https://developer.nvidia.com/cuda-toolkit)


## Architecture

JobBy est composé de plusieurs services interconnectés :

- **n8n** : Orchestrateur de workflows (port 5678)
- **Next.js** : Interface web de gestion des jobs (port 3000)
- **MongoDB** : Base de données principale (port 59117)
- **Ollama** : Service d'IA locale avec modèle Mistral-Nemo (port 11434)
- **Grafana** : Visualisation des logs et métriques (port 5601)
- **Loki** : Agrégation des logs (port 3100)
- **Vector** : Traitement des logs (port 8686)
- **Puppeteer** : Service de web scraping (port 3200)

## Commandes disponibles

| Commande                    | Description                                    |
|-----------------------------|------------------------------------------------|
| `npm start`                 | Démarre tous les services (alias de n8n)      |
| `npm stop`                  | Arrête et supprime tous les conteneurs        |
| `npm restart`               | Redémarre tous les services avec rebuild      |
| `npm run n8n`               | Démarre tous les services avec Docker Compose |
| `npm run n8n:build`         | Construit les images Docker                    |
| `npm run n8n:rebuild`       | Reconstruit toutes les images sans cache      |
| `npm run n8n:rebuild:nextjs`| Reconstruit uniquement l'image Next.js        |
| `npm run n8n:stop`          | Arrête et supprime les conteneurs             |
| `npm run n8n:logs`          | Affiche les logs en temps réel                |
| `npm run n8n:logs:nextjs`   | Affiche les logs Next.js en temps réel        |
| `npm run n8n:restart`       | Redémarre les conteneurs                      |
| `npm run n8n:images:update` | Met à jour les images Docker                  |

## Initialisation

1. **Configuration des variables d'environnement**
   - Renommer `.env.local` en `.env` 
   - Définir les différentes valeurs (mots de passe, utilisateurs MongoDB, etc.)
   - ⚠️ Ces valeurs sont sensibles - ne les communiquez à personne

2. **Démarrage des services**
   ```bash
   npm start
   ```

3. **Accès aux interfaces**
   - **n8n** : http://localhost:5678/ (suivre les instructions d'initialisation)
   - **Interface JobBy** : http://localhost:3000/
   - **Grafana** : http://localhost:5601/ (admin/admin)
   - **API Puppeteer** : http://localhost:3200/

4. **Configuration des workflows n8n**
   - Accéder à http://localhost:5678/
   - Mettre à jour les credentials depuis http://localhost:5678/home/credentials

## Agent IA local avec Ollama

### Configuration N8N AI Agent
Dans le fichier docker-compose, une instance Ollama est configurée avec support GPU pour exécuter des modèles d'IA localement.

**Paramètres de connexion depuis n8n :**
- URL : `http://ollama:11434`
- Modèle : `mistral-nemo:latest` (téléchargé automatiquement)

⚠️ **Note importante** : Le téléchargement initial du modèle Mistral-Nemo (~7Go) peut prendre plusieurs minutes avant d'être disponible.

### Stockage des modèles
Les modèles sont persistés dans le volume Docker `ollama_models` pour éviter les re-téléchargements lors des redémarrages de conteneurs.

## Monitoring et logs

### Grafana Dashboard
- **URL** : http://localhost:5601/
- **Identifiants** : admin/admin
- Visualisation des métriques et logs de tous les services

### Architecture de logging
- **Loki** : Agrégation centralisée des logs (port 3100)
- **Vector** : Traitement et routage des logs (port 8686)
- **Grafana** : Interface de visualisation et alerting

## Services additionnels

### Interface Web JobBy (Next.js)
- **URL** : http://localhost:3000/
- Interface de gestion des jobs et workflows
- Connexion directe à MongoDB pour la persistance des données

### Service Puppeteer
- **URL** : http://localhost:3200/
- API de web scraping et automatisation de navigateur
- Utilisable depuis les workflows n8n pour l'extraction de données web

## Configuration Google OAuth

### Étapes de configuration dans Google Cloud Console

1. **Accéder à la console** : [Google Cloud Console](https://console.cloud.google.com/) > [API Dashboard](https://console.cloud.google.com/apis/dashboard)

2. **Activer les APIs nécessaires** dans [Library](https://console.cloud.google.com/apis/library) :
   - Gmail API

3. **Créer les credentials OAuth** dans [Credentials](https://console.cloud.google.com/apis/credentials) :
   - Créer un "OAuth Client ID"
   - Définir l'URL de redirection : `http://localhost:5678/rest/oauth2-credential/callback`

4. **Configurer les scopes** dans [OAuth consent screen](https://console.cloud.google.com/auth/scopes) :
   ```
   https://www.googleapis.com/auth/gmail.addons.current.action.compose
   https://www.googleapis.com/auth/gmail.addons.current.message.action
   https://www.googleapis.com/auth/gmail.labels
   https://mail.google.com/
   https://www.googleapis.com/auth/gmail.modify
   https://www.googleapis.com/auth/gmail.compose
   ```

### Configuration dans n8n
Dans le **nœud Gmail** de n8n, configurer le compte OAuth avec :
- **Client ID** et **Client Secret** obtenus depuis Google Cloud Console

## Développement et debugging

### Logs en temps réel
```bash
# Tous les services
npm run n8n:logs

# Service spécifique Next.js
npm run n8n:logs:nextjs

# Service spécifique (via Docker)
docker logs -f <nom_du_conteneur>
```

### Accès aux conteneurs
```bash
# n8n
docker exec -it n8n /bin/sh

# MongoDB
docker exec -it mongodb mongosh

# Next.js
docker exec -it nextjs /bin/sh
```

### Mise à jour des images
```bash
npm run n8n:images:update
```

## Volumes et persistance

Les données sont persistées via les volumes Docker suivants :
- `n8n_data` : Données n8n (workflows, credentials, etc.)
- `ollama_data` : Configuration Ollama
- `ollama_models` : Modèles IA téléchargés
- `mongo_data` : Base de données MongoDB
- `mongo_config` : Configuration MongoDB
- `grafana_data` : Dashboards et configuration Grafana