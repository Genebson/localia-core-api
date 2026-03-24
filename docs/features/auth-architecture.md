# Auth Architecture — Design Note

## Status

**Accepted** — Implemented with workaround.

## Problem

Better Auth's `nestjs-better-auth` package registers an Express middleware that intercepts **all** requests matching the `basePath` (default: `/auth/*`) at the framework level — before NestJS's router. This means custom controller endpoints under `/auth/*` are unreachable; Better Auth's `toNodeHandler()` processes them directly and returns a 404 for unrecognized routes.

## Root Cause

`nestjs-better-auth` uses `this.adapter.httpAdapter.use(...)` to mount Better Auth's Express handler. This runs as middleware on the Express instance, catching all `/auth/*` requests before NestJS's router layer processes them:

```typescript
// nestjs-better-auth/dist/index.mjs lines 842-864
this.adapter.httpAdapter.use(
  (req, res, next) => {
    if (!matchesBasePath(req, this.basePath)) {
      next();  // pass to NestJS router
      return;
    }
    return handler(nodeReq, nodeRes);  // Better Auth handles it
  }
);
```

For routes Better Auth doesn't recognize (like our custom endpoints), `toNodeHandler` returns a raw 404 without body, bypassing NestJS entirely.

## Design Goals

1. Custom authenticated endpoints (`/profile`, `/profile/role`) must be reachable
2. Better Auth's built-in auth endpoints (`/auth/sign-in/email`, `/auth/sign-out`, etc.) must continue working
3. Session cookie must be readable by custom endpoints
4. Solution must follow AGENTS.md architecture (no barrel files, clean separation)

## Decision: Path Segmentation

**Move custom endpoints outside `/auth/*`** — place them under `/profile/*`.

Better Auth's middleware only intercepts `/auth/*`. Any path outside `/auth/*` reaches NestJS's router normally, where our `ProfileController` handles it. The `@Session()` decorator from `@thallesp/nestjs-better-auth` still reads `request.session` correctly because the auth middleware populates it for all requests (not just `/auth/*`).

### Endpoint Map

| Before | After | Notes |
|--------|-------|-------|
| `GET /auth/me` | `GET /auth/me` | Built-in Better Auth (still works) |
| `GET /auth/session` | `GET /auth/session` | Built-in Better Auth (still works) |
| `GET /auth/user` | `GET /profile` | Custom, moved out |
| `PATCH /auth/user/role` | `PATCH /profile/role` | Custom, moved out |

## Trade-offs

**Pros:**
- Custom endpoints work correctly with session cookies
- Better Auth's built-in endpoints unchanged
- Minimal code change
- No fork of nestjs-better-auth needed

**Cons:**
- Inconsistent path structure (`/auth/*` vs `/profile/*`)
- Frontend must update API calls from `/auth/user` → `/profile`
- `/auth/me` still returns 404 with our session cookie (Better Auth limitation), but `/profile` returns equivalent data

## Frontend Changes Required

File: `src/lib/api/auth.ts`

```typescript
// Before
export async function getMe() { return apiFetch('/auth/me'); }
export async function getUser() { return apiFetch('/auth/user'); }
export async function updateRole(role, matricula) {
  return apiFetch('/auth/user/role', { method: 'PATCH', ... });
}

// After
export async function getMe() { return apiFetch('/profile'); }
export async function getUser() { return apiFetch('/profile'); }
export async function updateRole(role, tuition) {
  return apiFetch('/profile/role', { method: 'PATCH', ... });
}
```

## Files Changed

| File | Change |
|------|--------|
| `src/presentation/controllers/profile.controller.ts` | New controller at `/profile/*` |
| `src/presentation/controllers/auth.controller.ts` | Removed custom endpoints, kept Better Auth proxies |
| `src/app.module.ts` | Registered `ProfileController` |
| `src/lib/api/auth.ts` | Updated endpoint paths |

## Future Considerations

- File a feature request or PR against `@thallesp/nestjs-better-auth` to support custom endpoints under `/auth/*`
- If accepted, a future version could allow registering custom routes that take precedence over Better Auth's handler
- Alternative: use `useGuards()` with a custom guard that calls Better Auth's `getSession()` instead of relying on the `@Session()` decorator — but this is more invasive
