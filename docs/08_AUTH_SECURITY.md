# Authentication and Security Architecture: Tradelense

## 1. Executive Summary
This document defines the target authentication, authorization, privacy, and security architecture for the Tradelense commercial SaaS. It specifies how user identities are established (Authentication) and how access to sensitive financial journal records is restricted (Authorization). Multi-tenant data isolation relies fundamentally on impenetrable server-side enforcement and Supabase Row Level Security (RLS). The system absolutely forbids client-side security filtering, protects AI and Stripe webhook boundaries server-side, and mandates the isolation of all privileged credentials. 

## 2. Security Goals
- **Confidentiality:** User financial journal data and screenshots must be strictly private.
- **Integrity:** Subscriptions and deterministic quotas must remain mathematically unforgeable by bad actors.
- **Availability:** Rate limits must prevent scraper/abuse floods from exhausting AI quotas or DB pools.
- **Privacy:** Least-privilege data access; PI/financial data is only visible to the owning user.
- **Authentication:** Establish true identities via verifiable cryptographic sessions.
- **Authorization:** Server-side confirmation of ownership prior to any resource mutation or data delivery.
- **Accountability:** Maintain immutable audit trails of destructive operations (Account/Data deletion).
- **Resilience:** Security controls must layer (Defense-in-depth), preventing catastrophic leaks if a single middleware fails.

## 3. Threat Model
| Threat | Impact | Mitigation |
| :--- | :--- | :--- |
| **Unauthorized account access** | Journal leak | Supabase Auth secure sessions, brute-force limits. |
| **Credential theft** | Account takeover | TLS enforcement, HttpOnly/Secure token handling. |
| **IDOR (Direct object ref)** | Cross-user data leak | Backend validates `user_id` matches JWT identity; RLS on DB. |
| **Malicious file uploads** | Subverting storage | Server validates MIME, size < X MB, strips EXIF. |
| **API/AI quota abuse** | Cost bankruptcy | Server-side usage counting and hard rate limits. |
| **Prompt injection** | Corrupted AI Coach | Prompts strictly segregate user inputs as unprivileged data blocks. |
| **Subscription manipulation**| Free users get Pro | Frontend is UX-only. Express middleware verifies DB Stripe state. |
| **Webhook forgery** | Fake upgrades | Webhook signatures cryptographically validated (Stripe `stripe-signature`). |
| **Secret exposure** | Database compromise | API keys strictly managed in `.env` or Vault. No browser exposure. |

## 4. Authentication Architecture
The target authentication flow relies on Supabase Auth.
`User` → `Supabase Provider (Email/OAuth)` → `Session (JWT)` → `Browser (Storage)` → `Backend API (Bearer Header)` → `Identity verification (Server decoding)` → `Authorized Request`.
- Covers Login, Logout, Session Expiry (refresh token rotation).
- Account Recovery utilizes provider-issued transactional emails.

## 5. Identity Model
- **Authentication identity:** Managed by the Auth Provider (`auth.users`), handling salts/hashes/tokens.
- **Application Profile:** Managed by `public.profiles`, storing display preferences.
- **Ownership:** Every user-owned row in the database rigidly binds via Foreign Key to `auth.users(id)`. Passwords/keys are NEVER copied to application tables.

## 6. Session Management
- **Lifecycle:** Supabase Auth issues short-lived JWTs and long-lived refresh tokens.
- **Validation:** API middleware decrypts the JWT to cryptographically verify validity before fulfilling `/api` requests.
- **Logout:** Kills local session; invalidates refresh token on the server.

## 7. Authorization Architecture
**Authentication is NOT Authorization.**
`Authenticated Identity` → `Does User own resource?` → `Does User possess Entitlement?` → `Action Allowed/Denied`.
Every API route handling trades, screenshots, behavioral tracking, exports, or AI must pass through an authorization middleware verifying identity vs row owner.

## 8. Resource Ownership
| Resource | Owner | Required Authorization |
| :--- | :--- | :--- |
| **Profile** | `user_id` | Authenticated owner |
| **Trade** | `user_id` | Authenticated owner |
| **Trade screenshot** | `user_id` | Authenticated owner |
| **AI Extraction state** | `user_id` | Authenticated owner |
| **Behavioral insight** | `user_id` | Authenticated owner |
| **Coach session** | `user_id` | Authenticated owner |
| **Export file** | `user_id` | Authenticated owner |
| **Subscription** | `user_id` | Authenticated owner (Read), System (Write) |
| **Audit event** | `system` | Restricted backend admin tools |

## 9. Row Level Security
Production RLS is mandatory for all multi-tenant tables (`trades`, `profiles`, `subscriptions`, etc.).
`Authenticated user identity` mapping directly to `record ownership` is the final safety net. If a developer forgets an API check, RLS will fail the SQL query.
*Frontend filtering (e.g. `WHERE user_id = X`) is UX, NOT security. An attacker can change `X`. RLS reads the cryptographically secure JWT inside the DB.*

## 10. Backend Authorization
For every request:
1. Authenticate (Is there a valid JWT?).
2. Identify user (Extract UUID).
3. Validate input (Is the payload shaped correctly?).
4. Authorize resource (Does UUID match the DB row?).
5. Check entitlement (Can UUID use the AI endpoint?).
6. Execute action.
7. Return safe response.
*The backend NEVER trusts browser-supplied UUIDs for permissions, plan levels, or quotas.*

## 11. API Security
- Inputs validated tightly against Zod schemas.
- Max request payload limits (e.g., 2MB).
- General express rate limiting (`express-rate-limit`).
- Generic API Error messages.
- Helmet security headers (HSTS, CSP).
- CORS locked to defined exact origins (Production domain).

## 12. IDOR Protection
Insecure Direct Object Reference (IDOR) is Tradelense’s biggest risk.
If `GET /api/trades/999` is requested, the backend will strictly enforce: `SELECT * FROM trades WHERE id = 999 AND user_id = auth.uid()`. Guessing another user's trade ID will confidently return `404 Not Found` or `403 Forbidden`. Obscuring UUIDs is insufficient; ownership checks are required.

## 13. Supabase Security
- Database tables default to anonymous/public Deny All.
- Authenticated JWT users are constrained by RLS.
- **Service-Role key:** Highly privileged. Bypasses RLS. Strictly contained within the Node.js backend to facilitate webhook mutations or crons. Never exposed to the frontend bundle.

## 14. Storage Security
Bucket: `trade_media` must be Private.
Paths must enforce user scoping: `user_id/trade_id/file.jpg`.
UI renders images via short-lived Signed URLs.
This protects against path traversal and unauthorized enumeration.

## 15. File Upload Security
- **MIME/Extension Validation:** Client MIME types are untrusted. Backend must verify actual file headers (Magic Bytes).
- **Processing:** Downsample image on backend to strip malicious EXIF metadata.
- **Limits:** *OPEN SECURITY DECISION* for strict byte/dimension maximums.

## 16. AI Security
- `GEMINI_API_KEY` lives server-side only.
- AI must NOT have agency to execute arbitrary SQL or manipulate subscriptions.
- Prompt injection MUST NOT trick AI into fetching another user's trades. DB context is selected *deterministically by the application* prior to AI interaction.

## 17. Prompt Injection Defense
User content (screenshots, imported texts, manual trade notes) is treated strictly as **untrusted data**.
Prompts clearly demarcate instructions vs user data. AI output is constrained to pre-defined strict JSON schemas. Evaluated output is data, never executable code.

## 18. Secrets Management
Secrets: `GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`.
Rules:
- Never committed to Git.
- Handled securely via `.env`.
- Avoid leaking via 500 error stack traces.
- Rotate immediately if suspected compromised.

## 19. Environment Separation
- **Development:** Locally scoped `.env` vars, mocked billing.
- **Staging:** A separate isolated Supabase project.
- **Production:** Live secrets restricted to server environment variables. Production databases must never be directly linked/queried from local developer workstations.

## 20. Free/Pro Security
Security intersects tightly with entitlements. A client may hide the "AI Scan" button if the user is Free, but a malicious POST to `/api/ai/scan` MUST be blocked by backend middleware querying the server-authoritative `subscriptions` DB table. Client-side checks are purely for UX.

## 21. Subscription Security
Billing state is server-authoritative. Stripe Webhooks use signed secrets (`stripe-signature`) to prove authenticity before Tradelense grants user entitlements. Webhook processing is idempotent to prevent race-condition abuses. (Details in `09_SUBSCRIPTION_BILLING.md`).

## 22. AI Usage Security
Abuse of Free and Pro quotas is prevented through atomic, server-side tallying of requests in `ai_usage_events`. Attempts to replay or flood API requests will be caught by server counters, rendering client tampering useless.

## 23. Rate Limiting
Explicit conceptual rate limits required.
Examples:
- Auth: 5 attempts / 5 mins.
- AI Scan: X per minute.
- Global API: Y total per minute.
*Exact limits are an OPEN SECURITY DECISION.*

## 24. Abuse Prevention
Measures to detect velocity spikes (credential stuffing, scraping). Tradelense backend should support future integrations like Cloudflare / WAF layers if scraping bots heavily target endpoints.

## 25. Privacy Architecture
Data minimization: Only send required trade variables to AI tools.
Store the minimal required PII in the Profile table. Users maintain complete ownership of their journal history and have the right to full extraction/deletion.

## 26. Logging and Audit
- **Log:** Auth failures, permission denials, subscriptions changes, AI abuse attempts.
- **DO NOT LOG:** Plaintext passwords, API keys, full Base64 screenshots, or sensitive financial notes in general operational logs.

## 27. Audit Event Model
Critical events generate records (e.g., `audit_events` table).
Includes: Event Type (e.g., `ACCOUNT_DELETED`), Actor (`user_id`), Target, Timestamp, and Outcome.

## 28. Security Error Handling
Errors are truthful but safe.
`401 Unauthorized` (You need to login).
`403 Forbidden` (You don't own this trade).
`404 Not Found` (Masking 403s where knowing a trade ID exists is undesirable).
No SQL stack traces ever returned to the client.

## 29. Account Recovery Security
Conceptual flows for Forgot Password and Email Verification will be managed by Supabase standard secure cryptographic token email flows (No custom insecure OTP implementation required).

## 30. Account Deletion Security
- Must be a deliberate, authenticated action.
- Distinguishes permanently from Subscription Cancellation (which leaves data intact).
- Hard delete cascade eliminates `profiles`, `trades`, private images from storage, and `subscriptions`, guaranteeing GDPR/Privacy compliance.

## 31. Data Export Security
Exports aggregate a user's entire financial history. This API requires strict ownership tokens and rate-limiting. Resulting files must not be enumerable public URLs.

## 32. Security for AI Coach
The backend queries the DB for exactly the logged-in user's trades to inject into the Gemini context. The AI Coach can never bypass application authorization to read general DB state.

## 33. Security for Behavioral Intelligence
Insights crunched from trades must explicitly inherit the `user_id` of the source trades, protected under the same impenetrable RLS rules.

## 34. Database Security
- RLS enabled on all user tables.
- Least privilege strictly enforced.
- Service role key heavily protected.
- Backups running recurrently via PITR.

## 35. Security Testing Strategy
Engineering must implement Unit/e2e Tests simulating:
- User A manipulating request to edit User B's trade (Assert 403/404).
- Free user attempting to hit premium AI endpoints (Assert 403).
- Tampered/invalid webhook payload ingestion (Assert 400).
- Malformed images triggering API bounds (Assert 400).

## 36. Security Incident Response
Process: Detect (Alerting) → Contain (Kill sessions/revoke keys) → Investigate (Logs) → Remediate (Patch) → Rotate (Keys) → Restore → Review.

## 37. Dependency Security
Node `package.json` relies on `npm audit`. Continual monitoring for vulnerabities in Express, Zod, and foundational libraries is required for production maturity.

## 38. Production Security Checklist
- [ ] RLS enabled on every table.
- [ ] Secrets injected via hosting Provider, absent from repo.
- [ ] Backend route authorization middleware verified.
- [ ] Stripe Webhook signature verification verified.
- [ ] Storage Buckets set to Private.
- [ ] CORS domains restricted.
- [ ] HTTPS enforcement enabled.

## 39. Security Failure Modes
| Failure | Impact | Detection | Response |
| :--- | :--- | :--- | :--- |
| **RLS Misconfig** | Data leakage | Automated test fail / DB alert | Immediate patch / Halt API |
| **API Key Leak**| Database exfiltration | GitHub token scanning | Rotate immediately |
| **Forged Webhook**| Stolen premium tier | Signature middleware throws | Ban abusive host IP |

## 40. Security Architecture Decision Records
- **ADR-SEC-001 (Auth Provider):** Supabase Auth preferred for tight DB integration.
- **ADR-SEC-002 (RLS Mandatory):** Enforced across all entities.
- **ADR-SEC-003 (Backend Authz):** Mandatory check on every authenticated route.
- **ADR-SEC-004 (Service-Role):** Credentials limited explicitly to backend workers.
- **ADR-SEC-005 (Private Storage):** Trade images securely guarded.
- **ADR-SEC-006 (Billing Truth):** Subscription state is server-authoritative.
- **ADR-SEC-007 (AI Keys):** API keys isolated from browser.
- **ADR-SEC-008 (AI Privileges):** AI barred from executing direct database migrations or billing checks.
- **ADR-SEC-009 (Client Checks = UX):** JavaScript UI checks are purely cosmetic, never a security boundary.

## 41. Open Security Decisions
- Exact rate limiting bounds (`X` req/min).
- Exact file upload MIME/Dimension policies.
- Account deletion cooling-off period vs instantaneous wiping.
- Multi-region or local compliance constraints (GDPR specific data centers).

## 42. Security Acceptance Criteria
- [x] Full separation between AuthN and AuthZ established.
- [x] Hard multi-tenant boundaries (IDOR + RLS) documented.
- [x] AI and Stripe Webhook security vectors handled.
- [x] Secrets lifecycle defined (Server-side isolation).
- [x] Defensive constraints preventing client-side state tampering established.
- [x] Directly aligned with Documents 01 through 07.

## 43. Document Governance
- **Owner:** Product Owner / Security Architecture Authority.
- This document outlines the required Target security reality.
- The repository source code will be judged against these principles. Pull requests omitting route authorization checks MUST be rejected.
