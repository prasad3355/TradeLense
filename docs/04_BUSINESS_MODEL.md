# Business Model: Tradelense

## 1. Executive Summary
Tradelense is a commercial SaaS operating on a freemium model. Its primary value proposition is helping traders understand their execution quality and behavioral patterns through an "AI Trading Journal OS." The business model relies on attracting users via a highly functional Free tier that habituates them to journaling, and monetizing power users who seek advanced AI screenshot extraction capabilities, deeper behavioral intelligence, and unlimited AI coaching (the Pro tier). Sustainable business operations require strict control over AI economics, balancing the high cost of generative image processing against predictable recurring subscription revenue.

## 2. Business Model Principles
- **Value-Based Monetization:** Users pay for efficiency (AI scans) and insights (Behavioral Intelligence/Coach), not basic necessity (core manual journal).
- **Sustainable AI Economics:** AI features are quota-limited or strictly tied to paid plans to prevent infrastructure costs from outpacing revenue.
- **Simple, Transparent Pricing:** No complex token-based wallets. Simple, flat monthly/annual recurring subscriptions.
- **No Deceptive Constraints:** No paywalling the user's own raw data; export is always free.
- **No Dark Patterns:** Cancellation must be instant and self-serve.
- **Privacy-First:** User data is not sold to brokers or hedge funds. Revenue comes exclusively from user subscriptions.

## 3. Target Customer Segments

### Active Retail Traders
- **Primary Problem:** High volume of trades; manual entry is too slow/friction-heavy.
- **Tradelense Usage:** Heavy AI screenshot scanning, daily dashboard reviews.
- **Free/Pro Fit:** Highly likely to hit Free tier scan limits rapidly; strong candidates for Pro.

### Developing Traders
- **Primary Problem:** Repeating emotional mistakes; lack of profitability.
- **Tradelense Usage:** AI Coach profiling, behavioral intelligence pattern recognition.
- **Free/Pro Fit:** Lower overall volume, but high willingness to pay for customized coaching insight.

### Prop Firm Challengers
- **Primary Problem:** Need strict discipline and drawdown tracking to avoid losing paid evaluation accounts.
- **Tradelense Usage:** Analytics (win rate, RR, drawdown) monitored religiously.
- **Free/Pro Fit:** Short-term intense usage; likely to subscribe for a few months during challenges.

*(Note: Professional/Institution/Team functionality is out of scope for Commercial V1).*

## 4. Jobs To Be Paid For
We must clearly separate the commodities (free) from the premium automations/insights (paid).

**CORE FREE VALUE (Commodity):**
- Reliable structural storage of trade history.
- Manual entry workflows.
- Basic deterministic aggregate calculations (Win Rate, Net PNL).

**PREMIUM VALUE (Worth Paying For):**
- **Time Savings:** Erasing manual entry via AI screenshot-to-trade extraction.
- **Expertise/Insight:** Behavioral pattern detection (e.g., "You lose most on Fridays after 10 AM").
- **Personalized Coaching:** On-demand AI Coach grounded in explicit historical user data.

## 5. Free Tier Strategy
The Free tier must provide genuine utility. If it is too restrictive, the Product-Led Growth loop collapses.
- **Manual Journaling:** Unlimited core trade limits.
- **Dashboard & Core History:** Fully accessible.
- **Basic Analytics:** Available over all historical trades.
- **Limited AI Scanning:** A strict monthly quota is provided to demonstrate the "magic" of the screenshot extraction workflow.
- **Limited AI Coach Access:** A strict monthly query limit.
- **Basic Exports:** Free CSV export respects the user's data ownership.

## 6. Pro Tier Strategy
Pro provides the ultimate, frictionless Trading OS experience.
- **Higher AI Scan Allowance:** Sufficient for heavy daily traders.
- **Behavioral Intelligence:** Unlocking the engine that correlates emotional tags and mistakes to PNL.
- **Advanced Diagnostics:** Insights into drawdowns, streak analysis, and expectancy modeling.
- **Deeper AI Coach:** Higher interaction baseline.
- **Advanced Exports/Reports:** e.g., PDF tear sheets for prop-firm proof.

## 7. Free vs Pro Entitlement Matrix

| Category | FREE | PRO | FUTURE |
| :--- | :--- | :--- | :--- |
| **Manual Trade Entry** | Unlimited | Unlimited | |
| **Trade History** | Unlimited | Unlimited | |
| **Dashboard** | Core metrics | Core + Advanced metrics | |
| **Basic Analytics** | Yes | Yes | |
| **AI Trade Scanning** | strict monthly quota (*OPEN DECISION*) | high monthly quota (*OPEN DECISION*) | |
| **AI Coach** | strict monthly quota (*OPEN DECISION*) | high monthly quota (*OPEN DECISION*) | |
| **Behavioral Intelligence** | No | Yes | |
| **Advanced Reports** | No | Yes | |
| **Exports** | Basic CSV | Advanced / PDFs | API Access |
| **Screenshot Storage** | Basic limit *(OPEN DECISION)* | Extended limit | |

## 8. Monetization Model
**Recommended V1 Model: Flat-Rate Monthly/Annual Subscription.**
- **Why:** Predictability. Users dislike "token anxiety" (worrying how much it costs to upload every specific image).
- **Control:** We absorb the variable AI cost, capping our risk via a generous but strict fair-use policy maximum limit on Pro accounts.
- **Alternative (Rejected):** Usage-based pricing is too complex for consumer SaaS billing MVP. Pure lifetime plans risk catastrophic losses against recurring AI API costs.

## 9. Pricing Strategy
Pricing must cover Gemini API costs (especially multi-modal image processing), storage, payment processing, and core infrastructure while leaving a healthy gross margin (target 70%+).

- **Monthly Pricing Hypothesis:** *OPEN BUSINESS DECISION* (Likely to sit in the premium B2C tier, parallel to tools like TradingView Pro).
- **Annual Pricing:** Offers an assumed ~20% discount to lock in LTV (Lifetime Value) and offset initial acquisition costs.
- **Future Pricing Review:** Price elasticity testing required post-launch using cohort data.

## 10. AI Economics (CRITICAL)
Gemini multi-modal requests are the biggest threat to Tradelense's unit economics.

**Strict Economic Principles:**
1. **Never use AI for deterministic math:** Application code calculates Win Rate, RR, PNL, and duration.
2. **Optimize Image Tokens:** Client-side compression and resizing (e.g., max 1024x1024) drastically reduces API payload costs.
3. **Graceful Degradation:** If Gemini costs spike or rate limits hit, the app falls back to manual entry.
4. **No Idle Polling:** AI is invoked explicitly by users (upload, or hitting 'ask coach'), never via autonomous background crons analyzing every tick.

## 11. Unit Economics Framework
- **ARPU (Average Revenue Per User):** (Total MRR) / (Active Paying Users).
- **AI Cost Per User:** (Total Gemini API Spend) / (Active Users using AI features).
- **Infrastructure Cost Per User:** (DB + Hosting + Auth + Storage Costs) / (Total Users).
- **Gross Margin:** (ARPU - Support - API Costs - Infrastructure - Payment Fees) / ARPU.
- **CAC (Customer Acquisition Cost):** Total Marketing + DevRel Spend / New Paying Users.
- **LTV (Lifetime Value):** ARPU * Average Customer Lifespan in months.

## 12. Cost Control Strategy
Client-side UI limits are easily bypassed. **All cost controls MUST be enforced server-side.**
- **Supabase Edge Functions / Middlewares:** Check `subscription_tier` and `monthly_scans_used` before forwarding the image to Gemini.
- **Throttling/Rate Limits:** Prevent script-kiddie abuse of the AI Coach endpoint.
- **Stale Data Pruning (Free tier):** Implement soft limitations on storing massive uncompressed images for free users (e.g., auto-compress heavily to save S3 costs).

## 13. Subscription Lifecycle
- **Free:** Default state on signup.
- **Active Pro:** User has an active Stripe subscription.
- **Past Due:** Payment failed (grace period applies handled via Stripe Retries).
- **Cancelled/Expired:** Webhook triggers downgrade logic. User retains data but loses access to Pro UI features.
- *Detailed implementation deferred to `docs/09_SUBSCRIPTION_BILLING.md`.*

## 14. Upgrade Experience
- **Organic Trigger:** User clicks "Add Trade" and exceeds their Free AI Scan quota.
- **UI Prompt:** A clear, honest modal: "You've reached your free AI scans for this month. Upgrade to Pro for X more monthly scans and Advanced Behavioral analytics."
- **Contextual Blur:** In the Behavioral Intelligence tab, Free users see a blurred/watermarked preview of what Pro would reveal about their exact data.

## 15. Retention Strategy
- **Habit Formation:** The dashboard encourages daily/weekly reviews. The manual core remains free so users don't abandon the product if they churn from Pro.
- **Data Gravity:** As users accumulate hundreds of trades, the analytical value scales exponentially, creating powerful organic lock-in based on utility, not artificial restriction.

## 16. Churn Strategy
- **Signal:** Zero logins in 14 days, or zero trades logged in a week.
- **Action:** Send a passive, non-intrusive value-summary email (e.g., "Your trading week in review").
- **Cancellation Flow:** Must be 1-click self-serve. Ask a 1-question optional survey ("Too expensive", "Not trading anymore", "Missing feature").
- **Downgrade Path:** Allow seamless reversion to Free tier, ensuring data is never held hostage.

## 17. Customer Acquisition Strategy
Initially strictly organic/Product-Led.
- **Content:** Building transparent "build-in-public" engineering/trading blogs mapping behavioral improvements.
- **SEO:** Ranking for search terms around "Trading Journal", "MT4 execution tracker", "Overcoming FOMO trading".
- **Communities:** X/Twitter and Reddit (r/Daytrading) offering an unequivocally excellent free tier.
- *(Paid Ads are explicitly out of scope for launch phase).*

## 18. Product-Led Growth Loop
`Visitor` → `Signs Up (Free)` → `Manually logs 3 trades` → `Tries AI screenshot scan` → `Experiences "Aha!" moment on fast extraction` → `Keeps journaling` → `Hits behavioral threshold (e.g., 50 trades)` → `Wants to know why PNL is flat` → `Hits Pro paywall for Behavioral Intelligence` → `Upgrades to Pro`.

## 19. Key Business Metrics
- **Acquisition:** Visitor-to-Signup conversion rate.
- **Activation:** % of signups who log > 3 trades in week 1. % who complete an AI Scan.
- **Engagement:** DAU/MAU ratio; Average trades logged per week.
- **Monetization:** Free-to-Paid conversion rate; MRR (Monthly Recurring Revenue).
- **Economics:** AI API Margin (Sub Revenue vs Gemini Token/Image Spend).
- **Retention:** Logo Churn %, Net Revenue Retention.

## 20. North Star Metric
**"Weekly Active Traders Completing Meaningful Journal Reviews"**
- *Definition of Meaningful:* Logging a session's trades AND navigating to the Analytics or Behavioral tab to evaluate performance for at least 3 minutes.
- *Why:* Optimizing for pure "AI requests" incentivizes burning our API budget. Optimizing for "Revenue" ignores the top-of-funnel health. Optimizing for this North Star focuses the entire company on the core product value: building better traders.

## 21. Business Risks

| Risk | Impact | Mitigation |
| :--- | :--- | :--- |
| **High AI Cost (Gemini)** | Destroys Gross Margins | Server-side max image sizing, aggressive usage quotas, never looping AI prompts. |
| **Low Free-to-Pro Conversion** | Stagnant revenue growth | Ensure the Behavioral Intelligence and AI Coach provide compelling, tangible insights. |
| **Inaccurate AI Extraction** | Trust breaks, churn spikes | UX must enforce human-in-the-loop review. Absolute veto of silent saves. |
| **User Distrust (Privacy)** | Refusal to upload broker data | Strong TOS, explicitly stating we do not sell trade logs; clear delete-account parity. |

## 22. Competitive Positioning
Tradelense differentiates by being the **AI-Native Journal**.
Legacy competitors require heavy manual Excel-like data entry or brittle broker API connections. Tradelense utilizes computer vision to bypass broker integrations entirely (Screenshots) and uses LLMs to interpret qualitative behaviors (FOMO, patience) rather than just quantitative outputs.

## 23. Commercial MVP
**MUST HAVE FOR LAUNCH:**
- Full Free tier capability.
- Full Pro tier (Advanced Analytics / AI limits unpacked).
- Stripe Checkout integration (Upgrade/Downgrade).
- Server-side quota entitlement tracking.
- Database privacy isolation (RLS).

**POST-LAUNCH (Not MVP):**
- Annual billing.
- Gift subscriptions/Promo codes.
- Usage-based overages.

## 24. Future Revenue Opportunities
*(These are explicitly future opportunities and do NOT expand V1 scope)*
- **Educator/Coach Portals:** Letting a mentor pay seat licenses to view their students' Tradelense dashboards.
- **Trading Group / Prop Firm Enterprise integration:** White-labeled instances.
- **Direct Broker Integration add-ons.**

## 25. Open Business Decisions
- EXACT $ Monthly Price.
- EXACT $ Annual Price (and discount %).
- EXACT Free tier monthly AI scan limit (e.g., 5 vs 15).
- EXACT Pro tier monthly AI scan limit (e.g., 500 vs 1000).
- EXACT Stripe integration flavor (Elements vs Hosted Checkout).
- Tax/GST compliance automation vendor (e.g., Stripe Tax).
- Storage policy per user limit (e.g., 1GB vs 5GB images for Free tier).

## 26. Business Model Acceptance Criteria
- [x] Free and Pro value propositions are distinctly separated.
- [x] Monetization relies on efficiency/insight, not basic utility.
- [x] AI economics and Gemini constraints are addressed.
- [x] Cost controls (server-side limits, downsampling) are explicitly required.
- [x] Business metrics and North Star are defined.
- [x] No unsupported exact pricing figures are presented as fact.
- [x] Aligns completely with Documents 01, 02, and 03.

## 27. Document Governance
- **Document Owner:** Product Owner
- Engineering applies this document to establish structural boundaries for subscriptions, API cost guards, and billing workflows.
- Exact stripe/billing webhook specs are deferred to later architecture documents.
- This document must NOT silently change the scope dictated by the PRD.
