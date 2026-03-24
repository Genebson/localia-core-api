# Email Service — Design Note

## Status

**Proposed** — Pending implementation.

## Context

Better Auth handles authentication but does not send verification or welcome emails. We need transactional email capability for:

1. **User registration** — Send welcome email after sign-up
2. **Password reset** — Send reset link via email
3. **Email verification** — (future) Verify email ownership

## Decision: Resend

**Why Resend:**
- Node.js SDK with SendGrid-compatible API
- No need to change transport if we migrate from SendGrid later
- Clean, minimal setup
- Supports React Email templates

## Implementation Plan

### 1. Install Resend

```bash
npm install resend
```

### 2. Environment Variables

Add to `.env` and `docs/`:

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | Default sender email (e.g., `Localia <noreply@localia.com>`) |

### 3. Email Service (`infrastructure/email/email.service.ts`)

```typescript
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    await this.resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to,
      subject: 'Welcome to Localia',
      html: `<h1>Welcome, ${name}!</h1><p>Your account has been created.</p>`,
    });
  }
}
```

### 4. Integration Points

Better Auth sign-up triggers `onCreateUser` hook or we wrap `signUpWithEmail` in a custom controller. Since Better Auth doesn't expose hooks natively, we'll use a custom sign-up flow that:

1. Calls Better Auth's `sign-up/email`
2. If successful, calls `EmailService.sendWelcomeEmail()`

### 5. Email Templates

Use React Email for templating (future). Start with simple HTML strings for MVP.

## Files to Create

```
src/infrastructure/email/
├── email.service.ts           # Resend wrapper
└── email.module.ts            # NestJS module
```

## Files to Modify

- `package.json` — add `resend`
- `.env.dist` — add `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- `docs/ARCHITECTURE.md` — update with email service
- `app.module.ts` — import `EmailModule`
- `presentation/controllers/auth.controller.ts` — custom sign-up with email
