# Feature Specification: Tradelense

## 1. Document Purpose and Scope
This document provides the detailed, implementation-ready feature specification for the Tradelense commercial SaaS. While the Product Requirements Document (`01_PRODUCT_REQUIREMENTS.md`) defines *what* Tradelense is and the overarching product vision, this document breaks down *how* each feature functions. It explicitly outlines user actions, system behaviors, inputs, outputs, state management, edge cases, permissions, plan restrictions, and acceptance criteria.

## 2. Feature Priority System
- **P0**: Required for commercial launch (core viable product).
- **P1**: Important/high-value feature (planned for commercial V1 or immediate fast-follow).
- **P2**: Future enhancement.

## 3. Product Feature Map

| Feature | Priority | User Type | Plan | Dependencies | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Sign Up & Sign In | P0 | Anonymous | N/A | Supabase Auth | Pending |
| Session Management | P0 | Authenticated | All | Supabase Auth | Pending |
| Account Recovery | P0 | Anonymous | N/A | Supabase Auth | Pending |
| Manual Trade Creation | P0 | Authenticated | All | Supabase DB | Pending |
| Trade List & Detail | P0 | Authenticated | All | Supabase DB | Pending |
| Trade Edit & Delete | P0 | Authenticated | All | Supabase DB | Pending |
| AI Trade Scan (Extraction) | P0 | Authenticated | All (Quotas apply) | Gemini Vision API, Supabase Storage | Pending |
| Dashboard Overview | P0 | Authenticated | All | Supabase DB | Pending |
| Baseline Analytics | P0 | Authenticated | All | Supabase DB | Pending |
| Advanced Analytics | P1 | Authenticated | Pro | Supabase DB | Pending |
| Behavioral Intelligence | P1 | Authenticated | Pro | Supabase DB | Pending |
| AI Coach Q&A | P1 | Authenticated | All (Quotas apply) | Gemini Language API, Supabase DB | Pending |
| Export to CSV | P1 | Authenticated | All | Supabase DB | Pending |
| Stripe Billing Integration | P0 | Authenticated | Pro | Payment Provider (Stripe) | Pending |

## 4. AUTHENTICATION AND ACCOUNT

### 4.1 Sign Up
- **User action:** User enters email and password, or clicks OAuth provider.
- **System behavior:** Creates user account in Supabase Auth, triggers email verification if required, initializes user record in public `users` table.
- **Success state:** User is redirected to onboarding/dashboard; welcome email sent.
- **Failure state:** Shows inline error (e.g., "Email already in use", "Weak password").
- **Security requirements:** Passwords must meet minimum complexity. Rate limiting on sign-up endpoint.

### 4.2 Sign In
- **User action:** User enters credentials or uses OAuth.
- **System behavior:** Validates credentials against Supabase.
- **Success state:** Generates session token, redirects to Dashboard.
- **Failure state:** "Invalid credentials" error. Account lockout after consecutive failures.
- **Security requirements:** Generic failure messaging to prevent email enumeration.

### 4.3 Sign Out
- **User action:** User clicks "Sign Out".
- **System behavior:** Invalidates the current session token locally and centrally (Supabase).
- **Success state:** Redirects to public landing page or login screen.

### 4.4 Session Handling
- **System behavior:** Maintains JWT tokens securely. Automatically refreshes tokens via Supabase client.
- **Failure state:** If refresh fails or token expires, forces sign out and redirects to login with "Session expired" message.

### 4.5 Password/Account Recovery
- **User action:** User requests reset email.
- **System behavior:** Generates specific reset link via Supabase, emails the user.
- **Success state:** User clicks link, enters new password, login is authorized.

### 4.6 Profile
- **User action:** Accesses Profile section to view/update display name, avatar, and core info.
- **System behavior:** Updates matching rows in `users` table.

### 4.7 Account Settings
- **User action:** Toggles UI theme, default currency, etc.
- **System behavior:** Saves preferences locally or in user settings table.

### 4.8 Timezone
- **System behavior:** Auto-detects on first load or allows manual override. All trades must be stored in UTC but displayed in user's selected timezone.

### 4.9 Account Deletion
- **User action:** User requests firm deletion of account.
- **System behavior:** Hard deletes user data from DB and Storage. Removes Auth record. (May take up to 30 days legally, but happens instantly in UI).
- **Security requirements:** Requires password confirmation or re-authentication to execute.

### 4.10 Data Deletion/Export
- **System behavior:** Provides immediate JSON or CSV export of all user activity and PII.

## 5. TRADE JOURNAL

### 5.1 Manual Trade Creation
- **User action:** Clicks "Add Trade", fills manual form.
- **System behavior:** Validates numeric fields, dates, and enums. Inserts into `trades` table.
- **Inputs:** Instrument/pair, Direction (Long/Short), Entry Price, Exit Price, Stop Loss (optional), Take Profit (optional), Position Size, Fees, Date/Time.
- **Outputs:** Created Trade record.
- **Success state:** Row appended to trade list, dashboard metrics recalculate on next fetch.
- **Failure state:** Validation errors displayed on respective fields.

### Canonical Trade Fields (Schema considerations):
*Missing fields remain `null`. Never substitute guessed defaults.*
- `id` (UUID)
- `user_id` (UUID)
- `instrument` (String)
- `direction` (Enum: LONG, SHORT)
- `entry_price` (Numeric)
- `exit_price` (Numeric)
- `stop_loss` (Numeric, nullable)
- `take_profit` (Numeric, nullable)
- `position_size` (Numeric)
- `pnl` (Numeric)
- `fees` (Numeric, default 0)
- `entry_time` (Timestamptz)
- `exit_time` (Timestamptz)
- `outcome` (Enum: WIN, LOSS, BREAKEVEN) - *Derived or explicit*
- `risk_reward_ratio` (Numeric, nullable) - *Derived*
- `setup_type` (String/Tags, nullable)
- `screenshot_url` (String, nullable)
- `notes` (Text, nullable)
- `emotional_state` (Enum/String, nullable)
- `execution_mistakes` (Array of Strings, nullable)

### 5.2 Trade List
- **User action:** Navigates to Journal tab.
- **System behavior:** Fetches paginated/infinite-scroll list of trades sorted by execution date descending.

### 5.3 Trade Detail
- **User action:** Clicks a specific trade row.
- **System behavior:** Opens dedicated view or modal showing complete trade data, screenshot thumbnail (enlargeable), and notes.

### 5.4 Trade Editing
- **User action:** Modifies fields on an existing trade.
- **System behavior:** Validates and updates the DB record.

### 5.5 Trade Deletion
- **User action:** Clicks delete, confirms action.
- **System behavior:** Soft or hard deletes trade and removes associated storage objects (screenshots) async.

### 5.6 - 5.8 Search, Filters, and Sorting
- **User action:** Selects filters (e.g., date range, instrument, wins only).
- **System behavior:** Adjusts Supabase query parameters.

### 5.12 - 5.14 UI States
- **Empty state:** "You haven't logged any trades yet. [Add Manual Trade] or [Upload Screenshot]"
- **Loading state:** Skeleton loaders matching the table/card layout.
- **Error state:** "Unable to load trades. Please check your connection."

## 6. AI TRADE SCAN (P0)

### Conceptual Pipeline
*Screenshot → Validation → Compression → Gemini → Structured extraction → Schema validation → Business validation → Review → User correction → Confirmation → Persistence*

### 6.1 Screenshot Upload
- **User action:** Drag-and-drops or selects image file.
- **System behavior:** Pre-validates file.

### 6.2 - 6.3 File Validation & Compression
- **System behavior:** Ensures format is PNG/JPG/WebP and under max size limit (e.g., 5MB). Compresses image client-side if necessary.

### 6.4 Gemini Vision Request
- **System behavior:** Backend securely sends image and strict JSON schema prompt to Gemini API.

### 6.5 - 6.6 Structured Extraction & Schema Validation
- **System behavior:** Receives JSON response.
- **CRITICAL:** Application parses the JSON and strictly validates it against the expected schema via Zod/Joi. No fabricated OCR values allowed. Invalid schemas trigger extraction failure.

### 6.7 Confidence/Uncertainty Handling
- **System behavior:** If Gemini marks a field as highly uncertain, or if it contradicts basic math (e.g., Long entry 10, exit 20, but claims loss), the field is left blank/null for the user to fill. No fake confidence UI is shown.

### 6.8 - 6.11 Review, Correction, Confirmation, Save
- **User action:** Views populated form side-by-side with the uploaded screenshot. Corrects any missing/wrong fields. Clicks "Save Trade".
- **System behavior:** Submits final form payload exactly as a manual trade (Section 5.1).

### 6.12 - 6.19 Edge Cases & Failures
- **AI Failure / Unreadable Image:** Show error: "We couldn't extract trade data from this image." Fallback to manual entry with image attached.
- **API Timeout / Gemini Unavailable:** Show error: "AI service is currently busy. Please try again or enter manually."
- **Missing/Ambiguous fields:** Fields are left strictly blank in the review UI.
- **CRITICAL RULES:** Never automatically save extracted data without explicit user confirmation.

## 7. DASHBOARD

### 7.1 Overview & Core Metrics
- **System behavior:** Triggers server-side/edge deterministic calculations on user's trade data for the current period (usually month or all-time).
- **Calculations:** 
  - Net PNL: Sum of (PNL - Fees)
  - Win Rate: (Wins / Total Trades) * 100
  - Average RR, Expectancy, Total Executions, Average Duration.
- **CRITICAL:** Metrics must strictly use deterministic math application code. LLMs must NOT calculate these.

### 7.11 PNL/Equity Curve
- **System behavior:** Renders a time-series line chart of cumulative PNL over time.

### 7.14 Insufficient-Data States
- **System behavior:** If < X trades exist, visualizations must display a clear "Not enough data" overlay rather than wildly skewed 1-trade charts.

## 8. ANALYTICS

### Session, Instrument, Setup, Dimension Analytics
- **System behavior:** Aggregates PNL and Win Rate grouped by time of day, day of week, instrument, and user-defined tags.
- **Minimum data:** Charts require a statistical minimum (e.g., 10 total trades) to display meaningful averages.
- **Presentation:** Bar charts, heatmaps, and summary tables.

## 9. BEHAVIORAL INTELLIGENCE

### 9.1 Behavioral Data Collection
- **User action:** Tags trades with emotional context (e.g., "FOMO", "Revenge Trading") or system detects it (e.g., 3 consecutive losses followed by a 4x size trade = Revenge Trading indicator).

### 9.9 Revenge Trading & Repeated Mistakes
- **System behavior:** Deterministically searches journal for defined failure patterns (e.g., widened stop losses, overleveraging after losses).
- **Presentation:** "You have widened your stop loss 4 times this month, costing $X total." (Deterministic evidence).
- **CRITICAL:** Must be grounded in facts. Never state "You traded out of anger" unless user explicitly tagged it or size metrics strongly imply deviation from plan.

## 10. AI COACH

### 10.1 Coach Home & Questions
- **User action:** Types a question like "Why am I failing to pass my prop challenge?"
- **System behavior:** System fetches user's aggregate metrics and recent trade data, injects them into a system prompt, and calls Gemini.
- **Outputs:** Conversational response citing specific user data (e.g., "Your win rate on NAS100 is strong (55%), but your average loss on Fridays is dragging down your PNL...").

### 10.11 AI Limitations & Error States 
- **CRITICAL:** AI Coach must not hallucinate trades. If it doesn't know, it must say "I don't have enough data on your account to determine this."
- **Failure state:** "Coach is currently offline."

## 11. SETTINGS
- **Profile:** Avatar, Name.
- **Timezone:** Dropdown of standard IANA timezones.
- **Export Preferences:** Date formats, etc.
- **Subscription Status:** Current plan, billing cycle end date, button to manage via Stripe Customer Portal.

## 12. EXPORT
- **User action:** Clicks "Export Data -> CSV".
- **System behavior:** Generates CSV from all `trades` associated with `user.id`.
- **Pro Behavior:** Export includes advanced behavioral tags and notes.

## 13. SUBSCRIPTIONS AND ENTITLEMENTS

### Free vs Pro Feature Matrix
*Entitlement checks must happen server-side via middleware or Supabase RLS policies.*

| Feature | Free Plan | Pro Plan |
| :--- | :--- | :--- |
| Core Trade Journal | Unlimited | Unlimited |
| Dashboard & Basic Analytics | Yes | Yes |
| AI Trade Scans | Quota (e.g., 10 / mo) | Higher Quota / Unlimited |
| AI Coach | Quota (e.g., 5 queries / mo) | Higher Quota / Unlimited |
| Behavioral Intelligence | No | Yes |
| Advanced Equity Reports | No | Yes |
| Export | Basic CSV | Full CSV / JSON / PDF |

## 14. BILLING

### Stripe Integration Workflow
- **Upgrade:** User clicks "Upgrade", system creates Stripe Checkout Session, redirects user.
- **Successful Payment:** Stripe redirects to success page. Stripe Webhook hits Tradelense API -> updates `subscriptions` table -> user is now Pro.
- **Expiration/Failed Payment:** Webhook updates status to `past_due` or `canceled`. User degrades to Free automatically by server authorization layer.
- **Edge cases:** Duplicate webhooks ignored via idempotency check.

## 15. NOTIFICATIONS AND SYSTEM FEEDBACK
- **Success:** Non-blocking toast notifications (e.g., "Trade saved successfully").
- **Error:** High-visibility toast or inline text (e.g., "Failed to save trade. Check connection.").
- **Processing:** Obvious visual loading states (spinners/skeletons) when AI is scanning. No silent hanging.

## 16. PERMISSION MODEL
- **Anonymous:** Can only access landing page, login, signup, reset password.
- **Authenticated Free:** RLS limits read/write/update/delete to own `user_id`. Cannot access restricted API endpoints (like advanced analytics generation).
- **Authenticated Pro:** Same RLS limits. Token contains `plan=pro` or DB lookup grants access to Pro features.

## 17. ERROR AND EDGE CASE MATRIX

| Condition | User-facing behavior | Data behavior | Recovery action |
| :--- | :--- | :--- | :--- |
| Network failure on save | "Connection lost. Please try again." | None (Not saved) | User clicks save again |
| Expired session | Redirects to login | Local cache cleared | User signs back in |
| Gemini API Failure | "AI extraction failed." | None | User falls back to manual entry |
| Screenshot unreadable | "Unable to find trade data in image." | None | User falls back to manual entry |
| Subscription mismatch | "This feature requires Pro." | Read-only behavior | Refresh subscription status via DB check |
| Export failure | "Failed to generate CSV." | None | Retry request |

## 18. DATA INTEGRITY RULES
- **No fabricated values:** Missing data is null. AI must not invent missing data.
- **User confirmation:** AI-derived data goes to a staging form, never straight to DB.
- **Canonical trade data:** The DB `trades` table is the sole source of truth. Analytics compute over it.
- **Validation:** Frontend and API boundary must validate types (numeric values must be real numbers, dates must be valid ISO8601).

## 19. ACCESSIBILITY AND RESPONSIVE BEHAVIOR
- Layout must flexibly reflow for mobile devices (hiding heavy data tables behind scroll or cards).
- Text must meet standard dark-mode contrast ratios against deep backgrounds.
- Forms must support standard keyboard navigation (Tab, Enter to submit).
- Follows existing premium dark fintech UI/UX identity.

## 20. FEATURE ACCEPTANCE CRITERIA

### Manual Trade Creation [P0]
- **Given** I am an authenticated user on the Dashboard, **when** I click "Add Trade" and submit valid data, **then** the trade is visible in my journal.
- **Given** I submit a form missing the entry price, **when** I click submit, **then** the system prevents submission and highlights the missing field.

### AI Trade Scan [P0]
- **Given** I upload a screenshot of my MT4 execution, **when** the Gemini extraction completes, **then** I am presented with a pre-filled review form, and the trade is NOT yet saved.
- **Given** the image contains no trade data, **when** the Gemini API returns, **then** the system shows an extraction error and provides a blank manual entry form.

### Dashboard Analytics [P0]
- **Given** I have exactly 10 winning trades and 10 losing trades, **when** I view the Dashboard overview, **then** my Win Rate is deterministically displayed as exactly 50%.

## 21. FEATURE DEPENDENCY MAP
- **Authentication** → Establishes User ID → **Journal** → Feeds **Dashboard & Analytics**
- **Journal** + **Analytics** → Feeds **Behavioral Intelligence**
- **Journal** + **Analytics** + **Behavior** → Forms context for **AI Coach**
- **Authentication** → Validates User in **Stripe Billing** → Updates **Subscription** → Unlocks **Pro Entitlements**.

## 22. OPEN PRODUCT DECISIONS
*The following items are intentionally deferred for later scoping phases:*
- Exact monthly/annual pricing for Pro.
- Explicit hard-limits (number of AI scans) for Free vs Pro.
- Choice of initial OAuth providers (e.g., Google vs specific brokerage logins).
- Future direct broker API integrations.
- Development of native iOS/Android applications.

## 23. DOCUMENT GOVERNANCE
This document (`docs/02_FEATURE_SPECIFICATION.md`) is the detailed feature-level source of truth. It adheres strictly to the rules and boundaries established in `docs/01_PRODUCT_REQUIREMENTS.md`. Any divergence between the two favors the Product Requirements Document.

**Next Document:** `docs/03_USER_FLOWS.md`
