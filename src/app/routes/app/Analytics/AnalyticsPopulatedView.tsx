import React from 'react';
import { PerformanceOverview } from './PerformanceOverview';
import { EquityPerformance } from './EquityPerformance';
import { TradeOutcomeDistribution } from './TradeOutcomeDistribution';
import { PerformanceByInstrument } from './PerformanceByInstrument';
import { DirectionPerformance } from './DirectionPerformance';
import { SessionPerformance } from './SessionPerformance';
import { DrawdownProfile } from './DrawdownProfile';
import { TradeQuality } from './TradeQuality';
import { TimeBasedPerformance } from './TimeBasedPerformance';
import { PerformanceHighlights } from './PerformanceHighlights';

interface Props {
    isPreview: boolean;
    trades: any;
    onExitPreview?: () => void;
}

// ─── Locked inner analytics content ──────────────────────────────────────────
// Approved production layout — never modify this tree.
function AnalyticsContent() {
    return (
        <div className="flex flex-col gap-8">
            <PerformanceOverview />

            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <EquityPerformance />
                <TradeOutcomeDistribution />
            </section>

            <PerformanceByInstrument />

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                <DirectionPerformance />
                <SessionPerformance />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                <DrawdownProfile />
                <TradeQuality />
            </section>

            <TimeBasedPerformance />

            <PerformanceHighlights />
        </div>
    );
}

// ─── Scoped preview styles ────────────────────────────────────────────────────
// All class names prefixed .aplp- to avoid collisions.
const PREVIEW_STYLES = `
/* Stage: break out of AppLayout's p-4/p-8 using negative margins so the
   preview fills the full content-area width (sidebar already excluded by lg:ml-64). */
.aplp-stage {
    /* Pull left/right to the edges of <main>'s padding box */
    margin-left:  calc(-1rem);        /* cancel p-4 */
    margin-right: calc(-1rem);
    /* ≥ lg: cancel p-8 */
    position: relative;
    background: #09090b;
    overflow: hidden;
    /* Subtle violet radial on the dark floor */
    background-image:
        radial-gradient(ellipse 70% 280px at 50% -60px, rgba(109,92,231,0.13) 0%, transparent 100%),
        radial-gradient(ellipse 50% 200px at 50% 100%, rgba(79,99,216,0.09) 0%, transparent 100%);
}

@media (min-width: 1024px) {
    .aplp-stage {
        margin-left:  calc(-2rem);    /* cancel lg:p-8 */
        margin-right: calc(-2rem);
    }
}

/* ── Compact hero ── */
.aplp-hero {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 10px;
    padding: 28px 24px 24px;
}
.aplp-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 3px 13px 3px 9px;
    border-radius: 999px;
    background: rgba(109,92,231,0.10);
    border: 1px solid rgba(109,92,231,0.30);
    color: rgba(196,170,255,0.88);
    font-family: 'JetBrains Mono','Courier New',monospace;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    user-select: none;
}
.aplp-badge-dot {
    flex-shrink: 0;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(139,92,246,0.85);
    animation: aplp-pulse 2.2s ease-in-out infinite;
}
@keyframes aplp-pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:.5; transform:scale(.8); }
}
.aplp-title {
    margin: 0;
    font-family: 'Hanken Grotesk','Inter',sans-serif;
    font-size: clamp(22px,3vw,34px);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.1;
    background: linear-gradient(135deg, #F3F3F5 0%, #C4B5FD 55%, #8B5CF6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
.aplp-subtitle {
    margin: 0;
    font-size: 13px;
    color: rgba(153,153,162,0.88);
    max-width: 500px;
    line-height: 1.55;
}
.aplp-exit-btn {
    margin-top: 4px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 14px;
    border-radius: 8px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.10);
    color: rgba(196,170,255,0.75);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
}
.aplp-exit-btn:hover {
    background: rgba(255,255,255,0.07);
    color: rgba(196,170,255,1);
}

/* ── Perspective viewport ── */
.aplp-viewport {
    position: relative;
    z-index: 3;
    padding: 0 20px 40px;          /* side gutter so shadow is visible */
    perspective: 1600px;
    perspective-origin: 50% 0%;
}
@media (min-width: 1024px) {
    .aplp-viewport { padding: 0 28px 48px; }
}

/* ── 3-D surface ── */
.aplp-surface {
    position: relative;
    /* Restrained tilt — readable at all sizes */
    transform: rotateX(3deg) scale(0.985);
    transform-origin: 50% 0%;
    transform-style: preserve-3d;
    border-radius: 12px;
    border: 1px solid rgba(109,92,231,0.28);
    box-shadow:
        0 0 0 1px rgba(109,92,231,0.10),
        0 6px 24px rgba(0,0,0,0.55),
        0 24px 64px rgba(0,0,0,0.45),
        0 0 60px  rgba(109,92,231,0.09);
    overflow: hidden;
    background: #09090b;
    transition: transform .45s cubic-bezier(.25,.46,.45,.94),
                box-shadow .45s ease;
}
.aplp-viewport:hover .aplp-surface {
    transform: rotateX(1deg) scale(0.99);
    box-shadow:
        0 0 0 1px rgba(109,92,231,0.15),
        0 10px 32px rgba(0,0,0,0.50),
        0 32px 72px rgba(0,0,0,0.40),
        0 0 80px  rgba(109,92,231,0.11);
}
/* Top-edge light shim */
.aplp-surface::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    pointer-events: none;
    z-index: 10;
    background: linear-gradient(180deg, rgba(255,255,255,0.045) 0%, transparent 5%);
}

/* ── Inner content ── */
.aplp-inner {
    padding: 24px 20px 20px;
}
@media (min-width: 1024px) {
    .aplp-inner { padding: 28px 28px 24px; }
}

/* ── Responsive: flatten on small screens ── */
@media (max-width: 767px) {
    .aplp-stage         { margin-left: -1rem; margin-right: -1rem; }
    .aplp-viewport      { padding: 0 10px 28px; perspective: none; }
    .aplp-surface       { transform: none !important; box-shadow: 0 4px 24px rgba(0,0,0,0.4); }
    .aplp-hero          { padding: 22px 16px 18px; }
    .aplp-inner         { padding: 16px 14px 14px; }
}

/* ── prefers-reduced-motion ── */
@media (prefers-reduced-motion: reduce) {
    .aplp-surface,
    .aplp-viewport:hover .aplp-surface { transform: none !important; transition: none !important; }
    .aplp-badge-dot                    { animation: none !important; }
}
`;

export function AnalyticsPopulatedView({ isPreview, trades, onExitPreview }: Props) {
    // ── Real-data path: return locked content grid directly, no wrapper ─────────
    if (!isPreview) {
        return <AnalyticsContent />;
    }

    // ── Preview path: 3-D product showcase ──────────────────────────────────────
    return (
        <>
            <style>{PREVIEW_STYLES}</style>

            <div className="aplp-stage">
                {/* Compact hero */}
                <div className="aplp-hero">
                    <span className="aplp-badge" aria-label="Interactive demo with sample data">
                        <span className="aplp-badge-dot" />
                        Interactive Demo · Sample Data
                    </span>
                    <h1 className="aplp-title">Analytics Preview</h1>
                    <p className="aplp-subtitle">
                        Explore how Tradelense turns your trading history into clear performance insights.
                    </p>
                    {onExitPreview && (
                        <button
                            className="aplp-exit-btn"
                            onClick={onExitPreview}
                            type="button"
                        >
                            ← Exit Preview
                        </button>
                    )}
                </div>

                {/* 3-D surface containing the locked Analytics grid */}
                <div className="aplp-viewport">
                    <div className="aplp-surface">
                        <div className="aplp-inner">
                            <AnalyticsContent />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
