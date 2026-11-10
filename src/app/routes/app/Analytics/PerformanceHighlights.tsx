import React from 'react';

export function PerformanceHighlights() {
    return (
        <section className="flex flex-col bg-[#141416] border border-[#202126] rounded-xl p-7 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-2 border-b border-[#1E1F24]">
                <div>
                    <h3 className="font-display text-[18px] font-bold text-[#F3F3F5] tracking-tight">PERFORMANCE HIGHLIGHTS</h3>
                    <p className="font-body text-[13px] text-[#9999A2] mt-0.5">Key qualitative insights derived from your analytical profile.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-[#091712] border border-[#10B981]/20">
                    <div className="mt-0.5 p-1.5 rounded-full bg-[#10B981]/20 text-[#10B981]">
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                    </div>
                    <div>
                        <h4 className="font-display text-[14px] text-[#10B981] font-semibold">Positive Asymmetry</h4>
                        <p className="font-body text-[12px] text-[#9999A2] mt-1 line-clamp-2">Your average win (+$114) outpaces your average loss (-$78) ensuring profitability regardless of micro-fluctuations in win rate.</p>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-[#141021] border border-[#8B5CF6]/20">
                    <div className="mt-0.5 p-1.5 rounded-full bg-[#8B5CF6]/20 text-[#A78BFA]">
                        <span className="material-symbols-outlined text-[18px]">schedule</span>
                    </div>
                    <div>
                        <h4 className="font-display text-[14px] text-[#A78BFA] font-semibold">London Dominance</h4>
                        <p className="font-body text-[12px] text-[#9999A2] mt-1 line-clamp-2">Trades initiated during the London session yield an exceptional 71% win rate, heavily skewing overall performance.</p>
                    </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-[#170E10] border border-[#EF4444]/20">
                    <div className="mt-0.5 p-1.5 rounded-full bg-[#EF4444]/20 text-[#EF4444]">
                        <span className="material-symbols-outlined text-[18px]">gpp_maybe</span>
                    </div>
                    <div>
                        <h4 className="font-display text-[14px] text-[#EF4444] font-semibold">Friday Decay</h4>
                        <p className="font-body text-[12px] text-[#9999A2] mt-1 line-clamp-2">Win rate drops to 50% on Fridays with a substantial volume decrease, identifying a potential vulnerability in late-week execution.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
