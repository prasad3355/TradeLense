import React from 'react';

export function DashboardHeader({ isDemoMode, setIsDemoMode }: { isDemoMode: boolean, setIsDemoMode: (val: boolean) => void }) {
    return (
        <header className="w-full bg-[#0B0C10] border-b border-[#1E2028] px-4 lg:px-6 py-2.5 flex items-center justify-between gap-3 sticky top-0 z-50 min-w-0">
            {/* Left: brand + breadcrumb — allow this group to shrink before right controls overflow */}
            <div className="flex items-center gap-3 min-w-0 shrink">
                <div className="flex items-center gap-2 shrink-0">
                    <div className="w-6 h-6 rounded bg-gradient-to-tr from-violet-600 via-indigo-600 to-emerald-400 flex items-center justify-center font-black text-white text-[11px] shadow-sm">
                        TL
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="font-bold tracking-wider text-[13px] text-white whitespace-nowrap">TRADELENSE</span>
                        <span className="hidden sm:inline text-[9px] uppercase px-1 py-0.5 rounded bg-[#1D1F28] text-violet-400 font-mono tracking-tight font-medium border border-violet-500/20">OS v2.4</span>
                    </div>
                </div>
                <div className="h-4 w-px bg-zinc-800 hidden md:block shrink-0"></div>
                <div className="hidden md:flex items-center gap-1.5 text-[11px] text-zinc-400 min-w-0">
                    <span className="text-zinc-200 font-medium whitespace-nowrap">Dashboard</span>
                    <span className="text-zinc-600">/</span>
                    <span className="hidden lg:inline text-zinc-500 whitespace-nowrap">Last import:</span>
                    <span className="text-zinc-400 font-mono hidden lg:inline truncate">Nov 19, 2024 09:01 AM</span>
                    <button className="text-violet-400 hover:text-violet-300 font-medium text-[11px] transition-colors underline decoration-violet-500/30 underline-offset-2 whitespace-nowrap shrink-0">
                        Resync
                    </button>
                </div>
            </div>

            {/* Right: action buttons — shrink-0 so they never collapse */}
            <div className="flex items-center gap-1.5 shrink-0">
                {/* Currency selector — always visible */}
                <button className="flex items-center gap-1 px-2 py-1.5 bg-[#14151B] hover:bg-[#1A1C24] border border-[#1E2028] rounded text-[11px] text-zinc-300 transition-colors whitespace-nowrap">
                    <span className="w-3.5 h-3.5 rounded-full bg-zinc-800 flex items-center justify-center text-[9px] text-emerald-400 font-mono font-bold shrink-0">$</span>
                    <span className="font-medium">USD</span>
                    <svg className="w-3 h-3 text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </button>
                {/* Filters — hidden below md */}
                <button className="hidden md:flex items-center gap-1 px-2 py-1.5 bg-[#14151B] hover:bg-[#1A1C24] border border-[#1E2028] rounded text-[11px] text-zinc-300 transition-colors whitespace-nowrap">
                    <svg className="w-3 h-3 text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                    <span>Filters</span>
                    <svg className="w-3 h-3 text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </button>
                {/* Date range — hidden below lg */}
                <button className="hidden lg:flex items-center gap-1 px-2 py-1.5 bg-[#14151B] hover:bg-[#1A1C24] border border-[#1E2028] rounded text-[11px] text-zinc-300 transition-colors whitespace-nowrap">
                    <svg className="w-3 h-3 text-zinc-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                    <span>June 2024</span>
                    <svg className="w-3 h-3 text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                </button>
                {/* Demo toggle — always visible, primary UX control; label shortened on small screens */}
                <button
                    onClick={() => setIsDemoMode(!isDemoMode)}
                    className="flex items-center gap-1.5 px-2 py-1.5 bg-[#171922] border border-violet-500/30 hover:border-violet-500/60 rounded text-[11px] text-zinc-200 transition-all cursor-pointer shadow-sm whitespace-nowrap"
                    title="Toggle between populated Demo state and Empty zero-data state"
                >
                    <span className={`w-2 h-2 rounded-full shrink-0 ${isDemoMode ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`}></span>
                    <span className="font-medium hidden sm:inline">{isDemoMode ? 'Demo Data' : 'Empty State'}</span>
                    <span className="font-medium sm:hidden">{isDemoMode ? 'Demo' : 'Empty'}</span>
                    {isDemoMode ? (
                        <span className="text-[9px] bg-violet-950/70 border border-violet-500/40 text-violet-300 px-1 rounded font-mono">ON</span>
                    ) : (
                        <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1 rounded font-mono">OFF</span>
                    )}
                </button>
                {/* Start my day — hidden below xl to free space at 1366px */}
                <button className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded text-[11px] font-medium transition-all shadow-md shadow-blue-900/20 active:scale-95 whitespace-nowrap">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
                    <span>Start my day</span>
                </button>
                {/* Ask Lens AI — always visible; label hidden on xs */}
                <button className="flex items-center gap-1 px-2.5 py-1.5 bg-[#1B1629] border border-purple-500/40 hover:border-purple-400 text-purple-200 rounded text-[11px] font-medium transition-colors shadow-sm whitespace-nowrap">
                    <svg className="w-3.5 h-3.5 text-purple-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z"></path>
                    </svg>
                    <span className="font-semibold tracking-wide hidden sm:inline">Ask Lens AI</span>
                </button>
            </div>
        </header>
    );
}
