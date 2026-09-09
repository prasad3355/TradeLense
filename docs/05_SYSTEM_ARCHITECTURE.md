# System Architecture: Tradelense

## 1. Executive Summary
This document defines the target technical architecture for the Tradelense commercial SaaS. Tradelense operates as a monolithic web application (React + Vite frontend, Node.js + Express backend) backed by Supabase (PostgreSQL for data, Storage for screenshots, Auth for identity). Gemini API serves as the external intelligence layer for image extraction and coaching, while a billing provider (e.g., Stripe) manages subscriptions. The architecture prioritizes data isolation, deterministic operations, strict AI guardrails (fail-closed), and server-side authorization to protect sensitive commercial quotas.

## 2. Architecture Goals
- **Reliability:** The core journaling system must function even if external AI services degrade.
- **Security:** Strict multi-tenant user isolation. User A cannot access User B's trades or images.
- **Maintainability:** A simple, monolithic foundation avoiding premature microservices to maximize startup developer velocity.
- **Data Integrity:** Supabase PostgreSQL guarantees truth; application code ensures deterministic validation; AI is isolated to text/image extraction safely gated by human review.
- **Cost Control:** Strict server-side enforcement of AI quotas and image payloads.
- **AI Reliability:** AI operations must fail closed with truthful error states, never fabricating data.

## 3. Architecture Overview

```text
       [ User (Browser / Mobile Web) ]
                |
                v
       [ Web Application (React / TS) ]
                |   (HTTPS / JWT)
                v
       [ Backend / API (Node.js) ] <===+==> [ Billing Provider (TBD) ]
                |                      |
                +----------------------+==> [ Gemini AI Services ]
                |
      +---------+---------+
      |                   |
[ Supabase Auth ] [ Supabase PostgreSQL / Storage ]
```

**Trust Boundaries:**
- The **Browser** is untrusted. It cannot directly push to the DB or call Gemini without backend mediation and entitlement checks.
- The **Backend** is trusted. It holds secrets, enforces quotas, calculates auth, and proxies protected calls.
- **Supabase** is the ultimate layer of trust (production ground truth), enforcing Row Level Security (RLS).

## 4. System Components

### 4.1 Web Client
**Responsibilities:** UI rendering, routing, local state management, form validation, image compression (pre-upload), dashboard/chart rendering (Recharts), and executing user flows.
**Constraints:** The client must NEVER hold secret API keys (Gemini, Stripe, Supabase Service Role). It must never be the sole enforcer of commercial quotas.

### 4.2 Backend/API
**Responsibilities:** Central authority for business logic. Verifies Auth JWTs, orchestrates Gemini AI calls, enforces Free/Pro subscription entitlements, tracks AI scan quotas, validates incoming schemas before saving to Supabase, generates exports, and handles webhook events.

### 4.3 Database
**Responsibilities:** Supabase PostgreSQL is the undisputed production source of truth. It stores user profiles, trades, settings, and behavioral tags. It mandates data integrity via relational schemas and RLS. (Detailed in `06_DATABASE_ARCHITECTURE.md`).

### 4.4 Storage
**Responsibilities:** Supabase Storage securely houses screenshot uploads. Buckets are private. Object paths are scoped by `user_id`. The backend coordinates signed URLs or validated uploads to ensure images are firmly associated with the correct user, ensuring orphan limits and MIME validation.

### 4.5 Authentication
**Responsibilities:** Supabase Auth issues secure sessions/JWTs linking users to their UUID. (Detailed in `08_AUTH_SECURITY.md`).

### 4.6 AI Service Layer
**Responsibilities:** The Gemini API provides vision-to-text extraction and conversational logic. The backend orchestrates this by wrapping requests in strict JSON schemas, implementing rate limiting, caching, and mapping failures to safe client errors. (Detailed in `07_AI_ARCHITECTURE.md`).

### 4.7 Billing
**Responsibilities:** External provider (e.g., Stripe) maintains subscription state. Webhooks notify the Backend to grant or revoke "Pro" entitlements in the `users` table. Server-side checks block premium API routes if entitlement is missing. (Detailed in `09_SUBSCRIPTION_BILLING.md`).

## 5. Request Lifecycle
`Browser` → `API Route` → `Auth Middleware validates JWT` → `Entitlement/Quota Middleware (if premium)` → `Input Validation (Zod)` → `Business Logic execution` → `Supabase/External Service integration` → `JSON Response to Browser`.
- **Errors:** Caught by a global error handler and returned as standard `{ error: message }` payloads without stack traces.

## 6. Authentication and Authorization Flow
- **User** logs in via Frontend.
- **Supabase Auth** verifies credentials and returns a JWT.
- **Frontend** attaches JWT to API headers.
- **Backend (Authentication)** decodes JWT to establish identity (`user_id`).
- **Backend (Authorization)** queries DB to confirm `user_id` has permission to execute the action (e.g., has remaining AI quota or owns the requested trade ID).

## 7. Trade Journal Data Flow
**Manual Entry:**
`User` → `Client validation` → `Backend API` → `Auth/Validation` → `Supabase DB Insert` → `Success` → `UI Update`.

**AI Scan:**
`Screenshot` → `Client down-samples image` → `Backend` → `Backend sends Image+Schema to Gemini` → `Gemini returns JSON` → `Backend enforces Schema match` → `Backend returns payload to matching Client` → `User human-reviews payload in UI` → `User clicks Save` → `Backend API treats as Manual Entry insert` → `Supabase DB`.

**CRITICAL:** Gemini extraction MUST NOT automatically save a trade. The extraction result is an intermediate, ephemeral state.

## 8. AI Failure Architecture
The system employs strict **Fail-Closed** logic.
If Gemini times out, returns malformed JSON, exceeds quota, or hallucinates schema keys:
- **DO NOT** fabricate values.
- **DO NOT** invent confidence scores.
- **DO NOT** save a corrupted/empty trade string.
- **DO** close the loading state, present a truthful error ("AI scanning unavailable"), retain the uploaded image, and present the user with a blank manual entry form to ensure recovery.

## 9. Data Ownership Model
Ownership is absolute and enforced via DB Row Level Security (RLS) and Backend checks.
- **User** owns their `trades`, `screenshots`, `analytics`, `behavioral history`, and `subscription/usage records`.
- Example RLS: `CREATE POLICY "Users can only select their own trades" ON trades FOR SELECT USING (auth.uid() = user_id);`

## 10. Free/Pro Entitlement Architecture
When a user hits a premium route (e.g., `/api/ai/scan`):
- Backend identifies user.
- Backend queries `subscriptions` for tier.
- If Free, backend checks `usage_limit` table.
- If usage > limit, backend explicitly denies access (HTTP 403) BEFORE calling Gemini.
- This secures the app from bankruptcy-inducing API abuse.

## 11. AI Usage and Cost-Control Architecture
- **Limits:** Hard rate limits per IP/User to prevent loop abuse.
- **Tokens:** Pre-compression of screenshots (e.g. 1024x1024 max rules) reduces multi-modal token overhead by 80%.
- **Duplicate Protection:** Debounce client buttons and assign idempotency keys to uploads.
- **Cost control:** 100% server-side.

## 12. Database Access Architecture
- Backend interacts with Supabase using authenticated clients scoping queries to the user's JWT.
- Batch analytics use Read-Only replicas (if available) or optimized backend-mediated aggregations.
- No direct client-to-database mutations bypassing backend business logic.

## 13. Storage Access Architecture
- Private buckets. Path structure: `screenshots/{user_id}/{trade_uuid}.jpg`.
- Backend issues short-lived Signed URLs for the client to render images securely in the Trade Detail view.

## 14. API Architecture
Logical Domains (RESTful JSON API via Express):
- `/api/auth` (Session mgmt bridging to Supabase)
- `/api/trades` (CRUD for manual and confirmed AI trades)
- `/api/ai/scan` (Receives image, returns structured JSON)
- `/api/ai/coach` (Conversational performance loop)
- `/api/analytics` (Aggregation endpoints)
- `/api/billing` (Stripe webhooks / session creation)
- `/api/export` (CSV generation)

## 15. Analytics Architecture
**Core Rule:** AI is NOT a calculator.
- Raw trade data generates aggregated metrics via deterministic JavaScript/SQL.
- P&L, Win Rate, RR, duration, and streaks are strictly mapped mathematically.
- If AI is used in analytics, it is strictly to interpret the already-calculated numbers in natural language.

## 16. Behavioral Intelligence Architecture
Pipeline:
`DB Trade History` + `Execution Metadata` + `Psychology Tags` -> `Backend Aggregation` -> `Pattern Detection (e.g., "Wins on Mon vs Fri")` -> `Insights`.
Behavior is derived from factual journal entries. Unsupported psychological diagnoses are explicitly barred.

## 17. AI Coach Architecture
User question -> `/api/ai/coach`.
Backend checks entitlement -> Queries DB for user's last 30 trades and current month Win Rate -> Crafts system prompt -> Passes Context + Question to Gemini -> Validates output -> Streams to UI.
Must remain grounded, never offering financial guarantees or hallucinated trades.

## 18. Export Architecture
- `/api/export/csv`. Checks authorization. Streams DB cursor to CSV encoder to maintain memory safety. Respects Free/Pro boundaries if Pro exports include deeper behavioral metadata.

## 19. Subscription and Billing Architecture Boundary
- **Tradelense:** Maintains `users.subscription_tier`.
- **External Provider (Stripe):** Holds payment logic, retry logic, invoices, and card data.
- **Boundary:** Webhooks (`checkout.session.completed`, `customer.subscription.deleted`) bridge the gap, translating external financial events to internal application entitlements.

## 20. Error Handling Architecture
Categories: `400 Validation`, `401 Unauthorized`, `403 Forbidden` / `Rate Limit`, `404 Not Found`, `500 Internal`, `503 Service Unavailable (Gemini)`.
- Client receives safe, actionable strings (`"Screenshot unreadable"`).
- Backend logs technical root cause + stack traces to internal logging. Passwords / API keys are NEVER logged.

## 21. Observability Architecture
- Application logs (Winston/Pino) tracking request latency, AI token usage, and AI failure rates.
- Privacy constraint: Exclude PII (names, emails) and raw journal notes from general system logs unless strictly necessary for debugging a specific targeted incident.

## 22. Performance Architecture
- Client-side lazy-loading of heavy charting libraries.
- Backend implements cursor-based pagination for large journal datasets.
- Backend requests only required columns to reduce memory overhead. Pre-calculating dashboard summaries async if required as lists grow.

## 23. Scalability Strategy
- **Stage 1 (Launch):** Monolithic Node.js + Express API. Direct DB connections.
- **Stage 2 (Growth):** Supabase connection pooling (PgBouncer) activated. Basic Redis caching for aggregate analytics.
- **Stage 3 (Scale):** Separate Worker processes specifically for background tasks (exports, heavy recurring AI batch scans).
- *Avoid premature microservices at V1.*

## 24. Development vs Production Architecture
- **Development:** Uses `.env.local`. May fallback to mock JSON files for offline UI development.
- **Production:** Strict environment variables injected by hosting provider (e.g., Vercel/Render). Connected to production Supabase. Local file fallbacks are permanently disabled. Production enforces all billing webhooks.

## 25. Security Boundaries
Browser MUST NOT harbor secrets.
Server-side exclusively holds:
- `GEMINI_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## 26. External Dependencies
| Dependency | Purpose | Criticality |
| :--- | :--- | :--- |
| **Supabase** | Primary DB, Auth, Storage | High (P0) |
| **Gemini API** | Scans, Extract, AI Coach | High (P0) - Fails gracefully |
| **Billing (Stripe)** | Subscriptions | Medium - Defaults to Free |
| **Hosting Platform**| Serve UI & API | High (P0) |

## 27. Architectural Failure Modes
| Failure | Impact | Detection | Response |
| :--- | :--- | :--- | :--- |
| **Gemini Unavailable** | AI scans fail | Timeout / 503 from external API | Present manual form; log AI outage |
| **Supabase Outage** | Total app outage | Server health-checks fail | Show global maintenance page |
| **Storage Upload Fails** | Can't attach image | S3 error caught by backend | Discard pending trade draft safely |
| **Webhook Delayed** | Upgrade delay | User complains / log mismatch | Allow manual refresh trigger in UI |

## 28. Data Integrity Principles
- **Validation Before Persistence:** Zod/Joi schema ensures data is clean BEFORE `INSERT`.
- **No Fabricated Data:** Backend purges hallucinated keys from Gemini explicitly.
- **Ownership:** Every `trades` record requires a valid `user_id`.

## 29. Architectural Decision Records
- **ADR-001 (Monolithic API):** Node + Express chosen for V1 to maximize startup velocity over domain-driven microservices.
- **ADR-002 (Supabase):** PostgreSQL selected as the absolute production source of truth over local JSON.
- **ADR-003 (Gemini):** Gemini selected as the V1 AI provider due to strong multi-modal capabilities.
- **ADR-004 (Server-side Entitlements):** Subscription checks live in backend middleware preventing client-side API bypassing.
- **ADR-005 (Fail-closed AI):** AI failures return null extraction states, preventing silent data corruption.
- **ADR-006 (Private Storage):** Trade images are strictly private and accessible only via authorized scoped URLs.
- **ADR-007 (Deterministic Math):** Application code uniquely owns numerical calculations (PNL, RR) to guarantee perfect financial accuracy.

## 30. Future Architecture [FUTURE]
*(Not included in V1 scope)*
- Background queue system (BullMQ) for generating complex PDF analytics reports.
- Event-driven architecture for robust multi-device syncing.
- Direct broker API webhooks (MetaTrader/TradingView integrations).

## 31. Architecture Acceptance Criteria
- [x] All major frontend, backend, and persistence boundaries defined.
- [x] Fail-closed AI behavior and schema-enforcement documented.
- [x] Security scopes mapped (secrets only on server).
- [x] Authorization boundaries for Free/Pro defined.
- [x] Data ownership explicitly tied to database architecture and user auth.
- [x] Document is fully consistent with PRD (`01`) and Feature Spec (`02`).

## 32. Document Governance
- **Document Owner:** Product Owner / Technical Architecture Authority.
- Engineering must abide by this target architecture. Current implementation variances must be gradually refactored to meet this document.
- Changes require approval matching the business intent in `04_BUSINESS_MODEL.md`.
