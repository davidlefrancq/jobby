# ---- build stage ----
FROM n8nio/n8n:latest AS base

# Dossier local contenant tes .json
COPY workflows /tmp/workflows
COPY credentials /tmp/credentials

# L’utilisateur « node » possède déjà les droits sur /home/node
USER node

# Import des workflows dans la BDD SQLite embarquée
RUN for f in /tmp/workflows/*.json; do \
      echo "→ importing $f"; \
      n8n import:workflow --input "$f"; \
    done

RUN n8n update:workflow --all --active=true
RUN n8n import:credentials --input=/tmp/credentials/oauth-credentials.json
