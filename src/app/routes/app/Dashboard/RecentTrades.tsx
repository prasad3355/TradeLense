import React from 'react';

export function RecentTrades({ data }: { data: any }) {
    const hasData = data.tradeCount > 0;

    return (
        <div className="lg:col-span-6 bg-[#101116] border border-[#1E2028] rounded-md p-3.5 flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#1E2028]">
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <span className="text-xs font-semibold text-zinc-200 whitespace-nowrap">Recent Trades</span>
                    <div className="flex items-center space-x-1 text-[11px]">
                        <button className="text-violet-400 font-medium px-2 py-0.5 rounded bg-violet-950/40 border border-violet-500/30 whitespace-nowrap">Recent trades</button>
                        <button className="text-zinc-500 hover:text-zinc-300 px-2 py-0.5 whitespace-nowrap">Open positions (0)</button>
                    </div>
                </div>
                <button className="text-[10px] text-zinc-400 hover:text-white transition-colors font-mono whitespace-nowrap">
                    View All {data.tradeCount || 35} Executions →
                </button>
            </div>

            <div className="overflow-x-auto mt-2">
                <table className="w-full text-left font-mono text-[11px] whitespace-nowrap">
                    <thead>
                        <tr className="text-zinc-500 text-[10px] border-b border-[#1E2028]">
                            <th className="pb-1.5 font-medium">ASSET</th>
                            <th className="pb-1.5 font-medium">SIDE</th>
                            <th className="pb-1.5 font-medium text-right">ENTRY</th>
                            <th className="pb-1.5 font-medium text-right">EXIT</th>
                            <th className="pb-1.5 font-medium text-right">NET P&L</th>
                            <th className="pb-1.5 font-medium text-right">R:R</th>
                            <th className="pb-1.5 font-medium text-center">STATUS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#181922]">
                        {!hasData ? (
                            <tr>
                                <td colSpan={7} className="py-8 text-center text-zinc-500 font-sans">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                                        <span className="text-xs">No executed trades logged for this selected time window.</span>
                                        <button className="px-2.5 py-1 bg-zinc-800 text-zinc-300 rounded text-[10px] hover:bg-zinc-700">Import CSV or Sync Broker</button>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            data.recentTrades.map((trade: any, idx: number) => (
                                <tr key={idx} className="hover:bg-[#151720] transition-colors">
                                    <td className="py-2 font-bold text-zinc-200">{trade.asset}</td>
                                    <td className="py-2">
                                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${trade.side === 'LONG' ? 'bg-emerald-950/80 text-emerald-400' : 'bg-rose-950/80 text-rose-400'}`}>
                                            {trade.side}
                                        </span>
                                    </td>
                                    <td className="py-2 text-right text-zinc-400">{trade.entry}</td>
                                    <td className="py-2 text-right text-zinc-400">{trade.exit}</td>
                                    <td className={`py-2 text-right font-bold ${trade.netPl > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {trade.netPl > 0 ? `+$${trade.netPl.toFixed(2)}` : `-$${Math.abs(trade.netPl).toFixed(2)}`}
                                    </td>
                                    <td className="py-2 text-right text-zinc-300">{trade.rr}</td>
                                    <td className="py-2 text-center">
                                        <span className={`text-[9px] px-1 py-0.5 rounded ${trade.status === 'WIN' ? 'text-emerald-400 bg-emerald-950/50' : 'text-rose-400 bg-rose-950/50'}`}>
                                            {trade.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
