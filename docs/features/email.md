# Email Service — Design Note

## Status

**Implemented** ✅

## Context

Better Auth handles authentication but does not send verification or welcome emails. We need transactional email capability for:

1. **User registration** — Send welcome email after sign-up
2. **Password reset** — Send reset link via email

## Decision: Resend + nestjs-resend

**Why Resend:**
- Node.js SDK with SendGrid-compatible API
- No need to change transport if we migrate from SendGrid later
- Clean, minimal setup
- Supports React Email templates

**Package:** `nestjs-resend` — thin NestJS wrapper providing `ResendModule` and `ResendService` for dependency injection.

## Implementation

### Package

```bash
npm install nestjs-resend
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | Sender email (e.g., `Localia <noreply@resend.dev>`) |
| `EMAIL_BASE_URL` | Frontend base URL for password reset links |

### Files

```
src/infrastructure/email/
├── email.service.ts           # EmailService (sendWelcomeEmail, sendPasswordResetEmail)
├── email.service.spec.ts      # Unit tests
└── email.module.ts            # NestJS module wiring ResendModule
```

### NotificationsController

Custom NestJS controller at `/notifications/welcome-email` — placed **outside** the `/auth/` prefix to avoid `nestjs-better-auth` Express route shadowing.

```
presentation/controllers/
└── notifications.controller.ts  # /notifications/welcome-email
```

## Integration Flow

### Registration → Welcome Email

```
Frontend login() 
  → POST /auth/sign-up/email (Better Auth)
  → POST /notifications/welcome-email (NotificationsController)
  → EmailService.sendWelcomeEmail()
  → Resend API
  → User inbox
```

### Password Reset (future endpoint)

```
User requests reset
  → POST /auth/forgot-password (to implement)
  → EmailService.sendPasswordResetEmail(token)
  → Resend API
```

## Key Design Decisions

### Route Shadowing Workaround

`nestjs-better-auth` registers Express-level routes at `/auth/*` that intercept ALL matching requests before they reach NestJS. Custom endpoints that need to live outside Better Auth's scope are placed under `/notifications/` instead of `/auth/`.

### Error Handling

`EmailService` catches and logs all Resend errors without rethrowing — email delivery failures do not break the registration flow. The `NotificationsController` also wraps calls in try/catch to always return `{success: true}`.

## Verification

```bash
curl -X POST http://localhost:3000/notifications/welcome-email \
  -H "Content-Type: application/json" \
  -d '{"email":"user@verified.com","name":"User"}'
# → {"success":true}
```
