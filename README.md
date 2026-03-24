# Localia Core API

NestJS backend for Localia platform. Handles authentication, user management, and serves as the foundation for the Localia real estate platform.

## Tech Stack

- **NestJS** — Framework
- **Better Auth** — Authentication (email/password, Google OAuth)
- **Resend** — Transactional email delivery
- **Drizzle ORM** — Database ORM
- **PostgreSQL** — Primary database
- **TypeScript** — Language

## Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm or pnpm

## Structure

```
src/
├── domain/                         # Pure business logic (no framework deps)
│   └── entities/
│       ├── base.entity.ts           # Abstract base (id, createdAt, updatedAt)
│       ├── user.domain.ts           # User entity
│       └── user-role.enum.ts        # UserRole enum (SEEKER, AGENT)
├── application/                     # Use cases, DTOs, repository interfaces
│   └── user/
│       ├── get-user/               # Get user by ID
│       └── update-user/             # Update user role/license_number
├── infrastructure/                 # External concerns
│   ├── auth/
│   │   └── schema.ts               # Drizzle schema (user, session, account tables)
│   ├── email/
│   │   ├── email.service.ts        # Email sending via Resend
│   │   └── email.module.ts          # NestJS module
│   └── repositories/user/
│       └── user.repository.ts       # Repository implementation
├── presentation/                   # HTTP layer
│   └── controllers/
│       ├── auth.controller.ts        # /auth/* (Better Auth proxy)
│       ├── notifications.controller.ts # /notifications/welcome-email
│       ├── profile.controller.ts     # /profile, /profile/role
│       └── health.controller.ts     # /health
├── config/
│   ├── configuration.ts             # Environment variable loader
│   └── database.config.ts           # Better Auth + Drizzle client config
├── app.module.ts                   # Root module
└── main.ts                        # Entry point
```

**Architecture rules (per AGENTS.md):**
- Domain has no `@Injectable()`, `@Controller()`, or database access
- 1 use case = 1 repository (per-operation interfaces)
- No barrel files (`index.ts`)
- No magic strings/numbers

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | localhost | PostgreSQL host |
| `DB_PORT` | 5432 | PostgreSQL port |
| `DB_USER` | localia | PostgreSQL user |
| `DB_PASSWORD` | localia_dev_password | PostgreSQL password |
| `DB_NAME` | localia_dev | Database name |
| `BETTER_AUTH_URL` | http://localhost:3000 | Public API URL |
| `GOOGLE_CLIENT_ID` | — | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | — | Google OAuth client secret |
| `BASE_URL` | http://localhost:5173 | Frontend URL (CORS) |
| `RESEND_API_KEY` | — | Resend API key |
| `RESEND_FROM_EMAIL` | Localia `<noreply@resend.dev>` | Sender email address |

## Getting Started

### 1. Start Infrastructure

```bash
docker-compose up -d
```

Starts PostgreSQL on port 5432.

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run start:dev
```

Application runs at http://localhost:3000

### 4. Run Tests

```bash
npm test
```

## API Endpoints

All endpoints follow [JSON:API](https://jsonapi.org/) specification.

### Health Check

```
GET /health
```

### Authentication (Better Auth built-in)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/sign-up/email` | Register with email/password |
| POST | `/auth/sign-in/email` | Login with email/password |
| POST | `/auth/sign-out` | End session |
| POST | `/auth/sign-in/social` | Initiate OAuth (Google) |
| GET | `/auth/get-session` | Get current session |

### Custom Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/profile` | Get current user profile |
| PATCH | `/profile/role` | Update role (seeker ↔ agent) and license number |
| POST | `/notifications/welcome-email` | Send welcome email to registered user |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run start:dev` | Start with hot reload |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit + integration tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov` | Run tests with coverage |

## Tests

Unit tests with Jest (7 suites, 24 tests — all passing).

```
src/
├── domain/entities/user.entity.spec.ts
├── application/user/
│   ├── get-user/get-user.use-case.spec.ts
│   └── update-user/update-user.use-case.spec.ts
└── presentation/controllers/
    ├── health.controller.spec.ts
    ├── notifications.controller.spec.ts
    └── profile.controller.spec.ts
infrastructure/email/
└── email.service.spec.ts
```

Note: E2e tests for auth are not included because Better Auth's ESM-only distribution is incompatible with Jest's CommonJS transform. Auth flows are verified manually via HTTP (see `docs/proofs/`).

## API Documentation

Swagger UI: http://localhost:3000/api/docs

## Architecture

Clean Architecture with strict layer separation:

- **Domain** — Pure entities, no framework dependencies
- **Application** — Use cases with per-operation repository interfaces
- **Infrastructure** — Database access via Drizzle, external auth services
- **Presentation** — NestJS controllers, HTTP adapters

See `docs/ARCHITECTURE.md` for full architectural documentation and `docs/features/auth-architecture.md` for authentication design decisions.
