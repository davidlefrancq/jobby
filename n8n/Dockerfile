FROM n8nio/n8n:latest AS base

# Copy credentials & Workflows folder
COPY workflows /tmp/workflows
COPY credentials /tmp/credentials

# Import workflows
RUN for f in /tmp/workflows/*.json; do \
      echo "→ importing $f"; \
      n8n import:workflow --input "$f"; \
    done

# Activate all workflows
RUN n8n update:workflow --all --active=true

# Import credentials
RUN n8n import:credentials --input=/tmp/credentials/oauth-credentials.json
