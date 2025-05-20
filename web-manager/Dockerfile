# Step 1 – install dependencies
FROM node:18-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install

# Step 2 – build the app
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY ./src ./src
COPY ./public ./public
COPY ./package*.json ./
COPY ./next.config.ts ./
COPY ./tsconfig.json ./
COPY ./postcss.config.mjs ./
RUN npm run build

# Step 3 – final image
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["npm", "run", "start"]

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
