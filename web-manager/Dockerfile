# Step 1 – install dependencies
FROM node:24.4.1-alpine3.21 AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm install

# Step 2 – build the app
FROM node:24.4.1-alpine3.21 AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY ./src ./src
COPY ./public ./public
COPY ./package*.json ./
COPY ./global.d.ts ./
COPY ./next.config.ts ./
COPY ./next-env.d.ts ./
COPY ./tsconfig.json ./
COPY ./postcss.config.mjs ./
RUN npm run build

# Step 3 – final image
FROM node:24.4.1-alpine3.21 AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["npm", "run", "start"]
