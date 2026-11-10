import React from 'react';

export function DirectionPerformance() {
    return (
        <div className="flex flex-col justify-between bg-[#141416] border border-[#202126] rounded-xl p-7 lg:p-8">
            <div>
                <div className="flex flex-wrap items-center justify-between gap-2 pb-6 border-b border-[#1E1F24]">
                    <div>
                        <h3 className="font-display text-[18px] font-bold text-[#F3F3F5] tracking-tight">DIRECTION PERFORMANCE</h3>
                        <p className="font-body text-[13px] text-[#9999A2] mt-0.5">Compare execution outcomes between Long and Short trades.</p>
                    </div>
                    <span className="font-mono text-[11px] px-2.5 py-1 bg-[#10B981]/15 text-[#10B981] rounded-md font-semibold">
                        +9.0% LONG EDGE
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                    {/* Long Side */}
                    <div className="flex flex-col p-4 rounded-xl bg-[#18181C] border border-[#202128]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-display text-[14px] text-[#F3F3F5] font-semibold flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[18px] text-[#10B981]">trending_up</span>
                                LONG
                            </span>
                            <span className="font-mono text-[11px] text-[#9999A2]">31 Trades (47.7%)</span>
                        </div>
                        <div className="my-3">
                            <span className="font-mono text-[24px] font-semibold text-[#10B981]">+$1,840.50</span>
                            <span className="block font-body text-[12px] text-[#9999A2] mt-1">Win Rate: 68.0%</span>
                        </div>
                        <div className="pt-2 flex justify-between font-mono text-[11px] text-[#9999A2] border-t border-[#25252E]">
                            <span>Avg R:R</span>
                            <span className="text-[#F3F3F5] font-semibold">2.31</span>
                        </div>
                    </div>

                    {/* Short Side */}
                    <div className="flex flex-col p-4 rounded-xl bg-[#18181C] border border-[#202128]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-display text-[14px] text-[#F3F3F5] font-semibold flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[18px] text-[#9999A2]">trending_down</span>
                                SHORT
                            </span>
                            <span className="font-mono text-[11px] text-[#9999A2]">34 Trades (52.3%)</span>
                        </div>
                        <div className="my-3">
                            <span className="font-mono text-[24px] font-semibold text-[#F3F3F5]">+$642.00</span>
                            <span className="block font-body text-[12px] text-[#9999A2] mt-1">Win Rate: 59.0%</span>
                        </div>
                        <div className="pt-2 flex justify-between font-mono text-[11px] text-[#9999A2] border-t border-[#25252E]">
                            <span>Avg R:R</span>
                            <span className="text-[#F3F3F5] font-semibold">1.84</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pt-4 mt-6 border-t border-[#1E1F24] flex flex-wrap items-center justify-between gap-2 font-mono text-[12px] text-[#9999A2]">
                <span>Long Excess Return: <span className="text-[#10B981] font-semibold">+$1,198.50</span></span>
                <span>Ratio: 1.25x</span>
            </div>
        </div>
    );
}
