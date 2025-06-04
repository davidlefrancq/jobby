FROM node:20-slim

# Dépendances nécessaires à Chromium
RUN apt-get update && apt-get install -y \
  wget ca-certificates fonts-liberation libappindicator3-1 libasound2 \
  libatk-bridge2.0-0 libatk1.0-0 libcups2 libdrm2 libgbm1 libnspr4 \
  libnss3 libxcomposite1 libxdamage1 libxrandr2 xdg-utils \
  && rm -rf /var/lib/apt/lists/*

# Créer le dossier de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY package.json ./
COPY server.js ./

# Installer les dépendances Node
RUN npm install

# Lancer le serveur
CMD ["node", "server.js"]
