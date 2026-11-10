import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
    onExplorePreview: () => void;
}

export function AnalyticsEmptyState({ onExplorePreview }: Props) {
    const navigate = useNavigate();

    return (
        <div
            className="relative w-full rounded-2xl overflow-hidden flex flex-col items-center"
            style={{
                background: 'linear-gradient(160deg, #0E0E12 0%, #111118 60%, #0B0B10 100%)',
                border: '1px solid #1E1E28',
                minHeight: 480,
            }}
        >
            {/* Subtle dot-grid background */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none select-none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <defs>
                    <pattern id="analytics-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                        <circle cx="1" cy="1" r="0.8" fill="#2A2A38" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#analytics-grid)" />
            </svg>

            {/* Radial violet glow behind illustration */}
            <div
                className="absolute pointer-events-none"
                style={{
                    top: '8%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 420,
                    height: 300,
                    background: 'radial-gradient(ellipse at center, rgba(124,60,237,0.12) 0%, rgba(99,57,202,0.06) 45%, transparent 70%)',
                    borderRadius: '50%',
                }}
            />

            {/* Telemetry status bar — top */}
            <div className="relative z-10 w-full flex items-center justify-between px-5 pt-4 pb-1">
                <div className="flex items-center gap-4 font-mono text-[10px] text-[#3C3C50] uppercase tracking-widest select-none">
                    <span>LATENCY: 0.1ms</span>
                    <span className="text-[#28283A]">·</span>
                    <span>ENGINE: STANDBY</span>
                </div>
                <div className="flex items-center gap-4 font-mono text-[10px] text-[#3C3C50] uppercase tracking-widest select-none">
                    <span>TELEMETRY: DORMANT</span>
                    <span className="text-[#28283A]">·</span>
                    <span>STREAM: AWAITING_LOG</span>
                </div>
            </div>

            {/* Central illustration card */}
            <div className="relative z-10 flex flex-col items-center mt-4 mb-0 px-4">
                <div
                    className="relative"
                    style={{
                        width: 280,
                        height: 186,
                        background: 'linear-gradient(145deg, #16161F 0%, #111118 100%)',
                        border: '1px solid #252532',
                        borderRadius: 12,
                        overflow: 'hidden',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,60,237,0.08) inset',
                    }}
                >
                    {/* Faint horizontal grid inside card */}
                    <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
                        <defs>
                            <pattern id="card-hgrid" x="0" y="0" width="280" height="25" patternUnits="userSpaceOnUse">
                                <line x1="0" y1="24.5" x2="280" y2="24.5" stroke="#1E1E28" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#card-hgrid)" />
                    </svg>

                    {/* Card top bar */}
                    <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-2 border-b border-[#1E1E28] bg-[#111118]/80 backdrop-blur-sm z-10">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                            <span className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                            <span className="w-2 h-2 rounded-full bg-[#28C840]" />
                        </div>
                        <span className="font-mono text-[9px] text-[#3C3C50] uppercase tracking-widest">METRICS_MATRIX_V2</span>
                        <div />
                    </div>

                    {/* Chart area — SVG candlesticks + equity line */}
                    <svg
                        viewBox="0 0 260 130"
                        className="absolute bottom-0 left-2 right-2"
                        style={{ width: 'calc(100% - 16px)', height: 130 }}
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        {/* Faint background price bands */}
                        <rect x="0" y="0" width="260" height="130" fill="none" />

                        {/* Candlesticks — alternating bullish/bearish */}
                        {/* Candle 1 - bearish */}
                        <line x1="22" y1="30" x2="22" y2="90" stroke="#3a3a4a" strokeWidth="1" />
                        <rect x="17" y="42" width="10" height="32" rx="1.5" fill="#EF4444" opacity="0.75" />

                        {/* Candle 2 - bearish */}
                        <line x1="42" y1="38" x2="42" y2="92" stroke="#3a3a4a" strokeWidth="1" />
                        <rect x="37" y="50" width="10" height="26" rx="1.5" fill="#EF4444" opacity="0.65" />

                        {/* Candle 3 - bullish */}
                        <line x1="62" y1="55" x2="62" y2="105" stroke="#3a3a4a" strokeWidth="1" />
                        <rect x="57" y="65" width="10" height="28" rx="1.5" fill="#34D399" opacity="0.7" />

                        {/* Candle 4 - bullish */}
                        <line x1="82" y1="42" x2="82" y2="88" stroke="#3a3a4a" strokeWidth="1" />
                        <rect x="77" y="52" width="10" height="24" rx="1.5" fill="#34D399" opacity="0.8" />

                        {/* Candle 5 - bullish */}
                        <line x1="102" y1="32" x2="102" y2="76" stroke="#3a3a4a" strokeWidth="1" />
                        <rect x="97" y="40" width="10" height="25" rx="1.5" fill="#34D399" opacity="0.85" />

                        {/* Candle 6 - bearish */}
                        <line x1="122" y1="28" x2="122" y2="72" stroke="#3a3a4a" strokeWidth="1" />
                        <rect x="117" y="36" width="10" height="24" rx="1.5" fill="#EF4444" opacity="0.6" />

                        {/* Candle 7 - bullish */}
                        <line x1="142" y1="20" x2="142" y2="65" stroke="#3a3a4a" strokeWidth="1" />
                        <rect x="137" y="28" width="10" height="25" rx="1.5" fill="#34D399" opacity="0.9" />

                        {/* Candle 8 - bullish */}
                        <line x1="162" y1="14" x2="162" y2="55" stroke="#3a3a4a" strokeWidth="1" />
                        <rect x="157" y="22" width="10" height="22" rx="1.5" fill="#34D399" opacity="0.85" />

                        {/* Candle 9 - bearish small */}
                        <line x1="182" y1="18" x2="182" y2="50" stroke="#3a3a4a" strokeWidth="1" />
                        <rect x="177" y="24" width="10" height="18" rx="1.5" fill="#EF4444" opacity="0.55" />

                        {/* Candle 10 - bullish */}
                        <line x1="202" y1="10" x2="202" y2="44" stroke="#3a3a4a" strokeWidth="1" />
                        <rect x="197" y="16" width="10" height="20" rx="1.5" fill="#34D399" opacity="0.9" />

                        {/* Equity curve — dashed glow line from lower left to upper right */}
                        <defs>
                            <linearGradient id="eqGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
                                <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.9" />
                                <stop offset="100%" stopColor="#06B6D4" stopOpacity="1" />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="2" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <path
                            d="M 10 105 C 30 90, 45 82, 65 75 S 95 62, 115 52 S 145 30, 165 20 S 190 14, 215 10"
                            fill="none"
                            stroke="url(#eqGrad)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            filter="url(#glow)"
                        />
                        {/* Terminal dot on the curve */}
                        <circle cx="215" cy="10" r="4" fill="#8B5CF6" opacity="0.95" />
                        <circle cx="215" cy="10" r="7" fill="#8B5CF6" opacity="0.2" />

                        {/* Highlighted region box (like a trade zone) */}
                        <rect x="120" y="22" width="55" height="38" rx="4" fill="#8B5CF6" opacity="0.06" stroke="#8B5CF6" strokeWidth="0.5" strokeOpacity="0.25" />
                    </svg>
                </div>

                {/* Floating status chips around the illustration */}
                <div className="relative w-full flex items-center justify-end mt-2 pr-2">
                    <span
                        className="font-mono text-[9px] uppercase tracking-widest select-none"
                        style={{ color: '#8B5CF6', opacity: 0.85 }}
                    >
                        ● AWAITING TRADES
                    </span>
                </div>
            </div>

            {/* Standby mode badge */}
            <div className="relative z-10 mt-3 flex items-center gap-2 px-3 py-1 rounded-full border border-[#2A2A3A] bg-[#14141C]/80 select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] opacity-60 animate-pulse" />
                <span className="font-mono text-[10px] text-[#7070A0] uppercase tracking-widest">STANDBY MODE</span>
            </div>

            {/* Heading */}
            <h2
                className="relative z-10 mt-5 font-display font-bold text-[#F0F0F6] tracking-widest uppercase text-center px-4"
                style={{ fontSize: 'clamp(18px, 4vw, 26px)', letterSpacing: '0.12em' }}
            >
                YOUR ANALYTICS AWAITS
            </h2>

            {/* Description */}
            <p className="relative z-10 mt-3 font-body text-[13px] text-[#9999A2] text-center max-w-[420px] leading-relaxed px-6">
                Start recording trades and Tradelense will automatically construct execution curves, distribution profiles, and performance metrics.
            </p>

            {/* CTAs */}
            <div className="relative z-10 mt-7 mb-10 flex flex-wrap items-center justify-center gap-3">
                <button
                    onClick={() => navigate('/app/journal')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-[13px] text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                        background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                        boxShadow: '0 4px 20px rgba(124,60,237,0.35)',
                    }}
                    type="button"
                >
                    <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 18, fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                    >
                        cloud_upload
                    </span>
                    <span>Upload First Trade</span>
                </button>

                <button
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[#E2E2EE] text-[13px] font-medium transition-all hover:scale-[1.02] active:scale-[0.98] select-none"
                    onClick={onExplorePreview}
                    type="button"
                    style={{
                        background: '#16161F',
                        border: '1px solid #262636',
                    }}
                >
                    <span>Explore Analytics Preview</span>
                    <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 18, fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}
                    >
                        arrow_forward
                    </span>
                </button>
            </div>

            {/* Bottom corner accent */}
            <div
                className="absolute bottom-0 right-0 pointer-events-none"
                style={{
                    width: 200,
                    height: 120,
                    background: 'radial-gradient(ellipse at bottom right, rgba(99,57,202,0.08) 0%, transparent 70%)',
                }}
            />
        </div>
    );
}
