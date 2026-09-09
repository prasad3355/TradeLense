# API Architecture: Tradelense

## 1. Executive Summary
This document defines the target backend API architecture for the Tradelense commercial SaaS. Utilizing a monolithic Node.js + Express architecture atop Supabase, the API serves as the ultimate enforcer of business logic, multidimensional data isolation, commercial entitlements, and AI safety constraint chains. It acts as the intermediary mapping untrusted interactions:
`Client` → `API` → `Authentication` → `Authorization` → `Validation` → `Business Logic` → `Database/External Services` → `Response`.

## 2. API Architecture Goals
- **Security:** Inviolable server-side boundary guaranteeing user data privacy.
- **Correctness:** Deterministic mathematical operations for analytics, banning AI hallucination from persistence.
- **Consistency:** Standardized error codes, pagination, and response patterns.
- **Maintainability:** Avoiding scattered logic; single middlewares for entitlements.
- **Observability:** Auditability of API keys, subscription webhooks, and failing Gemini payloads.
- **Performance:** Optimized queries mitigating N+1 problems prior to DB hydration.
- **Cost Control:** Strict backend proxying blocking AI quota abuse.
- **Developer Usability:** Simple, well-documented routes avoiding premature microservice complexity.

## 3. API Architecture Overview
```text
           [ Web Client ]
                 ↓ HTTPS
           [ Express API ]
                 ↓
    [ Authentication Middleware ]
                 ↓
    [ Authorization Middleware ]
                 ↓
           [ Validation ]
                 ↓
        [ Business Services ]
      ↙          ↓           ↘ 
[Supabase DB] [Gemini] [Stripe Webhooks]
```
**Trust Boundary:** The Express API backend is completely trusted; the client is fundamentally untrusted. 

## 4. API Layer Responsibilities
**IN SCOPE for API:** Request validation, auth/authz verification, Free/Pro Entitlement checks, Stripe Webhook listening, Gemini Orchestration, SQL execution logic shaping, generating signed storage URLs, error normalization, usage counting.
**NOT IN SCOPE (Must not be trusted if supplied by client):** User_ID payloads determining access rights, "Pro" boolean flags, "Remaining Tokens" counters.

## 5. API Base Structure
Root conceptually mapped as `/api/v1` (with route families):
- `/api/auth`
- `/api/trades`
- `/api/media`
- `/api/ai`
- `/api/coach`
- `/api/analytics`
- `/api/behavior`
- `/api/usage`
- `/api/subscription`
- `/api/exports`
- `/api/settings`
- `/api/webhooks`

## 6. Authentication Middleware
`Request` → `Extract Bearer Token` → `Cryptographic Verification` → `Inject { user_id } to Request Context`.
Fails instantly on invalid tokens (401). Prevents unauthorized entry to protected routes. **Never** trusts a client-provided `user_id` in a JSON request body.

## 7. Authorization Middleware
`Authenticated user` → Evaluate ownership of `/:id` param → `Role/Permission` → `Entitlement check` → `Route Allowed`.
Distinct from Authentication: A valid JWT doesn't grant the right to edit a trade they don't own. 

## 8. Request Validation
`Client UX Validation` + `Server Zod Validation` (Authoritative) + `Business Rules` + `Database RLS Constraints`.
Verifies shape, numeric bounding (Negative position sizes?), Enums, Base64 MIME signatures, payload chunk limits. 

## 9. Standard API Response Model
Structured JSON envelopes to allow metadata scaling.
**Success:** `{ "data": {}, "meta": { "pagination": {} } }`
**Error:** `{ "error": { "code": "VALIDATION_FAILED", "message": "Invalid stop loss" } }`
*Exact envelope schema: **OPEN TECHNICAL DECISION***. Never leaks API keys, stack traces, or Postgres error strings.

## 10. HTTP Status Strategy
- `200`: Success.
- `201`: Created (New trade, settings init).
- `202`: Accepted (Export queued).
- `204`: No Content (Delete successful).
- `400`: Bad Request (Validation failed).
- `401`: Unauthorized (Missing JWT).
- `403`: Forbidden (Wrong owner, Quota empty).
- `404`: Not Found (Obfuscates 403s on masked IDs).
- `409`: Conflict.
- `422`: Unprocessable Entity.
- `429`: Too Many Requests.
- `500/502/503`: Internal Server Error, Gateway problems, Gemini outage.

## 11. Trade Journal API
- `POST /trades`: Create (manual or post-AI review).
- `GET /trades/:id`: Fetch detail.
- `GET /trades`: Fetch list (paginated).
- `PUT /trades/:id`: Update fields.
- `DELETE /trades/:id`: Remove securely.

## 12. Trade Creation
`Client` → `API` → `Auth Check` → `Zod Validation` → `Business Rule Check` → `DB Persistence` → `201 Response`.
AI extraction must NEVER automatically hit this endpoint. It exists purely as an explicit action triggered by human review completion. 

## 13. Trade Update
Must re-validate fields, recalculate analytics (PNL) deterministically, check ownership, and update `updated_at`. Human edits strictly override any previous AI tags.

## 14. Trade Delete
Checks ownership securely. Requires defined DB cascade behaviors (purge related `trade_media` rows and Storage objects). Triggers async behavioral baseline recalculation if massive datasets are impacted.

## 15. Trade List API
Supports Offset/Cursor pagination. Safely filters by date range, symbol, session, PNL status. Explicit bounds applied to prevent "SELECT * FROM trades" crippling the server. 

## 16. Trade Detail API
Securely returns the single trade object + signed URLs for related screenshots. `403/404` if queried ID maps to an opposing user's UUID.

## 17. Media / Screenshot API
Routes allocating short-lived (e.g. 5 min) Signed URLs pointing to private Supabase Storage buckets, executing tight MIME and size checks (e.g., `< 2MB`) prior to granting upload PUT capability. Avoids leaking direct `SUPABASE_KEY`s. 

## 18. AI Extraction API
`Request` → `Auth` → `Quota middleware` → `Validate Image` → `Gemini Request` → `Zod Validation (Enforce JSON schema)` → `Response`.
Outputs to frontend state, strictly bypassing backend trade persistence until requested via Route 12 explicitly.

## 19. AI Extraction Failure Responses
Under conditions of Gemini timeouts, corrupted images, Quota failures, or safety refusals, the API responds with clean application errors, NOT hallucinated text or fake fallback objects. 

## 20. AI Coach API
`User Question` → `Auth/Quota` → `Fetch Context (Current week trades)` → `Pass to Gemini` → `Streaming/JSON Response` → `Increment AI Usage log`. 
Backend selects DB truth carefully; never grants AI uncontrolled `SELECT` capabilities.

## 21. Behavioral Intelligence API
Exposes the analytically generated patterns (e.g., "Frequent revenge trading") derived from factual journal statistics. Evaluates insights safely and returns them to the dashboard.

## 22. Analytics API
Separated deeply from AI. Returns deterministic SQL/JS aggregate mathematics (Summed PNL, overall Win Rate, standard deviation curves). AI interprets, but this endpoint strictly calculates.

## 23. Usage API
Read-only endpoints mapping against `ai_usage_events`. Provides client data for rendering "5/10 scans used this month" bars. Rejects all `PUT/POST` attempts client-side as unauthorized spoofing.

## 24. Subscription API
Provides readonly contextual status deriving from the server. Exposes checkout links, customer billing portal links, and secure tier information. 

## 25. Billing Webhook API
Unauthenticated externally but heavily signature-verified. Idempotent POST listeners reading Stripe events (`checkout.session.completed`), aligning `subscriptions` user rows accurately without trusting sessions.

## 26. Export API
Async / Rate-limited routes creating CSV or JSON compilations of owned trading history. Bounded securely by ownership to never leak multi-tenant journals.

## 27. Settings API
Stores non-critical configs (Dark mode, default timezone) in the `profiles` table. Validates sensible safe defaults.

## 28. Error Architecture
Standard taxonomy (`AUTHENTICATION_REQUIRED`, `VALIDATION_FAILED`, `QUOTA_EXCEEDED`, `AI_INVALID_RESPONSE`). Exact casing/structure: *OPEN TECHNICAL DECISION*.

## 29. AI-Specific API Errors
Properly identifies `AI_UNAVAILABLE` vs `AI_EXTRACTION_INCOMPLETE` vs `AI_QUOTA_EXCEEDED` so the UI can render localized, accurate, and non-confusing fallbacks (e.g., routing to the manual form).

## 30. Pagination
Will utilize standard mechanisms (Offset/Limit limits to 100 per page max). Cursor indexing strongly considered for heavy data loads. Exact format: *OPEN TECHNICAL DECISION*.

## 31. Filtering and Sorting
Uses strict Zod whitelisted parameters (`?symbol=AAPL&sort=desc`). Completely blocks arbitrary un-sanitized strings hitting SQL generators.

## 32. Idempotency
Used crucially in Billing Webhook listening (Event IDs) and AI Extraction submissions (preventing duplicate charging on double clicks). Exact header keys: *OPEN TECHNICAL DECISION*.

## 33. Rate Limiting
Global endpoint limit (e.g. 100/min).
Auth endpoint limit (e.g. 5/min).
AI request limits (e.g. 10/min).
Exact numeric configuration: *OPEN SECURITY/TECHNICAL DECISION*.

## 34. API Security
TLS/HTTPS forced. `helmet` headers included. CORS configured accurately to domain boundaries. No un-hashed secrets allowed in logs.

## 35. API Abuse Prevention
Rate logic + payload chunking thwarts bot scraping, automated enumeration, credential stuffing, and oversized malicious memory floods.

## 36. API Observability
Winston/Pino logging tracks latency percentiles, error rate matrices, usage correlations, and validation block volume. Does not blindly log binary streams or PI strings.

## 37. API Versioning
Endpoints prefixed via `/api/v1` to allow seamless transition scaling later. Strategy specifics: *OPEN TECHNICAL DECISION.*

## 38. API Performance
Relies on Redis caching for static analytical datasets if latency demands it. Heavy data crunching or Gemini 1.5 token processing avoids locking main event loops.

## 39. Async Operations
PDF report generation or heavy behavioral ML analysis belongs in a background queue (e.g., BullMQ). Do not pause the Express request waiting 30 seconds for an orchestration hook. 

## 40. API Data Ownership
| Endpoint Domain | User-Owned Data | Authorization |
| :--- | :--- | :--- | 
| `/api/trades` | Trades | Owner only |
| `/api/ai` | Extractions | Owner only |
| `/api/coach` | Coach History | Owner only |
| `/api/usage` | Usage limit logs | Owner (Read) / System (Write) |
| `/api/webhooks` | Billing Events | Stripe / System (Write) |

## 41. API and RLS Relationship
API Authorization blocks obvious invalid behavior gracefully early (returning a friendly JSON error). 
Database RLS sits underneath it—a ruthless final gate defending the database should the API logic fail to reject a request cleanly.

## 42. API and Entitlement Relationship
Entitlement resolution depends on dynamic fetching. A client stating "I am Pro" means nothing; the API queries the DB upon hitting premium analytics endpoints to guarantee true access.

## 43. API and AI Relationship
The API abstracts Gemini API bindings inside of provider interfaces (`GeminiService`), normalizing JSON prompt injections server-side, securing API keys, and normalizing timeouts. 

## 44. API and Storage Relationship
The API dictates storage logic via constrained Signed URLs. No untrusted client can manipulate raw paths (`user_123/trade_X.jpg`) without explicit API supervision generating those precise keys.

## 45. API and Billing Relationship
The API responds to Webhooks mapping external Customer UUIDs to internal Auth UUIDs automatically. It is the sync bridge linking commercial commerce to app functionality. 

## 46. API Failure Modes
| Failure | Impact | Detection | Response |
| :--- | :--- | :--- | :--- |
| **Auth Provider Down** | No logins | 500 on Auth APIs | Notify user transparently |
| **Gemini Outage** | 503 AI Requests | Timeout hooks | Render Manual forms |
| **Billing Outage** | Sync failed | Failed post hooks | Poll reconciliation script |

## 47. API Testing Strategy
Mocks external services (Stripe, Gemini). Test matrix runs rigorous AuthZ cross-user manipulation (Attempting to view UUID2 with UUID1's JWT). Rate limits, quotas, IDOR, and Zod enforcement bounds checked via CI/CD.

## 48. API Architecture Decision Records
- **ADR-API-001 (Express Backend):** Chosen for startup velocity as API layer.
- **ADR-API-002 (Server Auth):** Trust only verified JWTs.
- **ADR-API-003 (Server Authz):** Enforce data access strictly.
- **ADR-API-004 (AI Validation):** Output verified before trusting.
- **ADR-API-005 (Extraction != Persistence):** Two distinct routes.
- **ADR-API-006 (Deterministic Math):** Application code governs RR/PNL calculation.
- **ADR-API-007 (Idempotent Webhooks):** Double charging blocked by event memory.
- **ADR-API-008 (Untrusted Clients):** UI flags bypassed by API backend checks.
- **ADR-API-009 (RLS Synergy):** Layered DB defense behind API.
- **ADR-API-010 (Monolith first):** Prevent early microservice fragmentation.

## 49. Open API Decisions
*Require technical resolution prior to exact endpoint implementation:*
- Exact Endpoint API Contract paths `/:id/edit` vs `/update` (**OPEN TECHNICAL DECISION**).
- API versioning specification (**OPEN TECHNICAL DECISION**).
- JSON Response Envelope configuration (**OPEN TECHNICAL DECISION**).
- Pagination scheme offset vs cursor (**OPEN TECHNICAL DECISION**).
- Concrete idempotency header implementations (**OPEN TECHNICAL DECISION**).
- Concrete Rate-Limiting rules logic (**OPEN TECHNICAL DECISION**).
- Worker Queue job infrastructure selection (**OPEN TECHNICAL DECISION**).

## 50. API Acceptance Criteria
- [x] Defined all baseline logical operations.
- [x] Explicitly distinguished between Validation, Verification, and Entitlement Checks.
- [x] Forced complete integration of AI fail-closed standards.
- [x] Dictated strictly Server-Authoritative commercial quota controls.
- [x] Implemented API logic syncing effortlessly with Webhooks and Supabase RLS.
- [x] Fully integrated and aligned with Documents 01 through 09.

## 51. Document Governance
- **Owner:** Product Owner / API Architecture Authority.
- Pull Requests integrating endpoints or modifying validation routers MUST conform to these architecture principles. Engineering contracts explicitly rely on these parameters, establishing security perimeters well prior to client consumption.
