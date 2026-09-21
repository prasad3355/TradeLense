# Authorization and Validation Architecture

## Introduction
The backend architecture is scoped around structural and sequential security. This document details the distinction between authentication and authorization, ownership logic, validation constraints, and explicit failure semantics. 

## Authentication vs Authorization
- **Authentication ("Who is this?"):** Identifies the user. This is exclusively handled by `requireAuth`, which securely processes the Supabase Bearer token and extracts `req.user`. It strictly prevents `user_id` assumption from incoming JSON.
- **Authorization ("What may this user access?"):** Dictates permissions. This is achieved via `requireOwnership` and explicit DB Row Level Security (RLS). A user may be securely *authenticated* but still forcibly *unauthorized* to access another user's trade entries or profile.

## Request Identity Source
User identifiers (`user_id`) must NEVER be trusted from `req.body`, `req.query`, or `req.params`. The only authoritative source of identity is `req.user.id`, strictly decoded from the verified Supabase token within the `requireAuth` middleware.

## Request Flow
Every protected request follows a strict sequence:
1. `requireAuth` (Extract validated Bearer token -> Reject 401 or set `req.user`)
2. `validateRequest` (Parse Body, Params, Query against Zod Schemas -> Reject 400 VALIDATION_ERROR)
3. `requireOwnership` (Assert resource matches `req.user.id` -> Reject 403 FORBIDDEN)
4. Contextual Handler Logic
5. Supabase Admin Query (Leveraging internal RLS rules as defense-in-depth)

## Authorization & Ownership Model
Ownership enforcement occurs systematically via two primary mechanics:
1. **Application-Layer Validation (`server/auth/authorize.ts`)**: Handlers use explicit checks (e.g. `requireOwnership()`) comparing the inherently trusted `req.user.id` against a target resource's Owner ID before executing expensive operations or revealing resource metadata.
2. **Defense-in-depth RLS**: When utilizing database interfaces, policies restrict table reads/writes exclusively via `FOR ALL USING (auth.uid() = user_id)`.

## Validation Model
Incoming user input is never trusted directly. It's statically bounded via **Zod Validation Layers** inside `server/validation/validate.ts`. 

## 4xx Failure Semantics
- **401 Unauthorized**: Authentication missing, invalid format, or expired bearer token.
- **403 Forbidden**: Token valid, but the user lacks specific ownership or privilege to mutate the target resource.
- **404 Not Found**: Used interchangeably occasionally alongside 403 when a resource fetch returns null, effectively preventing external bad actors from enumerating other users' existences.
- **400 Validation Error**: Structured safely, hiding stack traces:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request.",
    "details": [{"path": "field_name", "message": "Expected string"}]
  }
}
```

## Legacy Prototype Isolation
During codebase analysis, legacy references utilizing literal placeholders such as `default-user` and client-submitted `req.body.user_id` insertions were identified (e.g., inside `src/components/SettingsView.tsx` prototype SQL backups and `/legacy/*`). 
These implementations strictly deviate from V2 specifications and were deliberately quarantined resulting in no local persistence bypassing modern authorization bounds taking effect.

## Service-Role Rules
- The `SUPABASE_SERVICE_ROLE_KEY` is fully and absolutely restricted to the backend `.env`. It is NEVER exposed to `src/` bundles.
- The Service Role client (`getSupabaseAdmin()`) inherently bypasses RLS in DB triggers. Therefore, manual Application-level Authorization rules (`requireOwnership`) must precede DB queries in protected handlers to bridge access control effectively.

## Testing Limitations
The current framework lacks integrated unit-testing suites (Vitest/Jest omitted originally) and local Docker environment integration prohibiting runtime e2e execution logic. Authentication context handlers (`test-auth.ts`) were designed strictly to type-check structure matching TS implementations correctly validating dependencies. Integration tests mapping native Supabase logic are marked functionally skipped pending infrastructure execution setup.
