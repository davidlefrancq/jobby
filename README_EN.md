[FR](./README.md) - [EN]

# JobBy - Automation and Artificial Intelligence Platform

JobBy is a complete automation platform using [n8n](https://n8n.io/) for workflow orchestration, integrated with local AI via Ollama and a Next.js web interface. Everything is orchestrated via Docker Compose for easy deployment.

This project uses [n8n](https://n8n.io/) for workflow automation via Docker Compose. The goal is to easily manage a self-hosted n8n environment using `npm` commands.

## Code
The code architecture documentation is available [here](./README_CODE_EN.md).

## Prerequisites

### Hardware
- [Compatible GPU](https://github.com/ollama/ollama/blob/main/docs/gpu.md) with at least 10 GB VRAM.
- 32 GB RAM

### Software
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) (to run `npm` scripts)

**Optional** (NVIDIA AI Tools):
- [CUDNN Library](https://developer.nvidia.com/cudnn)
- [CUDA Toolkit](https://developer.nvidia.com/cuda-toolkit)

## Architecture

JobBy is composed of several interconnected services:

- **n8n**: Workflow orchestrator (port 5678)
- **Next.js**: Web interface for job management (port 3000)
- **MongoDB**: Main database (port 59117)
- **Ollama**: Local AI service with Mistral-Nemo model (port 11434)
- **Grafana**: Logs and metrics visualization (port 5601)
- **Loki**: Log aggregation (port 3100)
- **Vector**: Log processing (port 8686)
- **Puppeteer**: Web scraping service (port 3200)

## Available Commands

| Command                      | Description                                 |
|------------------------------|---------------------------------------------|
| `npm start`                  | Start all services (alias for n8n)          |
| `npm stop`                   | Stop and remove all containers              |
| `npm restart`                | Restart all services with rebuild           |
| `npm run n8n`                | Start all services with Docker Compose      |
| `npm run n8n:build`          | Build Docker images                         |
| `npm run n8n:rebuild`        | Rebuild all images without cache            |
| `npm run n8n:rebuild:nextjs` | Rebuild only the Next.js image              |
| `npm run n8n:stop`           | Stop and remove containers                  |
| `npm run n8n:logs`           | Show real-time logs                         |
| `npm run n8n:logs:nextjs`    | Show Next.js real-time logs                 |
| `npm run n8n:restart`        | Restart containers                          |
| `npm run n8n:images:update`  | Update Docker images                        |

## Initialization

1. **Environment variable configuration**
    - Copy the `.env.local` file to `.env`:
      ```bash
      cp .env.local .env
      ```
    - Edit the values as needed. Here are the variables to set:
      - `MONGO_ROOT_USER`: MongoDB root username
      - `MONGO_ROOT_PASSWORD`: MongoDB root password
      - `MONGO_DB_NAME`: Main database name
      - `MONGO_DB_USER`: Non-root database username
      - `MONGO_DB_USER_PASSWORD`: Non-root user password
    - Example content of `.env.local`:
      ```env
      MONGO_ROOT_USER=root_user
      MONGO_ROOT_PASSWORD=root_password
      MONGO_DB_NAME=n8n_db
      MONGO_DB_USER=db_user
      MONGO_DB_USER_PASSWORD=db_password
      ```
    - ⚠️ These values are sensitive - do not share them with anyone

2. **Start the services**
   ```bash
   npm start
   ```

3. **Access the interfaces**
   - **n8n**: http://localhost:5678/ (follow the initialization instructions)
   - **JobBy Interface**: http://localhost:3000/
   - **Grafana**: http://localhost:5601/ (admin/admin)
   - **Puppeteer API**: http://localhost:3200/

4. **n8n workflow configuration**
   - Go to http://localhost:5678/
   - Update credentials at http://localhost:5678/home/credentials

## Local AI Agent with Ollama

### N8N AI Agent Configuration
In the docker-compose file, an Ollama instance is configured with GPU support to run AI models locally.

**Connection parameters from n8n:**
- URL: `http://ollama:11434`
- Model: `mistral-nemo:latest` (downloaded automatically)

⚠️ **Important note**: The initial download of the Mistral-Nemo model (~7GB) may take several minutes before it is available.

### Model storage
Models are persisted in the Docker volume `ollama_models` to avoid re-downloading on container restarts.

## Monitoring and logs

### Grafana Dashboard
- **URL**: http://localhost:5601/
- **Credentials**: admin/admin
- Visualization of metrics and logs from all services

### Logging architecture
- **Loki**: Centralized log aggregation (port 3100)
- **Vector**: Log processing and routing (port 8686)
- **Grafana**: Visualization and alerting interface

## Additional services

### JobBy Web Interface (Next.js)
- **URL**: http://localhost:3000/
- Job and workflow management interface
- Direct connection to MongoDB for data persistence

### Puppeteer Service
- **URL**: http://localhost:3200/
- Web scraping and browser automation API
- Usable from n8n workflows for web data extraction

## Google OAuth Configuration

### Steps in Google Cloud Console

1. **Go to the console**: [Google Cloud Console](https://console.cloud.google.com/) > [API Dashboard](https://console.cloud.google.com/apis/dashboard)

2. **Enable required APIs** in the [Library](https://console.cloud.google.com/apis/library):
   - Gmail API

3. **Create OAuth credentials** in [Credentials](https://console.cloud.google.com/apis/credentials):
   - Create an "OAuth Client ID"
   - Set the redirect URL: `http://localhost:5678/rest/oauth2-credential/callback`

4. **Configure scopes** in [OAuth consent screen](https://console.cloud.google.com/auth/scopes):
   ```
   https://www.googleapis.com/auth/gmail.addons.current.action.compose
   https://www.googleapis.com/auth/gmail.addons.current.message.action
   https://www.googleapis.com/auth/gmail.labels
   https://mail.google.com/
   https://www.googleapis.com/auth/gmail.modify
   https://www.googleapis.com/auth/gmail.compose
   ```

### Configuration in n8n
In the **Gmail node** of n8n, configure the OAuth account with:
- **Client ID** and **Client Secret** obtained from Google Cloud Console

## Development and debugging

### Real-time logs
```bash
# All services
npm run n8n:logs

# Next.js specific service
npm run n8n:logs:nextjs

# Specific service (via Docker)
docker logs -f <container_name>
```

### Access containers
```bash
# n8n
docker exec -it n8n /bin/sh

# MongoDB
docker exec -it mongodb mongosh

# Next.js
docker exec -it nextjs /bin/sh
```

### Update images
```bash
npm run n8n:images:update
```

## Volumes and persistence

Data is persisted via the following Docker volumes:
- `n8n_data`: n8n data (workflows, credentials, etc.)
- `ollama_data`: Ollama configuration
- `ollama_models`: Downloaded AI models
- `mongo_data`: MongoDB database
- `mongo_config`: MongoDB configuration
- `grafana_data`: Grafana dashboards and configuration
