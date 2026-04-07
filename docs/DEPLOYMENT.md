# Railway Deployment Guide

## Overview

This guide covers deploying the Localia Core API to Railway with automatic migrations.

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
- Works reliably in Docker containers
- Applies all schema changes in one go

> Note: `db:migrate` was tested but hangs without applying changes. `db:push` is the working solution.

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

- Railway account
- GitHub repository connected to Railway
- PostgreSQL database on Railway (or external)

## Environment Variables

Set these in Railway dashboard under **Variables** tab.

### Required

| Variable             | Example Value                      | Description                  |
| -------------------- | ---------------------------------- | ---------------------------- |
| `DB_HOST`            | `containers.sql.railway.com`       | PostgreSQL host              |
| `DB_PORT`            | `5432`                             | PostgreSQL port              |
| `DB_USER`            | `postgres`                         | PostgreSQL user              |
| `DB_PASSWORD`        | `your-password`                    | PostgreSQL password          |
| `DB_NAME`            | `railway`                          | Database name                |
| `BETTER_AUTH_URL`    | `https://your-app.up.railway.app`  | Public API URL               |
| `BETTER_AUTH_SECRET` | `your-secret-at-least-32-chars`    | Auth secret (32+ chars)      |
| `BASE_URL`           | `https://your-frontend.vercel.app` | Frontend URL for CORS        |
| `RESEND_API_KEY`     | `re_123456789`                     | Resend API key (dummy works) |

### Optional (with defaults)

| Variable               | Default                        | Description                |
| ---------------------- | ------------------------------ | -------------------------- |
| `GOOGLE_CLIENT_ID`     | —                              | Google OAuth client ID     |
| `GOOGLE_CLIENT_SECRET` | —                              | Google OAuth client secret |
| `RESEND_FROM_EMAIL`    | `Localia <noreply@resend.dev>` | Sender email               |

## Deployment Steps

### 1. Connect Repository

1. Go to Railway dashboard
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository

### 2. Add PostgreSQL

1. In project dashboard, click **+ New** → **Database** → **Add PostgreSQL**
2. Copy the connection string from the **Connect** tab
3. Extract host, port, user, password, and database name

### 3. Set Environment Variables

Add all required variables from the table above.

### 4. Deploy

1. Railway automatically builds from `Dockerfile`
2. On each deploy, `prestart:prod` runs migrations automatically
3. Health check available at `/health`

## Start Command

Railway will use the `CMD` from Dockerfile:

```
npm run start:prod
```

This automatically runs `prestart:prod` (migrations) before starting the app.

## Rollback

If you need to rollback migrations:

```bash
# Locally
npm run db:rollback

# In Railway: use Railway CLI
railway run npm run db:rollback
```

## Verification

After deployment, verify:

1. **Health check**: `GET /health` returns 200
2. **Auth**: Sign up a test user
3. **Database**: Check tables were created

## Troubleshooting

### db:push issues

Check Railway logs:

```bash
railway logs
```

Common issues:

- Wrong `DB_*` variables
- Database not ready (add healthcheck)
- Schema file not found - ensure `src/infrastructure/database/schema.ts` is copied in Dockerfile

### Build fails

Check the build output in Railway dashboard under **Deployments**.

### Connection refused

Ensure PostgreSQL is in the same Railway project, or verify `DB_HOST` points to external database.

### Schema Changes

To modify the schema:

1. Edit `src/infrastructure/database/schema.ts`
2. Run `npm run db:push` locally to test
3. Commit and push - Railway will run `db:push` automatically on deploy

### Reset Database

```bash
# Drop all tables locally
docker exec localia-postgres psql -U localia -d localia_dev -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Re-push schema
npm run db:push
```
