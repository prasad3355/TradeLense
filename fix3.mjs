import fs from 'fs/promises';

async function updateTable() {
    let content = await fs.readFile('src/app/routes/app/Journal.tsx', 'utf8');

    const oldPlaceholder = `<div className="p-8 text-center text-sm text-[#6F7078] border border-[#202126] rounded-xl bg-[#151515]">
                                Table View mode active. (Reusing existing table component context...)
                            </div>`;

    const newTable = `<div className="overflow-x-auto min-h-[400px] bg-[#0E1015] border border-[#202126] rounded-xl">
                                <table className="w-full text-left font-sans text-xs">
                                    <thead>
                                        <tr className="bg-[#151515] border-b border-[#202126] text-[10px] text-[#6F7078] tracking-widest uppercase font-mono font-bold">
                                            <th className="py-4 px-6">SYMBOL</th>
                                            <th className="py-4 px-6">SIDE</th>
                                            <th className="py-4 px-6">PRICE (ENTRY - EXIT)</th>
                                            <th className="py-4 px-6">NET PNL</th>
                                            <th className="py-4 px-6">OUTCOME</th>
                                            <th className="py-4 px-6">TIME (UTC)</th>
                                            <th className="py-4 px-4 text-center">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#202126]">
                                        {displayTrades.map((t: any, idx: number) => {
                                            const pnl = t.pnl_realized || t.pnl || 0;
                                            const isProfit = pnl >= 0;
                                            const entryPrice = t.entryPrice !== undefined ? t.entryPrice : (t.entry_price || 0);
                                            const exitPrice = t.exitPrice !== undefined ? t.exitPrice : (t.exit_price || 0);
                                            const sideStr = t.type || t.side || t.direction || '';
                                            return (
                                                <tr
                                                    key={t.id || idx}
                                                    onClick={() => setSelectedTrade(t)}
                                                    className="hover:bg-[#1A1A1E] transition-colors cursor-pointer group"
                                                >
                                                    <td className="py-4 px-6 font-semibold text-[#F3F3F5] group-hover:text-[#8B5CF6] transition-colors">{t.asset || t.symbol}</td>
                                                    <td className="py-4 px-6">
                                                        <span className={\`px-2 py-1 rounded text-[9px] font-bold uppercase \${sideStr === 'LONG' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}\`}>
                                                            {sideStr}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 font-mono text-[#6F7078] font-medium">\${entryPrice.toLocaleString()} - \${exitPrice.toLocaleString()}</td>
                                                    <td className={\`py-4 px-6 font-mono font-bold \${isProfit ? 'text-emerald-500' : 'text-red-500'}\`}>
                                                        {isProfit ? '+' : ''}\${parseFloat(pnl).toLocaleString()}
                                                    </td>
                                                    <td className="py-4 px-6 font-mono text-[#6F7078]">{t.outcome || 'OPEN'}</td>
                                                    <td className="py-4 px-6 text-[#6F7078] font-mono text-[10px]">{t.time ? new Date(t.time).toLocaleString() : (t.date || '')}</td>
                                                    <td className="py-4 px-4 text-center">
                                                        <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedTrade(t);
                                                                }}
                                                                className="text-[10px] text-[#8B5CF6] hover:text-[#7C6CF2] font-mono font-semibold hover:underline bg-transparent border-none cursor-pointer"
                                                            >
                                                                DIAGNOSE
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>`;

    content = content.replace(oldPlaceholder, newTable);

    // fix \` from python string format
    content = content.replace(/\\\\\`/g, '\`');

    await fs.writeFile('src/app/routes/app/Journal.tsx', content);
}

updateTable().catch(console.error);
