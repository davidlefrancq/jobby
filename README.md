# n8n - Automatisation & Agent IA locale avec Docker & Ollama

Ce projet utilise [n8n](https://n8n.io/) pour l'automatisation de workflows via Docker Compose. L'objectif est de gérer facilement un environnement n8n auto-hébergé à l’aide de commandes `npm`.

---

## Prérequis

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) (pour exécuter les scripts `npm`)
- [Ollama](https://ollama.com/)

---

## Commandes disponibles

| Commande              | Description                          |
|-----------------------|--------------------------------------|
| `npm run n8n`         | Démarre n8n avec Docker Compose      |
| `npm run n8n:stop`    | Arrête et supprime les conteneurs    |
| `npm run n8n:logs`    | Affiche les logs en temps réel       |
| `npm run n8n:restart` | Redémarre les conteneurs n8n         |

---

## Intégration d'un Agent IA local avec Ollama

Le projet peut être étendu pour inclure un modèle LLM local via [Ollama](https://ollama.com/), permettant d'utiliser des agents IA directement dans vos workflows `n8n` sans dépendre d’un service cloud.

- [Ollama installé localement](https://ollama.com/download)
- Un modèle LLM téléchargé, par exemple : `gemma`, `llama3`, `mistral`, etc.

```bash
ollama pull llama3
```