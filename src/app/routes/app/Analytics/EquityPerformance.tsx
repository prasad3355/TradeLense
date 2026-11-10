import React from 'react';

export function EquityPerformance() {
    return (
        <div className="lg:col-span-7 flex flex-col bg-[#141416] border border-[#202126] rounded-xl p-7 lg:p-8 min-h-[440px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-4">
                <div>
                    <h3 className="font-display text-[18px] font-bold text-[#F3F3F5] tracking-tight">EQUITY PERFORMANCE</h3>
                    <p className="font-body text-[13px] text-[#9999A2] mt-0.5">Cumulative P&amp;L across the selected trading period.</p>
                </div>
                <div className="inline-flex p-1 bg-[#1A1A20] border border-[#25252E] rounded-lg text-[12px] font-mono self-start">
                    <button className="px-3 py-1 rounded bg-[#3B82F6] text-white font-medium shadow-sm transition-all" type="button">P&amp;L</button>
                    <button className="px-3 py-1 rounded text-[#9999A2] hover:text-[#F3F3F5] transition-colors" type="button">Return %</button>
                    <button className="px-3 py-1 rounded text-[#9999A2] hover:text-[#F3F3F5] transition-colors" type="button">Daily</button>
                </div>
            </div>

            <div className="relative w-full h-[330px] my-3">
                <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 720 310" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="heroEquityGrad" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.28"></stop>
                            <stop offset="65%" stopColor="#6366F1" stopOpacity="0.08"></stop>
                            <stop offset="100%" stopColor="#090909" stopOpacity="0.0"></stop>
                        </linearGradient>
                        <linearGradient gradientUnits="userSpaceOnUse" id="heroEquityLine" x1="0" x2="720" y1="0" y2="0">
                            <stop offset="0%" stopColor="#38BDF8"></stop>
                            <stop offset="50%" stopColor="#3B82F6"></stop>
                            <stop offset="100%" stopColor="#818CF8"></stop>
                        </linearGradient>
                    </defs>
                    <line stroke="#1F2027" strokeDasharray="4 4" strokeWidth="1" x1="15" x2="705" y1="40" y2="40"></line>
                    <line stroke="#1F2027" strokeDasharray="4 4" strokeWidth="1" x1="15" x2="705" y1="105" y2="105"></line>
                    <line stroke="#1F2027" strokeDasharray="4 4" strokeWidth="1" x1="15" x2="705" y1="170" y2="170"></line>
                    <line stroke="#1F2027" strokeDasharray="4 4" strokeWidth="1" x1="15" x2="705" y1="235" y2="235"></line>

                    <text fill="#6F7078" fontFamily="JetBrains Mono" fontSize="11" textAnchor="end" x="710" y="44">+$2,500</text>
                    <text fill="#6F7078" fontFamily="JetBrains Mono" fontSize="11" textAnchor="end" x="710" y="109">+$1,800</text>
                    <text fill="#6F7078" fontFamily="JetBrains Mono" fontSize="11" textAnchor="end" x="710" y="174">+$1,000</text>
                    <text fill="#6F7078" fontFamily="JetBrains Mono" fontSize="11" textAnchor="end" x="710" y="239">$0</text>

                    <polygon fill="url(#heroEquityGrad)" points="25,235 60,230 100,205 145,212 200,170 240,178 295,138 345,152 400,112 455,138 515,96 565,104 625,62 660,74 695,38 695,235 25,235"></polygon>
                    <line stroke="#262732" strokeDasharray="3 3" strokeWidth="1.2" x1="25" x2="695" y1="235" y2="195"></line>
                    <polyline fill="none" points="25,235 60,230 100,205 145,212 200,170 240,178 295,138 345,152 400,112 455,138 515,96 565,104 625,62 660,74 695,38" stroke="url(#heroEquityLine)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></polyline>

                    <circle cx="695" cy="38" fill="#141416" r="6" stroke="#38BDF8" strokeWidth="3"></circle>
                    <circle cx="695" cy="38" fill="#FFFFFF" r="2.5"></circle>

                    <g transform="translate(500, 10)">
                        <rect fill="#1A1A22" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.6))" height="44" rx="7" stroke="#2D2E3B" strokeWidth="1" width="180"></rect>
                        <text fill="#9999A2" fontFamily="Inter" fontSize="11" x="12" y="19">Trade #65 Peak Run</text>
                        <text fill="#10B981" fontFamily="JetBrains Mono" fontSize="12" fontWeight="600" x="12" y="34">+$2,482.50 <tspan fill="#F3F3F5" fontWeight="400">(+24.8%)</tspan></text>
                    </g>

                    <text fill="#6F7078" fontFamily="JetBrains Mono" fontSize="11" x="25" y="275">Jun 01</text>
                    <text fill="#6F7078" fontFamily="JetBrains Mono" fontSize="11" x="190" y="275">Jun 08</text>
                    <text fill="#6F7078" fontFamily="JetBrains Mono" fontSize="11" x="355" y="275">Jun 15</text>
                    <text fill="#6F7078" fontFamily="JetBrains Mono" fontSize="11" x="520" y="275">Jun 22</text>
                    <text fill="#6F7078" fontFamily="JetBrains Mono" fontSize="11" x="665" y="275">Jun 28</text>
                </svg>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-[#1E1F24]">
                <div>
                    <span className="font-mono text-[11px] text-[#6F7078] block">INITIAL CAPITAL</span>
                    <span className="font-mono text-[13px] text-[#F3F3F5] font-semibold">$10,000.00</span>
                </div>
                <div>
                    <span className="font-mono text-[11px] text-[#6F7078] block">PEAK EQUITY</span>
                    <span className="font-mono text-[13px] text-[#10B981] font-semibold">$12,482.50</span>
                </div>
                <div>
                    <span className="font-mono text-[11px] text-[#6F7078] block">CURRENT RUN-UP</span>
                    <span className="font-mono text-[13px] text-[#38BDF8] font-semibold">+$2,482.50</span>
                </div>
                <div>
                    <span className="font-mono text-[11px] text-[#6F7078] block">SHARPE RATIO</span>
                    <span className="font-mono text-[13px] text-[#A78BFA] font-semibold">2.38</span>
                </div>
            </div>
        </div>
    );
}
