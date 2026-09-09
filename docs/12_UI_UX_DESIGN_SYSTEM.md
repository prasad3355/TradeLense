# UI/UX & Design System Specification: Tradelense

## 1. Executive Summary
This document officially defines the scalable design system and user experience architecture for the Tradelense commercial SaaS. It elevates the product from a visually striking interface to a credible, mature, startup-grade platform. The system focuses on absolute clarity in financial data presentation, intentional visual hierarchy, accessible interactions, and rigorous boundaries between user-authored data and AI interpretations.

## 2. Product UI Philosophy
The interface operates as a "professional trading workspace." It prioritizes data density, operational speed, and trustworthy feedback loops. Decorative styling exists only to organize information and reflect the technical nature of the brand, never to overwhelm the core task of trading analysis.

## 3. Startup-Grade Product Principles
- **Predictability over Novelty:** Workflows use standardized SaaS paradigms (sidebars, data tables, modals).
- **Legibility over Asthetics:** Financial numbers must be instantly readable without squinting on dark modes.
- **Honest Feedback:** Errors, missing fields, and AI failures are communicated directly, avoiding fake success states.
- **Systematic Styling:** All spacing, coloring, and typography derive from documented tokens, ending ad-hoc inline styles.

## 4. Existing UI as Design Foundation
The current React/Tailwind base sets the visual tone: deep obsidian backgrounds (`#0d0d0f`), stark cyan/purple accents, and subtle glassmorphic layers (`bg-black/40 backdrop-blur`). This document does not rewrite this identity; it scales it for enterprise-level consistency.

## 5. Existing UI Audit
An inspection of the codebase (e.g., `index.css`, `DashboardView.tsx`, `Navbar.tsx`) reveals a strong visual language built upon utility classes. The navigation relies on a 64-width fixed sidebar and top navigation for global contexts.

## 6. Existing UI Strengths
- **Typography:** Brilliant pairing of `Inter` (Sans), `Hanken Grotesk` (Display), and `JetBrains Mono` (Technical Data).
- **Depth:** Excellent use of translucent layered surfaces (`.glass-fill`, `.glass-panel`) establishing spatial hierarchy.
- **Contrast:** Deep black backgrounds perfectly support glowing neon cyan (`#00dbe7`) and purple (`#ebb2ff`) focal points.

## 7. Existing UI Inconsistencies
- Over-reliance on looping aesthetic animations (e.g., `.laser-line` keyframes) which detract from the serious analytical environment.
- Unregulated usage of colors directly rather than through semantic roles (e.g., using raw Emerald rather than defining a standard `financial.profit` token).
- Lack of comprehensive empty-state messaging in data-heavy views.

## 8. Design System Goals
To construct a living framework that dictates semantic color roles, rigid layout grids, deterministic financial presentation, accessible AI safety indicators, and fluid commercial states (Free/Pro/Billing).

## 9. Visual Identity
Tradelense is absolute technical precision. The visual identity communicates "Your AI Trading Journal OS" through stark contrasts and clean structural lines, lacking any superfluous rounded-bubble friendliness indicative of consumer social apps.

## 10. Brand/Product Relationship
The Tradelense brand promises intelligence and clarity. The UI fulfills this by framing AI insight within rigid, human-confirmed data structures. The UI is the literal "lens".

## 11. Dark Theme Strategy
The system is exclusively Dark Mode first. Because traders look at charts for hours, the dark theme reduces eye strain. True black (`#000000`) is used for the lowest elevation (the app backdrop), while slightly lighter tones (`#131316`, `#1A1A1E`) signify elevated cards and interactable surfaces.

## 12. Color System
The palette is constrained. Colors must not be hardcoded by hex in components; they must reference semantic tokens.

## 13. Semantic Color Roles
- `color.background.base`
- `color.background.elevated`
- `color.text.primary`
- `color.text.secondary`
- `color.text.muted`
- `color.border.subtle`
- `color.status.success`
- `color.status.error`
- `color.status.warning`
- `color.status.info`
- `color.accent.primary` (Cyan)
- `color.accent.secondary` (Purple)

## 14. Background System
- **Level 0 (Backdrop):** True Black `#000000`. Used strictly behind the main workspace layout.
- **Level 1 (Surface):** `#0B0B0C`. Standard panel background.
- **Level 2 (Elevated):** `#131316`. Modals, dropdowns, hovered inputs.

## 15. Surface System
Surfaces utilize `backdrop-filter: blur(24px)` moderately over noisy backgrounds (like faint glowing background orbs) to simulate frosted glass without sacrificing contrast.

## 16. Border System
Borders are razor-thin (1px) and incredibly subtle (`rgba(255,255,255,0.05)`). Accent borders (`color.accent.primary`) are reserved strictly for active elements or AI-focused containers. 

## 17. Accent System
- **Cyan (`#00dbe7`):** Represents interactive utility, primary buttons, and positive momentum.
- **Purple (`#ebb2ff`):** Strictly represents Artificial Intelligence. Used for the AI Coach, extraction boundaries, and AI insights.

## 18. Financial Color Rules
- **Profit (`color.financial.profit`):** Emerald / Green. Used explicitly for positive PNL and Win Rate > 50%.
- **Loss (`color.financial.loss`):** Rose / Red. Used explicitly for negative PNL and Drawdown metrics.
- **Breakeven:** Slate / Neutral. 
*Rule:* Do NOT use Purple or Cyan to denote PNL direction. 

## 19. Typography System
- **Display:** `Hanken Grotesk` (Marketing headers, grand dashboard figures).
- **UI Base:** `Inter` (Forms, buttons, paragraphs).
- **Data:** `JetBrains Mono` (All tables, PNL values, datetimes, active tags).

## 20. Typography Hierarchy
- **H1:** 24px/32px - Module Headers.
- **H2:** 18px/24px - Section Headers / Card Titles.
- **Body:** 14px/20px - Standard UI label.
- **Micro:** 10px/12px - Monospaced telemetry tags and timestamps.

## 21. Financial Number Typography
All financial data (PNL, R:R, Account Balances) must be rendered in `JetBrains Mono`. It forces tabular lining, ensuring vertical alignment across table rows, preventing the jagged edges caused by proportional fonts.

## 22. Technical / Monospace Typography
Used for API Keys, Trade IDs, and System states (e.g. `[ACTIVE MONITORING]`).

## 23. Spacing System
Built on a strict 4px grid. 
- `spacing.xs` (4px)
- `spacing.sm` (8px)
- `spacing.md` (16px)
- `spacing.lg` (24px)
- `spacing.xl` (32px)
- `spacing.2xl` (64px)

## 24. Layout System
The UI utilizes CSS Grid for rigid dashboards and Flexbox for linear navigation bars and card alignments.

## 25. Grid System
Standard 12-column liquid grid for the main viewing area.

## 26. Container Strategy
The main application area (`MainContent`) maximizes fluid width inside the sidebar bounded area, establishing max-widths (`max-w-7xl`) for legibility on extremely ultrawide monitors.

## 27. Responsive Breakpoints
- `sm`: 640px (Mobile Landscape)
- `md`: 768px (Tablet)
- `lg`: 1024px (Desktop Laptop)
- `xl`: 1280px (Widescreen)

## 28. Desktop Product Experience
Multi-column dashboards, persistent left-side navigation (`w-64`), prominent top search bar, complex high-density datatables that support horizontal scrolling if column counts expand.

## 29. Tablet Product Experience
Sidebar collapses into an icon-only strip (`w-16`). Dashboard grids collapse from 4 columns to 2.

## 30. Mobile Product Experience
Navigation moves to a Bottom Tab Bar or Hamburger menu. Data tables are transformed into stacked responsive Cards. Hover interactions are replaced by explicit tap targets.

## 31. Navigation Architecture
Provides instant global context. Sidebar for primary routing; Topbar for contextual actions / search / settings / profile.

## 32. Sidebar
Houses the absolute core pillars: Dashboard, Trades, Analytics, AI Coach.

## 33. Top Navigation
Contains the omni-search bar, system health indicators, notification bell (unresolved alerts), and the User/Billing Profile hook.

## 34. Page Header
Every route must have a standard Header (e.g., `<H1>Trade Journal</H1>`) aligned precisely with secondary breadcrumbs or export actions.

## 35. Breadcrumbs
Format: `Trades / TSLA #248 / Edit`. Used strictly on nested views to ensure lateral escape routes.

## 36. Product Workspace Model
Tradelense is an operational sandbox. Popovers and Modals retain context without forcing heavy full-page reloads.

## 37. Dashboard UX
A command center, not a marketing page. It must surface the absolute truth of current performance immediately.

## 38. Dashboard Information Hierarchy
1. Immediate Account Health (P&L, Win Rate).
2. Equity Curve over the last 30 Days.
3. Active AI / Behavioral Insights flagged for review.
4. Recent Trading Activity string.

## 39. Dashboard Metric Cards
Cards must hold a Title, value formatted in `JetBrains Mono`, an up/down percent-change delta relative to a defined timeline, and an optional mini-sparkline chart.

## 40. Dashboard Charts
Rely heavily on minimalist borders, gridless plotting areas, and explicit axis labeling. Colors correspond to the `financial.*` tokens (Green for upward equity, Red if drawdown dominates).

## 41. Equity / P&L Visualization
Must plot chronologically. Tooltips must be snappy (sub 50ms render) to display exact metrics at each node.

## 42. Behavioral Visualization
Spider/radar charts or stacked bars depicting the correlation between Tags (e.g., 'FOMO') and Net P&L. 

## 43. Trade Journal UX
The authoritative source of record. High density. Rapid sorting.

## 44. Trade Table
Designed efficiently to display maximum rows. Uses sticky headers. Strict column alignments (Right-align pure numbers, Left-align strings, Center badges).

## 45. Trade Detail
A 2-column spatial architecture. Left column: Context (Screenshot, Tags, Execution logic, AI Coach readout). Right column: Hard Data (Entry, Exit, Size, P&L, Dates). 

## 46. Trade Creation
Form structure focuses on the fastest path to entry. Required fields prominently marked. Optional fields collapsed progressively.

## 47. Trade Editing
Distinct visual state changes via input borders reflecting `focus-within`. Validates real-time before allowing database `PUT`.

## 48. Trade Deletion
Mandates a dangerous-action modal ("Are you sure? This removes calculation weight from your analytics."). Uses strict Red/Danger primary button.

## 49. Trade Screenshot Presentation
Images load inside a bounded aspect-ratio container with a slick loading skeleton. Click-to-expand into a fullscreen theater mode for detailed chart inspection.

## 50. AI Trade Scan UX
The most critical workflow ensuring AI Trust.

## 51. Screenshot Upload
Drag-and-drop zone with MIME and size validation before payload dispatch.

## 52. AI Processing State
Communicates state (e.g., "Extracting symbols...", "Interpreting risk..."). Bounding box pulse animations used intentionally.

## 53. AI Extraction Review
Crucial: The UI stops here. Extracted data is presented side-by-side with the screenshot in editable fields.

## 54. AI-Extracted Data Presentation
Fields populated by the AI are wrapped in a subtle Purple `color.accent.secondary` border. 

## 55. User-Entered Data Presentation
Standard boundaries (`color.border.subtle`). User overrides immediately drop the purple AI styling, adopting standard styling to reflect human authority.

## 56. System-Derived Data Presentation
Calculated fields (Gross P&L derived from Entry/Exit) are locked inputs visually communicating their derived nature.

## 57. AI Confidence Presentation
If the API returns less than 95% confidence on a specific parsed field, the UI flags it with a Warning icon prompting explicit human check. Fake generic confidence (e.g., arbitrary 99%) is banned.

## 58. AI Failure UX
Truthful. Replaces processing spinner with a neutral state: "Screenshot illegible or format unrecognized. Please complete manually."

## 59. Manual Entry Recovery
Smooth fallback dropping immediately into the standard, non-AI trade creation form workflow.

## 60. AI Coach UX
Chat-like interface but restricted strictly to Trading context. Uses Markdown formatting for financial numbers.

## 61. Behavioral Intelligence UX
Exposed specifically as actionable summaries, separated visually from pure computational metric cards to avoid confusing math with ML suggestions.

## 62. Analytics UX
Deep dive interface allowing arbitrary slicing of trade logic.

## 63. Analytics Filters
Sticky top-bar filtering. Filters compound logically. 

## 64. Search
Debounced 300ms omnisearch handling UUIDs or Symbols.

## 65. Sorting
Chevrons on table headers denoting active column and Active ASC/DESC direction.

## 66. Pagination
Standard Footer (10/50/100 rows per page) rather than infinite scroll, ensuring predictable footer access.

## 67. Empty States
Must be actionable. (e.g. "You haven't logged any setups yet." -> [Add Trade Button]). Must not look broken.

## 68. Loading States
Prevent layout shifts (CLS). Retain structural containers while data fetches.

## 69. Skeleton States
Prefer pulse-animated structural blocks matching the exact dimensions of final metric cards over generic spinning wheels. 

## 70. Error States
Inline Red text. In-context boundary fallbacks. Never crash the global app because a single chart failed to render.

## 71. Success States
Brief, transient green confirmation toasts confirming DB transactions.

## 72. Partial Data States
Used when analyzing e.g., Win Rate while Stop Loss details are missing. Calculations proceed where possible, flagging omissions.

## 73. Toasts
Used for transient `< 4s` non-blocking confirmations (e.g., "Trade #113 Saved"). Placed fixed Bottom-Right.

## 74. Notifications
Persistent actionable items living inside the Top Nav Bell icon (e.g., "Card Expiring soon").

## 75. Modal System
Frosted glass underlay. Focus immediately trapped inside the modal to support Esc-to-close keyboard UX.

## 76. Drawer System
For deep filtering menus, sliding from the right edge, covering standard application views selectively.

## 77. Tooltip System
Provides exact value (e.g., `$402.14`) upon hovering over obfuscated visual chart nodes. Zero delay logic to feel snappy.

## 78. Dropdown System
High z-index (`z-50`). Distinct hover states over list items.

## 79. Form System
Stacked labels. Inputs take `w-full`. Strict hierarchical structure preventing field jumping.

## 80. Input Fields
Background `#131316`. Border 1px White/10. Focus ring Cyan/40.

## 81. Select Controls
Custom UI mirroring dark mode terminal aesthetic. Native browser selects avoided due to uncontrollable styling.

## 82. Date Controls
Calendar pickers restricted strictly to user-configured timezone logic.

## 83. Toggle Controls
Used for instant-effect preferences (e.g., "Hide Balance", "Switch exact P&L to % R-Multiple"). 

## 84. Button System
Consistent paddings. Clear primary / secondary / danger hierarchies.

## 85. Button Hierarchy
- **Primary:** Background Cyan, Text Black, intense hover glow. Used solely for the primary objective of a page.
- **Secondary:** Background Transparent, Border White/20. Hover background White/5. Used for cancellations / basic nav.
- **Danger:** Background Transparent, Border Red/40, Text Red. 

## 86. Cards
Containers establishing content blocks. 1px outer stroke, translucent fill. Rounded `lg`.

## 87. Tables
Striped visually using subtle background shifts on even rows (`bg-white/[0.02]`) to aid eye tracking.

## 88. Badges
Small inline labels. 

## 89. Tags
User-generated strings (e.g., #FOMO). Rendered in Monospace, padded, rounded-full.

## 90. Status Indicators
Small pulsing dots next to texts indicating live states (e.g., `pulse-emerald` = Subscription Active).

## 91. AI Indicators
Purple spark icon next to any component explicitly powered by the Gemini orchestration pipeline.

## 92. Free Plan UX
Clean operational software. Advanced items are visible but adorned with a padlock and subtle overlay explaining Pro utility without being disruptive/intrusive.

## 93. Pro Plan UX
Pads unlocked features cleanly. Removes usage barriers (AI Quota limits hit 100/100).

## 94. Usage Limit UX
A subtle visual bar near AI features. Approaching 90% triggers a yellow warning state. 100% disables AI input elements entirely with a prompt to upgrade.

## 95. Upgrade UX
Honest checkout modal clearly detailing exact commercial thresholds, avoiding flashing deceptive countdown timers (dark patterns strictly banned).

## 96. Pricing UX
Clear comparison tables (Monthly vs Annual). Honest toggle states mapping exact values.

## 97. Subscription UX
Settings panel section cleanly mapping Current Tier, Renewal Date, and Payment Method linkage.

## 98. Billing UX
Integration with Stripe Customer Portal. Does not build raw credit card rendering forms internally.

## 99. Payment Failure UX
A global red warning banner placed beneath the Top Nav explicitly detailing grace period timing before downgrading.

## 100. Account Settings UX
A vertical tab navigation containing Profile, Preferences, Security, Billing, and Data Export.

## 101. Export UX
Progress bars detailing async compilation of heavy CSV files to prevent user-perceived hangs.

## 102. Authentication UX
Sleek, heavily focused central widget. No distractions. Clean layout, immediate validation.

## 103. Onboarding UX
Guides the user immediately to complete their first Trade Journal entry either manually or via AI Scan, demonstrating core value instantly.

## 104. Accessibility
Required. Startup products do not ignore ADA standards. 

## 105. Keyboard Navigation
Every button, input, tab, and link must be accessible via the `TAB` key sequentially.

## 106. Focus States
Standard browser focus rings are overridden with uniform branded `ring-brand-cyan/50` to ensure visibility globally over dark canvases.

## 107. Screen Reader Considerations
Usage of `aria-label` heavily enforced inside Icon-Only components (e.g., Delete trashcans). 

## 108. Color Contrast
All `color.text.muted` strings must retain a minimum 4.5:1 WCAG contrast ratio over their deep black backgrounds.

## 109. Reduced Motion
System honors `@media (prefers-reduced-motion: reduce)`. Decorative `.laser-line` scans and heavy modaling transitions must fall back to instant display.

## 110. Touch Targets
Mobile/Tablet target spacing minimum 44x44px. 

## 111. Animation Philosophy
Motion must indicate state. It should never solely entertain.

## 112. Motion System
Using Framer Motion or CSS transitions. Strict usage of easing curves (`ease-out`) rather than linear timings.

## 113. Micro-interactions
Buttons scaling to `0.98` on `:active`. Subtle opacity shifts on hover. Fast `150ms` timings.

## 114. Motion Do's and Don'ts
**Do:** Animate skeleton loaders fading out.
**Don't:** Animate charts bouncing heavily into view every route change.

## 115. Data Density
Traders require density. Do not utilize excessive whitespace commonly found in consumer landing pages at the expense of table rows visible above the fold. 

## 116. Information Hierarchy
1. Money (PNL, R:R). 2. Logic (Symbol, Side, Setup). 3. Context (Dates, Durations, Screenshots).

## 117. Financial Trust Signals
Values match standard accounting paradigms (Commas, uniform precision). 

## 118. AI Trust Signals
Purple border around machine assumptions. Mandatory human verification buttons locking persistence paths.

## 119. Privacy UX
App automatically masks sensitive balances visually (Eye-slash icon) if navigating environments requiring screen-sharing (Coaching streaming).

## 120. Security UX
Automatic session timeout workflows fading to a locked authorization screen.

## 121. Error Messaging
"The trade screenshot could not be parsed" vs "Oops! Something broke!" Provide context.

## 122. Copy Guidelines
Capitalization is sentence-case internally for action buttons. Labels are Title Case. 

## 123. Product Voice
Sophisticated, analytical, confident.

## 124. AI Copy Guidelines
"Based on your setup history..." (Evidence-based). Not "I think you should buy..." (Financial Advice ban).

## 125. Financial Copy Guidelines
Stick accurately to standardized terminology (`Stop Loss`, not `Loss Stopper`).

## 126. Empty Dataset Messaging
Educational fallback text explaining *why* the dataset is empty ("Add tags to your setups to unlock this chart.").

## 127. Analytics Messaging
Tooltips heavily explaining complex heuristics (e.g., "Expectancy: The average mathematical edge per trade").

## 128. Free vs Pro Messaging
"Included in Pro" vs "You can't do this." Focus on unlocked value over restriction.

## 129. Entitlement Messaging
Syncs directly with backend error handling to spawn cohesive client modals.

## 130. Responsive Component Rules
Standard tables automatically morph into vertically stacked block-cards on `<768px` breakpoints.

## 131. Component Consistency
Buttons look like buttons. Links look like links. 

## 132. Design Tokens
Will map to Tailwind config dynamically. 

## 133. Component States
Static, Hover, Focus, Disabled, Error, Loading. Every component must address all six.

## 134. Component Variants
Outline, Text, Ghost, Fill. 

## 135. UI Architecture Relationship
CSS strictly segmented into the React component module pattern or unified precisely in `index.css` `@layer components`. Hard-coded style strings in JSX are banned. 

## 136. UX Architecture Relationship
Supports Document 03 User Flows directly.

## 137. API / Loading Relationship
Skeleton loaders explicitly tied to React Query or SWR `isLoading` booleans deriving off Document 10 architectures.

## 138. AI UX Relationship
Tied rigorously to the Document 07 definition of human-in-the-loop isolation fields.

## 139. Analytics UX Relationship
Ensures Document 11 algorithms are surfaced beautifully, yet identically precisely calculated.

## 140. Billing UX Relationship
Maps purely to the state machinery derived from Document 09 Webhook structures.

## 141. Security UX Relationship
Maps UI to Document 08 isolation rules (hashing, route boundaries). 

## 142. Performance
SVGs heavily preferred over PNGs for internal icons. Lazy loading implemented on heavy chart libraries (Recharts/Chart.js).

## 143. UI Failure Modes
If Tailwind fails to inject or compile, HTML structure semantic hierarchies remain readable natively.

## 144. UX Failure Modes
Dead-ends are prevented with global Error Boundaries returning to Dashboard.

## 145. Usability Testing
Core workflows (Scan -> Upload -> Review -> Save) subjected to strict click-tracking reduction. 

## 146. Visual Regression Testing
*OPEN TECHNICAL DECISION* (Cypress vs Playwright component testing frameworks strategy).

## 147. Accessibility Testing
Required Lighthouse score targeting `>95` Accessibility rating.

## 148. Performance Testing
Lighthouse tracking focusing heavily on Time-to-Interactive on heavy journal lists.

## 149. Design System Decision Records
- **ADR-UX-001 (Color Semanticism):** No hex strings in components, strictly mapping to semantic Tailwind config variables.
- **ADR-UX-002 (Terminal Aesthetics):** Strict adherence to `JetBrains Mono` for all tabular/financial digits.
- **ADR-UX-003 (AI Ringfencing):** Machine-inferred data must be purple bordered and editable before Database `POST`.

## 150. Open Design Decisions
- Specific Chart engine layer (Recharts vs Lightweight Charts implementation).
- Exact framework for UI testing strategies natively. 
- Deep configuration logic for dynamic `prefers-reduced-motion` tailwind mapping.

## 151. UI/UX Acceptance Criteria
- [x] Base visual language explicitly defined.
- [x] Grid, Typography, and Motion principles laid out.
- [x] Boundary between human UI and AI UX forcefully articulated to protect systemic trust.
- [x] Accessible, performant, and Startup-Grade tenets instituted strictly.

## 152. Document Governance
- **Owner:** UI/UX Engineering Lead. All future UI components must be vetted against this specification to prevent drift into fragmented visual implementations over time.
