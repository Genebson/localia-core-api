# Deployment Guide

## Overview

This guide covers deploying the Localia Core API with Docker. The application uses automatic schema migrations via `db:push` on startup.

## ORM Configuration

### Drizzle ORM

| Property         | Value                                   |
| ---------------- | --------------------------------------- |
| Version          | `0.45.1`                                |
| Dialect          | PostgreSQL                              |
| Schema File      | `src/infrastructure/database/schema.ts` |
| Migration Folder | `drizzle/`                              |

### Migration Strategy

**Using `db:push`** - Drizzle pushes schema changes directly to the database on each deploy.

```
prestart:prod → npm run db:push → drizzle-kit push
```

This approach:

- Simpler than migrations (no version tracking)
- Works reliably in containers
- Applies all schema changes in one go

### Database Tables

| Table          | Description                 |
| -------------- | --------------------------- |
| `user`         | User accounts (Better Auth) |
| `session`      | Active user sessions        |
| `account`      | OAuth provider accounts     |
| `verification` | Email verification tokens   |
| `property`     | Real estate listings        |
| `favorite`     | User favorite properties    |

## Prerequisites

- Docker installed
- PostgreSQL database (local or cloud)
- GitHub repository

## Dockerfile

The project includes a multi-stage Dockerfile:

```dockerfile
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
```

## Environment Variables

Set these in your platform's environment variable configuration.

### Required

| Variable             | Example Value                         | Description                  |
| -------------------- | ------------------------------------- | ---------------------------- |
| `DATABASE_URL`       | `postgresql://user:pass@host:5432/db` | PostgreSQL connection string |
| `BETTER_AUTH_URL`    | `https://api.yourapp.com`             | Public API URL               |
| `BETTER_AUTH_SECRET` | `your-secret-at-least-32-chars`       | Auth secret (32+ chars)      |
| `BASE_URL`           | `https://your-frontend.vercel.app`    | Frontend URL for CORS        |
| `RESEND_API_KEY`     | `re_123456789`                        | Resend API key (dummy works) |

### Optional (with defaults)

| Variable               | Default                        | Description                |
| ---------------------- | ------------------------------ | -------------------------- |
| `GOOGLE_CLIENT_ID`     | —                              | Google OAuth client ID     |
| `GOOGLE_CLIENT_SECRET` | —                              | Google OAuth client secret |
| `RESEND_FROM_EMAIL`    | `Localia <noreply@resend.dev>` | Sender email               |

## Deployment Steps

### 1. Build Image

```bash
docker build -t localia-api .
```

### 2. Run Container

```bash
docker run -d \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e BETTER_AUTH_URL="https://api.yourapp.com" \
  -e BETTER_AUTH_SECRET="your-secret-at-least-32-chars" \
  -e BASE_URL="https://your-frontend.vercel.app" \
  -e RESEND_API_KEY="re_123456789" \
  -p 3000:3000 \
  localia-api
```

### 3. Verify Deployment

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{ "data": { "type": "health", "attributes": { "status": "ok" } } }
```

## Platform-Specific Notes

### Coolify

1. Add PostgreSQL database
2. Set environment variables in app settings
3. Deploy from GitHub repository
4. Health check: `/health`

### AWS (ECS/EKS)

1. Use Amazon ECR or public registry
2. Set environment variables in task definition
3. Ensure VPC/security groups allow PostgreSQL access

### Hetzner (or any VPS)

1. Install Docker on server
2. Use Docker Compose or direct `docker run`
3. Set up PostgreSQL (managed or self-hosted)
4. Configure nginx/Caddy for reverse proxy

## Verification

After deployment, verify:

1. **Health check**: `GET /health` returns 200
2. **Auth**: Sign up a test user
3. **Database**: Check tables were created

## Troubleshooting

### db:push issues

Check container logs:

```bash
docker logs <container-id>
```

Common issues:

- Wrong `DATABASE_URL`
- PostgreSQL not reachable
- Schema file not found

### Build fails

Check the build output for TypeScript errors:

```bash
npm run build
```

### Connection refused

Ensure PostgreSQL is reachable from container network.

### Schema Changes

To modify the schema:

1. Edit `src/infrastructure/database/schema.ts`
2. Run `npm run db:push` locally to test
3. Commit and push - container will auto-migrate on restart

### Reset Database

```bash
# Drop all tables
docker exec <container> psql -U user -d db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Re-push schema
docker exec <container> npm run db:push
```
