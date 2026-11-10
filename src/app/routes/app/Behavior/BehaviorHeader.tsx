import React from 'react';
import { Calendar, Filter, Sparkles, RefreshCw, ChevronDown } from 'lucide-react';

interface Props {
    showPreview: boolean;
    togglePreview: () => void;
    hasRealTrades: boolean;
    tradeCount?: number;
    selectedDateRange: string;
    onDateRangeChange: (range: string) => void;
}

export function BehaviorHeader({
    showPreview,
    togglePreview,
    hasRealTrades,
    tradeCount = 0,
    selectedDateRange,
    onDateRangeChange,
}: Props) {
    const badgeLabel = showPreview
        ? 'Demo Preview Mode (58 Trades)'
        : hasRealTrades
            ? `${tradeCount} Trades Evaluated`
            : '0 Trades Evaluated';

    return (
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
            {/* Title + Subtitle */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="font-display text-[28px] lg:text-[32px] font-bold text-[#F3F3F5] tracking-tight leading-tight">
                        Behavioral Intelligence
                    </h1>
                    <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-[#1C1A2E] text-[#C4B5FD] border border-[#3E3269]/60 font-medium whitespace-nowrap flex items-center gap-1.5">
                        {showPreview && <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse" />}
                        {badgeLabel}
                    </span>
                    {showPreview && (
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 font-semibold tracking-wide">
                            SIMULATED METRICS
                        </span>
                    )}
                </div>
                <p className="font-body text-[13px] text-[#9999A2] leading-snug">
                    Understand the habits, decisions and emotional patterns behind your trading performance.
                </p>
            </div>

            {/* Controls Row */}
            <div className="flex flex-wrap items-center gap-2">
                {/* Date range filter dropdown simulated button */}
                <div className="relative group inline-flex items-center gap-2 h-9 bg-[#151518] border border-[#202126] rounded-lg px-3 text-[#F3F3F5] hover:bg-[#1C1C22] transition-colors cursor-pointer select-none">
                    <Calendar className="w-3.5 h-3.5 text-[#9999A2]" />
                    <span className="font-body text-[13px] font-medium whitespace-nowrap">
                        {selectedDateRange}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#9999A2] group-hover:translate-y-0.5 transition-transform" />
                </div>

                {/* Session Filter */}
                <div className="relative group inline-flex items-center gap-2 h-9 bg-[#151518] border border-[#202126] rounded-lg px-3 text-[#F3F3F5] hover:bg-[#1C1C22] transition-colors cursor-pointer select-none">
                    <Filter className="w-3.5 h-3.5 text-[#9999A2]" />
                    <span className="font-body text-[13px] font-medium whitespace-nowrap">
                        All Sessions
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#9999A2] group-hover:translate-y-0.5 transition-transform" />
                </div>

                {/* Preview Mode Toggle */}
                <button
                    className={`inline-flex items-center gap-2 h-9 px-3 rounded-lg text-[13px] font-mono cursor-pointer select-none transition-all active:scale-95 border ${
                        showPreview
                            ? 'bg-[#1F1935] text-[#C4B5FD] border-[#6D5CE7]/60 shadow-[0_0_15px_rgba(109,92,231,0.2)]'
                            : 'bg-[#151518] text-[#9999A2] border-[#202126] hover:text-[#F3F3F5] hover:bg-[#1C1C22]'
                    }`}
                    onClick={togglePreview}
                    type="button"
                    aria-pressed={showPreview}
                    title="Toggle simulated preview data"
                >
                    <Sparkles className={`w-3.5 h-3.5 ${showPreview ? 'text-[#8B5CF6] animate-pulse' : 'text-[#9999A2]'}`} />
                    <span className="font-medium whitespace-nowrap">
                        {showPreview ? 'Demo Preview Active' : 'Explore Preview'}
                    </span>
                    <RefreshCw className="w-3 h-3 text-[#7070A0]" />
                </button>
            </div>
        </header>
    );
}

