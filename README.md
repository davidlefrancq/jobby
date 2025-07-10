# n8n - Automatisation & Agent IA locale avec Docker & Ollama

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


## Commandes disponibles

| Commande              | Description                          |
|-----------------------|--------------------------------------|
| `npm run n8n`         | Démarre n8n avec Docker Compose      |
| `npm run n8n:stop`    | Arrête et supprime les conteneurs    |
| `npm run n8n:logs`    | Affiche les logs en temps réel       |
| `npm run n8n:restart` | Redémarre les conteneurs n8n         |

## Initialisation

1) Renommer `.env.local` en `.env` et définir les différentes valeurs. Ce sont des valeurs arbitraires. Mettez ce que vous voulez, mais ne les communiquez à personne.
2) Lancer la commande : `npm run n8n`
3) Ouvrir http://localhost:5678/ et suivre les instructions jusuqu'au tableau de bord.
4) Ouvrir un terminal : `docker exec -it n8n /bin/sh`
5) Ouvrir les différents workflows http://localhost:5678/ et mettre à jour les credentials

## Agent IA local avec Ollama

### N8N AI Agent
Dans le fichier docker-compose, une instance de l'image docker ollama/ollama est configuré pour fonctionnner avec l'option GPU.

Depuis l'interface N8N, utilisez:
- http://ollama:11434

Attention le téléchargement du modèle `mistral-nemo` (~7Go) peut prendre un certain temp avant d'être disponible.

### Stockage des models
Attention `E:/AI/ollama/models:/models` permet de persisté les modèles dans un dossier pour éviter de les télécharger à nouveau en cas de reset de du container. A modifier si nécéssaire.

## Google OAuth Config
Go to [Google Cloud Console](https://console.cloud.google.com/) > [API Dashboard](https://console.cloud.google.com/apis/dashboard)
- [Library](https://console.cloud.google.com/apis/library)
  - Activate GMail API
- [Credentials](https://console.cloud.google.com/apis/credentials) : Create OAuth Client
  - Set field OAuth Redirect URL with : http://localhost:5678/rest/oauth2-credential/callback
- [Scopes](https://console.cloud.google.com/auth/scopes), adds data access :
    - https://www.googleapis.com/auth/gmail.addons.current.action.compose
    - https://www.googleapis.com/auth/gmail.addons.current.message.action
    - https://www.googleapis.com/auth/gmail.labels
    - https://mail.google.com/
    - https://www.googleapis.com/auth/gmail.modify
    - https://www.googleapis.com/auth/gmail.compose

In N8N **GMail Node**, setup OAuth Account with **Client ID** and **Client Secret**