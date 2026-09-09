# Product Requirements Document: Tradelense

## 1. Executive Summary
Tradelense is a commercial AI-powered web SaaS designed to be a trader's "AI Trading Journal OS". It combines a traditional trading journal with behavioral analytics and Gemini-powered AI extraction to help traders effortlessly log their trades, analyze their performance deterministically, and receive personalized coaching based on their actual trading history. 

## 2. Product Vision
To be the definitive AI Trading Journal OS that seamlessly bridges the gap between trade execution and performance analytics. Tradelense aims to eliminate the friction of manual journaling while providing deep, data-driven behavioral insights and coaching to help traders improve their consistency and profitability.

## 3. Problem Statement
Traders struggle to maintain accurate and consistent trading journals due to the tedious nature of manual data entry. Existing solutions are either overly complex, require manual input that is prone to human error, or lack the intelligence to provide actionable behavioral insights. Traders need a frictionless way to capture their trades and a system that can objectively analyze their performance and psychology.

## 4. Target Users
### Primary Persona
- **The System-Driven Retail Trader:** Active retail traders who follow specific strategies, understand the importance of journaling, but struggle with consistency. They want data-driven insights to improve their edge.

### Secondary Personas
- **The Prop Firm Challenger:** Traders taking proprietary trading firm evaluations who need strict risk management and performance tracking to pass the challenge.
- **The Part-Time Trader:** Discretionary traders who need a fast, efficient way to review their trades after hours without spending hours on data entry.

### Non-Target Users
- Institutional algorithmic traders.
- Individuals looking for automated trading bots or signals.
- Users who want to copy-trade others.
- Investors primarily focused on long-term portfolio management (buy-and-hold).

## 5. Jobs To Be Done
- **When I** finish a trading session, **I want to** quickly capture my trades by taking screenshots, **so I can** maintain a reliable journal without tedious manual entry.
- **When I** review my trading month, **I want to** see accurate, deterministically calculated performance metrics, **so I can** understand my true profitability and win rate.
- **When I** make repetitive mistakes, **I want to** identify recurring behavioral patterns, **so I can** correct them and improve my psychology.
- **When I** feel stuck in a drawdown, **I want** personalized coaching based on my actual journal history, **so I can** receive objective advice on how to improve.

## 6. Value Proposition
Tradelense is your AI Trading Journal OS that eliminates data entry friction using intelligent screenshot extraction, providing deterministic performance analytics and actionable AI coaching to uncover behavioral edge.

## 7. Commercial V1 Product Scope
The commercial V1 release will include the following core capabilities:
- Trade Journal
- AI Trade Scan (Screenshot-to-trade extraction)
- Dashboard
- Performance Analytics
- Behavioral Intelligence
- AI Coach
- User Accounts
- Free / Pro Plans
- Subscription Billing
- Security and Privacy
- Data Export

## 8. Core User Workflows
### New User Onboarding
1. User signs up via email/password or OAuth.
2. User is presented with a brief onboarding flow to select their primary asset classes and experience level.
3. User lands on the main Dashboard.

### Manual Trade Entry
1. User clicks "Add Trade".
2. User selects "Manual Entry".
3. User inputs trade details (instrument, entry/exit price, size, date/time, PNL, tags, notes).
4. System validates numerical data and saves the trade to the database.

### Screenshot-to-Trade
1. User clicks "Add Trade".
2. User uploads or pastes a screenshot of their broker execution or chart.
3. System uses Gemini AI to analyze the image and extract trade data based on a predefined schema.
4. System presents the extracted data to the user for review.

### AI Extraction Review
1. User reviews the structured data extracted by the AI.
2. User corrects any inaccurate values or fills in missing information.
3. User confirms the data.
4. System validates the data and persists it to the database.

### AI Extraction Failure
1. System fails to extract data or returns an error from the AI model.
2. System displays a clear error message explaining the failure.
3. System gracefully falls back to the manual trade entry form with the image attached.
4. *Critical:* The system must never silently save a failed or incomplete extraction as a trade.

### Trade Editing
1. User selects a trade from the journal or dashboard.
2. User modifies the trade details.
3. System validates and updates the record in the database.

### Journal Review
1. User navigates to the Journal view.
2. User filters, sorts, and paginates through historical trades.
3. User clicks on a trade to view the detailed record, including screenshots, notes, and AI insights.

### Analytics Review
1. User navigates to the Analytics view.
2. User views deterministic performance metrics (PNL, Win Rate, Risk/Reward, etc.) over selected timeframes.

### Behavioral Analysis
1. User navigates to the Behavioral Intelligence section.
2. User views patterns identified by the system (e.g., performance by day of week, win rate by holding duration, consecutive loss impacts).

### AI Coach
1. User opens the AI Coach interface.
2. User asks a question or requests a performance review.
3. The AI Coach analyzes the user's historical data and provides customized, grounded feedback.

### Subscription Upgrade
1. User on the Free Plan hits a limitation (e.g., AI scan quota).
2. User is prompted to upgrade to the Pro Plan.
3. User completes the checkout process via Stripe.
4. System updates the user's entitlements immediately.

## 9. Functional Requirements

### Trade Journal
- **REQ-J-01 [P0]:** The system must allow users to view a list of all recorded trades.
- **REQ-J-02 [P0]:** The system must support manual trade entry with fields for asset, direction (long/short), entry time, exit time, entry price, exit price, size, PNL, fees, tags, and notes.
- **REQ-J-03 [P0]:** The system must allow users to edit and delete existing trades.
- **REQ-J-04 [P1]:** The system must support filtering trades by date range, asset, direction, and tags.

### AI Trade Scan
- **REQ-AI-01 [P0]:** The system must allow users to upload images (PNG, JPG, WebP) of their trades.
- **REQ-AI-02 [P0]:** The system must process images using the Gemini API to extract structured trade data matching the manual entry schema.
- **REQ-AI-03 [P0]:** The system must present extracted data for human confirmation before saving.

### Dashboard
- **REQ-D-01 [P0]:** The dashboard must display an overview of the current month's performance (Net PNL, Win Rate).
- **REQ-D-02 [P1]:** The dashboard must display a sparkline or simple chart of recent equity curve.
- **REQ-D-03 [P0]:** The dashboard must display a list of the 5 most recent trades.

### Analytics
- **REQ-A-01 [P0]:** The system must deterministically calculate Net PNL, Gross PNL, Win Rate, and Average Risk/Reward ratio.
- **REQ-A-02 [P0]:** Analytics calculations must rely exclusively on the canonical data stored in Supabase.
- **REQ-A-03 [P1]:** The system must calculate and display average holding duration and expectancy.

### Behavioral Intelligence
- **REQ-B-01 [P1]:** The system must provide basic tag-based analysis (e.g., win rate grouped by custom tags).
- **REQ-B-02 [P2]:** The system should highlight statistical anomalies in trading behavior (e.g., "You lose most often on Fridays").

### AI Coach
- **REQ-C-01 [P1]:** The AI Coach must be queryable via a chat interface.
- **REQ-C-02 [P1]:** The AI Coach must only answer questions based on the user's actual documented trading data. The prompt must inject relevant user metrics.

### User Accounts & Settings
- **REQ-U-01 [P0]:** The system must support email/password authentication via Supabase Auth.
- **REQ-U-02 [P1]:** The user must be able to change their password and manage their account details.

### Export
- **REQ-X-01 [P1]:** Users must be able to export their raw trade data in CSV format.

### Entitlements & Billing
- **REQ-E-01 [P0]:** The system must enforce quotas distinguishing Free and Pro plans.
- **REQ-E-02 [P1]:** The system must integrate with a payment provider to process recurring subscriptions.

## 10. AI PRODUCT PRINCIPLES
- **Human-in-the-loop AI:** All AI-extracted data MUST be reviewed and explicitly confirmed by the user before it is considered valid and saved.
- **No Fabricated OCR Values:** The AI must only extract data explicitly visible in the screenshot. It must not guess or invent prices, dates, or assets.
- **No Fabricated Confidence Scores:** Do not present fake or arbitrary "confidence scores" to the user.
- **No Fake Fallback Trade Data:** If extraction fails, present a blank form. Do not fill the form with dummy data.
- **No Silent Saves:** Failed AI extraction must never silently create or save a corrupted trade object.
- **Schema-First Extraction:** The AI payload must conform to a strict, typed schema before being presented to the user.
- **Validation Before Persistence:** All data, whether manual or AI-extracted, must pass strict validation rules before being written to the database.
- **Deterministic Calculations:** All financial metrics (PNL, RR, win rate, duration, streaks, expectancy) MUST be calculated deterministically using standard mathematical formulas. AI must NEVER be used to calculate core reporting metrics.
- **Gemini is the AI Layer:** Google Gemini is the exclusive AI foundation model for V1.
- **Purpose of AI:** AI is strictly used for data extraction (screenshots), text classification (tagging), trend interpretation, and conversational coaching.
- **No Custom Neural Networks:** Tradelense is NOT training its own foundation model or neural network for V1.

## 11. Free Plan Direction
- Manual journaling (unlimited core trades).
- Core dashboard.
- Core analytics.
- Limited AI scans.
- Limited AI Coach interactions.
- Basic filtering.
- Basic CSV export.

## 12. Pro Plan Direction
- Higher/Unlimited AI scan limits.
- Higher/Unlimited AI Coach usage.
- Advanced analytics (drawdown analysis, detailed equity curve).
- Behavioral intelligence patterns.
- Advanced reports.
- Advanced exports (PDF reports).
- Future premium capabilities.

## 13. Non-Goals
- We are NOT building an automated trading execution bot.
- We are NOT operating as a broker or integrating directly with broker APIs for trade execution.
- We are NOT providing financial advice or trade signals.
- We are NOT building a social copy-trading network.
- We are NOT guaranteeing that users will become profitable.

## 14. UX / DESIGN REQUIREMENTS
- **Visual Identity:** Preserve the existing Tradelense premium dark fintech aesthetic.
- **Theme:** Terminal-inspired interface with dark/black surfaces.
- **Color Palette:** Maintain the existing cyan/purple visual language.
- **Effects:** Utilize tasteful glassmorphism and terminal effects.
- **Readability:** Ensure large, highly readable trade screenshots and clear information hierarchy.
- **Performance:** Workflows must be fast and responsive.
- **State Management:** Implement strong and obvious loading, error, and success states for all interactive elements.

## 15. SECURITY, PRIVACY AND TRUST
- **Authentication:** All access requires secure, authenticated sessions.
- **User Data Isolation:** Users can only access their own data.
- **Row Level Security (RLS):** Supabase RLS must be strictly enforced on all database tables.
- **Storage Security:** Screenshots must be stored securely with appropriate access controls.
- **Server-Side Authorization:** All sensitive operations, including API calls to Gemini and billing updates, must be authorized server-side.
- **Secret Management:** Secure handling of all API keys and secrets.
- **Billing Security:** Webhook verification must be implemented for all billing events.
- **Rate limiting and Abuse prevention:** Implement necessary safeguards against API abuse.
- **Data Export & Deletion:** Users have the right to export their data and permanently delete their accounts and data.
- **Production Truth:** Supabase is the undisputed production source of truth.
- **Development Fallback:** Local JSON files may only be used as a fallback during local development.

## 16. DATA QUALITY REQUIREMENTS
- **Schema Validation:** Strict type checking and validation on all database operations.
- **Numerical Validation:** Prices, sizes, and PNL must be valid numerical values with appropriate precision.
- **Missing Data Handling:** The system must gracefully handle missing optional fields (like tags or notes). Required fields must halt the workflow if missing.
- **No Invented Defaults:** The system must not quietly invent default values for missing critical data (e.g., assuming $0 PNL if unreadable).
- **Derived Metrics:** All analytics are derived from the canonical trade data.
- **Sample-Size Limitations:** The system must clearly indicate when data sample sizes are too small to draw statistically significant behavioral conclusions.

## 17. PRODUCT SUCCESS METRICS
- Trade capture completion rate (time to log a trade).
- Screenshot-to-confirmed-trade conversion rate.
- AI extraction failure rate.
- AI correction rate (how often users have to fix extracted data).
- Active Daily/Monthly Users (DAU/MAU).
- Average trades logged per active user.
- Retention rate (Week 1, Month 1).
- AI Coach engagement/usage rate.
- Free-to-Pro conversion rate.
- Paid subscriber retention/churn rate.
- AI API and infrastructure cost per active user.
- Number of critical workflow errors encountered.

## 18. RELEASE STRATEGY
- **Internal Foundation:** Establish architecture, database schema, CI/CD, and basic manual journaling.
- **Commercial V1:** Launch with functional AI Trade Scan, Analytics, Dashboard, AI Coach, and Stripe integration.
- **Post-launch:** Polish UX, expand behavioral analytics, introduce advanced reporting, and scale marketing efforts.

## 19. PRD ACCEPTANCE CRITERIA
- The PRD covers all requested sections clearly and concisely.
- The AI Product Principles are explicitly documented and highlighted as non-negotiable.
- The distinction between Free and Pro plans is established.
- The product is clearly defined as a web SaaS running on Supabase and Gemini.
- No technical implementation details conflicting with the "locked decisions" are included.

## 20. KEY DEPENDENCIES
- Google Gemini API (for AI extraction and coaching).
- Supabase (PostgreSQL database, Auth, Storage, Edge Functions).
- Authentication provider (Supabase Auth).
- Payment provider (Stripe).
- GitHub (Source control).
- Antigravity (Primary development environment/agent).
- Google AI Studio (For prompt engineering and testing).

## 21. PRODUCT DECISIONS LOCKED BY THIS DOCUMENT
- **Product Name:** Tradelense
- **Positioning:** Your AI Trading Journal OS
- **Product Type:** Commercial web SaaS
- **Core Value:** AI-assisted journaling + analytics + behavioral intelligence + AI coaching
- **AI Engine:** Gemini APIs are the exclusive AI provider for V1
- **Data Integrity:** User-confirmed trade data is the canonical source of truth
- **Database:** Supabase is the production source of truth
- **Source Control:** GitHub
- **Development Environment:** Antigravity
- **Design:** Existing premium dark fintech UI direction is strictly preserved

## 22. DOCUMENT GOVERNANCE
This Product Requirements Document (docs/01_PRODUCT_REQUIREMENTS.md) serves as the definitive product-level source of truth for all subsequent technical specifications, design decisions, and engineering implementation. Any changes to the core scope or product principles require modification of this document.

Next document:
02_FEATURE_SPECIFICATION.md
