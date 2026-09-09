# Analytics Specification: Tradelense

## 1. Executive Summary
This document defines the formal rules for how Tradelense calculates, aggregates, displays, and interprets trading analytics. It establishes the rigid calculation boundaries ensuring that all core financial mathematics remain purely deterministic, while Gemini (AI) acts strictly as a contextual interpreter.

## 2. Analytics Philosophy
Tradelense analytics must be deterministic. Financial and statistical calculations must be performed by application or database logic using validated trade data. AI must NEVER be the arithmetic authority.

## 3. Analytics Goals
Ensure perfect accuracy, statistical reproducibility, absolute isolation (cross-tenant safety), missing-data safety (failing gracefully rather than fabricating data), and composability for deep behavioral correlation.

## 4. Analytics Non-Goals
It is NOT a goal to build an autonomous trading simulator, handle unstructured AI math tasks, or predict future market movements.

## 5. Analytics Architecture
Raw Trade Rows (Supabase) → Node.js/Postgres deterministic aggregation → Strict JSON DTO → Frontend render (or Context sent to AI Coach for summarization).

## 6. Source-of-Truth Data
The definitive source of truth is the canonical `trades` table in Supabase. Analytics derived from ephemeral memory or client-side caching are discarded upon refresh.

## 7. Trade Data Requirements
Analytics rely on the presence of: `direction`, `entry_price`, `exit_price`, `entry_time`, `exit_time`, and `position_size`. 

## 8. Data Quality Rules
Invalid or fundamentally contradictory trades (e.g., exit timestamp prior to entry timestamp) are flagged and excluded from duration-sensitive analytics to prevent data poisoning.

## 9. Financial Calculation Principles
Calculations must respect position constraints, directionality (Long vs. Short), and retain full decimal floating precision internally, only rounding at the final UI presentation layer.

## 10. P&L Calculation
- **Name:** P&L (Profit and Loss)
- **Purpose:** Determine the absolute return of a closed trade.
- **Input fields:** `direction`, `entry_price`, `exit_price`, `position_size`, `fees`.

## 11. Gross P&L
- **Formula (Long):** `(exit_price - entry_price) * position_size`
- **Formula (Short):** `(entry_price - exit_price) * position_size`
- **Missing Rules:** If `exit_price` or `position_size` is missing, Gross P&L evaluates to `NULL`.

## 12. Net P&L
- **Formula:** `Gross P&L - Fees`
- **Missing Rules:** If `fees` are `NULL` but Gross P&L exists, Net P&L falls back to Gross P&L (implicit zero fees, flagged with a warning where appropriate).

## 13. Fees and Costs
Explicitly subtracted. Do not assume zero unless `fees` are null.

## 14. Realized vs Unrealized P&L
Tradelense V1 Analytics focuses entirely on closed/realized trades. Unrealized P&L (open trades) are excluded from aggregated equity curves to prevent false optimism.

## 15. Win Rate
- **Formula:** `(Total Winning Trades / Total Closed Trades) * 100`
- **Inclusion Rules:** Winning Trade = Net P&L > 0.
- **Empty Dataset:** Returns `0` or `N/A`.

## 16. Loss Rate
- **Formula:** `(Total Losing Trades / Total Closed Trades) * 100`
- **Inclusion Rules:** Losing Trade = Net P&L < 0.

## 17. Breakeven Trades
- **Formula:** `(Total Breakeven Trades / Total Closed Trades) * 100`
- **Inclusion Rules:** Net P&L exactly equal to 0.

## 18. Profit Factor
- **Formula:** `(Sum of all Gross Profits) / (Absolute Sum of all Gross Losses)`
- **Exception:** If Losses = 0 and Wins > 0, Profit Factor = `Infinity`.

## 19. Average Winning Trade
- **Formula:** `Sum of P&L of all Winning Trades / Total Winning Trades`.

## 20. Average Losing Trade
- **Formula:** `Sum of P&L of all Losing Trades / Total Losing Trades`.

## 21. Expectancy
- **Formula:** `(Win Rate * Average Win) - (Loss Rate * Absolute Average Loss)`
- **Purpose:** Represents the expected mathematical return per trade.

## 22. Risk and Reward Analytics
Strictly separated between planned expectations vs realized execution.

## 23. Risk:Reward Ratio
Measures the mathematical boundary between the Stop Loss (Risk) and Take Profit (Reward).

## 24. Planned vs Realized R:R
- **Planned Risk (Long):** `entry_price - stop_loss`
- **Planned Reward (Long):** `take_profit - entry_price`
- **Planned R:R:** `Planned Reward / Planned Risk`
- **Realized R Multiple:** `Realized Net P&L / Planned Risk`

## 25. Average R:R
- **Formula:** The arithmetic mean of `Planned R:R` across a filtered dataset. Requires both SL and TP to be present.

## 26. Maximum Favorable Excursion
*(Future Scope / OPEN TECHNICAL DECISION)*: Requires granular tick data not currently scraped by Screenshots. Marked NA for MVP.

## 27. Maximum Adverse Excursion
*(Future Scope / OPEN TECHNICAL DECISION)*: Marked NA for MVP.

## 28. Position Sizing Analytics
- **Average Position Size:** `Sum of absolute position_sizes / Count of Trades`. Used to track aggressive risking.

## 29. Trade Duration
- **Formula:** `exit_time - entry_time` (Result in milliseconds/seconds).
- **Missing Rules:** If timestamps are malformed/missing, trade is excluded from duration averages.

## 30. Session Analytics
Groups analytics by recognized active trading sessions (e.g., Asian, London, NY).
- **Session Win Rate:** Extracts P&L grouping strictly by tags.

## 31. Setup Analytics
Groups metrics by the user's predefined setup strings (e.g., "Breakout"). Computes Setup Win Rate and Setup Expectancy.

## 32. Long vs Short Analytics
Breaks down all core metrics (Win Rate, Profit Factor, P&L) filtered strictly by `direction`.

## 33. Symbol / Pair Analytics
Ranks instruments (e.g., AAPL vs EURUSD) by net profitability and frequency.

## 34. Day-of-Week Analytics
Aggregates trade closing datetimes locally normalized to identify worst/best performing days.

## 35. Time-of-Day Analytics
Aggregates execution frequency by hour chunks.

## 36. Streak Analytics
- **Winning Streak:** Count of consecutive chronologically ordered closed trades where Net P&L > 0.
- **Losing Streak:** Consecutive Net P&L < 0.
- **Breakeven Interruption:** A Breakeven trade ends a streak.

## 37. Drawdown Analytics
- **Peak Equity:** Maximum cumulative Net P&L achieved.
- **Current Drawdown:** `Peak Equity - Current Equity`.
- **Maximum Drawdown:** The largest historical drop from peak to trough in absolute or percentage terms.

## 38. Equity Curve
Constructed via chronologically ordered Cumulative Net P&L. Identical timestamps resolved by database insert order (`id` or `created_at` secondary).

## 39. Monthly Performance
Aggregates trades logically grouped by Calendar Month (using user timezones).

## 40. Weekly Performance
Aggregates trades grouped by Calendar Week.

## 41. Daily Performance
Aggregates trades grouped by Calendar Day.

## 42. Trade Frequency
- **Formula:** Count of trades executed over a defined time window.

## 43. Consistency Analytics
Measures variance in daily P&L. Low standard deviation relative to mean return equals high consistency. 

## 44. Behavioral Analytics
Tracks emotional and cognitive labels manually specified or AI-suggested and user-confirmed.

## 45. Psychology Data
Tags (e.g., "FOMO", "Tilted", "Calm") linked relationaly to trade IDs.

## 46. Cognitive / Emotional Patterns
Frequency calculations of tags present in Winning vs Losing trades.

## 47. Mistake Analytics
Tracks execution mistakes labels ("Moved Stop Loss").

## 48. Discipline Analytics
Matches `Realized P&L` vs `Planned R:R`. Exiting before 1R is flagged as an undisciplined early exit.

## 49. Behavioral Correlations
Matches psychology metadata vs financial outcomes.
- "FOMO" vs Average P&L.
- *Rule Check:* Correlation does not prove causation must be noted.

## 50. Behavioral Segmentation
Splits the entire dataset: "Performance when FOMO is True" vs "Performance when FOMO is False".

## 51. Dashboard Metrics
Prioritizes at-a-glance health.

## 52. Dashboard Metric Definitions
- **Monthly P&L:** Net P&L for current month.
- **Win Rate:** Global win rate over selected period.
- **Average R:R:** Global average planned Risk:Reward.
- **Total Executions:** Count of closed trades.
- **Average Duration:** Average time in trade.

## 53. Dashboard Metric Priority
Focuses on the North Star: Profitable consistency over pure volume.

## 54. Analytics Filters
Filters are strictly composable. 

## 55. Date Range Filtering
Applies `entry_time` bounding (Start Date, End Date).

## 56. Session Filtering
Isolates specific trading sessions (e.g., NY Open).

## 57. Setup Filtering
Isolates specific setups (e.g., "BOS").

## 58. Symbol Filtering
Isolates pairs (e.g., NQ, EURUSD).

## 59. Position Type Filtering
Isolates Long / Short.

## 60. Outcome Filtering
Isolates Win / Loss / Breakeven.

## 61. Psychology Filtering
Isolates tagged behavioral states.

## 62. R:R Filtering
Isolates parameters matching specific R mults.

## 63. Aggregation Rules
Filters execute a logical `AND`. A trade must pass all selected filters to be included in the dataset supplied to the math engine.

## 64. Empty Dataset Rules
Returns `0`, `[]`, or `N/A`. Does not throw 500 errors.

## 65. Missing Data Rules
Never fabricates missing data (e.g., extrapolating SL to build a fake RR graph is illegal).

## 66. Invalid Data Rules
Exclude trade from the specific uncalculable metric while preserving it for others (e.g. invalid timestamp removes it from Duration, but it stays in Win Rate).

## 67. Currency Handling
*OPEN BUSINESS DECISION:* V1 assumes a unified account baseline currency (USD) unless updated. Calculations do not presently invoke live external FX converters.

## 68. Timezone Handling
Database stores UTC. Backend accepts user Timezone identifier from Profile to group "Daily PNL" correctly per the user's geographic perspective. 

## 69. Precision and Rounding
Internal: Exact Decimal.
Frontend Display Rounding: 2 decimal places for Fiat, contextual for specific assets (e.g., 5 for Forex pips).

## 70. Statistical Integrity
Maintains rigorous arithmetic logic. Backend validates all div-by-zero checks.

## 71. Outlier Handling
Do not silently delete. Apply frontend UI warnings if a single trade represents >80% of total Net P&L (skew warning).

## 72. Small Sample Warnings
Datasets < 20 trades trigger a generic statistical insufficiency visual warning in the UI.

## 73. Data Sufficiency
AI requires X minimum trades to confidently assess deep behavioral patterns.

## 74. AI Interpretation Layer
Boundary separating the Node.js/SQL calculator from the Gemini explainer.

## 75. AI Analytics Boundaries
The deterministic backend hands a JSON block of `{winRate: 45, pnl: 4000, maxDrawdown: 1200}` to AI. 
AI writes a paragraph: "You struggled with drawdown this week." AI **does not** recount trades.

## 76. AI Hallucination Prevention
Prompts explicitly instruct AI: `"You are reading pre-calculated metrics. Do not alter or contradict the provided numbers."`

## 77. AI Behavioral Insights
Uses evidence provided in context (e.g. "20 out of 25 losses were tagged FOMO") and outputs a natural language coaching recommendation.

## 78. AI Coach Analytics Context
Coach injected with Top 5 strongest deterministic correlations when answering user queries.

## 79. Free vs Pro Analytics
- **FREE:** Standard dashboard, simple equity curve, basic win rates.
- **PRO:** Deep behavioral correlations, drawdown analyzers, multi-filter metric nesting. 

## 80. Analytics Entitlement Enforcement
Server-side Express middleware blocks Pro-level advanced analytic aggregation queries (`GET /api/analytics/advanced`) if User tier = Free.

## 81. Analytics Performance
Indices established on `user_id`, `direction`, `entry_time`. 

## 82. Caching Strategy
*OPEN TECHNICAL DECISION.* (In-memory Redis caching of dashboard payload to save DB scans if scale requests it).

## 83. Precomputation Strategy
*OPEN TECHNICAL DECISION.* (Materialized views for Heavy pro users with 10k+ trades).

## 84. Analytics API Relationship
`/api/analytics` acts as the bridge connecting SQL to the UI and the AI context loader.

## 85. Database Relationship
Relies wholly on Document 06 RLS constraints. 

## 86. Analytics Security
No arbitrary raw SQL filter evaluation. All API filtering is strictly wrapped in parameterized queries.

## 87. User Data Isolation
`auth.uid()` fundamentally bounds all sum/avg queries. Analytics cannot mathematically leak data due to RLS scoping.

## 88. Analytics Failure Modes
If division by zero occurs internally, default fallback -> API returns `null` for that metric, but `200 OK` overall. Frontend translates `null` to `N/A`.

## 89. Analytics Testing Strategy
Extensive Jest unit tests covering edge arithmetic cases.

## 90. Deterministic Calculation Test Cases
Assert PNL equals exactly `(exit-entry)*size`. Assert short trades negative/positive inversion is perfect.

## 91. Cross-User Isolation Tests
Assert generating User A's analytics does not increment when User B adds trade data.

## 92. Edge Cases
- 0 trades.
- 1 trade.
- Trades spanning daylight savings time shifts.
- Stop Loss identical to Entry (Breakeven).

## 93. Analytics Observability
Track API calculation latency. If an aggregation routine > 2,000ms, alert engineering to add indices. 

## 94. Analytics Decision Records
- **ADR-ANA-001:** Deterministic Code computes math; AI interprets.
- **ADR-ANA-002:** Missing fields yield omitted metric lines.
- **ADR-ANA-003:** UTC Storage, Browser rendering resolution.

## 95. Open Analytics Decisions
- Exact currency conversion methodology (Fx API?).
- Exact Materialized view thresholds for big users.
- Treatment of 0-fee trades in asset classes with known hidden spread costs.

## 96. Analytics Acceptance Criteria
- [x] Defined exact boundaries between AI limits and Deterministic Mathematics.
- [x] Formally listed mandatory P&L, Win Rate, and Drawdown formulas securely mapping to Long/Short logic.
- [x] Declared fail-safe responses to null/missing input constraints.
- [x] Assured analytical alignment seamlessly scaling Free to Pro limits on the backend.

## 97. Document Governance
- **Owner:** Backend/Product Analytics Team.
- Future code calculation implementations must perfectly mirror the mathematical formulas delineated herein.
