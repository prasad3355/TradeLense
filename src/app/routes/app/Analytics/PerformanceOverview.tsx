import React from 'react';

export function PerformanceOverview() {
    return (
        <section className="flex flex-col bg-[#141416] border border-[#202126] rounded-xl p-7 lg:p-8 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 gap-2 border-b border-[#1E1F24]">
                <div>
                    <h2 className="font-display text-[20px] font-bold tracking-tight text-[#F3F3F5]">PERFORMANCE OVERVIEW</h2>
                    <p className="font-body text-[13px] text-[#9999A2] mt-1">A concise view of your trading performance.</p>
                </div>
                <div className="flex items-center gap-2 text-[12px] font-mono text-[#9999A2]">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                    <span>65 Closed Trades</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 pt-6">
                {/* Primary Showcase Metric: NET P&L */}
                <div className="lg:col-span-2 flex flex-col justify-between pb-6 lg:pb-0 lg:pr-4 border-b lg:border-b-0 lg:border-r border-[#1E1F24]/70">
                    <div className="flex flex-col">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#9999A2]">NET P&amp;L (CUMULATIVE)</span>
                        <div className="flex items-baseline gap-3 mt-2">
                            <span className="font-mono text-[36px] font-bold text-[#10B981] tracking-tight leading-none">+$2,482.50</span>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                            <span className="font-mono text-[12px] text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded font-semibold">+24.8% net return</span>
                            <span className="font-body text-[12px] text-[#9999A2]">Avg: +$118.21 / session</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 font-mono text-[11px] text-[#6F7078]">
                        <span>Initial: $10,000.00</span>
                        <span className="text-[#3E3E48]">·</span>
                        <span>Current: $12,482.50</span>
                    </div>
                </div>

                {/* Metric 1: WIN RATE */}
                <div className="flex flex-col justify-between p-4 rounded-lg bg-[#18181C] border border-[#202128]">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#9999A2]">WIN RATE</span>
                    <div className="my-2">
                        <span className="font-mono text-[26px] font-semibold text-[#F3F3F5] tracking-tight">64.2%</span>
                        <p className="font-body text-[12px] text-[#9999A2] mt-1">42W / 23L trades</p>
                    </div>
                    <div className="w-full h-1.5 bg-[#25252E] rounded-full overflow-hidden flex">
                        <div className="h-full bg-[#10B981]" style={{ width: '64.2%' }}></div>
                        <div className="h-full bg-[#EF4444]" style={{ width: '35.8%' }}></div>
                    </div>
                </div>

                {/* Metric 2: PROFIT FACTOR */}
                <div className="flex flex-col justify-between p-4 rounded-lg bg-[#18181C] border border-[#202128]">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#9999A2]">PROFIT FACTOR</span>
                    <div className="my-2">
                        <span className="font-mono text-[26px] font-semibold text-[#F3F3F5] tracking-tight">1.82</span>
                        <p className="font-body text-[12px] text-[#9999A2] mt-1">Gross Win: $5,512.50</p>
                    </div>
                    <span className="font-mono text-[11px] text-[#6F7078]">Gross Loss: $3,030.00</span>
                </div>

                {/* Metric 3: EXPECTANCY & R:R */}
                <div className="flex flex-col justify-between p-4 rounded-lg bg-[#18181C] border border-[#202128]">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#9999A2]">EXPECTANCY</span>
                    <div className="my-2">
                        <span className="font-mono text-[26px] font-semibold text-[#10B981] tracking-tight">+$42.18</span>
                        <p className="font-body text-[12px] text-[#9999A2] mt-1">Avg R:R: 2.14</p>
                    </div>
                    <span className="font-mono text-[11px] text-[#10B981]">Positive expectancy</span>
                </div>

                {/* Metric 4: MAX DRAWDOWN */}
                <div className="flex flex-col justify-between p-4 rounded-lg bg-[#18181C] border border-[#202128]">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#9999A2]">MAX DRAWDOWN</span>
                    <div className="my-2">
                        <span className="font-mono text-[26px] font-semibold text-[#EF4444] tracking-tight">-$486.20</span>
                        <p className="font-body text-[12px] text-[#9999A2] mt-1">-3.9% peak-to-trough</p>
                    </div>
                    <span className="font-mono text-[11px] text-[#6F7078]">Recovered in 3 sess.</span>
                </div>
            </div>
        </section>
    );
}
