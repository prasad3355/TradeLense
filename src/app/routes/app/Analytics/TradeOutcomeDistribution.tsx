import React from 'react';

export function TradeOutcomeDistribution() {
    return (
        <div className="lg:col-span-5 flex flex-col bg-[#141416] border border-[#202126] rounded-xl p-7 lg:p-8 gap-6">
            <div>
                <h3 className="font-display text-[18px] font-bold text-[#F3F3F5] tracking-tight">TRADE OUTCOME DISTRIBUTION</h3>
                <p className="font-body text-[13px] text-[#9999A2] mt-0.5">Distribution of winning and losing trades.</p>
            </div>

            <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between font-mono text-[13px]">
                    <span className="text-[#10B981] font-semibold flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-[#10B981]"></span>
                        64.2% Wins (42)
                    </span>
                    <span className="text-[#EF4444] font-semibold flex items-center gap-1.5">
                        35.8% Losses (23)
                        <span className="w-2.5 h-2.5 rounded-sm bg-[#EF4444]"></span>
                    </span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#1F2027] overflow-hidden flex">
                    <div className="h-full bg-[#10B981]" style={{ width: '64.2%' }}></div>
                    <div className="h-full bg-[#EF4444]" style={{ width: '35.8%' }}></div>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px] text-[#9999A2]">
                    <span>Avg Win: +$168.50</span>
                    <span>Avg Loss: -$82.40</span>
                </div>
            </div>

            <div className="flex items-center justify-between bg-[#18181C] border border-[#202128] p-3.5 rounded-lg">
                <div className="flex flex-col">
                    <span className="font-mono text-[11px] uppercase text-[#9999A2]">Max Win Streak</span>
                    <span className="font-mono text-[16px] text-[#10B981] font-bold mt-0.5">6 trades</span>
                </div>
                <div className="h-8 w-px bg-[#262732]"></div>
                <div className="flex flex-col text-right">
                    <span className="font-mono text-[11px] uppercase text-[#9999A2]">Max Loss Streak</span>
                    <span className="font-mono text-[16px] text-[#9999A2] font-bold mt-0.5">4 trades</span>
                </div>
            </div>

            <div className="flex flex-col gap-3 pt-1">
                <span className="font-mono text-[11px] text-[#F3F3F5] uppercase tracking-wider font-semibold">Realized R:R Distribution</span>

                <div className="flex flex-col gap-1">
                    <div className="flex justify-between font-mono text-[12px]">
                        <span className="text-[#9999A2]">&lt; 1.0R (Sub-target exits)</span>
                        <span className="text-[#F3F3F5] font-semibold">18% <span className="text-[#6F7078] font-normal">(12)</span></span>
                    </div>
                    <div className="w-full h-2 rounded bg-[#1F2027] overflow-hidden">
                        <div className="h-full bg-[#A78BFA]/70 rounded" style={{ width: '18%' }}></div>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex justify-between font-mono text-[12px]">
                        <span className="text-[#9999A2]">1.0R – 2.0R (Target Baseline)</span>
                        <span className="text-[#F3F3F5] font-semibold">35% <span className="text-[#6F7078] font-normal">(23)</span></span>
                    </div>
                    <div className="w-full h-2 rounded bg-[#1F2027] overflow-hidden">
                        <div className="h-full bg-[#38BDF8] rounded" style={{ width: '35%' }}></div>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex justify-between font-mono text-[12px]">
                        <span className="text-[#9999A2]">2.0R – 3.0R (Extended Trend)</span>
                        <span className="text-[#F3F3F5] font-semibold">32% <span className="text-[#6F7078] font-normal">(21)</span></span>
                    </div>
                    <div className="w-full h-2 rounded bg-[#1F2027] overflow-hidden">
                        <div className="h-full bg-[#3B82F6] rounded" style={{ width: '32%' }}></div>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex justify-between font-mono text-[12px]">
                        <span className="text-[#9999A2]">3.0R+ (Runner Expansion)</span>
                        <span className="text-[#F3F3F5] font-semibold">15% <span className="text-[#6F7078] font-normal">(10)</span></span>
                    </div>
                    <div className="w-full h-2 rounded bg-[#1F2027] overflow-hidden">
                        <div className="h-full bg-[#10B981] rounded" style={{ width: '15%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
