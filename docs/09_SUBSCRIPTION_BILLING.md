# Subscription & Billing Architecture: Tradelense

## 1. Executive Summary
This document defines the commercial subscription, entitlement, and billing architecture for Tradelense. Operating on a Freemium SaaS model, Tradelense requires an ironclad boundary between external billing providers (e.g., Stripe) and internal application state. The architecture mandates that subscription state is strictly server-authoritative, driven by securely verified and idempotently processed webhooks. Free/Pro limitations and AI quotas are enforced centrally via backend middleware, ensuring the client cannot spoof commercial privileges. 

## 2. Billing Architecture Goals
- **Correctness:** Subscriptions perfectly mirror the payment provider reality.
- **Security:** Webhooks are cryptographically verified; entitlements are unforgeable.
- **Reliability:** Billing failures gracefully degrade features without corrupting journal data.
- **Transparency:** Clear UI states guiding the user regarding payments, grace periods, and quotas.
- **Auditability:** Every subscription mutation is logged immutably.
- **Idempotency:** Webhook duplication never causes duplicate upgrades or state corruption.
- **Recoverability:** System can independently reconcile stale states by querying the provider.

## 3. Billing System Architecture

```text
User 
 ↓ (Clicks Upgrade)
Tradelense Billing UI 
 ↓ (Initiates Checkout)
Backend (Creates Session)
 ↓
Billing Provider (Stripe Checkout) 
 ↓ (Payment Succeeded)
Webhook (Stripe Event)
 ↓
Webhook Verification (Signature check in Backend)
 ↓
Subscription Synchronization (Idempotent processing)
 ↓
Database (Update `subscriptions` table)
 ↓
Entitlement Resolution (Derived plan state)
 ↓
Feature Authorization (User can now POST `/api/ai/coach`)
```

*The browser DOES NOT directly determine subscription state.*

## 4. Plans

### Free
Real utility without payment:
- Manual trade journaling.
- Core dashboard and metrics.
- Basic analytics (PNL, Win Rate).
- Limited AI Usage (e.g. 5 scans/month).
- Basic CSV exports.

### Pro
Meaningful premium value:
- Higher/Unlimited AI usage (Scans + Coach).
- Advanced analytics & reporting.
- Behavioral Intelligence patterns.
- Deep AI Coach memory.
- Advanced exports.
- Increased storage limits.

*Exact limits/prices: **OPEN BUSINESS DECISION***

## 5. Plan and Entitlement Model
`Plan` (e.g., Pro) → `Entitlements` (e.g., AI Coach Access) → `Limits` (e.g., 500 requests/month) → `Effective User Access`.
Entitlement resolution must rely on secure backend database queries, not frontend feature flags, which a malicious user can trivially bypass using browser dev tools.

## 6. Pricing Model
The pricing strategy relies on automated recurring billing:
- Monthly subscription.
- Annual subscription (with discount incentivizing lock-in).
- Optional Trials or Introductory promos.
- Future multi-regional pricing structures.

*Exact prices/discount rates/trial mechanics: **OPEN BUSINESS DECISION***

## 7. Checkout Flow
1. **User** selects Pro.
2. **Backend** creates a secure checkout session holding the `user_id` as `client_reference_id`.
3. **Billing provider** handles PCI-compliant checkout.
4. **Provider** confirms sequence and sends Webhook.
5. **Backend** verifies signature and synchronizes DB `subscriptions` table.
6. **Entitlement** becomes active dynamically upon the next API request.

*Crucial rule: Tradelense UI returning to the "Success" page does NOT grant Pro. Pro is granted ONLY when the backend verifies the webhook.*

## 8. Subscription Lifecycle
States include: `free`, `trialing`, `active`, `payment_pending`, `past_due`, `cancelling`, `cancelled`, `expired`.
- **Grants Pro:** `trialing`, `active`.
- **Grace Period (Pro temporarily maintained):** `past_due` (Exact duration: **OPEN BUSINESS DECISION**).
- **Free Fallback:** `cancelled`, `expired`.

## 9. Subscription State Machine

| Current State  | Event | Next State | Entitlement Effect | UX |
| :--- | :--- | :--- | :--- | :--- |
| **Free** | Upgrade checkout | Checkout flow | None (Pending) | Processing spinner |
| **Pending** | Valid Webhook | **Active** | Grants Pro | "Welcome Pro" Banner | 
| **Active** | Failed renewal | **Past_Due** | Retains Pro (Grace) | "Update Card" Warning |
| **Active** | Cancel request | **Cancelling** | Retains Pro | "Renews on X" changes to "Ends on X" |
| **Cancelling** | Period Ends | **Expired** | Reverts to Free | Pro features locked |
| **Active** | Refund Issued | **Cancelled** | Immediate Free | Pro features locked |

## 10. Upgrade Flow
`Free` → UI Prompts Upgrade → Checkout → Payment → **Verified Webhook** → DB Active → Pro UI Unlocked.
While pending, the UI displays a processing/loading state polling the backend or listening for a websocket event for confirmation. It never assumes success prematurely.

## 11. Downgrade Flow
`Pro` → `Cancel request` → `Remains Active until Period End` → `Free`.
When reverting to Free:
- Existing premium journal data/trades are perfectly preserved.
- Old AI Coach history may become read-only.
- New Pro scans hit a 403 Forbidden.
- Storage limits may reject new uploads if over quota.
*(Behavior of premium reports post-downgrade: **OPEN BUSINESS DECISION**).*

## 12. Cancellation Flow
User securely clicks "Cancel Subscription" inside App Settings → Backend signals Provider → Provider confirms `cancel_at_period_end = true` → Webhook updates DB.
- Must be reversible before the period ends.
- Uses no dark patterns (e.g., hiding the cancel button behind an email request).

## 13. Renewal Flow
`Active Pro` → `Provider background charge` → `Success` → `invoice.payment_succeeded Webhook` → DB updates `current_period_end` → Pro continues seamlessly.

## 14. Failed Payment Flow
Payment failure triggers an `invoice.payment_failed` provider webhook.
- State shifts to `past_due`.
- A grace period activates.
- UI displays a prominent banner linking to the billing portal.
- If provider dunning retries fail entirely, the sub expires and falls back to Free entitlements.
*(Exact provider dunning/retry schedules: **OPEN BUSINESS DECISION**).*

## 15. Grace Period
A grace period ensures short-term bank errors don't abruptly break the user's trading workflow.
Pro access continues, but warning banners instruct the user to update payment methods. Upon expiration, access reverts to Free.
*(Exact Grace Duration: **OPEN BUSINESS DECISION**).*

## 16. Refunds
- **Accidental / Duplicate:** Generates a `charge.refunded` webhook. Tradelense immediately revokes the entitlement corresponding to the refunded time block.
- **Chargeback / Provider Dispute:** Automatically freezes the subscription pending investigation.
*(Final Refund Policy: **OPEN BUSINESS DECISION**).*

## 17. Billing Provider Architecture
While Stripe is the conceptual V1 direction (`customer`, `subscription`, `price`, `checkout.session`, `webhook`), Tradelense connects to this concept via an interface layer. Engineering will perform absolute configuration post-approval.

## 18. Webhook Architecture
`Billing Provider` → `POST /api/webhooks/billing` → `Verify cryptographic signature` → `Verify Event format` → `Check DB idempotency token` → `Process Event (Update subscriptions table)` → `Return 200 OK`.
Crucial: This process runs exclusively server-side.

## 19. Webhook Security
- HTTPS required.
- Signatures derived from `WEBHOOK_SECRET` mapped to event payload exactly.
- Timestamp validation rejects payloads older than 5 minutes to prevent replay attacks.
- Only known, verified internal IP blocks/provider blocks allowed where possible.

## 20. Webhook Idempotency
Stripe guarantees "at least once" delivery, meaning duplicate hooks occur.
Each hook arrives with an `event_id`. The backend stores this in a `webhook_events` log. If `event_id` already exists, the backend safely returns `200 OK` without duplicating database updates.

## 21. Subscription Synchronization
The Provider is the unquestionable Source of Billing Truth.
Tradelense Database is a synchronized Read-Replica of Entitlement Truth. 
If divergence occurs, Tradelense relies on Webhooks and eventual Reconciliation scripts to pull the correct state from the Provider.

## 22. Entitlement Resolution
`GET /api/ai/coach` → Backend identifies User → Queries `subscriptions` → Resolves `Free` vs `Pro`.
If `Free`, checks AI usage log. If `Pro`, applies higher limits. Resolves access boolean dynamically per request.

## 23. Server-Side Enforcement (Mandatory)
The backend intercepts every protected request to verify Auth, Subscription State, and Quotas. Client-side checks are purely cosmetic UX additions.

## 24. AI Quota Billing Relationship
Every AI API request logs a row in `ai_usage_events`.
Before a new AI request hits Gemini, the backend sums the current month's usage.
- If User = Free & Usage > Free Quota: HTTP 403.
- If User = Pro & Usage > Pro Quota: HTTP 403.
The client cannot spoof this event check.

## 25. Usage Periods
Usage resets perfectly align with the `current_period_start` and `current_period_end` fields fetched from the most recent billing Provider webhook.
*(Exact quota numerical values: **OPEN BUSINESS DECISION**).*

## 26. Billing Database Model
Reference `06_DATABASE_ARCHITECTURE.md`.
Key conceptual tables: `subscriptions`, `ai_usage_events`, `webhook_events` (for idempotency). Detailed column definitions remain within Document 06.

## 27. Billing Event Model
Tracked Webhook Events:
- `checkout.session.completed` (First subscribe)
- `customer.subscription.updated` (Renewals / plan changes)
- `customer.subscription.deleted` (Expiration)
- `invoice.payment_failed` (Dunning)
- `charge.refunded` (Reversals)

## 28. Billing Auditability
The `audit_events` or `webhook_events` table logs JSON payloads of all incoming subscription state changes. It guarantees a forensic trail if a user claims they paid but received no service. (Raw credit card numbers never touch Tradelense systems).

## 29. Billing UI
UI explicitly maps server states:
- Active: Shows renewal date.
- Cancelling: Shows "Access ends on X".
- Past Due: Shows red banner with "Update Payment Method".
UI state derives strictly from `GET /api/user/subscription` payload.

## 30. Billing Settings
Within the app settings menu, users view their current plan tier, renewal date, and upgrade/downgrade controls. Tradelense relies on the Billing Provider UI to handle actual credit card insertions.

## 31. Customer Portal
*(Usage of a provider-hosted Customer Portal vs custom UI wrapper: **OPEN BUSINESS DECISION**).*

## 32. Taxes and Regional Billing
Conceptually designed to allow the Billing Provider to automatically manage Tax IDs, VAT, and localized invoices in the future.
*(Legal/Tax final requirements: **OPEN LEGAL/BUSINESS DECISION**).*

## 33. Pricing Currency
*(Primary Launch Currency vs localized display handling: **OPEN BUSINESS DECISION**).*

## 34. Free-to-Pro Upgrade Triggers
Honest, non-manipulative contextual prompts appear when the user:
- Reaches the Free AI scan limit.
- Attempts to render advanced behavioral charts.
- Submits specific AI Coach queries flagged as premium depth.

## 35. Downgrade Data Handling
Upon downgrading to Free, the user's historical raw trades remain sacrosanct. Premium analytical views may become locked, but raw ownership persists.
*(Explicit storage over-limit or report-locking rules: **OPEN BUSINESS DECISION**).*

## 36. Account Cancellation vs Subscription Cancellation
**Cancellation:** Adjusts billing status (`cancel_at_period_end`). Data stays intact.
**Account Deletion:** GDPR/CCPA hard-delete of `auth.users` and all cascading trades. The two operations are disjoint.

## 37. Billing Failure Modes

| Failure | Impact | Detection | Response |
| :--- | :--- | :--- | :--- |
| **Webhook Outage** | State stale | Provider logs 5xx | Provider retries via built-in retry logic |
| **Invalid Signature**| Hacker mock | Backend throws 401 | Ignore / Log attack IP |
| **Stale State** | Free user has Pro | User complains / Reconcile mismatch | Nightly sync script fetches real provider state |
| **Card Declined** | Past Due shift | webhook `payment_failed` | Shift DB state; notify user |

## 38. Billing Reconciliation
A conceptual scheduled worker routine (e.g., daily) that compares the Tradelense DB `subscriptions` list against the Provider's active list to correct drifting states caused by dropped webhooks.
*(Exact frequency: **OPEN TECHNICAL DECISION**).*

## 39. Billing Security Risks
- **Client Manipulation:** Hackers modify JS to say `plan: "PRO"`. Mitigated by server-side verification intercepting actual API calls.
- **Webhook Replay:** Hackers re-send a successful payment webhook. Mitigated by `event_id` idempotency checks in DB.

## 40. Billing Reliability and Recovery
If Tradelense completely drops the database record of a subscription, the architecture dictates that a manual/support-triggered Sync command can pull the user's `customer_id` from the Auth profile and rebuild the subscription state flawlessly from the Provider API. Billing failures NEVER write corrupted data to trades.

## 41. Future Billing Models [FUTURE]
- Annual discounted plans.
- High-frequency trader AI credit packs.
- B2B Team/Prop Firm plans.
These are out of scope for V1.

## 42. Billing Architecture Decision Records
- **ADR-BILL-001 (Server Authority):** Subscription state logic rests strictly on the server.
- **ADR-BILL-002 (Webhooks):** Verifiable webhooks are the sole trigger for syncing plan changes.
- **ADR-BILL-003 (Idempotency):** Database guards against webhook duplication.
- **ADR-BILL-004 (Server Entitlements):** Protected endpoints re-check entitlements on every request.
- **ADR-BILL-005 (Independent Lifecycles):** Subscription cancellation != Account Deletion.
- **ADR-BILL-006 (Isolation):** Billing failure cannot corrupt core journaling mechanics.
- **ADR-BILL-007 (Provider Agnostic internally):** Stripe handles PCI/Cards, Tradelense merely tracks state.
- **ADR-BILL-008 (Freemium Value):** Free tier remains natively useful, not a crippled demo.

## 43. Open Billing Decisions
*Must be resolved before Provider configuration:*
- Exact payment provider selection (**OPEN BUSINESS DECISION**).
- Exact monthly and annual USD prices (**OPEN BUSINESS DECISION**).
- Trial duration/availability (**OPEN BUSINESS DECISION**).
- Free AI quota numerical limits (**OPEN BUSINESS DECISION**).
- Pro AI quota limits (**OPEN BUSINESS DECISION**).
- Primary billing currency / Tax handling (**OPEN LEGAL/BUSINESS DECISION**).
- Formal refund terms URL (**OPEN LEGAL/BUSINESS DECISION**).
- Exact Grace Period timelines (**OPEN BUSINESS DECISION**).
- Frequency of fallback background reconciliation (**OPEN TECHNICAL DECISION**).

## 44. Billing Acceptance Criteria
- [x] Defined Free and Pro plan value mechanics.
- [x] Unresolved quantitative elements labeled Open Decisions.
- [x] Fully delineated secure, verified webhook flow.
- [x] Enforced server-side entitlement checks.
- [x] Idempotency, recovery, and reconciliation defined.
- [x] Explicitly segregates Account Deletion from Sub Cancellation.
- [x] Protects canonical trade databases from billing errors.
- [x] Aligned intimately with Documents 01 through 08.

## 45. Document Governance
- **Owner:** Product Owner / Billing Architecture authority.
- Engineering will construct the Stripe (or alternative provider) SDK integrations strictly aligned with this architecture.
- Real products, prices, and webhooks will only be provisioned in the Provider Dashboard after these open decisions are finalized by business stakeholders.
