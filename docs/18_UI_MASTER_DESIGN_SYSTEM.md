# UI-01: MASTER DESIGN SYSTEM
> Tradelense V2 — "Your AI Trading Journal OS"

## A. Product Visual Philosophy
Tradelense V2 is a startup-grade commercial SaaS utilizing a modern "fintech/trading-terminal" aesthetic. It prioritizes information density, precision, and performance. The UI must feel authoritative, secure, and technologically advanced while maintaining usability. It is **not** a generic dashboard, and it is **not** a playful consumer app.

## B. Design Principles
1. **Precision & Clarity**: Financial metrics and trade data must be instantly readable. Avoid visual clutter around critical numbers.
2. **Terminal Edge**: Emulate the focused, dark environment of professional trading software, balanced with modern web aesthetics (subtle glass, smooth motion).
3. **Restrained Flourish**: Use vibrant neon accents (Cyan, Purple, Emerald) strictly for status, telemetry, and AI interaction. Backgrounds remain deep and near-black.
4. **Hierarchical Dense Data**: Authenticated screens should maximize screen real estate to show trade grids, insights, and charts efficiently.

## C. Color System
The foundational palette is rooted in dark mode with high-contrast neon accents.

**Backgrounds**
- `app-background`: `#000000` (Pure Black)
- `surface`: `#0d0d0f`
- `elevated-surface`: `rgba(20, 20, 22, 0.8)` (`.glass-panel`)
- `overlay`: `rgba(0, 0, 0, 0.8)`

**Brand Accents**
- `brand-cyan`: `#00dbe7` (Primary Accent, Actions, Focus)
- `brand-purple`: `#ebb2ff` (Secondary Accent, AI Insights)
- `brand-emerald`: `#00e383` (Profit, Success, Ascending)

**Text**
- `text-primary`: `#ffffff`
- `text-secondary`: `#e5e2e1`
- `text-muted`: `#849495`, `#b9cacb`
- `text-disabled`: `rgba(255, 255, 255, 0.4)`
- `text-inverse`: `#002022` (Used on solid Cyan backgrounds)

## D. Typography System
Fonts:
- Sans (Primary UI): `Inter`
- Display (Marketing/Headers): `Hanken Grotesk`
- Mono (Financial/Technical): `JetBrains Mono`

**Hierarchy**
- Display: 8xl to 5xl (`font-display font-bold`)
- Page Title: `text-2xl` to `text-3xl` (`font-display`)
- Section Title: `text-lg` to `text-xl`
- Card Title: `text-sm font-semibold uppercase tracking-wider`
- Body: `text-sm` (`font-sans text-[#b9cacb]`)
- Caption: `text-xs`
- Financial/Metric: `font-mono tracking-tight font-bold text-white`

## E. Spacing System
Standard 4px grid (Tailwind defaults).
- Dense Data Tables: `p-2` / `gap-2`
- Card Padding: `p-6` or `p-8`
- Section Gaps: `gap-6` or `gap-8`
- App Layout Shell Pacing: `px-4 lg:px-8`

## F. Border / Radius System
- Default Radius (Cards, Buttons): `rounded-lg` (`8px`)
- Soft Radius (Larger Sections): `rounded-xl` (`12px`)
- Sharp Radius (Data Cells): `rounded-sm` or `rounded-none`
- Borders: `border-white/5` or `border-white/10` (Subtle)
- Focus Borders: `border-brand-cyan/40`

## G. Surface / Elevation System
Rely on borders and subtle blurred backgrounds (`backdrop-blur-3xl`), avoid heavy drop shadows in standard mode.
- Base: `bg-black`
- Glass Cards: `.glass-fill` (`bg: rgba(14, 14, 16, 0.7)`, `blur(20px)`, `inset shadow`)
- Hover Elevations: Use cyan/purple glow `shadow-[0_0_15px_rgba(0,219,231,0.15)]`

## H. Iconography
- Library: `lucide-react`
- Line weight: Standard (2px)
- Usage: Minimal, generally `w-4 h-4` or `w-5 h-5` accompanied by `text-muted` or accent colors for active states.

## I. Motion
- Restrained, short durations (`duration-200` to `duration-300`).
- Subtle hover scales: `active:scale-95` on interactive elements.
- Decorative loops (like `.laser-line` or pulse dots) reserved for AI or Live data telemetry.
- No heavy physics staggering in authenticated app.

## J. Buttons
- **Primary**: Solid Cyan `bg-brand-cyan`, Text Inverse, glowing box-shadow on hover.
- **Secondary**: Glass `bg-white/5 border border-white/10 text-white`.
- **Tertiary/Ghost**: Transparent with hover `bg-white/[0.04] text-muted hover:text-white`.
- **Upgrade**: Emerald or Purple gradient/glow.

## K. Inputs
- Background: `bg-[#131316]` or `bg-white/5`
- Border: `border-white/10`, focus uses `ring-1 ring-brand-cyan`
- Text: `text-white`, placeholder `#849495`
- Radius: `rounded-lg` (rounded-full for global search)

## L / M. Selects & Tabs
- Avoid native selects if possible; use styled dropdowns matching input appearance.
- Tabs should use an underline `border-brand-cyan` or segmented control style using `bg-white/5` and `bg-white/15` for active state.

## N / P / Q. Cards (Metric & Trade)
- `.glass-fill` classes preferred.
- Top-label metrics: small uppercase tracking-wide label, large mono value.
- Trade Cards: Emphasize Profit (Emerald) vs Loss (Red/Warning) clearly using text color and side-borders (`border-l-4`).

## R. Charts
- Grid lines must be subtle (`white/5`).
- Chart paths use neon variants. Fill under chart uses gradient fades.

## S / T / U / V. Alerts, Badges & Overlays
- Badges: `bg-accent/10 border-accent/20 text-accent` with deep tracking (`tracking-widest`).
- Modals: Dark overlay (`bg-black/80 backdrop-blur-sm`). Use `glass-panel` for modal surface.
- Drawers: Slide from right, same styling as Sidebar.
- Toasts: Bottom-right, dark surface with left border indicating status.

## W / X. Tooltips & Drop Zones
- Tooltips: `bg-[#252529] text-xs px-2 py-1`.
- Upload Zones: Dashed border `border-white/10` with hover state `.ambient-glow`. 

## Y. AI States
- Idle: Ghost icon.
- Processing: `.laser-line` scan animation or `animate-pulse` of Purple/Cyan mix.
- Verified/Confirmed: Emerald tint or checkmark.
- Warning/Review: Amber/Red highlights.

## Z / AA / AB. States (Loading, Empty, Error)
- Loading: Use skeletal loading using `bg-white/5 animate-pulse` or a subtle spinner `Loader2`.
- Empty: Display muted icon in `bg-white/5` block with soft text. Do not overdesign.
- Error: Restrained red `bg-red-500/10 border-red-500/20 text-red-200`.

## AC. Responsive Behavior
- Mobile: Sidebar becomes hamburger drawer. Layout transitions to 1-column. Data tables shift to stacked card view.
- Desktop: Sidebar fixed 260px (`w-64`), horizontal header metrics.

## AD. Accessibility
- Maintain minimum contrast ratios, especially on placeholders vs inputs.
- Required: `focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-cyan` on interactive elements.
- Semantic HTML tags (main, nav, aside) mandatory.

## AE / AF. Commercial & Billing UI
- Free: "Standard" label in muted tones.
- Pro: Emphasize with Purple / Emerald gradients or glows. Do not use abusive dark patterns. Show explicit quotas and limits smoothly.
- Unlock/Upgrade UI: Clearly itemize features.

## AG. AI Trust & Truth Conventions
- Distinct visual separation between explicit user data and derived AI insight.
- Do NOT fabricate statistical confidence. 
- Use "Review Required" for unverified AI extractions.

---

# Existing UI Migration Strategy

1. **KEEP**: 
    - `index.css` global utilities (`.glass-fill`, `.laser-line`) 
    - The core color palette (Cyan/Purple/Emerald accents on Black).
    - `Sidebar` (Great styling, clear navigation logic).
    - `LandingView` aesthetics (Strong 3D grid, cinematic feel).
    - Main `AppLayout` wrapper.
2. **REFINE**:
    - `Navbar.tsx`: Ensure mobile responsiveness and align search bar logic.
    - Forms in Auth (`Login.tsx`, etc.): Ensure error states and validation align with standard spacing.
3. **REBUILD**:
    - Existing Dashboard/Journal placeholders to implement final bento-style components.
4. **REMOVE**:
    - Extraneous prototyping pages or inline styles that hardcode colors instead of using `text-brand-*`.
