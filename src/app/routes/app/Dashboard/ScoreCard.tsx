import React from 'react';

export function ScoreCard({ data }: { data: any }) {
    const hasData = data.tradeCount > 0;
    return (
        <div className="lg:col-span-4 bg-[#101116] border border-[#1E2028] rounded-md p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E2028]">
                <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-semibold text-zinc-200">Lense Score</span>
                    <button className="text-zinc-500 hover:text-zinc-300">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"></circle><line strokeWidth="2" x1="12" x2="12" y1="16" y2="12"></line><line strokeWidth="2" x1="12" x2="12.01" y1="8" y2="8"></line></svg>
                    </button>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-950/60 border border-violet-500/30 text-violet-300 font-mono font-medium">Institutional Grade</span>
            </div>

            <div className="relative py-2 flex items-center justify-center">
                <svg className="w-full max-w-[260px] h-auto overflow-visible" viewBox="0 0 260 260">
                    <polygon fill="none" points="130,45 203,87 203,173 130,215 57,173 57,87" stroke="#232635" strokeDasharray="2 2" strokeWidth="1"></polygon>
                    <polygon fill="none" points="130,62 188,96 188,164 130,198 72,164 72,96" stroke="#1D202D" strokeWidth="1"></polygon>
                    <polygon fill="none" points="130,79 174,104 174,156 130,181 86,156 86,104" stroke="#181A24" strokeWidth="1"></polygon>
                    <polygon fill="none" points="130,96 159,113 159,147 130,164 101,147 101,113" stroke="#14161E" strokeWidth="1"></polygon>

                    <line stroke="#232635" strokeWidth="1" x1="130" x2="130" y1="130" y2="45"></line>
                    <line stroke="#232635" strokeWidth="1" x1="130" x2="203" y1="130" y2="87"></line>
                    <line stroke="#232635" strokeWidth="1" x1="130" x2="203" y1="130" y2="173"></line>
                    <line stroke="#232635" strokeWidth="1" x1="130" x2="130" y1="130" y2="215"></line>
                    <line stroke="#232635" strokeWidth="1" x1="130" x2="57" y1="130" y2="173"></line>
                    <line stroke="#232635" strokeWidth="1" x1="130" x2="57" y1="130" y2="87"></line>

                    <polygon
                        fill={hasData ? "rgba(124, 58, 237, 0.28)" : "transparent"}
                        points={hasData ? "130,60 192,94 185,160 130,190 70,158 80,95" : "130,130 130,130 130,130 130,130 130,130 130,130"}
                        stroke={hasData ? "#8B5CF6" : "transparent"}
                        strokeWidth="1.8"
                    ></polygon>

                    {hasData && (
                        <>
                            <circle cx="130" cy="60" fill="#A78BFA" r="3"></circle>
                            <circle cx="192" cy="94" fill="#A78BFA" r="3"></circle>
                            <circle cx="185" cy="160" fill="#A78BFA" r="3"></circle>
                            <circle cx="130" cy="190" fill="#A78BFA" r="3"></circle>
                            <circle cx="70" cy="158" fill="#A78BFA" r="3"></circle>
                            <circle cx="80" cy="95" fill="#A78BFA" r="3"></circle>
                        </>
                    )}

                    <text fill="#A1A7B8" fontFamily="sans-serif" fontSize="9" textAnchor="middle" x="130" y="36">Win %</text>
                    <text fill="#A1A7B8" fontFamily="sans-serif" fontSize="9" textAnchor="start" x="212" y="86">Profit factor</text>
                    <text fill="#A1A7B8" fontFamily="sans-serif" fontSize="9" textAnchor="start" x="212" y="177">Avg win/loss</text>
                    <text fill="#A1A7B8" fontFamily="sans-serif" fontSize="9" textAnchor="middle" x="130" y="230">Recovery factor</text>
                    <text fill="#A1A7B8" fontFamily="sans-serif" fontSize="9" textAnchor="end" x="48" y="177">Max drawdown</text>
                    <text fill="#A1A7B8" fontFamily="sans-serif" fontSize="9" textAnchor="end" x="48" y="86">Consistency</text>
                </svg>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#1E2028]">
                <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-zinc-400">Your Lense Score</span>
                    <span className="font-mono text-xl font-bold text-white tracking-tight">{hasData ? data.lenseScore : '—'}</span>
                </div>
                <div className="relative pt-1">
                    <div className="h-2 w-full rounded-full bg-gradient-to-r from-rose-600 via-amber-500 to-emerald-500 relative">
                        <div
                            className="absolute -top-1 w-4 h-4 bg-white border-2 border-zinc-950 rounded-full shadow -ml-2 flex items-center justify-center transition-all duration-700"
                            style={{ left: hasData ? `${data.lenseScore}%` : '0%' }}
                        >
                            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex justify-between text-[8px] font-mono text-zinc-500 mt-1.5 px-0.5">
                        <span className="">0</span>
                        <span className="">20</span>
                        <span className="">40</span>
                        <span className="">60</span>
                        <span className="">80</span>
                        <span className="">100</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
