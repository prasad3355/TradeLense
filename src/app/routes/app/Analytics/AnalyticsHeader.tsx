import React from 'react';

interface Props {
    showPreview: boolean;
    togglePreview: () => void;
    hasRealTrades: boolean;
    tradeCount?: number;
}

export function AnalyticsHeader({ showPreview, togglePreview, hasRealTrades, tradeCount }: Props) {
    const badgeLabel = showPreview
        ? '65 Closed Trades'
        : hasRealTrades
            ? `${tradeCount ?? ''} Trades`
            : '0 Trades';

    return (
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
            {/* Title + sub-description */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="font-display text-[28px] lg:text-[32px] font-bold text-[#F3F3F5] tracking-tight leading-tight">
                        Analytics
                    </h1>
                    <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-[#1C1A2E] text-[#C4B5FD] border border-[#3E3269]/50 font-medium whitespace-nowrap">
                        {badgeLabel}
                    </span>
                </div>
                <p className="font-body text-[13px] text-[#9999A2] leading-snug">
                    Performance intelligence across your trading history.
                </p>
            </div>

            {/* Filters + toggle row */}
            <div className="flex flex-wrap items-center gap-2">
                {/* Date filter */}
                <div className="inline-flex items-center gap-1.5 h-9 bg-[#151518] border border-[#202126] rounded-lg px-3 text-[#F3F3F5] hover:bg-[#1C1C22] transition-colors cursor-pointer group select-none">
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#9999A2', fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>
                        calendar_today
                    </span>
                    <span className="font-body text-[13px] font-medium whitespace-nowrap">June 2024</span>
                    <span className="material-symbols-outlined group-hover:translate-y-0.5 transition-transform" style={{ fontSize: 15, color: '#9999A2', fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>
                        expand_more
                    </span>
                </div>

                {/* Instrument filter */}
                <div className="inline-flex items-center gap-1.5 h-9 bg-[#151518] border border-[#202126] rounded-lg px-3 text-[#F3F3F5] hover:bg-[#1C1C22] transition-colors cursor-pointer group select-none">
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#9999A2', fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>
                        candlestick_chart
                    </span>
                    <span className="font-body text-[13px] font-medium whitespace-nowrap">All Instruments</span>
                    <span className="material-symbols-outlined group-hover:translate-y-0.5 transition-transform" style={{ fontSize: 15, color: '#9999A2', fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>
                        expand_more
                    </span>
                </div>

                {/* Session filter */}
                <div className="inline-flex items-center gap-1.5 h-9 bg-[#151518] border border-[#202126] rounded-lg px-3 text-[#F3F3F5] hover:bg-[#1C1C22] transition-colors cursor-pointer group select-none">
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#9999A2', fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>
                        schedule
                    </span>
                    <span className="font-body text-[13px] font-medium whitespace-nowrap">All Sessions</span>
                    <span className="material-symbols-outlined group-hover:translate-y-0.5 transition-transform" style={{ fontSize: 15, color: '#9999A2', fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>
                        expand_more
                    </span>
                </div>

                {/* Preview mode toggle — only visible when no real trades */}
                {!hasRealTrades && (
                    <button
                        className="inline-flex items-center gap-2 h-9 bg-[#1A1A22] border border-[#282834] px-3 rounded-lg text-[#C4B5FD] hover:bg-[#20202C] active:scale-95 transition-all text-[13px] font-mono cursor-pointer select-none"
                        onClick={togglePreview}
                        type="button"
                        aria-pressed={showPreview}
                    >
                        {showPreview && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse flex-shrink-0" />
                        )}
                        <span className="font-medium whitespace-nowrap">
                            {showPreview ? 'Zero State Active' : 'Explore Preview'}
                        </span>
                        <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#9999A2', fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20" }}>
                            sync_alt
                        </span>
                    </button>
                )}
            </div>
        </header>
    );
}
