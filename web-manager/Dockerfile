# # Étape 1 – installation des dépendances
# FROM node:18-alpine AS deps
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm install

# # Étape 2 – build de l’app
# FROM node:18-alpine AS builder
# WORKDIR /usr/src/app
# COPY --from=deps /usr/src/app/node_modules ./node_modules
# COPY . .
# RUN npm run build

# # Étape 3 – image finale
# FROM node:18-alpine AS runner
# WORKDIR /usr/src/app
# ENV NODE_ENV=production
# # On copie uniquement l’essentiel
# COPY --from=builder /usr/src/app/public ./public
# COPY --from=builder /usr/src/app/.next ./.next
# COPY --from=builder /usr/src/app/node_modules ./node_modules
# COPY --from=builder /usr/src/app/package.json ./
# EXPOSE 3000
# CMD ["npm", "run", "start"]

FROM node:18-alpine AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=development
COPY . .
RUN rm -rf node_modules
RUN rm -rf .next
RUN rm .env
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "dev"]
