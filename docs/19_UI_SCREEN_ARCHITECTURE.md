# UI-02: SCREEN ARCHITECTURE
> Tradelense V2 Product Screen Inventory

This document defines the complete product screen inventory for Tradelense V2, categorized by user journey phase and prioritized by implementation dependency.

## Screen Prioritization Classifications
- **P0**: Essential launch screen. Application cannot function without this.
- **P1**: Important launch screen. Provides significant value but core flow works without it.
- **P2**: Post-launch enhancement. Iterative or advanced feature.

---

## 1. PUBLIC
Public-facing pages for unauthenticated users.

- **Landing** (P0): Main value proposition, features tease, and waitlist/signup CTA.
- **Features** (P1): Deep dive into the tool functionality.
- **How It Works** (P2): Walkthrough of the user journey.
- **Pricing** (P1): Subscription tier breakdown.
- **Login** (P0): Core authentication entry.
- **Signup** (P0): Registration.
- **Forgot Password** (P0): Credential recovery initiated.
- **Reset Password** (P0): Credential recovery finalized via link.
- **Email Verification** (P0): Mandatory step to secure accounts.

## 2. ONBOARDING
First-run experience to configure the trader's profile.

- **Welcome** (P1): Introductory greeting and app philosophy.
- **Trading Preferences** (P1): Preferred asset classes (Forex, Crypto, Equities).
- **Timezone** (P1): Crucial for session stats.
- **Initial Setup** (P1): Connecting broker or establishing starting balance.
- **First Trade** (P1): Guided upload/manual entry of the first journal entry.
- **Completion** (P1): Transition to dashboard.

## 3. APPLICATION
Core user-authenticated data interfaces.

- **Dashboard** (P0): High-level top-down view of equity curve, recent performance, and AI alerts.
- **Journal** (P0): Data table/grid of all executed trades.
- **Trade Detail** (P0): Focused modal or page detailing exact parameters of a single trade (Entry, Exit, R:R, Tags).
- **New Trade** (P0): Manual entry form.
- **Edit Trade** (P0): Record modification form.

## 4. AI & UPLOAD OPERATIONS
The AI-assisted ingestion pipeline.

- **Trade Scan** (P0): Entry point for uploading trade logs/screenshots.
- **Image Upload** (P0): Dropzone for visual data.
- **AI Processing** (P0): Loading state analyzing the image.
- **AI Extraction Result** (P0): Form displaying parsed data.
- **AI Review** (P0): User interaction correcting or validating parsed data.
- **AI Correction** (P0): Auditable trail of what the user changed vs AI.
- **AI Failure** (P0): Fallback to manual entry.
- **AI Confirmation** (P0): Final commit to database.

## 5. ANALYTICS
Deep statistical analysis of historical performance.

- **Analytics Overview** (P1): Consolidated metrics.
- **P&L** (P1): Isolated profit and loss charting over time.
- **Risk/Reward** (P1): Expectancy and ratio breakdowns.
- **Drawdown** (P1): Peak-to-trough analysis.
- **Streaks** (P1): Consecutive wins/losses.
- **Sessions** (P2): Performance by Time of Day (London/NY/Asian).
- **Symbols** (P2): Performance by asset.
- **Setups** (P2): Performance by custom user setups (e.g. Breakout, Reversion).
- **Long vs Short** (P2): Directional bias analysis.
- **Time Analysis** (P2): Hold time vs profitability.

## 6. BEHAVIORAL INTELLIGENCE
Psychological and emotional tracking.

- **Behavioral Overview** (P1): Base psychology dashboard.
- **Emotional Patterns** (P2): Heatmaps of emotional states post-trade.
- **Execution Patterns** (P2): Early closes, missed entries.
- **Risk Behaviors** (P2): Moving stops, over-leveraging indicators.
- **Rule Adherence** (P2): Compliance index based on user's written rules.
- **Behavioral Correlations** (P2): "Win rate drops 15% when tagged 'Tired'".
- **AI Behavioral Interpretation** (P2): AI summary of cyclical emotional errors.

## 7. AI COACH
Conversational interface for trading guidance based on user data.

- **Coach Home** (P2): Entry point highlighting recent lessons.
- **Coach Conversation** (P2): Chat UI for specific trade analysis.
- **Coach Context** (P2): Sidebar showing what data the AI is using for advice.
- **Coach History** (P2): Archive of past insights.
- **Coach Usage** (P2): Token/quota tracking.

## 8. COMMERCIAL
Subscription, Upgrades, and Billing.

- **Upgrade** (P1): Upgrade prompt/landing inside app.
- **Plan Comparison** (P1): Detailed feature grid.
- **Subscription** (P1): Current status and limits.
- **Billing** (P1): Invoices and payment methods.
- **Payment Status** (P1): Flow result screens (Success, Failure).
- **Cancellation** (P1): Churn mitigation and off-boarding.
- **Downgrade** (P1): Return to free tier limits.

## 9. SETTINGS
Application and user preferences.

- **Profile** (P0): Name, Email, Avatar.
- **Trading Preferences** (P0): Default risk %, Base Currency.
- **Journal Preferences** (P1): Custom tags, default views.
- **Appearance** (P1): Theme overrides (if applicable, though dark-mode is default).
- **Account** (P0): Password changes, 2FA.
- **Data Export** (P1): CSV/PDF generation.
- **Delete Account** (P0): Essential GDPR compliance.

---

## User Journeys

**Journey A: Activation**
Landing → Signup → Email Verification → Onboarding → Dashboard

**Journey B: Manual Trade Cycle**
Dashboard → New Trade form → Review Parameters → Save → Journal List → Trade Detail Overlay

**Journey C: AI-Assisted Ingestion**
Journal → Trade Scan Dropzone → Image Upload → AI Processing UI → Extraction Form → Human Review & Edits → Confirm → Trade Detail

**Journey D: Insights Discovery**
Journal → Analytics Page → Behavioral Intelligence Dashboard → AI Coach Context Chat

**Journey E: Monetization Flow (Free to Paid)**
Free User interacting with locked feature → Usage limit modal → Upgrade prompt → Pricing table → Checkout → Pro Success Dashboard

**Journey F: Subscription Management**
Pro User → Settings → Subscription → Billing → Cancel / Manage Plan

---

## Responsive Architecture Guidelines

- **Desktop (1024px+)**: Sidebar navigation (260px fixed width). Multi-column bento layouts for dashboards. Complex data grids in Journal. Modals used for Trade Details.
- **Tablet (768px - 1023px)**: Sidebar navigation standard or collapsed. 2-column bento grids. Tables remain, but less important columns hidden.
- **Mobile (< 768px)**: Hidden sidebar, activated via hamburger to overlay drawer. Standard Bottom Navigation for primary routes (Dashboard, Journal, AI). Data grids become stacked vertical cards. Complex charts simplified to sparklines. Full-screen views for Trade Detail instead of Modals.

---

## Stitch Framework & Component Governance

Stitch is authorized to explore and mock these screens visually. However, its output **must** be normalized to use the `doc/18_UI_MASTER_DESIGN_SYSTEM.md` styling parameters.

**Workflow Constraints:**
1. Do not accept random padding values; snap to tailwind 4px framework (`p-4`, `p-6`, `p-8`).
2. Do not accept arbitrary hex colors; convert them back to `brand-cyan`, `brand-purple`, `surface`, etc.
3. Every component (Button, Input, Card) must fall back to the normalized React component to prevent UI fragmentation. 
4. AI-generated screens must include explicit fallback states (Empty, Loading, Error).
