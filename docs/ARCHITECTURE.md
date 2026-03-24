# Localia Core API — Architecture

## Overview

Localia Core API is a NestJS backend following Clean Architecture with TypeScript. It uses **Better Auth** for authentication and **Drizzle ORM** with PostgreSQL for data persistence.

## Layer Structure

```
src/
├── domain/           # Pure business logic, no framework dependencies
├── application/      # Use cases, DTOs, repository interfaces
├── infrastructure/   # Repository implementations, database schemas, external services
└── presentation/     # Controllers (HTTP entry points)
```

### Domain Layer (`domain/`)

Contains pure domain entities and business rules. **No** NestJS decorators, **no** database access.

```
domain/entities/
├── base.entity.ts          # Abstract base with id, createdAt, updatedAt
├── user.domain.ts          # User entity
└── user-role.enum.ts       # UserRole enum (SEEKER, AGENT)
```

### Application Layer (`application/`)

One folder per use case. Each contains:

- `*.use-case.ts` — Business logic
- `*.repository.interface.ts` — Repository contract (in Infrastructure, not here)
- `*.request.dto.ts` — Input validation
- `*.response.dto.ts` — Output shaping

Current use cases:

```
application/user/
├── get-user/                       # Get user by ID
│   ├── get-user.use-case.ts
│   ├── get-user.repository.interface.ts
│   └── get-user.response.dto.ts
└── update-user/                    # Update user role and tuition
    ├── update-user.use-case.ts
    ├── update-user.repository.interface.ts
    ├── update-user.request.dto.ts
    └── update-user.response.dto.ts
```

### Infrastructure Layer (`infrastructure/`)

```
infrastructure/
├── auth/schema.ts            # Drizzle schema (user, session, account, verification tables)
├── email/
│   ├── email.service.ts      # Email sending via Resend (sendWelcomeEmail, sendPasswordResetEmail)
│   └── email.module.ts       # NestJS module wiring nestjs-resend
└── repositories/user/user.repository.ts  # Repository implementation
```

### Presentation Layer (`presentation/`)

```
presentation/controllers/
├── auth.controller.ts        # /auth/me, /auth/session (Better Auth proxy)
├── notifications.controller.ts # /notifications/welcome-email (email triggers)
├── profile.controller.ts     # /profile, /profile/role (custom user endpoints)
└── health.controller.ts      # /health
```

## Authentication Flow

### Stack

- **Better Auth** (`better-auth` + `@thallesp/nestjs-better-auth`) — handles sign-up, sign-in, sign-out, session management, Google OAuth
- **Drizzle Adapter** — stores sessions, accounts, verifications in PostgreSQL

### Better Auth Endpoints (built-in)

All under `/auth/*`:

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/sign-up/email` | Register with email/password |
| POST | `/auth/sign-in/email` | Login with email/password |
| POST | `/auth/sign-out` | End session |
| GET | `/auth/get-session` | Get current session |

### Custom Endpoints

Because Better Auth's Express middleware intercepts ALL `/auth/*` requests, custom endpoints that need session access are placed under `/profile/*`:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/profile` | Get current user profile |
| PATCH | `/profile/role` | Update user role (seeker ↔ agent) and tuition |

### Session Cookie

Better Auth stores session in `better-auth.session_token` cookie (HttpOnly). The `Session` decorator from `@thallesp/nestjs-better-auth` reads `request.session` set by the auth middleware.

## Email Flow

### Stack

- **Resend** (`nestjs-resend`) — transactional email delivery via Resend API
- **NotificationsController** — custom NestJS controller outside `/auth/` prefix to avoid Better Auth route shadowing

### Custom Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/notifications/welcome-email` | Send welcome email to newly registered user |

### Route Shadowing

`nestjs-better-auth` registers Express-level routes at `/auth/*` that intercept ALL matching requests before they reach NestJS controllers. To expose custom endpoints without conflict, controllers are placed outside the `/auth/` prefix under `/notifications/`.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | Sender email (e.g., `Localia <noreply@resend.dev>`) |

## Configuration

All configuration in `src/config/`:

- `database.config.ts` — Better Auth instance + Drizzle client + database config
- `configuration.ts` — NestJS ConfigService loading from `.env`

## Data Model

### User Entity

| Field | Type | Notes |
|-------|------|-------|
| id | varchar | Primary key |
| email | text | Unique |
| name | text | Optional |
| emailVerified | boolean | Default false |
| image | text | Optional |
| role | varchar | `seeker` or `agent`, default `seeker` |
| tuition | text | Agent license number (required if role=agent) |
| createdAt | timestamp | Auto |
| updatedAt | timestamp | Auto |

### Session Entity (Better Auth managed)

| Field | Type |
|-------|------|
| id | varchar |
| token | text |
| userId | varchar → user.id |
| expiresAt | timestamp |
| ipAddress | text |
| userAgent | text |

## Architecture Constraints

### Enforced by AGENTS.md

- **1 Use Case = 1 Repository**: Each use case has its own repository interface. `UserRepository` implements `IGetUserRepository` and `IUpdateUserRepository` because get-user and update-user are separate use cases.
- **No barrel files**: Direct imports only. Never `import from './.../index'`.
- **No framework bleed**: Domain entities have no `@Injectable()`, `@Controller()` decorators.
- **No repositories in domain**: Repository interfaces live in `application/`, implementations in `infrastructure/`.
- **No dynamic imports**: All imports are static, top-level.
- **No magic strings**: Constants defined in one place.
- **No MikroORM global EntityManager**: Project uses Drizzle exclusively.

### Current State

- No `index.ts` barrel files ✅
- No unused files ✅
- No framework decorators in domain ✅
- Clean build (`nest build`) ✅
- Auth flow end-to-end verified ✅
- Email (Resend) integration verified ✅

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port |
| `DB_USER` | Database user |
| `DB_PASSWORD` | Database password |
| `DB_NAME` | Database name |
| `BETTER_AUTH_URL` | Public URL of the API |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `BASE_URL` | Frontend URL for CORS |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | Sender email address |

## API Base URL

- Development: `http://localhost:3000`
- Frontend: `http://localhost:5173`
