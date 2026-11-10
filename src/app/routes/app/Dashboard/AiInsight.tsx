import React from 'react';

export function AiInsight({ isDemoMode }: { isDemoMode: boolean }) {
    return (
        <section className="bg-[#12101E] border border-violet-900/40 rounded-md p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg shadow-purple-950/10">
            <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-md bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400 shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z"></path>
                    </svg>
                </div>
                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold text-zinc-100 text-xs">Lens AI · Behavioral Intelligence Coach</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-mono">CYCLE AUDIT</span>
                    </div>
                    <p className="text-zinc-300 text-[11px] leading-relaxed max-w-4xl">
                        {isDemoMode ? (
                            <>
                                Your execution discipline is strongest (<span className="text-emerald-400 font-mono font-medium">91%</span>) during the New York Open. However, emotional revenge-trading tendencies spike after consecutive losses on Friday sessions. Adhering to your 15-minute cool-down protocol would have reduced max drawdown by <span className="text-emerald-400 font-mono font-medium">$680.00</span> this cycle.
                            </>
                        ) : (
                            'Connect your brokerage or upload trade data to allow Lens AI to detect behavioural biases, edge consistency, and tilt triggers.'
                        )}
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0 self-end md:self-center">
                {isDemoMode && (
                    <div className="hidden xl:flex items-center space-x-2 text-[10px] font-mono">
                        <span className="px-2 py-1 rounded bg-[#1A1629] text-zinc-400 border border-violet-900/30">Risk Discipline: <strong className="text-emerald-400">84%</strong></span>
                        <span className="px-2 py-1 rounded bg-[#1A1629] text-zinc-400 border border-violet-900/30">Rule Adherence: <strong className="text-violet-300">78%</strong></span>
                    </div>
                )}
                <button className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded text-[11px] font-medium transition-colors shadow-sm whitespace-nowrap">
                    Open Behavioral Audit →
                </button>
            </div>
        </section>
    );
}
