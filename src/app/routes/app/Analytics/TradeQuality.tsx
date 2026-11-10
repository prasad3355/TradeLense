import React from 'react';

export function TradeQuality() {
    return (
        <div className="flex flex-col justify-between bg-[#141416] border border-[#202126] rounded-xl p-7 lg:p-8">
            <div>
                <div className="flex items-center justify-between pb-6 border-b border-[#1E1F24]">
                    <div>
                        <h3 className="font-display text-[18px] font-bold text-[#F3F3F5] tracking-tight">TRADE QUALITY</h3>
                        <p className="font-body text-[13px] text-[#9999A2] mt-0.5">Statistical characteristics of your trade outcomes.</p>
                    </div>
                    <span className="font-mono text-[14px] text-[#38BDF8] font-bold">1.46x Payoff</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                    {/* Win vs Loss Average */}
                    <div className="p-4 rounded-xl bg-[#18181C] border border-[#202128] flex flex-col justify-between">
                        <span className="font-mono text-[11px] text-[#6F7078] uppercase">Average Win</span>
                        <span className="font-mono text-[22px] text-[#10B981] my-1 font-semibold">+$114.00</span>
                        <span className="font-body text-[12px] text-[#9999A2]">vs Avg Loss: -$78.00</span>
                    </div>
                    {/* Payoff Ratio */}
                    <div className="p-4 rounded-xl bg-[#18181C] border border-[#202128] flex flex-col justify-between">
                        <span className="font-mono text-[11px] text-[#6F7078] uppercase">Average R:R</span>
                        <span className="font-mono text-[22px] text-[#F3F3F5] my-1 font-semibold">2.14 R</span>
                        <span className="font-body text-[12px] text-[#9999A2]">Realized reward multiplier</span>
                    </div>
                    {/* Largest Single Win */}
                    <div className="p-4 rounded-xl bg-[#18181C] border border-[#202128] flex flex-col justify-between">
                        <span className="font-mono text-[11px] text-[#6F7078] uppercase">Largest Win</span>
                        <span className="font-mono text-[22px] text-[#10B981] my-1 font-semibold">+$420.00</span>
                        <span className="font-body text-[12px] text-[#9999A2]">XAUUSD Long (June 18)</span>
                    </div>
                    {/* Largest Single Loss */}
                    <div className="p-4 rounded-xl bg-[#18181C] border border-[#202128] flex flex-col justify-between">
                        <span className="font-mono text-[11px] text-[#6F7078] uppercase">Largest Loss</span>
                        <span className="font-mono text-[22px] text-[#EF4444] my-1 font-semibold">-$215.00</span>
                        <span className="font-body text-[12px] text-[#9999A2]">NAS100 Short (June 12)</span>
                    </div>
                </div>
            </div>
            <div className="mt-6 p-4 rounded-xl bg-[#18181C] border border-[#202128] flex items-center justify-between">
                <span className="font-mono text-[12px] text-[#9999A2]">Expected Value per Execution</span>
                <span className="font-mono text-[15px] text-[#10B981] font-bold">+$42.18 / trade</span>
            </div>
        </div>
    );
}
