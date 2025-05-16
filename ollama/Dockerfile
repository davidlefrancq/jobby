# FROM node:18-alpine AS runner
# WORKDIR /usr/src/app
# ENV NODE_ENV=development
# COPY . .
# RUN rm -rf node_modules
# RUN rm -rf .next
# RUN rm .env
# RUN npm install
# EXPOSE 3000
# CMD ["npm", "run", "dev"]



# Utilise l'image officielle d'Ollama comme base
FROM ollama/ollama:latest

# Pré-télécharge le modèle désiré au build
# RUN ollama pull mistral-nemo:latest

# Copier E:/AI/ollama/models dans /models
RUN mkdir -p /models
COPY ./models /models
