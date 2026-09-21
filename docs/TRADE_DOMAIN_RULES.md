# Tradelense Trade Domain Rules & Contract

## 1. Objective
This document outlines the canonical domain constraints for the core Tradelense journaling implementation. These rules act as the strict boundary between incoming API payloads and the definitive PostgreSQL `trades` table. The backend exclusively drives determinism avoiding dangerous trust distributions favoring frontends.

## 2. Server-Controlled Fields
Clients **MUST NEVER** provide these fields mutating payloads locally. The Server controls their creation, derivation, and tracking statically:
* `id`: UUID driven locally or DB generated.
* `user_id`: Strictly extracted via JWT token identity bindings (`req.user.id`).
* `created_at` / `updated_at`: Database trigger sequences.
* `pnl_realized`: Deterministically parsed evaluating Entry, Exit, and Size.
* `outcome`: Deterministically deduced assessing P&L outcomes.
* `entry_source`: Explicitly defined based on workflow pipeline (Defaults: `MANUAL`).

## 3. Editable vs Immutable Fields
* **Immutable:** Re-assigning `user_id`, mapping another identity across existing structures, or coercing `pnl_realized`/`outcome` values artificially is completely blocked (triggering `FORBIDDEN_FIELD` schemas respectively via Zod `strict()`).
* **Editable:** Normal traits mapping open transitions adjusting entries, stops, psychology, or eventually logging exit markers successfully triggering closed-states structurally securely.

## 4. Open vs Closed Behaviors
* **Open Trade:** Necessitates missing data structurally identifying as `OPEN`. Timestamps evaluating outputs (`exit_timestamp`), executing costs (`exit_price`), and results (`pnl_realized`) must explicitly utilize `NULL`, eliminating unverified zeros.
* **Closed Trade:** Once `exit_timestamp` is logged locally, the trade enforces an `INCOMPLETE_CLOSED_TRADE` bounds restricting exits without complete numeric configurations (`entry_price`, `exit_price`, `position_size`, `side`). 

## 5. Timestamp Rules
* Execution time chronologies must reflect reality linearly locally natively: `entry_timestamp <= exit_timestamp`.
* Values require ISO 8601 formatting translating natively towards `TIMESTAMPTZ` internally natively.

## 6. Numeric Constraints
* **Positivity:** `entry_price`, `exit_price`, `stop_loss`, `take_profit`, and `position_size` enforce absolute `> 0` structures implicitly avoiding arithmetic contradictions natively.
* **Fees:** Mapped evaluating `>= 0` bounding execution charges natively.

## 7. Trade Geometry (Long / Short)
* **LONG Semantics:** Prices advance linearly safely. Geometry implies `stop_loss < entry_price < take_profit`. 
* **SHORT Semantics:** Prices descend reversing tracking outputs natively. Geometry implies `stop_loss > entry_price > take_profit`. 
* **Domain Rejection:** Contradictory definitions natively evaluate via `validateTradeGeometry()` ejecting payloads dynamically catching false `INVALID_TRADE_GEOMETRY` assumptions precisely natively.

## 8. P&L & Outcome Determinism
* **PNL Logic:** `((Price Movement) * Position_size) - Fees`.
  * *LONG:* `exit_price - entry_price`
  * *SHORT:* `entry_price - exit_price`
* **Outcome Rules:**
  * PNL `> 0`: `WIN`
  * PNL `< 0`: `LOSS`
  * PNL `== 0`: `BREAK_EVEN`
* **Note on Precision:** JS Floating Point logic exposes rounding errors statically. Derived sums parse locally translating numeric boundaries locked behind `.toFixed(4)` limits structurally mitigating DB storage fragmentation. Asset contract scaling limits apply generically without explicit `multiplier` variables locally presently.

## 9. Risk/Reward (R:R) Handling
The database structure eschews storing calculated `risk_reward_ratio` columns protecting structural truth. Derivations execute actively assessing limits dynamically:
* **Missing Stops / Targets:** Bounding lacks resolution mapping SL or TP boundaries individually safely returning `null` tracking metrics securely. 

## 10. Provenance & Entry Sources
AI states generate complex extraction payloads initially. When confirming payloads natively, structural APIs inject mapping origins seamlessly marking `entry_source` arrays natively (`MANUAL`, `AI_EXTRACTED`). Clients attempting false provenance mappings bypassing extraction triggers passively receive explicit rejections avoiding false logging natively structures natively seamlessly. 

## 11. Domain Error Codes
| Code | Reason |
| :--- | :--- |
| `INVALID_TIMESTAMPS` | Exit occurred before Entry chronologically. |
| `INVALID_TRADE_GEOMETRY` | SL or TP placement contradicts trade direction physically. |
| `INCOMPLETE_CLOSED_TRADE` | Exit Timestamp implies closure without executable numeric outputs natively securely. |
| `FORBIDDEN_FIELD` | Server-driven variable injected maliciously evaluating updates. |
