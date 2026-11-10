import React from 'react';

export function PerformanceCalendar({ data, isDemoMode }: { data: any, isDemoMode: boolean }) {
    const hasData = isDemoMode;

    return (
        <div className="lg:col-span-8 bg-[#101116] border border-[#1E2028] rounded-md p-3.5 flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#1E2028] gap-2">
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 text-zinc-400">
                        <button className="p-1 hover:bg-[#1A1C24] rounded text-zinc-400 hover:text-white transition-colors" title="Previous month">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                        </button>
                        <span className="text-xs font-semibold text-zinc-100 tracking-wide font-mono px-1">June 2024</span>
                        <button className="p-1 hover:bg-[#1A1C24] rounded text-zinc-400 hover:text-white transition-colors" title="Next month">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                        </button>
                    </div>
                    <button className="px-2.5 py-1 bg-[#171922] hover:bg-[#1F222E] border border-[#1E2028] rounded text-[10px] text-zinc-300 font-medium transition-colors">
                        This month
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="text-zinc-500 font-medium">Monthly stats:</span>
                    {hasData ? (
                        <>
                            <span className="px-1.5 py-0.5 rounded bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 font-mono font-semibold text-[10px]">
                                +$5.13K
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-[#1B1832] border border-violet-500/30 text-violet-300 font-mono font-semibold text-[10px]">
                                13 days
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-400 font-mono font-semibold text-[10px]">
                                $0.00
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-400 font-mono font-semibold text-[10px]">
                                0 days
                            </span>
                        </>
                    )}
                    <button className="p-1 text-zinc-500 hover:text-zinc-300">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                    <button className="p-1 text-zinc-500 hover:text-zinc-300">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"></circle><line strokeWidth="2" x1="12" x2="12" y1="16" y2="12"></line><line strokeWidth="2" x1="12" x2="12.01" y1="8" y2="8"></line></svg>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2.5 overflow-x-auto">
                <div className="sm:col-span-10 flex flex-col space-y-1.5 min-w-[340px] sm:min-w-0">
                    <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] text-zinc-500 py-1">
                        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                    </div>

                    {/* Calendar row 1 */}
                    <div className="grid grid-cols-7 gap-1">
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-14 rounded bg-[#0D0E12] border border-[#181920]"></div>)}
                        <div className="h-14 rounded bg-[#0E0F14] border border-[#1E202A] p-1 flex flex-col justify-between">
                            <span className="text-zinc-600 font-mono text-[9px] text-right">1</span>
                        </div>
                    </div>

                    {/* Calendar row 2 */}
                    <div className="grid grid-cols-7 gap-1">
                        {[2, 3, 4].map(day => (
                            <div key={day} className="h-14 rounded bg-[#0E0F14] border border-[#1E202A] p-1 text-right text-zinc-600 font-mono text-[9px]">{day}</div>
                        ))}

                        {hasData ? (
                            <div className="h-14 rounded bg-[#0A1B14] border border-[#144833] p-1 flex flex-col justify-between group hover:border-emerald-400 transition-colors cursor-pointer">
                                <div className="flex justify-between items-center text-[9px]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                    <span className="text-zinc-400 font-mono">5</span>
                                </div>
                                <div className="text-center">
                                    <div className="text-emerald-400 font-bold font-mono text-[11px] leading-tight">+$1.05K</div>
                                    <div className="text-[8px] text-zinc-400 font-mono">1 trade · 100%</div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-14 rounded bg-[#0E0F14] border border-[#1E202A] p-1 text-right text-zinc-600 font-mono text-[9px]">5</div>
                        )}

                        {[6, 7, 8].map(day => (
                            <div key={day} className="h-14 rounded bg-[#0E0F14] border border-[#1E202A] p-1 text-right text-zinc-600 font-mono text-[9px]">{day}</div>
                        ))}
                    </div>

                    {/* Calendar row 3 */}
                    <div className="grid grid-cols-7 gap-1">
                        <div className="h-14 rounded bg-[#0E0F14] border border-[#1E202A] p-1 text-right text-zinc-600 font-mono text-[9px]">9</div>

                        {hasData ? (
                            <>
                                <div className="h-14 rounded bg-[#0A1B14] border border-[#144833] p-1 flex flex-col justify-between group hover:border-emerald-400 transition-colors cursor-pointer">
                                    <span className="text-zinc-400 font-mono text-[9px] text-right">10</span>
                                    <div className="text-center">
                                        <div className="text-emerald-400 font-bold font-mono text-[11px] leading-tight">+$600</div>
                                        <div className="text-[8px] text-zinc-400 font-mono">1 trade · 100%</div>
                                    </div>
                                </div>
                                <div className="h-14 rounded bg-[#0A1B14] border border-[#144833] p-1 flex flex-col justify-between group hover:border-emerald-400 transition-colors cursor-pointer">
                                    <span className="text-zinc-400 font-mono text-[9px] text-right">11</span>
                                    <div className="text-center">
                                        <div className="text-emerald-400 font-bold font-mono text-[11px] leading-tight">+$1.09K</div>
                                        <div className="text-[8px] text-zinc-400 font-mono">2 trades · 50%</div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="h-14 rounded bg-[#0E0F14] border border-[#1E202A] p-1 text-right text-zinc-600 font-mono text-[9px]">10</div>
                                <div className="h-14 rounded bg-[#0E0F14] border border-[#1E202A] p-1 text-right text-zinc-600 font-mono text-[9px]">11</div>
                            </>
                        )}

                        <div className="h-14 rounded bg-[#0E0F14] border border-[#1E202A] p-1 text-right text-zinc-600 font-mono text-[9px]">12</div>

                        {hasData ? (
                            <>
                                <div className="h-14 rounded bg-[#241113] border border-[#521C22] p-1 flex flex-col justify-between group hover:border-rose-400 transition-colors cursor-pointer">
                                    <span className="text-zinc-400 font-mono text-[9px] text-right">13</span>
                                    <div className="text-center">
                                        <div className="text-rose-400 font-bold font-mono text-[11px] leading-tight">-$638</div>
                                        <div className="text-[8px] text-zinc-400 font-mono">2 trades · 0.0%</div>
                                    </div>
                                </div>
                                <div className="h-14 rounded bg-[#0A1B14] border border-[#144833] p-1 flex flex-col justify-between group hover:border-emerald-400 transition-colors cursor-pointer">
                                    <div className="flex justify-between items-center text-[9px]">
                                        <svg className="w-2.5 h-2.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                        <span className="text-zinc-400 font-mono">14</span>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-emerald-400 font-bold font-mono text-[11px] leading-tight">+$556</div>
                                        <div className="text-[8px] text-zinc-400 font-mono">3 trades · 33%</div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="h-14 rounded bg-[#0E0F14] border border-[#1E202A] p-1 text-right text-zinc-600 font-mono text-[9px]">13</div>
                                <div className="h-14 rounded bg-[#0E0F14] border border-[#1E202A] p-1 text-right text-zinc-600 font-mono text-[9px]">14</div>
                            </>
                        )}

                        <div className="h-14 rounded bg-[#0E0F14] border border-[#1E202A] p-1 text-right text-zinc-600 font-mono text-[9px]">15</div>
                    </div>

                    {/* Calendar row 4 */}
                    <div className="grid grid-cols-7 gap-1">
                        <div className="h-14 rounded bg-[#0E0F14] border border-[#1E202A] p-1 text-right text-zinc-600 font-mono text-[9px]">16</div>
                        {hasData ? (
                            <>
                                <div className="h-14 rounded bg-[#241113] border border-[#521C22] p-1 flex flex-col justify-between group hover:border-rose-400 transition-colors cursor-pointer">
                                    <span className="text-zinc-400 font-mono text-[9px] text-right">17</span>
                                    <div className="text-center">
                                        <div className="text-rose-400 font-bold font-mono text-[11px] leading-tight">-$788</div>
                                        <div className="text-[8px] text-zinc-400 font-mono">3 trades · 0.0%</div>
                                    </div>
                                </div>
                                <div className="h-14 rounded bg-[#0A1B14] border border-[#144833] p-1 flex flex-col justify-between group hover:border-emerald-400 transition-colors cursor-pointer">
                                    <div className="flex justify-between items-center text-[9px]">
                                        <svg className="w-2.5 h-2.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                        <span className="text-zinc-400 font-mono">18</span>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-emerald-400 font-bold font-mono text-[11px] leading-tight">+$875</div>
                                        <div className="text-[8px] text-zinc-400 font-mono">2 trades · 100%</div>
                                    </div>
                                </div>
                                <div className="h-14 rounded bg-[#0A1B14] border border-[#144833] p-1 flex flex-col justify-between group hover:border-emerald-400 transition-colors cursor-pointer">
                                    <div className="flex justify-between items-center text-[9px]">
                                        <svg className="w-2.5 h-2.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                        <span className="text-zinc-400 font-mono">19</span>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-emerald-400 font-bold font-mono text-[11px] leading-tight">+$608</div>
                                        <div className="text-[8px] text-zinc-400 font-mono">1 trade · 100%</div>
                                    </div>
                                </div>
                                <div className="h-14 rounded bg-[#0A1B14] border border-[#144833] p-1 flex flex-col justify-between group hover:border-emerald-400 transition-colors cursor-pointer">
                                    <span className="text-zinc-400 font-mono text-[9px] text-right">20</span>
                                    <div className="text-center">
                                        <div className="text-emerald-400 font-bold font-mono text-[11px] leading-tight">+$1.18K</div>
                                        <div className="text-[8px] text-zinc-400 font-mono">5 trades · 40%</div>
                                    </div>
                                </div>
                                <div className="h-14 rounded bg-[#0A1B14] border border-[#144833] p-1 flex flex-col justify-between group hover:border-emerald-400 transition-colors cursor-pointer">
                                    <span className="text-zinc-400 font-mono text-[9px] text-right">21</span>
                                    <div className="text-center">
                                        <div className="text-emerald-400 font-bold font-mono text-[11px] leading-tight">+$113</div>
                                        <div className="text-[8px] text-zinc-400 font-mono">3 trades · 50%</div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="h-14 rounded bg-[#0E0F14] border border-[#1E202A] p-1 text-right text-zinc-600 font-mono text-[9px]">17</div>
                                <div className="h-14 rounded bg-[#0E0F14] border border-[#1E202A] p-1 text-right text-zinc-600 font-mono text-[9px]">18</div>
                                <div className="h-14 rounded bg-[#0E0F14] border border-[#1E202A] p-1 text-right text-zinc-600 font-mono text-[9px]">19</div>
                                <div className="h-14 rounded bg-[#0E0F14] border border-[#1E202A] p-1 text-right text-zinc-600 font-mono text-[9px]">20</div>
                                <div className="h-14 rounded bg-[#0E0F14] border border-[#1E202A] p-1 text-right text-zinc-600 font-mono text-[9px]">21</div>
                            </>
                        )}
                        <div className="h-14 rounded bg-[#0E0F14] border border-[#1E202A] p-1 text-right text-zinc-600 font-mono text-[9px]">22</div>
                    </div>

                    {/* Calendar row 5 */}
                    <div className="grid grid-cols-7 gap-1">
                        <div className="h-14 rounded bg-[#0E0F14] border border-[#1E202A] p-1 text-right text-zinc-600 font-mono text-[9px]">23</div>
                        {hasData ? (
                            <>
                                <div className="h-14 rounded bg-[#0A1B14] border border-[#144833] p-1 flex flex-col justify-between group hover:border-emerald-400 transition-colors cursor-pointer">
                                    <span className="text-zinc-400 font-mono text-[9px] text-right">24</span>
                                    <div className="text-center">
                                        <div className="text-emerald-400 font-bold font-mono text-[11px] leading-tight">+$225</div>
                                        <div className="text-[8px] text-zinc-400 font-mono">3 trades · 33%</div>
                                    </div>
                                </div>
                                <div className="h-14 rounded bg-[#0A1B14] border border-[#144833] p-1 flex flex-col justify-between group hover:border-emerald-400 transition-colors cursor-pointer">
                                    <div className="flex justify-between items-center text-[9px]">
                                        <svg className="w-2.5 h-2.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                        <span className="text-zinc-400 font-mono">25</span>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-emerald-400 font-bold font-mono text-[11px] leading-tight">+$300</div>
                                        <div className="text-[8px] text-zinc-400 font-mono">3 trades · 33%</div>
                                    </div>
                                </div>
                                <div className="h-14 rounded bg-[#241113] border border-[#521C22] p-1 flex flex-col justify-between group hover:border-rose-400 transition-colors cursor-pointer">
                                    <div className="flex justify-between items-center text-[9px]">
                                        <svg className="w-2.5 h-2.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                                        <span className="text-zinc-400 font-mono">26</span>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-rose-400 font-bold font-mono text-[11px] leading-tight">-$37.5</div>
                                        <div className="text-[8px] text-zinc-400 font-mono">1 trade · 0.0%</div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="h-14 rounded bg-[#0E0F14] border border-[#1E202A] p-1 text-right text-zinc-600 font-mono text-[9px]">24</div>
                                <div className="h-14 rounded bg-[#0E0F14] border border-[#1E202A] p-1 text-right text-zinc-600 font-mono text-[9px]">25</div>
                                <div className="h-14 rounded bg-[#0E0F14] border border-[#1E202A] p-1 text-right text-zinc-600 font-mono text-[9px]">26</div>
                            </>
                        )}

                        {[27, 28, 29].map(day => (
                            <div key={day} className="h-14 rounded bg-[#0E0F14] border border-[#1E202A] p-1 text-right text-zinc-600 font-mono text-[9px]">{day}</div>
                        ))}
                    </div>

                    {/* Calendar row 6 */}
                    <div className="grid grid-cols-7 gap-1">
                        <div className="h-14 rounded bg-[#0E0F14] border border-[#1E202A] p-1 text-right text-zinc-600 font-mono text-[9px]">30</div>
                        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-14 rounded bg-[#0D0E12] border border-[#181920]"></div>)}
                    </div>
                </div>

                <div className="sm:col-span-2 flex flex-col justify-between pt-6 space-y-1 text-center font-mono">
                    <div className="h-14 rounded bg-[#13141A] border border-[#1E2028] p-1.5 flex flex-col justify-center items-center">
                        <span className="text-[9px] text-zinc-400">Week 1</span>
                        <span className="text-zinc-500 font-bold text-[10px]">$0</span>
                        <span className="text-[8px] text-zinc-600">0 days</span>
                    </div>
                    <div className="h-14 rounded bg-[#13141A] border border-[#1E2028] p-1.5 flex flex-col justify-center items-center">
                        <span className="text-[9px] text-zinc-400">Week 2</span>
                        {hasData ? <span className="text-emerald-400 font-bold text-[10px]">+$1.05K</span> : <span className="text-zinc-500 font-bold text-[10px]">$0</span>}
                        <span className="text-[8px] text-zinc-500">{hasData ? '1 day' : '0 days'}</span>
                    </div>
                    <div className="h-14 rounded bg-[#13141A] border border-[#1E2028] p-1.5 flex flex-col justify-center items-center">
                        <span className="text-[9px] text-zinc-400">Week 3</span>
                        {hasData ? <span className="text-emerald-400 font-bold text-[10px]">+$1.61K</span> : <span className="text-zinc-500 font-bold text-[10px]">$0</span>}
                        <span className="text-[8px] text-zinc-500">{hasData ? '4 days' : '0 days'}</span>
                    </div>
                    <div className="h-14 rounded bg-[#13141A] border border-[#1E2028] p-1.5 flex flex-col justify-center items-center">
                        <span className="text-[9px] text-zinc-400">Week 4</span>
                        {hasData ? <span className="text-emerald-400 font-bold text-[10px]">+$1.98K</span> : <span className="text-zinc-500 font-bold text-[10px]">$0</span>}
                        <span className="text-[8px] text-zinc-500">{hasData ? '5 days' : '0 days'}</span>
                    </div>
                    <div className="h-14 rounded bg-[#13141A] border border-[#1E2028] p-1.5 flex flex-col justify-center items-center">
                        <span className="text-[9px] text-zinc-400">Week 5</span>
                        {hasData ? <span className="text-emerald-400 font-bold text-[10px]">+$488</span> : <span className="text-zinc-500 font-bold text-[10px]">$0</span>}
                        <span className="text-[8px] text-zinc-500">{hasData ? '3 days' : '0 days'}</span>
                    </div>
                    <div className="h-14 rounded bg-[#13141A] border border-[#1E2028] p-1.5 flex flex-col justify-center items-center">
                        <span className="text-[9px] text-zinc-400">Week 6</span>
                        <span className="text-zinc-500 font-bold text-[10px]">$0</span>
                        <span className="text-[8px] text-zinc-600">0 days</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
