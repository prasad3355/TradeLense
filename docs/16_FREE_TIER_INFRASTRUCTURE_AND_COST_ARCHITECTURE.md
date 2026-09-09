# 16. FREE-TIER INFRASTRUCTURE & COST ARCHITECTURE

## 1. INFRASTRUCTURE PHILOSOPHY
Tradelense V2 is designed as a **free-tier-first, production-grade, scale-ready** system. 
- **Free-Tier-First**: Initial hosting and dependencies (Supabase, Gemini, hosting platforms) leverage free quotas as an intended strategy, while recognizing these provider limits are configurable and external constraints that must be verified during deployment.
- **Production-Grade**: Security (JWT, RLS, centralized entitlement), verifiable data integrity, and deterministic capabilities are never sacrificed for cost. 
- **Scale-Ready & Cost-Aware**: The modular monolith structure ensures Tradelense can smoothly move to paid tiers with no fundamental architectural rewrite. Premature complex infrastructure (microservices, Kafka queues) is deferred, but the application is built to dynamically adapt to scaling limits.

## 2. TARGET INFRASTRUCTURE TOPOLOGY
The flow enforcing trust boundaries is defined below. The API is the sole authority over database/AI actions.
```
User (Browser Client)
  ↓ [JWT via HTTPS]
Frontend (React + Vite)
  ↓ [REST API POST/GET + JWT Authorization]
Backend/API (Express.js)
  ↓ [Service Account / RLS verification]
Supabase Auth  &  Supabase PostgreSQL  &  Supabase Storage
```
External integrations managed exclusively by the Backend:
```
Backend/API 
  ↓ [Server-Side Keys, AI Provider/Model Configuration Abstraction]
Gemini AI
  
Backend/API 
  ↕ [Webhook Validation, Centralized Entitlement Routing]
Stripe
```
**Authoritative Boundaries**: The client is never trusted to calculate P&L, hold secrets, execute AI calls natively, or dictate subscription entitlements. All interactions route through rigorous Express Backend logic.

## 3. HOSTING STRATEGY
- **Candidate Frontend Hosting**: Vercel Free Tier, Cloudflare Pages, or Netlify. The architecture preserves standard static frontend hosting.
- **Candidate Backend Hosting**: Render Web Service, Vercel Serverless, or generic Docker environments. The Node/Express API remains stateless allowing seamless migration.
- **Environment Separation**: 
  - `Development`: Local environment accessing a local/remote development database.
  - `Staging`: Secondary cloud environment replicating production configuration.
  - `Production`: Immutable deployment executing real user actions securely.
- **Limits**: Serverless cold starts may introduce delays. Persistent local filesystems (e.g., Node `fs`) are completely prohibited in favor of stateless, scalable environments.

## 4. SUPABASE FREE-TIER STRATEGY
The Supabase free tier demands strict efficiency:
- **No `SELECT *`**: Queries fetch only necessary scalar items.
- **Aggregations**: Handled heavily by SQL views/queries to prevent Node mapping loads.
- **Pagination**: Compulsory cursor-based or offset pagination limiting return boundaries.
- **Connections**: Rely on PgBouncer (connection pooling) preventing connection exhaustion.
- **Indices**: Proper B-tree indexing on `user_id`, `created_at`, and foreign keys.
- **Resource Exhaustion**: Safeguards must remain independently configurable, ensuring application parameters never directly border provider hard limits dynamically.

## 5. DATABASE EFFICIENCY
Frontend-wide data loading is explicitly removed. 
- **Server-Side Pagination**: API forces chunked responses mapping boundaries securely.
- **Indices**: Compound indices (`user_id`, `created_at`, `status`) exist for all query workloads.
- **Expensive Query Detection**: Heavy logic executes against dedicated materialized views or optimized aggregate tables only when justified, preventing repetitive CPU-bound table locks.

## 6. DATABASE STORAGE ECONOMICS
- **User-Owned Permanent Data**: Trades, Journals, Settings, and Subscriptions.
- **Derived/Temporary Data**: AI heuristic processing artifacts automatically pruned or minimized. 
- **Audit Data**: Essential for security but subject to retention curves scaled proportionally to user entitlements.

## 7. SCREENSHOT STORAGE STRATEGY
Trading screenshots present primary bandwidth and scale costs.
- **Private Storage**: Requires explicit backend authorization policies and private buckets (never use a public bucket merely for convenience).
- **Signed URLs**: Frontend requests a short-lived signed URL generated via the server for image consumption.
- **Validation**: Uploads strictly limited to specific formats and a configurable max size (enforced server-side).
- **Duplicate Prevention**: Client generates SHA hashes blocking multi-uploads of identical binaries.

## 8. IMAGE COMPRESSION
- **Client-Side Compression**: The React client uses browser APIs to compress dimensions and format types before transmission.
- **Server-Side Validation**: Exact sizes and limits are verified server-side ensuring security boundaries.
- **Deletion Behavior**: Must adhere to a strict asynchronous deletion lifecycle removing orphan objects.

## 9. GEMINI COST/QUOTA STRATEGY
Gemini usage is governed via centralized policy controls dynamically aware of business limits.
- **Model Routing**: Integrated through an AI provider/model configuration abstraction, utilizing a Gemini Flash-class model. The exact production model is an implementation-time decision based on latency, capabilities, and economics.
- **Quotas**: Governed firmly by application business limits (not provider maximums) to maintain safety headroom. 
- **Abstractions**: AI Requests track timeouts and employ exponential backoff limits gracefully failing-closed.
- **Accountability**: Never assume AI is unlimited merely because a free tier currently supports it.

## 10. AI ECONOMICS
- **Deterministic Computation**: Native application logic strictly handles P&L calculations, Win Rate math, drawdown, and analytics safely without touching generative limits.
- **AI Computation**: Confined uniquely to generative behaviors: OCR Extraction, psychological interpretation, and Coaching insights. 
- **Justification**: Separating deterministic math protects cost structures drastically across scaling events and fundamentally ensures calculation correctness.

## 11. AI QUOTA ENFORCEMENT
To prevent simultaneous requests from bypassing limits, the system operates on a rigorous, atomic reservation/consumption model:
1. Authenticate user
2. Resolve centralized entitlement
3. Atomically reserve quota
4. Execute AI request
5. Settle usage
6. Release/reconcile reservation on failure where appropriate.

## 12. API RESOURCE PROTECTION
- **Rate Limits**: Generic throttling implemented securely protecting against abuse scraping models.
- **Payload Limits**: Strict HTTP payload limits protecting endpoints from JSON memory overflows and massive uploads.
- **Timeout Restrictions**: Configured boundaries preventing hanging HTTP requests masking dependency network faults.

## 13. CACHING STRATEGY
- **Cached Considerations**: Public tier metadata, plan configurations, generic application state.
- **Not Cached**: User P&L, Active AI scans, Session state, Billing data.
- **Invalidation**: Caching user assets introduces massive UX staleness in financial applications and is broadly discouraged functionally.

## 14. REALTIME
Synchronous request/response or lightweight polling remains the default for V2. Realtime architectures (like WebSockets) are kept out unless a concrete, measurable product requirement mandates their introduction later. 

## 15. BACKGROUND JOBS
Synchronous processing is the default for the V2 launch to maintain maximum architectural simplicity. Asynchronous jobs/queues may be introduced later only when measurable requirements justify it, such as:
- Large structural exports.
- Long-running multi-AI processing.
- Off-cycle cleanup workloads.

## 16. OBSERVABILITY
- **JSON Structured Logging**: Logs generated containing mapped structured parameters. 
- **Logging Focus**: API Error traces, authentication faults, application quota exhaustion variables.
- **Secrets Protection**: Proactively dropping passwords, Auth tokens, screenshot URLs, and user PII.

## 17. ENVIRONMENT & SECRETS
- **Client Configuration**: Safe variables (prefixed specifically for Vite).
- **Backend Secrets**: Server-bound environment layers locking Gemini API target keys, Supabase Service roles, webhook endpoints, and Stripe credentials securely off-limits to JS endpoints.

## 18. SECURITY VS COST
Authentication constraints, JWT verifications, Row Level Security, private object storage limits, API strict typing, webhook validations, and secure sessions **will never be compromised for cost considerations.**

## 19. FREE-TIER EXHAUSTION
When external configuration bounds are reached gracefully handle exhaustion:
- Temporary provider outage (503s upstream).
- Application quota exhausted (Valid thresholding).
- The system must communicate truthful failover bounds and avoid silent corruption vectors entirely avoiding fabricated fallback generation. 

## 20. FREE USER EXPERIENCE
Free limits are application-configurable business limits. When exhausted natively via the centralized quota engine, the UI explicitly describes the state without dark patterns guiding seamlessly upgrade parameters.

## 21. PRO USER EXPERIENCE
Pro Users scale natively relying exclusively on identical infrastructural frameworks dynamically passing elevated policy checks managed natively on the isolated Backend servers.

## 22. COST PER USER MODEL
Cost variables remain modular and external:
`Fixed infrastructure + DB consumption + Storage + Bandwidth + AI usage + Billing fees + Observability`. 
Tradelense operates efficiently over free-tier bounds prioritizing sustainable initial launch economics.

## 23. UNIT ECONOMICS
Provider pricing remains external and subject to change. Validating ARPU against variable storage, pipeline, and foundational DB costs forms the benchmark establishing the absolute cap variables designated for the Free Tier application layers.

## 24. FREE-TIER ABUSE
Anomalies spanning scraping models or multi-spawn account creations are routed by authentications, rate limit bounding, and strict payload limitations stopping concurrent queue drains efficiently.

## 25. DATA RETENTION
- **Primary History**: Maintained safely as primary system ownership arrays.
- **Operational Logs & Temporaries**: Defined via explicit deletion policies dropping orphaned assets rapidly.
- Do not delete valuable trading histories solely for localized cost-cutting thresholds natively.

## 26. EXPORT ECONOMICS
API constraints enforce strict synchronous pagination mapping limiting generic abusive dumping metrics via explicit application rate limiters natively. 

## 27. ANALYTICS ECONOMICS
All dashboards compute against server-authoritative `.select()` aggregates natively offloading giant historical raw dataset downloads away from local browser CPU rendering loops securely. 

## 28. SCALING THRESHOLDS
Thresholds prompting infrastructure scale-ups are conceptually derived via API latency boundaries, explicit concurrent users tracking, and configurable DB storage constraint monitors prior to deployment definitions.

## 29. SCALE-UP PATH
Scaling dictates **no fundamental architectural rewrite**. It may require:
- Infrastructure layer scaling (dedicated databases, larger nodes).
- Query tuning or compound indexing.
- Observability expansions and eventual queue introduction scopes cleanly preserving existing domain architecture limitations. 

## 30. NO PREMATURE MICROSERVICES
The API models retain strict monolithic structure natively handling domain definitions inside clean programmatic isolation keeping architectural mapping operations stable. 

## 31. FAILURE MODES
Define truthful categorized failures explicitly protecting the front end:
- Temporary provider outage.
- Application quotas exhausted.
- Authentication validation failures.
- Timeouts tracking upstream bottlenecks cleanly without fabricating synthetic result metrics intrinsically.

## 32. DATA INTEGRITY DURING FAILURES
Failures halt transactions atomically protecting ghost trades, orphaned images, or phantom pipeline metadata integrations cleanly via the application repository logic scopes mapping strict foreign-key dependencies. 

## 33. PERFORMANCE BUDGETS
Performance budgets remain initial engineering targets / SLO candidates subject to intensive testing validations natively avoiding blind premature optimized processing boundaries broadly. 

## 34. MOBILE/BANDWIDTH CONSIDERATIONS
Pagination logic and lazy loading protect mobile client architectures from egregious bandwidth saturation heavily utilizing the Signed URLs constraint mappings organically. 

## 35. CDN CONSIDERATIONS
Candidate hosting provides initial basic global edge deliveries inherently natively via Static deployment platforms saving specialized complex explicit CDN derivations until measurably justified requirements escalate definitions. 

## 36. BACKUP & RECOVERY
Backup and PITR capabilities are entirely derived via provider-plan dependency constraints natively. Verification checks must occur establishing exact capabilities pre-launch natively combining manual logical exports providing generic user-level recuperation safety factors. 

## 37. DEPLOYMENT ARCHITECTURE
GitHub acts securely invoking CI/CD deployment channels abstracting isolated environments defining strictly staging operations apart from deployment production mappings gracefully natively. 

## 38. CI/CD COST CONTROL
Keep integration and testing routines natively focused verifying required security checks keeping explicit bounds preventing runaway environmental previews or exhaustive remote builds organically. 

## 39. DEVELOPMENT ENVIRONMENT
The local environment actively targets isolated non-production endpoints seamlessly providing developers accurate test metrics devoid of manual local JSON or proxy dependencies heavily mimicking staging parameters. 

## 40. SECURITY TESTING
Infrastructure verification links directly via Vitest limits running JWT, IDOR, API verification, quota bypass, and Webhook checks actively pre-flight tracking architecture stability cleanly. 

## 41. COMMERCIAL BILLING INFRASTRUCTURE
Stripe exists securely directing payment statuses updating local DB models natively retaining strictly Stripe verified payload constraints via Idempotency mappings structurally. 

## 42. AI PROVIDER ABSTRACTION
Direct pipeline calls isolate natively inside Provider interfaces ensuring model configurations shift cleanly devoid of localized systemic rippling constraints throughout global API nodes. 

## 43. PROVIDER LOCK-IN
Abstract logic protects boundaries keeping infrastructure constraints reasonably modular targeting future AWS or alternative scaling environments if dependency restrictions heavily increase generically. 

## 44. INFRASTRUCTURE DECISION RECORDS
- **ADR 001:** Preserve modular monolith to avoid distributed computing complexities targeting scaling paths devoid of fundamental rewrites natively.
- **ADR 002:** Abstract GEMINI calls wrapping atomic quota reservations heavily preventing runaway limitations safely. 
- **ADR 003:** Security standards dictating Storage and RLS authorizations never compromise for free limitations inherently. 
- **ADR 004:** Utilize centralized policy management rendering user entitlements actively Server-Side dropping arbitrary client verification clauses securely. 
- **ADR 005:** Asynchronous task processing defaults strictly synchronous avoiding complex workers pre-emptively natively. 

## 45. FINAL RECOMMENDED V2 STACK
- **Frontend Layer:** React, Vite, React Router, TailwindCSS.
- **Backend API Layer:** Express 5.0, Zod constraints natively. 
- **Database Layer:** Supabase PostgreSQL, Supabase Auth.
- **Storage Layer:** Private Supabase Storage object mapping safely via signed boundaries strictly separated from basic RLS tracking queries securely. 
- **Generative AI Layer:** Provider abstraction injecting Google Gemini Flash-Class model limits securely mapped via deployment evaluations properly. 
- **Billing Layer:** Stripe.

## 46. INFRASTRUCTURE READINESS CHECKLIST
- [ ] Vercel/Render pipeline ENV candidate keys mapped generically tracking explicit staging bounds cleanly.
- [ ] RLS and Storage Authentication verification limits tracked natively preventing Public vulnerabilities completely.
- [ ] Concurrency testing checks quota-locks verifying atomic decrement architectures flawlessly. 
- [ ] Logging environments map JSON fields scrubbing generalized PII bounds aggressively. 

## 47. OPEN DECISIONS
- Exact final candidate selection evaluating Render vs Vercel Serverless hosting.
- Exact Gemini model designation parameters targeting Flash-bounds.
- Application-configurable business limits setting Free / Pro generative quota targets specifically.
- Backup / PITR parameter capabilities explicitly evaluated via the final Supabase Free Tier configuration limits functionally.
- Exact thresholds prompting explicit async queue processing introduction cleanly.
- Storage capacity bounds establishing explicit file dimensional max tracking cleanly natively minimizing footprint scaling. 

***
*Document generated according to explicit Tradelense V2 correction guidelines.*
