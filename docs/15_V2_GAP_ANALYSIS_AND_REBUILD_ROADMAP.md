# Tradelense V2 Gap Analysis & Rebuild Roadmap

## 1. Executive Summary
This document outlines the transition of the Tradelense application from its initial, vibe-coded prototype (V1) to a secure, scalable, and commercial startup-grade SaaS product (V2). It defines the gaps identified in the codebase audit and provides a rigorous, phased roadmap for rebuilding systems correctly based on the target architecture. 

## 2. V2 Product Target
Tradelense V2 is a commercial "AI Trading Journal OS," offering deeply integrated behavioral insights, deterministically calculated financial analytics, and a multi-tiered subscription model designed for traders. Security, robust financial logic, and absolute data integrity are core deliverables.

## 3. V1 Prototype Position
The V1 application is treated strictly as reference material—an aesthetic shell that successfully demonstrated the conceptual product loop. It is fundamentally unsuitable for production, lacking multi-tenancy, authentication, RLS, testing, valid pagination, and server-side logic validation.

## 4. Audit Summary
The audit (docs/14_FULL_CODEBASE_AUDIT.md) confirmed that zero commercial infrastructure exists. Storage permits public insertion, AI requests fabricate mock fallback data to avoid crashing, analytics run completely on the client in a blocking manner, and persistence writes to local JSON filesystem state, which will destroy container orchestration.

## 5. Gap Analysis Method
Each feature subsystem was evaluated by comparing the V2 architectural and product guidelines (Docs 01-13) against the existing repository implementation. Gaps identify precisely where the target logic diverges from the current reality.

## 6. Decision Classification
Implementation strategy relies on five categorical decisions for legacy code: KEEP (preserve), REFACTOR (modify), REBUILD (rewrite), REMOVE (delete), and NEW (create).

## 7. KEEP Criteria
Code is KEP if it is aesthetically correct (e.g., core Tailwind styles), context-free, secure, and has zero dependency on legacy monolithic logic.

## 8. REFACTOR Criteria
Code is REFACTORED if its conceptual structure is sound, but its implementation requires integration adaptation (e.g., Vite configurations, component wrappers).

## 9. REBUILD Criteria
Code is REBUILT if it violates security, acts as a local monolithic dependency, handles client-side math, or relies on insecure storage paradigms.

## 10. REMOVE Criteria
Code is REMOVED if it acts as a prototype-exclusive band-aid, such as `fs.write` local backups, `mockPresets`, and AI heuristic fallbacks.

## 11. NEW Criteria
Features are labelled NEW if they exist in the V2 target specification but were completely absent in V1 (e.g., Stripe Billing, Auth, Quotation logic).

## 12. Product Gap Analysis
V1 presents the illusion of a product without actual value retention. V2 requires onboarding, user lifecycles, and protected analytics boundaries.

## 13. Frontend Gap Analysis
V1 heavily relies on state-based monolithic routing mapped inside `App.tsx` and executes intensive loops to calculate P&L. V2 requires `react-router-dom` and clean, lightweight API data binding.

## 14. Backend Gap Analysis
V1 uses a single `server.ts` Express file with open API endpoints. V2 requires modular controllers, Zod validation logic, and secure JWT verification middleware.

## 15. API Gap Analysis
V1 endpoints are unpaginated, lack validation, and allow global overwrites. V2 requires standard filtering, idempotency keys, and explicit user-ownership checks.

## 16. Database Gap Analysis
V1 operates on a flat `trades` table with a dummy user. V2 requires normalized multi-tenancy, specific data type limitations, foreign keys, and indices.

## 17. Storage Gap Analysis
V1 actively permits `ALLOW PUBLIC INSERT` on Supabase Storage. V2 targets secured, RLS-protected storage objects bound explicitly to authenticated tenants.

## 18. Authentication Gap Analysis
100% Gap. Auth does not exist. V2 requires Supabase Auth (JWT generation).

## 19. Authorization Gap Analysis
100% Gap. IDOR vulnerabilities exist across all endpoints. V2 demands server-side matching of the session JWT against the targeted resource ID.

## 20. RLS Gap Analysis
100% Gap. V2 requires explicit Row Level Security scripts configured at the Supabase PostgreSQL layer for all tables.

## 21. Security Gap Analysis
100% Gap. V1 lacks rate limiting, CSRF protection, and environment isolation. V2 standardizes zero-trust validation before interaction with the database.

## 22. AI Gap Analysis
V1 fabricates values when stressed. V2 enforces deterministic failover without hallucinations.

## 23. AI Extraction Gap Analysis
V1 uses `mockPresets` on API failures. V2 triggers a standard `422 Unprocessable` Error.

## 24. AI Failure Gap Analysis
V1 overrides failure via "Heuristic Cognitive Fallback". V2 routes explicitly to a manual, blank data-entry form.

## 25. Analytics Gap Analysis
V1 calculates analytics deterministically on the client causing CPU blocking. V2 calculates analytics on the backend DB leveraging fast PostgreSQL aggregation.

## 26. Behavioral Analytics Gap Analysis
V1 fabricates emotional traits. V2 enforces explicit data-binding to historical AI responses validated by user input.

## 27. Dashboard Gap Analysis
V1 renders static placeholder graphs based on mocked AI returns. V2 requires Recharts backed by real dynamic database grouping outputs.

## 28. Journal Gap Analysis
V1 lacks infinite scroll/pagination, dumping the whole JSON array to the client. V2 mandates cursor-based pagination.

## 29. UI/UX Gap Analysis
V1 presents a high-end visual base. V2 formalizes this into reusable primitive components to stabilize layout jitter.

## 30. Responsive Gap Analysis
V1 uses fixed-scaling. V2 implements CSS Grid and Flexbox wrapping for tablet/mobile.

## 31. Accessibility Gap Analysis
V1 provides no ARIA labels or keyboard support. V2 builds accessibility natively into core component refactors.

## 32. Subscription Gap Analysis
100% Gap. V2 requires a fully integrated Stripe Customer lifecycle state.

## 33. Billing Gap Analysis
100% Gap. V2 requires Stripe webhook parsing, signature validation, and idempotency.

## 34. Entitlement Gap Analysis
100% Gap. V2 requires database reconciliation of Pro logic (e.g. tracking "is_active").

## 35. Usage/Quota Gap Analysis
100% Gap. V2 limits free-tier AI requests via server-side Redis OR DB counter enforcement.

## 36. Export Gap Analysis
Missing. V2 introduces CSV/JSON extraction functionality strictly scoped to tenant usage.

## 37. Settings Gap Analysis
Missing. V2 introduces a profile management and billing portal.

## 38. Testing Gap Analysis
100% Gap. V2 incorporates Vitest/Jest and deterministic API route testing.

## 39. Observability Gap Analysis
V1 uses `console.log`. V2 introduces structured server logging mechanisms for error tracking.

## 40. Performance Gap Analysis
V1 blocks UI thread with map/reduce operations. V2 shifts compute load to optimized Postgres queries.

## 41. Scalability Gap Analysis
V1 writes to local disk containers. V2 forces completely stateless Express API nodes scaled infinitely.

## 42. Deployment Gap Analysis
V1 lacks environmental CI/CD checks. V2 institutes staging vs production pipeline gates.

## 43. V2 Target Architecture
A stateless Node/Express backend securely bridging a Vite-based React frontend to a heavily sandboxed Supabase Postgres deployment.

## 44. V2 Frontend Architecture
React 19 + Vite. Routing via React Router v6. Lightweight, declarative state managed natively with React Context where absolutely necessary.

## 45. V2 Backend Architecture
Express 4/5. Modular controller/service/repository pattern. Every incoming router validates input strictly with Zod.

## 46. V2 API Architecture
RESTful semantics with pagination, filtering parameters, and standardized JSON error structures matching HTTP definitions.

## 47. V2 Database Architecture
Supabase Postgres. Heavy reliance on robust data-type declarations, constraints, compound indices, and isolated foreign keys.

## 48. V2 Storage Architecture
Supabase Storage with explicit RLS preventing unauthenticated inserts or reads.

## 49. V2 Authentication Architecture
Supabase Auth (JWT processing context on Express via Authorization headers).

## 50. V2 Authorization Architecture
Multi-layer protection: API validates user_id ownership match + Supabase RLS natively enforces secondary rejection.

## 51. V2 AI Architecture
Gemini Node SDK wrapper that operates strictly as a pure transformer (Image -> JSON), aborting and failing-closed if limits are hit.

## 52. V2 Analytics Architecture
Backend database views and optimized `.select()` aggregates minimizing data payload bandwidth and client-side processing risk.

## 53. V2 Behavioral Intelligence Architecture
Data persists accurately without heuristic inference when unavailable.

## 54. V2 AI Coach Architecture
RAG-oriented pattern providing actionable analytics based accurately on calculated history, completely rejecting fabrication logic.

## 55. V2 Subscription Architecture
Database single source-of-truth synced directly by verified Stripe Webhooks.

## 56. V2 Billing Architecture
Client triggers Stripe Checkout sessions via secure API endpoint links referencing local user context.

## 57. V2 Entitlement Architecture
API middleware queries entitlement state prior to permitting AI requests.

## 58. V2 Usage Architecture
Transaction counters update atomically with each successfully completed AI pipeline Request.

## 59. V2 Testing Architecture
Mandatory test coverage requirements for billing, Math/P&L calculations, and security guards.

## 60. V2 Observability Architecture
Standard structured JSON outputs capturing context variables for APM ingest.

## 61. Free-Tier Strategy
Avoid monolithic paid abstractions. Leverage the inherent Free Tier limits of hosting via intelligent query optimization and application layout.

## 62. Free-Tier Hosting
Vercel/Render free tiers for stateless Express & React hosting.

## 63. Free-Tier Database
Supabase Free Tier (limit constraints enforced locally).

## 64. Free-Tier Authentication
Supabase native JWT provisioning (0 cost < 50k MAU).

## 65. Free-Tier Storage
Image compression executed on the frontend BEFORE dispatching to Supabase Storage, preserving finite byte quotas.

## 66. Free-Tier AI Usage
Initial launch relies on Gemini 1.5/3.5 Flash free-tier quotas (RPM bound), protected aggressively by client-side limits.

## 67. Free-Tier Bandwidth
All endpoints enforcing pagination/limits prevent payload bloat.

## 68. Free-Tier Database Efficiency
Avoid N+1 queries. Process aggregation inside SQL views rather than returning 1,000s of rows to JS RAM.

## 69. Free-Tier Storage Efficiency
Automatically expire or heavily compress raw screenshots retaining only what is needed.

## 70. Free-Tier Query Efficiency
Indexing targets specifically `user_id` + `created_at` matching the primary query footprint.

## 71. Free-Tier AI Cost Control
Fail-closed AI limits without aggressive background retries preventing loop exhaustion.

## 72. Free-Tier Abuse Prevention
IP tracking and strict rate limiting blocks malicious DDoS API consumption.

## 73. Free-Tier Rate Limiting
Apply memory-cache based standard throttling on vulnerable endpoints (`/api/ocr`).

## 74. Free-Tier Capacity Planning
Hardcap logic implemented gracefully; if capacity hits maximal limit, fallback is to Manual input explicitly.

## 75. Free-Tier Failure Strategy
"Service Under High Load" messaging without breaking legacy journal access capabilities.

## 76. Free-to-Paid Infrastructure Transition
Abstract configurations to `.env` targeting enterprise URLs when migrating off free instances, no rewrite needed.

## 77. Scalability Without Rewrite
Nodes remain stateless natively ensuring seamless future clustering integration.

## 78. Dependency Analysis
React and Vite remain native. Strip legacy filesystem Node assumptions. Apply Zod.

## 79. Dependency Decisions
**NEW**: React Router, Zod, Stripe.
**REMOVE**: Node `fs` utilization for db backups. 

## 80. Technology Decisions
Vite (Bundler), TS (Typing), React (UI), Express (API), Supabase (DB).

## 81. Architecture Decisions
No microservices. Monolithic Modular Architecture focusing deeply on separation of concerns.

## 82. Reusable V1 Assets
Tailwind theme, basic visual HTML hierarchy, Lucide iconography layer.

## 83. V1 Assets Requiring Refactor
Express instantiation configs.

## 84. V1 Assets Requiring Replacement
`App.tsx` global map reducers.

## 85. V1 Assets to Remove
`mockPresets`, Local Storage Syncers, Heuristic Generative Scripts. 

## 86. Completely New Systems
Auth Session Wrapper context, Stripe integration layer, Vitest implementations, RLS policies.

## 87. Engineering Dependency Graph
Foundation -> Database -> Auth -> Domain -> Analytics -> UI -> Billing

## 88. Critical Path
Authentication & DB Setup must be completed before API routing or Fronted bindings.

## 89. Foundation Layer
Vite/Express initialization, Env validation.

## 90. Data Layer
Supabase Schema migration with strictly enforced RLS.

## 91. Security Layer
Auth JWT validation middleware attached to Express routes.

## 92. Domain Layer
Trade ingestion endpoints mapped mapping purely Zod-validated structures.

## 93. API Layer
Standardization of REST HTTP response shapes.

## 94. AI Layer
Re-implement Gemini processing with strict fail-closer and explicit validation returns.

## 95. Analytics Layer
Postgres SQL view formulation for P&L aggregate metrics.

## 96. Product UI Layer
Implementation of React Router and declarative component lifecycles.

## 97. Commercial Layer
Stripe Checkout integrations mapping to Database limits.

## 98. Quality Layer
Testing suite injections spanning Unit / API endpoints.

## 99. Operations Layer
Proper observability log deployment mechanisms.

## 100. Development Phase Strategy
Highly structured sequential execution to prevent massive unstructured scope creep.

## 101. Vertical Slice Strategy
Build from Database up to API out to UI in isolated vertical sprints (e.g. Auth pipeline).

## 102. One-Task-at-a-Time Strategy
Isolate implementation tasks. Prevent overlapping monolithic agent prompts.

## 103. Implementation Verification Strategy
Manual logic checking prior to closing each targeted subsystem.

## 104. Testing Strategy During Development
Tests accompany each vertical slice built (e.g., Auth tests exist before API tests).

## 105. Browser Verification Strategy
Validating UI layout natively alongside logical construction.

## 106. Regression Strategy
Maintaining testing coverage gating future task deployments.

## 107. Phase 1 — Foundation
Clean dependencies, establish strict project structure, set linting and Zod parameters.

## 108. Phase 2 — Database
Generate, execute, and test primary Supabase Schema migrations utilizing strict RLS parameters.

## 109. Phase 3 — Authentication
Establish JWT middleware validations and client-side Auth Context routing bounds.

## 110. Phase 4 — Core Trade Domain
Rebuild the API trade ingestion schemas.

## 111. Phase 5 — Journal
Implement backend pagination controllers matching Frontend Data table feeds.

## 112. Phase 6 — Storage
Implement secure frontend-client based image compression algorithms before sending exclusively to authenticated Supabase bucketing.

## 113. Phase 7 — AI Scan
Revert hardcoded mock datasets logic, integrating explicit deterministic Fail-Closed logic pipeline on Gemini responses. 

## 114. Phase 8 — Analytics
Remove frontend map reducers and generate optimized Postgres Views.

## 115. Phase 9 — Behavioral Intelligence
Ensure database records enforce strict adherence limits for trait outputs limiting heuristic guesswork.

## 116. Phase 10 — AI Coach
Develop AI Coaching algorithms constrained by accurate non-hallucinated historical queries context.

## 117. Phase 11 — Entitlements
Enforce user limitation boundaries globally in middleware.

## 118. Phase 12 — Usage & Quotas
Ensure logic natively tracks user actions atomically decrementing available interactions.

## 119. Phase 13 — Subscription
Develop local data syncing mapping stripe models (e.g. status, renewal).

## 120. Phase 14 — Billing
Implement Stripe Webhook controllers validating robust execution signatures.

## 121. Phase 15 — UI/UX V2
Bind finalized API models directly backwards into the stylized React interface layers.

## 122. Phase 16 — Accessibility
Enforce final keyboard and tagging validation over all UI structures.

## 123. Phase 17 — Performance
Target N+1 queries. Establish final caching definitions across endpoints.

## 124. Phase 18 — Testing
Complete E2E logic checking all user flow definitions natively.

## 125. Phase 19 — Production Infrastructure
Deploy via isolated environmental CI/CD chains ensuring stable node deployment processing.

## 126. Phase 20 — Launch
Product verification gating and final documentation.

## 127. Phase Dependencies
Phases build linearly across Database -> Auth -> Domain limits sequentially.

## 128. Task Dependencies
Frontend data-bindings cannot proceed without Zod API definition stabilization.

## 129. Parallelizable Work
UI primitive styling components natively uncoupled from logic layers.

## 130. Sequential Work
Auth integrations MUST precede Database RLS and API Routing definitions.

## 131. P0 Implementation Priorities
Strict Auth integrations and Fail-Close AI implementations.

## 132. P1 Implementation Priorities
Database optimizations and Server Side analytical implementations.

## 133. P2 Implementation Priorities
Billing, Quota tracking, and Stripe Integration functionality.

## 134. P3 Implementation Priorities
Advanced AI Psych tooling capabilities relying extensively on past data processing logic.

## 135. Security-First Order
Establish validation boundaries BEFORE API routing initialization.

## 136. Data-First Order
Construct persistent structures aligning exactly to definitions via test mockings.

## 137. Product-First Order
Verify End-to-End lifecycle testing confirms User-Flow architecture accuracy.

## 138. Commercial-First Order
Never launch devoid of active Stripe Webhook listener limits validating free tier exhaustion parameters.

## 139. Quality-First Order
All calculations remain Server-Side mathematically guaranteeing accuracy checks.

## 140. Definition of Done
The target subsystem matches exactly the specifications mandated within Docs 01-13 securely.

## 141. Feature Completion Criteria
Tests pass, endpoint rejects unauthenticated access, handles validation logically.

## 142. Phase Completion Criteria
All vertical components encompassing a phase process cleanly preventing architectural bleed tracking.

## 143. Release Completion Criteria
All 20 Phases are fully integrated without disrupting UI flow paradigms nor invoking Mock fallback code bases.

## 144. Migration Strategy
Wipe V1 database dummy data explicitly preventing legacy format injections from crossing over.

## 145. V1 to V2 Transition Strategy
Treat V1 as purely functional UI referential material avoiding massive code lifting processes natively.

## 146. Prototype Data Strategy
Purge and abandon localized `data.json` storage concepts inherently.

## 147. Development Data Strategy
Create deterministic seeder logic scripts creating real test environments quickly.

## 148. Production Data Strategy
Launch with aggressive backup methodologies guarding real user ingestions correctly via Supabase logic.

## 149. Technical Debt Strategy
Avoid introducing mapping loops within the React Frontend retaining logic exclusively encapsulated to DB limits natively.

## 150. Risk Management
Maintain granular implementation commits avoiding "big bang" integration disasters.

## 151. Rollback Strategy
Maintain strictly versioned migration tracking records cleanly reversing schema mistakes rapidly when required.

## 152. Open Decisions
Pace at which legacy React component architectures are fully wrapped in new primitive styling scopes.

## 153. Final V2 Roadmap
This roadmap outlines exactly how V1 transforms into V2 via methodical sequential deployment iterations specifically mapped for Antigravity-execution sequences.

## 154. Document Governance
Document locked for implementation sequence reference natively enforcing constraints matching target documentation limits exactly.
