import React from 'react';

export function KpiCards({ data }: { data: any }) {

    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {/* KPI 1: Net P&L */}
            <div className="bg-[#101116] border border-[#1E2028] rounded-md p-3.5 flex flex-col justify-between relative overflow-hidden group hover:border-[#2A2E3D] transition-colors">
                <div className="flex items-center justify-between text-zinc-400">
                    <div className="flex items-center space-x-1.5">
                        <span className="text-[11px] font-medium tracking-tight">Net P&L</span>
                        <button className="text-zinc-500 hover:text-zinc-300" title="Total net profit after commissions & slippage">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"></circle><line strokeWidth="2" x1="12" x2="12" y1="16" y2="12"></line><line strokeWidth="2" x1="12" x2="12.01" y1="8" y2="8"></line></svg>
                        </button>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 bg-zinc-800/80 text-zinc-300 rounded font-normal">{data.tradeCount}</span>
                    </div>
                    <div className="w-4 h-4 rounded bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-[9px] text-emerald-400">
                        ▲
                    </div>
                </div>
                <div className="mt-2.5 flex items-baseline justify-between">
                    <div className={`font-mono text-2xl font-bold tracking-tight ${data.netPl > 0 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                        {data.netPl > 0 ? `+$${data.netPl.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '$0.00'}
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono tracking-tight">{data.tradeCount} closed</span>
                </div>
            </div>

            {/* KPI 2: Profit Factor */}
            <div className="bg-[#101116] border border-[#1E2028] rounded-md p-3.5 flex items-center justify-between group hover:border-[#2A2E3D] transition-colors">
                <div className="space-y-2">
                    <div className="flex items-center space-x-1.5 text-zinc-400">
                        <span className="text-[11px] font-medium tracking-tight">Profit factor</span>
                        <button className="text-zinc-500 hover:text-zinc-300">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"></circle><line strokeWidth="2" x1="12" x2="12" y1="16" y2="12"></line><line strokeWidth="2" x1="12" x2="12.01" y1="8" y2="8"></line></svg>
                        </button>
                    </div>
                    <div className="font-mono text-2xl font-bold tracking-tight text-zinc-100">
                        {data.profitFactor || '—'}
                    </div>
                </div>
                <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" opacity="0.6" stroke="#EF4444" strokeDasharray="100, 100" strokeWidth="3.5"></path>
                        {data.profitFactor > 0 && <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10B981" strokeDasharray="68, 100" strokeLinecap="round" strokeWidth="3.6"></path>}
                    </svg>
                    <span className="absolute text-[8px] font-mono text-zinc-400">{data.profitFactor > 0 ? '68%' : '0%'}</span>
                </div>
            </div>

            {/* KPI 3: Trade Win % */}
            <div className="bg-[#101116] border border-[#1E2028] rounded-md p-3.5 flex items-center justify-between group hover:border-[#2A2E3D] transition-colors">
                <div className="space-y-2">
                    <div className="flex items-center space-x-1.5 text-zinc-400">
                        <span className="text-[11px] font-medium tracking-tight">Trade win %</span>
                        <button className="text-zinc-500 hover:text-zinc-300">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"></circle><line strokeWidth="2" x1="12" x2="12" y1="16" y2="12"></line><line strokeWidth="2" x1="12" x2="12.01" y1="8" y2="8"></line></svg>
                        </button>
                    </div>
                    <div className="font-mono text-2xl font-bold tracking-tight text-zinc-100">
                        {data.winRate > 0 ? `${data.winRate}%` : '0.00%'}
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center space-y-1">
                    <div className="relative w-16 h-8 flex items-end justify-center overflow-hidden">
                        <svg className="w-16 h-16 transform -rotate-180 origin-center translate-y-1" viewBox="0 0 40 40">
                            <circle cx="20" cy="20" fill="none" r="16" stroke="#EF4444" strokeDasharray="50 50" strokeDashoffset="0" strokeWidth="3"></circle>
                            {data.tradeCount > 0 && (
                                <>
                                    <circle cx="20" cy="20" fill="none" r="16" stroke="#3B82F6" strokeDasharray="6 94" strokeDashoffset="-22" strokeWidth="3"></circle>
                                    <circle cx="20" cy="20" fill="none" r="16" stroke="#10B981" strokeDasharray="21 79" strokeDashoffset="-29" strokeWidth="3"></circle>
                                </>
                            )}
                        </svg>
                    </div>
                    <div className="flex items-center space-x-2 text-[9px] font-mono">
                        <span className="text-emerald-400 font-bold">{data.wins}</span>
                        <span className="text-blue-400 font-bold">{data.breakeven}</span>
                        <span className="text-rose-400 font-bold">{data.losses}</span>
                    </div>
                </div>
            </div>

            {/* KPI 4: Avg ratio */}
            <div className="bg-[#101116] border border-[#1E2028] rounded-md p-3.5 flex flex-col justify-between group hover:border-[#2A2E3D] transition-colors">
                <div className="flex items-center space-x-1.5 text-zinc-400">
                    <span className="text-[11px] font-medium tracking-tight">Avg win/loss trade</span>
                    <button className="text-zinc-500 hover:text-zinc-300">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"></circle><line strokeWidth="2" x1="12" x2="12" y1="16" y2="12"></line><line strokeWidth="2" x1="12" x2="12.01" y1="8" y2="8"></line></svg>
                    </button>
                </div>
                <div className="mt-1 flex items-baseline space-x-3">
                    <div className="font-mono text-2xl font-bold tracking-tight text-zinc-100">
                        {data.avgWinLossRatio || '—'}
                    </div>
                    <div className="flex-1 space-y-1">
                        <div className="h-2 w-full bg-zinc-800 rounded-full flex overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-l-full transition-all duration-500" style={{ width: data.tradeCount > 0 ? '74%' : '50%' }}></div>
                            <div className="bg-rose-500 h-full rounded-r-full transition-all duration-500" style={{ width: data.tradeCount > 0 ? '26%' : '50%' }}></div>
                        </div>
                        <div className="flex justify-between text-[9px] font-mono">
                            <span className="text-emerald-400 font-medium">{data.avgWin > 0 ? `+$${data.avgWin}` : '+$0'}</span>
                            <span className="text-rose-400 font-medium">{data.avgLoss > 0 ? `-$${data.avgLoss}` : '-$0'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
