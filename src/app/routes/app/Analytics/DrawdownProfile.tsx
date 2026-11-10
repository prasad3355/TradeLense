import React from 'react';

export function DrawdownProfile() {
    return (
        <div className="flex flex-col bg-[#141416] border border-[#202126] rounded-xl p-7 lg:p-8">
            <div className="flex items-center justify-between pb-6 border-b border-[#1E1F24]">
                <div>
                    <h3 className="font-display text-[18px] font-bold text-[#F3F3F5] tracking-tight">DRAWDOWN PROFILE</h3>
                    <p className="font-body text-[13px] text-[#9999A2] mt-0.5">Understand equity retracement and recovery behavior.</p>
                </div>
                <span className="font-mono text-[15px] text-[#EF4444] font-bold">-3.9% Max</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-[#18181C] border border-[#202128] my-6">
                <div>
                    <span className="font-mono text-[11px] text-[#6F7078] block">MAX DRAWDOWN</span>
                    <span className="font-mono text-[13px] text-[#EF4444] font-semibold">-$486.20</span>
                </div>
                <div>
                    <span className="font-mono text-[11px] text-[#6F7078] block">AVG DRAWDOWN</span>
                    <span className="font-mono text-[13px] text-[#F3F3F5] font-semibold">-$142.10</span>
                </div>
                <div>
                    <span className="font-mono text-[11px] text-[#6F7078] block">MAX STREAK</span>
                    <span className="font-mono text-[13px] text-[#F3F3F5] font-semibold">4 trades</span>
                </div>
                <div>
                    <span className="font-mono text-[11px] text-[#6F7078] block">RECOVERY TIME</span>
                    <span className="font-mono text-[13px] text-[#10B981] font-semibold">3 sessions</span>
                </div>
            </div>

            <div className="relative w-full h-[180px]">
                <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 500 160" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="redDrawdownFill" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.0"></stop>
                            <stop offset="100%" stopColor="#EF4444" stopOpacity="0.25"></stop>
                        </linearGradient>
                    </defs>
                    <line stroke="#3B494B" strokeWidth="1.5" x1="0" x2="500" y1="20" y2="20"></line>
                    <text fill="#849495" fontFamily="JetBrains Mono" fontSize="10" textAnchor="end" x="495" y="15">0.0% (Peak)</text>
                    <text fill="#849495" fontFamily="JetBrains Mono" fontSize="10" textAnchor="end" x="495" y="80">-2.0%</text>
                    <text fill="#849495" fontFamily="JetBrains Mono" fontSize="10" textAnchor="end" x="495" y="145">-4.0%</text>
                    <line stroke="#202128" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="500" y1="80" y2="80"></line>
                    <line stroke="#202128" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="500" y1="140" y2="140"></line>

                    <polygon fill="url(#redDrawdownFill)" points="10,20 60,20 80,45 110,30 140,20 180,20 210,65 240,110 260,135 280,70 300,20 340,20 370,40 400,20 450,20 480,20 480,20 10,20"></polygon>
                    <polyline fill="none" points="10,20 60,20 80,45 110,30 140,20 180,20 210,65 240,110 260,135 280,70 300,20 340,20 370,40 400,20 450,20 480,20" stroke="#EF4444" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polyline>

                    <circle cx="260" cy="135" fill="#EF4444" r="4.5"></circle>
                    <text fill="#EF4444" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" x="260" y="155">-3.9% (Trade #38)</text>
                </svg>
            </div>
        </div>
    );
}
