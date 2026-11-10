import React from 'react';

export function TimeBasedPerformance() {
    return (
        <section className="flex flex-col bg-[#141416] border border-[#202126] rounded-xl p-7 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-2 border-b border-[#1E1F24]">
                <div>
                    <h3 className="font-display text-[18px] font-bold text-[#F3F3F5] tracking-tight">TIME-BASED PERFORMANCE</h3>
                    <p className="font-body text-[13px] text-[#9999A2] mt-0.5">Performance by day of week and session timing.</p>
                </div>
                <span className="font-mono text-[11px] px-3 py-1 bg-[#18181C] border border-[#202128] rounded-md text-[#10B981] self-start font-semibold">
                    TUESDAY PEAK VELOCITY
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-6">
                {/* Monday */}
                <div className="p-4 rounded-xl bg-[#18181C] border border-[#202128] flex flex-col justify-between gap-4">
                    <div className="flex justify-between items-center">
                        <span className="font-display text-[14px] text-[#F3F3F5] font-semibold">Monday</span>
                        <span className="font-mono text-[11px] text-[#6F7078]">8 Trades</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="font-mono text-[18px] text-[#10B981] font-bold">+$310.00</span>
                        <span className="font-body text-[12px] text-[#9999A2]">62.5% Win Rate</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#25252E] overflow-hidden">
                        <div className="h-full bg-[#38BDF8]" style={{ width: '31%' }}></div>
                    </div>
                </div>

                {/* Tuesday */}
                <div className="p-4 rounded-xl bg-[#1C1A2E]/80 border border-[#3E3269]/70 relative flex flex-col justify-between gap-4">
                    <div className="flex justify-between items-center">
                        <span className="font-display text-[14px] text-white font-semibold">Tuesday</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#10B981]/20 text-[#10B981] rounded font-semibold border border-[#10B981]/30">PEAK</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="font-mono text-[20px] text-[#10B981] font-bold">+$980.00</span>
                        <span className="font-body text-[12px] text-white font-medium">75.0% Win Rate (16 T)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#25252E] overflow-hidden">
                        <div className="h-full bg-[#10B981]" style={{ width: '100%' }}></div>
                    </div>
                </div>

                {/* Wednesday */}
                <div className="p-4 rounded-xl bg-[#18181C] border border-[#202128] flex flex-col justify-between gap-4">
                    <div className="flex justify-between items-center">
                        <span className="font-display text-[14px] text-[#F3F3F5] font-semibold">Wednesday</span>
                        <span className="font-mono text-[11px] text-[#6F7078]">14 Trades</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="font-mono text-[18px] text-[#10B981] font-bold">+$420.00</span>
                        <span className="font-body text-[12px] text-[#9999A2]">57.1% Win Rate</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#25252E] overflow-hidden">
                        <div className="h-full bg-[#38BDF8]" style={{ width: '42%' }}></div>
                    </div>
                </div>

                {/* Thursday */}
                <div className="p-4 rounded-xl bg-[#18181C] border border-[#202128] flex flex-col justify-between gap-4">
                    <div className="flex justify-between items-center">
                        <span className="font-display text-[14px] text-[#F3F3F5] font-semibold">Thursday</span>
                        <span className="font-mono text-[11px] text-[#6F7078]">15 Trades</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="font-mono text-[18px] text-[#10B981] font-bold">+$640.00</span>
                        <span className="font-body text-[12px] text-[#9999A2]">66.7% Win Rate</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#25252E] overflow-hidden">
                        <div className="h-full bg-[#38BDF8]" style={{ width: '65%' }}></div>
                    </div>
                </div>

                {/* Friday */}
                <div className="p-4 rounded-xl bg-[#18181C] border border-[#202128] flex flex-col justify-between gap-4">
                    <div className="flex justify-between items-center">
                        <span className="font-display text-[14px] text-[#F3F3F5] font-semibold">Friday</span>
                        <span className="font-mono text-[11px] text-[#6F7078]">12 Trades</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="font-mono text-[18px] text-[#F3F3F5] font-bold">+$132.50</span>
                        <span className="font-body text-[12px] text-[#9999A2]">50.0% Win Rate</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#25252E] overflow-hidden">
                        <div className="h-full bg-[#6F7078]" style={{ width: '14%' }}></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
