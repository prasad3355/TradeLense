import React from 'react';

export function PerformanceByInstrument() {
    return (
        <section className="flex flex-col bg-[#141416] border border-[#202126] rounded-xl p-7 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-2 border-b border-[#1E1F24]">
                <div>
                    <h3 className="font-display text-[18px] font-bold text-[#F3F3F5] tracking-tight">PERFORMANCE BY INSTRUMENT</h3>
                    <p className="font-body text-[13px] text-[#9999A2] mt-0.5">Compare profitability and execution quality across active markets.</p>
                </div>
                <span className="font-mono text-[11px] px-3 py-1 bg-[#18181C] border border-[#202128] rounded-md text-[#9999A2] self-start">
                    4 Active Pairs
                </span>
            </div>

            <div className="flex flex-col gap-3 pt-6">
                {/* Row 1: XAUUSD */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-xl bg-[#18181C] border border-[#202128] hover:border-[#2D2E3B] transition-colors gap-4">
                    <div className="flex items-center gap-4 lg:w-1/3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-[#25252E] flex items-center justify-center font-mono text-[#38BDF8] text-[14px] font-bold shrink-0">
                            AU
                        </div>
                        <div className="flex flex-col truncate">
                            <span className="font-display text-[14px] text-[#F3F3F5] font-semibold">XAUUSD</span>
                            <span className="font-body text-[12px] text-[#9999A2]">Gold Spot / US Dollar</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between lg:justify-end gap-8 lg:w-2/3">
                        <div className="flex flex-col items-start lg:items-end">
                            <span className="font-mono text-[11px] text-[#6F7078]">TRADES</span>
                            <span className="font-mono text-[13px] text-[#F3F3F5] font-medium">28</span>
                        </div>
                        <div className="flex flex-col items-start lg:items-end">
                            <span className="font-mono text-[11px] text-[#6F7078]">WIN RATE</span>
                            <span className="font-mono text-[13px] text-[#F3F3F5] font-medium">61.0%</span>
                        </div>
                        <div className="flex flex-col items-start lg:items-end">
                            <span className="font-mono text-[11px] text-[#6F7078]">AVG R:R</span>
                            <span className="font-mono text-[13px] text-[#F3F3F5] font-medium">2.18</span>
                        </div>
                        <div className="flex flex-col items-end min-w-[120px]">
                            <span className="font-mono text-[11px] text-[#6F7078]">NET RETURN</span>
                            <span className="font-mono text-[16px] text-[#10B981] font-semibold">+$1,240.00</span>
                        </div>
                    </div>
                </div>

                {/* Row 2: EURUSD */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-xl bg-[#18181C] border border-[#202128] hover:border-[#2D2E3B] transition-colors gap-4">
                    <div className="flex items-center gap-4 lg:w-1/3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-[#25252E] flex items-center justify-center font-mono text-[#A78BFA] text-[14px] font-bold shrink-0">
                            EU
                        </div>
                        <div className="flex flex-col truncate">
                            <span className="font-display text-[14px] text-[#F3F3F5] font-semibold">EURUSD</span>
                            <span className="font-body text-[12px] text-[#9999A2]">Euro / US Dollar</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between lg:justify-end gap-8 lg:w-2/3">
                        <div className="flex flex-col items-start lg:items-end">
                            <span className="font-mono text-[11px] text-[#6F7078]">TRADES</span>
                            <span className="font-mono text-[13px] text-[#F3F3F5] font-medium">18</span>
                        </div>
                        <div className="flex flex-col items-start lg:items-end">
                            <span className="font-mono text-[11px] text-[#6F7078]">WIN RATE</span>
                            <span className="font-mono text-[13px] text-[#F3F3F5] font-medium">68.0%</span>
                        </div>
                        <div className="flex flex-col items-start lg:items-end">
                            <span className="font-mono text-[11px] text-[#6F7078]">AVG R:R</span>
                            <span className="font-mono text-[13px] text-[#F3F3F5] font-medium">2.41</span>
                        </div>
                        <div className="flex flex-col items-end min-w-[120px]">
                            <span className="font-mono text-[11px] text-[#6F7078]">NET RETURN</span>
                            <span className="font-mono text-[16px] text-[#10B981] font-semibold">+$820.00</span>
                        </div>
                    </div>
                </div>

                {/* Row 3: NAS100 */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-xl bg-[#18181C] border border-[#202128] hover:border-[#2D2E3B] transition-colors gap-4">
                    <div className="flex items-center gap-4 lg:w-1/3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-[#25252E] flex items-center justify-center font-mono text-[#38BDF8] text-[14px] font-bold shrink-0">
                            NQ
                        </div>
                        <div className="flex flex-col truncate">
                            <span className="font-display text-[14px] text-[#F3F3F5] font-semibold">NAS100</span>
                            <span className="font-body text-[12px] text-[#9999A2]">Nasdaq 100 Index</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between lg:justify-end gap-8 lg:w-2/3">
                        <div className="flex flex-col items-start lg:items-end">
                            <span className="font-mono text-[11px] text-[#6F7078]">TRADES</span>
                            <span className="font-mono text-[13px] text-[#F3F3F5] font-medium">13</span>
                        </div>
                        <div className="flex flex-col items-start lg:items-end">
                            <span className="font-mono text-[11px] text-[#6F7078]">WIN RATE</span>
                            <span className="font-mono text-[13px] text-[#F3F3F5] font-medium">57.0%</span>
                        </div>
                        <div className="flex flex-col items-start lg:items-end">
                            <span className="font-mono text-[11px] text-[#6F7078]">AVG R:R</span>
                            <span className="font-mono text-[13px] text-[#F3F3F5] font-medium">1.87</span>
                        </div>
                        <div className="flex flex-col items-end min-w-[120px]">
                            <span className="font-mono text-[11px] text-[#6F7078]">NET RETURN</span>
                            <span className="font-mono text-[16px] text-[#10B981] font-semibold">+$640.00</span>
                        </div>
                    </div>
                </div>

                {/* Row 4: GBPUSD */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-xl bg-[#18181C] border border-[#202128] hover:border-[#2D2E3B] transition-colors gap-4">
                    <div className="flex items-center gap-4 lg:w-1/3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-[#25252E] flex items-center justify-center font-mono text-[#9999A2] text-[14px] font-bold shrink-0">
                            GU
                        </div>
                        <div className="flex flex-col truncate">
                            <span className="font-display text-[14px] text-[#F3F3F5] font-semibold">GBPUSD</span>
                            <span className="font-body text-[12px] text-[#9999A2]">British Pound / USD</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between lg:justify-end gap-8 lg:w-2/3">
                        <div className="flex flex-col items-start lg:items-end">
                            <span className="font-mono text-[11px] text-[#6F7078]">TRADES</span>
                            <span className="font-mono text-[13px] text-[#F3F3F5] font-medium">6</span>
                        </div>
                        <div className="flex flex-col items-start lg:items-end">
                            <span className="font-mono text-[11px] text-[#6F7078]">WIN RATE</span>
                            <span className="font-mono text-[13px] text-[#F3F3F5] font-medium">50.0%</span>
                        </div>
                        <div className="flex flex-col items-start lg:items-end">
                            <span className="font-mono text-[11px] text-[#6F7078]">AVG R:R</span>
                            <span className="font-mono text-[13px] text-[#F3F3F5] font-medium">1.42</span>
                        </div>
                        <div className="flex flex-col items-end min-w-[120px]">
                            <span className="font-mono text-[11px] text-[#6F7078]">NET RETURN</span>
                            <span className="font-mono text-[16px] text-[#10B981] font-semibold">+$140.00</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
