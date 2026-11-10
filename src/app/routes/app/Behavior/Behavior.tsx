import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import { BehaviorHeader } from './BehaviorHeader';
import { BehaviorEmptyState } from './BehaviorEmptyState';
import { BehaviorOverview } from './BehaviorOverview';
import { EmotionalDistribution } from './EmotionalDistribution';
import { SessionBehavior } from './SessionBehavior';
import { RuleAdherence } from './RuleAdherence';
import { TradingConsistency } from './TradingConsistency';
import { RiskHabits } from './RiskHabits';
import { BehaviorTrends } from './BehaviorTrends';
import { BehaviorInsights } from './BehaviorInsights';
import { sampleBehaviorData } from './behaviorData';
import { Sparkles, X } from 'lucide-react';

export function Behavior() {
    const { session } = useAuth();
    const [trades, setTrades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPreview, setIsPreview] = useState(false);
    const [selectedDateRange, setSelectedDateRange] = useState('Last 30 Days');

    useEffect(() => {
        const fetchTrades = async () => {
            if (!session?.access_token) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const res = await fetch(`/api/trades?page=1&pageSize=1000`, {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    setTrades(data.data || []);
                }
            } catch (err) {
                console.error('Error fetching behavior trades', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrades();
    }, [session]);

    const hasRealTrades = trades.length > 0;
    const showPreview = isPreview || !hasRealTrades;
    const isZeroState = !hasRealTrades && !isPreview;

    return (
        <div className="flex flex-col w-full gap-6 pb-12">
            {/* Header */}
            <BehaviorHeader
                showPreview={showPreview}
                togglePreview={() => setIsPreview(!isPreview)}
                hasRealTrades={hasRealTrades}
                tradeCount={trades.length}
                selectedDateRange={selectedDateRange}
                onDateRangeChange={setSelectedDateRange}
            />

            {/* Zero State if not in preview and no trades */}
            {isZeroState && (
                <BehaviorEmptyState onExplorePreview={() => setIsPreview(true)} />
            )}

            {/* Populated / Demo Preview Dashboard */}
            {!isZeroState && (
                <div className="flex flex-col gap-6 animate-fade-in">
                    {/* Demo Preview Notification Banner */}
                    {showPreview && (
                        <div className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-[#181524] border border-[#3E2E69]/70 text-[#C4B5FD] text-[12px] font-mono">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6] animate-pulse" />
                                <span>
                                    DEMO PREVIEW ACTIVE — Displaying 58 illustrative executions. No changes written to database.
                                </span>
                            </div>
                            {!hasRealTrades && (
                                <button
                                    onClick={() => setIsPreview(false)}
                                    className="text-[#9999A2] hover:text-white flex items-center gap-1 text-[11px] underline cursor-pointer"
                                >
                                    <span>Reset to Empty State</span>
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Section B: Behavioral Overview KPI Cards */}
                    <BehaviorOverview
                        overview={sampleBehaviorData.overview}
                        isPreview={showPreview}
                    />

                    {/* Section C1: Emotional State Distribution */}
                    <EmotionalDistribution items={sampleBehaviorData.emotionalStates} />

                    {/* Section C2: Trading Behavior by Session */}
                    <SessionBehavior sessions={sampleBehaviorData.sessions} />

                    {/* Section C3: Rule Adherence Breakdown */}
                    <RuleAdherence
                        rules={sampleBehaviorData.rules}
                        costOfViolations={sampleBehaviorData.costOfViolations}
                    />

                    {/* Section C4 & C5: Trading Consistency & Risk Management Habits */}
                    <section className="grid grid-cols-1 gap-6">
                        <TradingConsistency metrics={sampleBehaviorData.consistency} />
                        <RiskHabits habits={sampleBehaviorData.riskHabits} />
                    </section>

                    {/* Section C6: Behavioral Trends */}
                    <BehaviorTrends trends={sampleBehaviorData.trends} />

                    {/* Section D: Behavioral Insights */}
                    <BehaviorInsights
                        insights={sampleBehaviorData.insights}
                        isPreview={showPreview}
                    />
                </div>
            )}
        </div>
    );
}
export default Behavior;

