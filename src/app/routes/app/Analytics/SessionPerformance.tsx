import React from 'react';

export function SessionPerformance() {
    return (
        <div className="flex flex-col justify-between bg-[#141416] border border-[#202126] rounded-xl p-7 lg:p-8">
            <div>
                <div className="flex flex-wrap items-center justify-between gap-2 pb-6 border-b border-[#1E1F24]">
                    <div>
                        <h3 className="font-display text-[18px] font-bold text-[#F3F3F5] tracking-tight">SESSION PERFORMANCE</h3>
                        <p className="font-body text-[13px] text-[#9999A2] mt-0.5">Compare performance across your active trading sessions.</p>
                    </div>
                    <span className="font-mono text-[11px] px-2.5 py-1 bg-[#1C1A2E] text-[#C4B5FD] border border-[#3E3269]/60 rounded-md font-semibold">
                        LONDON DOMINANT
                    </span>
                </div>

                <div className="flex flex-col gap-3 pt-6">
                    {/* London Session */}
                    <div className="p-4 rounded-xl bg-[#1C1A2E]/70 border border-[#3E3269]/60 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="font-display text-[14px] text-white font-semibold">LONDON</span>
                                <span className="font-mono text-[10px] px-2 py-0.5 bg-[#3B82F6]/20 text-[#38BDF8] rounded font-semibold border border-[#3B82F6]/30">BEST EDGE</span>
                            </div>
                            <span className="font-mono text-[16px] text-[#10B981] font-semibold">+$1,420.00</span>
                        </div>
                        <div className="flex items-center justify-between font-mono text-[11px] text-[#9999A2]">
                            <span>34 Trades (57.2% vol)</span>
                            <span>71.0% Win Rate</span>
                            <span>Avg R:R 2.42</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#18181F] overflow-hidden">
                            <div className="h-full bg-[#38BDF8]" style={{ width: '57.2%' }}></div>
                        </div>
                    </div>

                    {/* New York Session */}
                    <div className="p-4 rounded-xl bg-[#18181C] border border-[#202128] flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className="font-display text-[14px] text-[#F3F3F5] font-semibold">NEW YORK</span>
                            <span className="font-mono text-[16px] text-[#10B981] font-semibold">+$642.50</span>
                        </div>
                        <div className="flex items-center justify-between font-mono text-[11px] text-[#9999A2]">
                            <span>19 Trades (25.9% vol)</span>
                            <span>58.0% Win Rate</span>
                            <span>Avg R:R 1.95</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#25252E] overflow-hidden">
                            <div className="h-full bg-[#818CF8]" style={{ width: '25.9%' }}></div>
                        </div>
                    </div>

                    {/* Asia Session */}
                    <div className="p-4 rounded-xl bg-[#18181C] border border-[#202128] flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className="font-display text-[14px] text-[#F3F3F5] font-semibold">ASIA</span>
                            <span className="font-mono text-[16px] text-[#F3F3F5] font-semibold">+$120.00</span>
                        </div>
                        <div className="flex items-center justify-between font-mono text-[11px] text-[#9999A2]">
                            <span>12 Trades (16.9% vol)</span>
                            <span>50.0% Win Rate</span>
                            <span>Avg R:R 1.40</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#25252E] overflow-hidden">
                            <div className="h-full bg-[#6F7078]" style={{ width: '16.9%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
