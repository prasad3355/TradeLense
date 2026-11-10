import React, { useState } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { KpiCards } from './KpiCards';
import { PerformanceCalendar } from './PerformanceCalendar';
import { ScoreCard } from './ScoreCard';
import { PnlChart } from './PnlChart';
import { RecentTrades } from './RecentTrades';
import { AiInsight } from './AiInsight';
import { dummyData, emptyData } from './data';

export function Dashboard() {
    const [isDemoMode, setIsDemoMode] = useState(true);
    const data = isDemoMode ? dummyData : emptyData;

    // We are using a fixed positioned full screen layout for Dashboard 
    // to override the AppLayout container padding/sidebar, giving it the 1:1 edge-to-edge look.

    return (
        <div className="fixed inset-0 z-[100] bg-[#08090C] text-[#E2E6EE] overflow-y-auto w-full h-[100dvh] text-xs select-none pb-12 antialiased" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
            <DashboardHeader isDemoMode={isDemoMode} setIsDemoMode={setIsDemoMode} />

            <style>
                {`
                  .dashboard-scroll::-webkit-scrollbar {
                    width: 5px;
                    height: 5px;
                  }
                  .dashboard-scroll::-webkit-scrollbar-track {
                    background: #0B0C0E;
                  }
                  .dashboard-scroll::-webkit-scrollbar-thumb {
                    background: #232630;
                    border-radius: 3px;
                  }
                  .dashboard-scroll::-webkit-scrollbar-thumb:hover {
                    background: #323644;
                  }
                `}
            </style>
            <main className="w-full max-w-[1720px] mx-auto px-3 sm:px-4 lg:px-6 pt-3 space-y-3 dashboard-scroll overflow-x-hidden">
                <KpiCards data={data} />

                <section className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                    <PerformanceCalendar data={data} isDemoMode={isDemoMode} />
                    <ScoreCard data={data} />
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                    <PnlChart data={data} />
                    <RecentTrades data={data} />
                </section>

                <AiInsight isDemoMode={isDemoMode} />
            </main>
        </div>
    );
}
