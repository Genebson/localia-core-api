# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY drizzle.config.ts ./
COPY drizzle/ ./drizzle/
COPY src/infrastructure ./src/infrastructure

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "run", "start:prod"]