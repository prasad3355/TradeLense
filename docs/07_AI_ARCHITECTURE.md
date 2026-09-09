# AI Architecture: Tradelense

## 1. Executive Summary
This document defines the target production AI architecture for the Tradelense commercial SaaS. Google Gemini acts as the core AI engine for V1, providing computer vision (screenshot-to-trade extraction) and language modeling (AI Coach and Behavioral Intelligence interpretation). The architecture strictly abstracts Gemini behind a backend orchestration layer. This ensures that AI extraction remains an untrusted, ephemeral state until explicitly reviewed and saved by a human. AI is treated as an assistant—it must never silently fabricate data, spoof confidence, or replace deterministic financial math.

## 2. AI Architecture Goals
- **Reliability:** The system must gracefully handle Gemini timeouts and errors.
- **Accuracy:** Extraction must favor missing fields over hallucinated guesses.
- **Explainability:** AI Coach recommendations must cite explicit journal facts.
- **Safety:** Defenses against prompt injection and cross-user data leakage.
- **Cost Control:** Strict image downsampling, token limits, and usage tracking.
- **Privacy:** Sending only the minimum required contextual data to Gemini.
- **Provider Flexibility:** The backend must abstract the provider to allow swapping models (e.g., to GPT-4V or Claude) in the future without rewriting core business logic.

## 3. AI System Architecture

**Core Extraction Flow:**
```text
User
 ↓
Web Client
 ↓ (Image + Request)
Backend AI Service
 ↓ (Auth + Entitlement check)
AI Orchestrator
 ↓ (Prompt + Image)
Gemini Provider
 ↓ (JSON Output)
Structured AI Result
 ↓
Validation Layer (Zod/Joi)
 ↓ (Valid payload)
Human Review (UI Form)
 ↓ (User Confirm)
Canonical Database (Supabase)
```

**AI Coach Flow:**
```text
Journal Database
 ↓
Context Builder (Selects recent trades/metrics)
 ↓ (Context + User Prompt)
AI Coach (Backend Orchestrator)
 ↓
Gemini Provider
 ↓
Validated Response
 ↓
User
```

## 4. AI Provider Abstraction
`AIProvider` is an internal backend interface.
**Responsibilities:**
- Send request (vision or text).
- Receive response.
- Normalize result to internal TS types.
- Report token usage.
- Classify provider errors (Timeout, API Key Invalid, Rate Limit).

Gemini is the V1 implementation behind this abstraction, preventing vendor lock-in.

## 5. AI Request Lifecycle
`User request` → `authentication` → `authorization` → `entitlement check` → `quota check` → `input validation` → `context preparation` → `AI request` → `response receipt` → `parsing` → `schema validation` → `business validation` → `result sent to frontend` → `persistence ONLY if explicitly approved by user`.

## 6. AI Trade Screenshot Extraction
**Workflow:**
`Screenshot` → `client-side compression` → `secure upload` → `backend authorization` → `AI usage entitlement check` → `Gemini vision request` → `structured extraction` → `schema validation` → `business validation` → `extraction result` → `human review` → `explicit save` → `canonical trade`.

**Explicit Rule:** AI extraction result ≠ saved trade.

## 7. Screenshot Input Requirements
- **Accepted formats:** JPEG, WebP, PNG (No PDFs/Video for V1 screenshot extraction).
- **Client Compression:** Standardized to reduce payload size.
- **Corrupted Handling:** Fails early during client canvas drawing or backend MIME check.
- **Exact Limits:** *OPEN TECHNICAL DECISION* (e.g., Max 1024x1024, max 2MB).

## 8. Structured Extraction Schema
The Gemini prompt forces a strict JSON output matching this conceptual schema:
- `symbol` (String, Optional, AI-extracted)
- `direction` (Enum[LONG, SHORT], Optional, AI-extracted)
- `entry_price` (Number, Optional, AI-extracted)
- `exit_price` (Number, Optional, AI-extracted)
- `stop_loss` (Number, Nullable, AI-extracted)
- `take_profit` (Number, Nullable, AI-extracted)
- `position_size` (Number, Optional, AI-extracted)
- `entry_time` (String/ISO, Nullable, AI-extracted)

If a value is not undeniably present, Gemini must return `null`.

## 9. Data Authority Model
- **USER-PROVIDED:** Absolute authority. Overwrites AI.
- **SYSTEM-DERIVED:** Absolute authority (e.g., PNL calculation). Cannot be overwritten.
- **AI-EXTRACTED:** Lowest authority. Acts merely as a suggestion to pre-fill a form.

## 10. AI Confidence Architecture
**CRITICAL RULE:** Never fabricate confidence.
Gemini does not reliably provide probabilistic confidence on JSON keys in a zero-shot multi-modal prompt. Therefore, Tradelense uses **Status Indicators**:
- `detected` (Parsed successfully and matched schema).
- `missing` (Not found in image).
- `validation failed` (Backend rejected string-to-number parse).

## 11. Missing Data Strategy
If the screenshot lacks an Entry Price, Gemini returns `"entry_price": null`.
The backend passes `null` to the frontend.
The UI form renders a blank Entry Price input.
The user MUST fill it manually before saving. 
*No heuristic guessing allowed.*

## 12. AI Validation Pipeline
**1. Schema Validation:** Backend parses JSON. Rejects if it returns plain text, markdown blocks, or wrong data types (Zod/Joi).
**2. Business Validation:** Rejects impossible math logically (e.g., `LONG` trade where `exit_price < entry_price` but `PNL > 0` extracted from text). Removes conflicting data.

## 13. AI Failure Architecture
**Fail-Closed Behavior Required.**
If Gemini times out, returns malformed text, or hits a billing limit:
- **DO NOT** fabricate values.
- **DO NOT** activate a fake heuristic fallback.
- **DO NOT** auto-save.
- **DO** show a truthful error: "AI extraction failed. Please enter manually."
- **DO** retain the uploaded image in the manual entry form.

## 14. Retry Strategy
- **Appropriate for:** 503 Service Unavailable, Network timeouts.
- **Inappropriate for:** 400 Bad Request, Quota Empty, Zod Schema Mismatch (implies prompt/image failure).
- **Exact Limits:** *OPEN TECHNICAL DECISION* (e.g., Max 2 retries with exponential backoff).

## 15. Prompt Architecture
Prompts are isolated backend constants.
**Structure:**
`System Instruction (You are a strict data extractor...)` + 
`Task constraints (DO NOT GUESS. Return null if missing)` + 
`JSON Schema format mapping` + 
`Current Base64 Image Inputs`.

## 16. AI Output Normalization
`Gemini response` → `Provider Adapter` → `JSON.parse` → `Normalized Object` → `Schema Validation` → `Frontend DTO`.

## 17. AI Trade Review
AI can suggest emotional/execution labels *post-trade* (e.g., "This looks like a revenge trade because you reopened Gold 2 minutes after a loss").
These remain **suggestions** until the user clicks "Apply Label".

## 18. Behavioral Intelligence
Input: Array of 50 recent valid trades + execution metrics.
AI identifies patterns: "Your win rate drops 30% when trading Asia session".
Insights must avoid clinical psychological diagnoses (e.g., never say "You have ADHD"). Insight must be grounded tightly to trade data.

## 19. Behavioral Evidence Model
Insights are structured objects:
- `Observation`: "Frequent early exits detected."
- `Supporting Metrics`: "22 out of 30 winning trades exited before 1R."
- `Source references`: Array of `trade_id`s.

## 20. AI Coach Architecture
`User question` → `Auth check` → `Quota check` → `Context Selector (fetches last N trades)` → `Stringify Context` → `Gemini` → `Response stream to UI`.
The Coach does not have direct unrestricted SQL access.

## 21. AI Coach Grounding Rules
- Must use provided context.
- Must state "I don't have enough data" if asked about unlogged history.
- Avoid financial guarantees ("This will make you profitable").

## 22. AI Coach Conversation Memory
V1 utilizes **Session-level conversation history**. Context resets on a new chat session to prevent ballooning token costs. *OPEN TECHNICAL DECISION:* Storing long-term behavioral summaries for coach context.

## 23. AI Usage Architecture
Tracked via `ai_usage_events` DB table: `user_id`, `feature_type`, `provider`, `input_tokens`, `output_tokens`, `timestamp`, `status`.
Ensures observability and quota tracking.

## 24. Token and Cost Management
Minimize input context. Only send the strictly required fields (Entry, Exit, Date, PNL). Do not send full Base64 screenshots to the AI Coach unless explicitly requested (Coach is primarily text-based).

## 25. Image Cost Optimization
Client-side Canvas compresses screenshots.
*Exact resizing rules:* *OPEN TECHNICAL DECISION* (e.g., Max width 1200px, 80% JPEG quality) to aggressively control multi-modal API costs.

## 26. AI Quotas
Free and Pro plan limits enforce economic sustainability.
`Quota Check` → `Allow/Deny` → `Execute Request` → `Update Usage Counter`. (Values deferred to Business Model).

## 27. Rate Limiting and Abuse Prevention
Backend IPs and JWTs are rate-limited via Redis/Memory (e.g., max 5 AI requests per minute). Prevents automation/scraping abuse.

## 28. AI Security
- `GEMINI_API_KEY` lives exclusively in backend ENV.
- Payloads are sanitized.
- Server isolates queries to the `user_id` making the request.

## 29. Prompt Injection Defense
User notes/inputs are appended clearly as data blocks (`""" [USER DATA] """`), not instructions. AI output is never fed into an `eval()` or dynamic SQL generator. 

## 30. Privacy Architecture
No user names or emails are sent to Gemini. Only anonymized trade metrics and images. Images mapped to session UUIDs.

## 31. AI Observability
Track: `Success %`, `Validation Failure %`, `Average Latency`, `Token Count`.
Do NOT log: Base64 raw images, User PII, Raw conversation text (unless explicitly opted-in for debugging).

## 32. AI Quality Metrics
- **Extraction:** Validation success rate, missing-field density, user-correction rate.
- **Coach:** Feedback (Thumbs Up/Down).

## 33. AI Evaluation Strategy
Maintain an offline Golden Dataset of 100 benchmark screenshots (MT4, TradingView, prop firm dashboards). Run regression tests when changing Gemini models or prompt structures to ensure extraction accuracy doesn't degrade.

## 34. Human-in-the-Loop Architecture
**AI proposes → User verifies → System validates → User saves → Database persists.**
This is the inviolable rule of Tradelense AI.

## 35. Deterministic vs AI Responsibilities

| Responsibility | Deterministic System | AI |
| :--- | :--- | :--- |
| P&L calculation | YES | NO |
| Win rate | YES | NO |
| RR calculation | YES | NO |
| Trade duration | YES | NO |
| Screenshot text extraction | NO | YES |
| Natural-language summary | NO | YES |
| Behavioral interpretation | NO | YES |
| Data validation | YES | ASSIST |

## 36. AI Failure and Degraded Modes
If Gemini goes offline, Tradelense remains a fully functional manual trading journal. Dashboards, historical analytics, manual entry, and exports work flawlessly. Only the "AI Scan" and "AI Coach" buttons present graceful unavailability toasts.

## 37. AI Provider Dependency Risk
**Risk:** Gemini deprecates a model or changes pricing.
**Mitigation:** `AIProvider` abstraction. We can hot-swap the backend adapter to call OpenAI GPT-4o or Anthropic Claude with minimal business logic refactoring.

## 38. AI Data Lifecycle
`Input` → `processing` → `validation` (Ephemeral memory) → `user review` (Ephemeral client state) → `persistence` (Permanent DB row).

## 39. AI Architecture Failure Modes
| Failure | Impact | Detection | Response |
| :--- | :--- | :--- | :--- |
| **Gemini Outage** | Scans fail | Timeout / 500s | Fallback manual form |
| **Malformed Response** | Validation fails | Zod error | Honest error toast, retry allowed |
| **Quota Exceeded**| Scans blocked | 429 Status | Prompt upgrade or wait |

## 40. AI Architecture Decision Records
- **ADR-AI-001 (Gemini V1):** Gemini is V1 provider. (Cost/Multimodal balance).
- **ADR-AI-002 (Separation):** Extraction is separate from persistence.
- **ADR-AI-003 (Fail-Closed):** Failures result in null operations, not heuristic guesses.
- **ADR-AI-004 (Human Review):** Mandatory checkpoint.
- **ADR-AI-005 (Math=Deterministic):** AI is banned from calculating PNL/RR.
- **ADR-AI-006 (Server Logging):** Usage tracked server-side for accurate billing.
- **ADR-AI-007 (Server Proxy):** AI called via Backend to hide API keys.
- **ADR-AI-008 (Scoped Context):** Coach only receives limited relevant trades to manage token cost.
- **ADR-AI-009 (Abstraction):** Backend isolates provider logic.

## 41. Open AI Decisions
- Exact Gemini version (e.g., `gemini-1.5-flash` vs `gemini-1.5-pro`).
- Exact image dimension downsampling rules.
- Exact retry policy ms timings.
- Exact token limits for Coach context.

## 42. AI Architecture Acceptance Criteria
- [x] Gemini architectural boundary defined.
- [x] Request lifecycle and structured outputs defined.
- [x] Fail-closed and anti-fabrication rules rigidly applied.
- [x] Human-in-the-loop and Deterministic boundary clearly separated.
- [x] Quota enforcement, abuse prevention, and API key protection detailed.
- [x] Compatible entirely with Documents 01 through 06.

## 43. Document Governance
- **Owner:** Product Owner / AI Architecture Authority.
- Engineering strictly uses this document to build AI features. Any modifications altering the fail-closed or human-in-the-loop principles require exhaustive product-level review.
