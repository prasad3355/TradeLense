import React from 'react';

export function PnlChart({ data }: { data: any }) {
    const hasData = data.tradeCount > 0;

    return (
        <div className="lg:col-span-6 bg-[#101116] border border-[#1E2028] rounded-md p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E2028]">
                <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-semibold text-zinc-200">Daily net cumulative P&L</span>
                    <button className="text-zinc-500 hover:text-zinc-300">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"></circle><line strokeWidth="2" x1="12" x2="12" y1="16" y2="12"></line><line strokeWidth="2" x1="12" x2="12.01" y1="8" y2="8"></line></svg>
                    </button>
                </div>
                <div className="flex items-center space-x-2 text-[10px] font-mono">
                    <span className="text-emerald-400 font-bold">{hasData ? `+$${data.netPl.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '+$0.00'}</span>
                    <span className="text-zinc-600">|</span>
                    <span className="text-zinc-400">ATH: {hasData ? '$7.24K' : '$0.00K'}</span>
                </div>
            </div>

            <div className="relative w-full h-48 mt-2 flex">
                <div className="flex flex-col justify-between text-[9px] font-mono text-zinc-500 pr-2 py-1 select-none text-right w-12">
                    <span className="">$8,000</span>
                    <span className="">$7,000</span>
                    <span className="">$6,000</span>
                    <span className="">$5,000</span>
                    <span className="">$4,000</span>
                    <span className="">$3,000</span>
                    <span className="">$2,000</span>
                    <span className="">$1,000</span>
                    <span className="">$0</span>
                </div>

                <div className="flex-1 relative">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 180">
                        <defs>
                            <linearGradient id="equityGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                                <stop offset="0%" stopColor="#10B981" stopOpacity="0.32"></stop>
                                <stop offset="65%" stopColor="#10B981" stopOpacity="0.08"></stop>
                                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0"></stop>
                            </linearGradient>
                        </defs>
                        <line stroke="#1A1C25" strokeDasharray="2 3" strokeWidth="1" x1="0" x2="500" y1="20" y2="20"></line>
                        <line stroke="#1A1C25" strokeDasharray="2 3" strokeWidth="1" x1="0" x2="500" y1="40" y2="40"></line>
                        <line stroke="#1A1C25" strokeDasharray="2 3" strokeWidth="1" x1="0" x2="500" y1="60" y2="60"></line>
                        <line stroke="#1A1C25" strokeDasharray="2 3" strokeWidth="1" x1="0" x2="500" y1="80" y2="80"></line>
                        <line stroke="#1A1C25" strokeDasharray="2 3" strokeWidth="1" x1="0" x2="500" y1="100" y2="100"></line>
                        <line stroke="#1A1C25" strokeDasharray="2 3" strokeWidth="1" x1="0" x2="500" y1="120" y2="120"></line>
                        <line stroke="#1A1C25" strokeDasharray="2 3" strokeWidth="1" x1="0" x2="500" y1="140" y2="140"></line>
                        <line stroke="#1A1C25" strokeDasharray="2 3" strokeWidth="1" x1="0" x2="500" y1="160" y2="160"></line>

                        {hasData ? (
                            <>
                                <path d="M 0,175 L 35,160 Q 80,120 120,95 T 180,68 T 225,85 T 260,70 T 320,105 T 390,40 T 450,22 L 500,20 L 500,178 L 0,178 Z" fill="url(#equityGradient)"></path>
                                <path d="M 0,175 L 35,160 Q 80,120 120,95 T 180,68 T 225,85 T 260,70 T 320,105 T 390,40 T 450,22 L 500,20" fill="none" stroke="#34D399" strokeLinecap="round" strokeWidth="2"></path>
                                <circle cx="500" cy="20" fill="#10B981" r="3.5" stroke="#08090C" strokeWidth="2"></circle>
                            </>
                        ) : (
                            <>
                                <path d="M 0,175 L 500,175 L 500,178 L 0,178 Z" fill="url(#equityGradient)"></path>
                                <path d="M 0,175 L 500,175" fill="none" stroke="#34D399" strokeLinecap="round" strokeWidth="2"></path>
                                <circle cx="500" cy="175" fill="#10B981" r="3.5" stroke="#08090C" strokeWidth="2"></circle>
                            </>
                        )}

                    </svg>
                    <div className="flex justify-between text-[9px] font-mono text-zinc-500 pt-1.5">
                        <span className="">03/19/23</span>
                        <span className="">06/11/24</span>
                        <span className="">06/18/24</span>
                        <span className="">06/24/24</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
