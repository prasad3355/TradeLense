# 17. V2 ENGINEERING EXECUTION BLUEPRINT

## 1. CORE PURPOSE & V1 REUSE POLICY
Tradelense V2 is a secure, server-authoritative, maintainable, free-tier-first, scale-ready SaaS. V1 is merely reference material.

**V1 Reuse Classification:**
- **KEEP**: Visual design tokens, color variables, Tailwind generic spacing, Lucide icons configuration.
- **REFACTOR**: Generic React UI primitives (Buttons, Inputs) to support proper form boundaries.
- **REBUILD**: `App.tsx`, Dashboard, Navbar, routing, trade model, analytics calculations. V1 conceptually depended on local state violating server authority.
- **REMOVE**: Local JSON persistence, filesystem `fs` saving, Supabase public bucket integrations, Gemini heuristic mock fallbacks.
- **DO NOT REUSE**: `server.ts` monolithic structure without validation boundaries, missing RLS DB scripts. Unsafe V1 architecture must never enter production.

**V1 Removal Strategy:**  
`INVENTORY → CLASSIFY → ISOLATE → REPLACE/REBUILD → REMOVE`  
No valuable reusable UI/design asset should be deleted before its replacement or preservation decision is verified. 

## 2. DEVELOPMENT PRINCIPLES
- **Database-First**: Establish ownership, user identity, and storage relationships early.
- **Auth-First**: Secure all endpoints before exposing production user data.
- **API-First Data Authority**: No client-side calculations for P&L or analytics.
- **AI Implementation Order**: Provider abstraction → Integration → Request validation → Quota reservation → Image processing → Extracted structured parsing → Schema validation → Business validation → Human review → Persistence → Usage settlement. NO FAKE DATA.
- **Analytics Implementation Order**: Raw trade data → DB aggregates → API aggregates → Frontend visualization.
- **Billing Implementation Order**: Auth → User Model → Entitlements → Core Product → Stripe → Webhooks → Server Enforcement.
- **Free-Tier Principle**: Initial implementations use PostgreSQL and existing managed infrastructure. New infrastructure (Redis, queues, vector databases, microservices) require measurable justification securely.
- **Accessibility**: A continuous requirement. Every UI implementation must include semantic HTML, labels, keyboard interaction, focus states, and meaningful loading/error states.

## 3. TASK EXECUTION CONTRACT
For each task in this blueprint:
1. Lead Architect provides exact task prompt natively matching the Section 7 template.
2. User feeds prompt to Antigravity.
3. Antigravity implements ONLY that exact task.
4. Antigravity reports changes cleanly.
5. Tests are reviewed.
6. Browser/security verification is performed.
7. Lead Architect accepts/rejects.
8. Only after acceptance is the next task issued. Antigravity MUST NEVER proceed autonomously.

## 4. UNIVERSAL DEFINITION OF DONE (DoD)
A task is genuinely complete only when:
- Implementation directly matches specification.
- Unit/Integration tests pass.
- Browser/Security checks pass.
- Zero console or server runtime errors.
- No unintended architecture regressions/drift.
- NO fake/mock production data; NO local persistence (`fs` module).
- Git state is clean (no secrets committed).

## 5. ARCHITECTURE DRIFT CONTROL & SECURITY GATES
**Security Gates:** NO production AI endpoint may be enabled before Authentication + Authorization + Input validation + Entitlement resolution + Atomic usage reservation + Rate limiting + AI fail-closed behavior are implemented and tested.
**Drift Control:** Any attempt to introduce alternate databases, client-side analytics authority, microservices, unnecessary realtime queues, or unapproved provider changes must explicitly be flagged and rejected natively.

## 6. PHASE STRUCTURE & TASK LIST

*Dependencies Reasoning:* Entitlement and usage boundaries MUST exist perfectly securing infrastructure resources BEFORE expensive AI scans natively trigger requests.

### PHASE 0 — Repository and Development Foundation
Establish the core V2 repository separating out V1 prototype artifacts accurately.
- **P0-T01**: Initialize Vite + React 19 Frontend environment bounds.
- **P0-T02**: Initialize Express 5 + Zod Backend environment bounds.

### PHASE 1 — Application Architecture & Routing Foundation
Set up application routing and layout wrappers.
- **P1-T01**: Implement React Router v6 DOM configurations.
- **P1-T02**: Rebuild generic Navbar & Sidebar layouts wrapped in isolated generic component boundaries.

### PHASE 2 — Database V2 Foundation
Clarify that Supabase Auth owns identical authentication structures while this Application DB handles account/profile rules. Focus is preparing ownership architecture properly.
- **P2-T01**: Define account/profile schemas linking natively against Supabase Auth identities.
- **P2-T02**: Establish core ownership architecture for trades, AI usage, entitlements, settings, and scopes preventing orphaned data. 
- **P2-T03**: Implement Row Level Security (RLS) constraints for all tables.

### PHASE 3 — Authentication & Account Security
- **P3-T01**: Integrate Supabase Auth UI/Login logic.
- **P3-T02**: Implement backend JWT Verification Middleware tracking against Supabase validation requests.

### PHASE 4 — API Validation & Authorization Foundation
- **P4-T01**: Construct central Zod validation schemas for all fundamental HTTP payloads.
- **P4-T02**: Attach explicit ownership enforcement matching identical user_ids protecting backend access explicitly.

### PHASE 5 — Core Trade Domain
- **P5-T01**: Implement strict Trade Creation REST endpoints (POST `/trades`).
- **P5-T02**: Implement Trade Update & Delete endpoints (PUT/DELETE `/trades/:id`).

### PHASE 6 — Manual Journal Entry
- **P6-T01**: Build V2 Manual Trade forms linking securely to `/trades` API.
- **P6-T02**: Enforce client-side accessibility and validation matching Zod parameters securely.

### PHASE 7 — Journal Query / Pagination
- **P7-T01**: Implement Server-Side Cursor Pagination endpoints.
- **P7-T02**: Rebuild the generic Journal Listing React components fetching paginated responses natively.

### PHASE 8 — Storage
- **P8-T01**: Implement Client-side WebP Image Compression utilities guarding explicit dimension limitations.
- **P8-T02**: Configure Private Supabase Buckets protecting RLS constraints cleanly preventing unverified injections.

### PHASE 9 — Entitlement + Usage Foundation
- **P9-T01**: Build PostgreSQL-backed atomic usage accounting tracking explicit quota reductions correctly.
- **P9-T02**: Implement API Middleware confirming quota Entitlement capacity before explicitly permitting external dependencies functionality safely. 

### PHASE 10 — AI Provider + AI Scan
- **P10-T01**: Establish AI Provider abstraction interface securely mapped to target Gemini boundaries properly. 
- **P10-T02**: Intercept image processing mapping to structured extracted parsing utilizing secure failure limits tightly rejecting fake cognitive definitions.

### PHASE 11 — AI Review & Persistence
- **P11-T01**: Build validation review screening guaranteeing Humans natively authorize structured parameters.
- **P11-T02**: Handle successful persistence tracking usage settlement recursively securely.

### PHASE 12 — Deterministic Analytics
- **P12-T01**: Create Postgres SQL Views tracking specific deterministic calculations perfectly (Win-rate, P&L, R:R). 
- **P12-T02**: Expose `/analytics` REST APIs querying aggregates natively blocking client-side derivation procedures globally.

### PHASE 13 — Dashboard
- **P13-T01**: Bind visual dashboard interfaces directly mapping explicitly to generic cached Server-Side aggregated limits safely. 

### PHASE 14 — Behavioral Intelligence
- **P14-T01**: Enforce strict emotional definition bounding verifying explicit constraints cleanly protecting parameters dynamically.

### PHASE 15 — AI Coach
Do not introduce unnecessary complex vector/RAG systems prematurely.
- **P15-T01**: Gather structured user context naturally + deterministic analytics histories seamlessly rendering AI reasoning parameters effectively minimizing database derivation bloats natively. 

### PHASE 16 — Billing
- **P16-T01**: Implement native Stripe API logic ensuring secure subscription webhooks reflect cleanly mirroring status back to PostgreSQL boundaries organically avoiding client authorization schemes broadly.

### PHASE 17 — Commercial UX
- **P17-T01**: Map limit exhaustion errors gracefully returning actionable upgrade pathways naturally protecting the UI definitions smoothly. 

### PHASE 18 — Accessibility / Performance
As basic formatting accessibility handles dynamically via generic component building previously organically, Phase 18 tracks global hardening:
- **P18-T01**: Perform systemic generalized Keyboard traversal tests checking final contrast ratios perfectly scaling constraints locally preventing regression failures fluidly.

### PHASE 19 — Testing, CI/CD, Production Readiness
- **P19-T01**: Final E2E testing gating deployment architectures mapping cleanly across environment thresholds properly natively.

### PHASE 20 — Launch
- **P20-T01**: Security checking verifying exact environment variable protections tracking gracefully executing main launch structures cleanly natively.


## 7. TASK TEMPLATE
This defines the universal format the **Lead Architect** natively uses when issuing prompts directly to Antigravity securely managing scopes iteratively strictly natively without dumping comprehensive lists consistently natively across execution definitions.

**Task ID:**  
**Task Name:**  
**Purpose:**  
**Dependencies:**  
**Inputs:**  
**Expected Changes:**  
**Files/Modules:**  
**Database Impact:**  
**API Impact:**  
**Frontend Impact:**  
**Security Impact:**  
**Tests:**  
**Browser Verification:**  
**Acceptance Criteria:**  
**Rollback Criteria:**  
**Definition of Done:** 

## 8. DEPENDENCY GRAPH & CRITICAL PATH
**Critical Path:** 
`Foundation (P0)` → `Database (P2)` → `Auth (P3)` → `Authorization (P4)` → `Core Trade Domain (P5)` → `Journal (P6, P7)` → `Storage (P8)` → `Entitlement / Usage (P9)` → `AI (P10, P11)` → `Analytics (P12)` → `Behavioral Intelligence (P14)` → `AI Coach (P15)` → `Billing (P16)` → `Commercial UX (P17)` → `Production Hardening (P18, P19)` → `Launch (P20)`

**Parallel-Safe Tasks:** 
Only genuinely independent work operates concurrently securely:
- Isolated UI Design-token classifications cleanly map concurrently against Backend API structural boundaries dynamically safely. 
- Documentation scaling scopes procedurally alongside UI development phases successfully. 

*Strictly Blocked Tasks:* 
- Auth-dependent domains cleanly blocked pending Authentication tracking organically natively. 
- API access points strictly blocked until valid RBAC/RLS Authorization parameters operate successfully safely. 
- Billing mappings tightly blocked resolving strict Entitlements tracking seamlessly natively. 


## 9. MIGRATION & DATA STRATEGY
V1 prototype data must **NOT** be blindly imported mapping flawed database architectures. Any required import utility dictates separate scoped features defining boundaries tracking validations mapping securely into V2 constraints safely without polluting core systems gracefully organically.

## 10. ROLLBACK & GIT STRATEGY
- **Main Branch**: Always deployable logic reflecting strict acceptance approvals securely.
- **Task Commits**: Each commit isolates specifically to the specific Task organically flawlessly tracking generic commits completely uniquely securely natively.
- **Rollback**: If a task fails acceptance cleanly reverse specific commits gracefully reverting structure definitions tracking optimally gracefully safely securely natively avoiding monolithic deploy rollbacks generally safely.

*Document locked ensuring explicit Execution Blueprint bounds.*
