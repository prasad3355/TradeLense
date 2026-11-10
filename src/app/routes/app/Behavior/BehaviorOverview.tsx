import React from 'react';
import { BehavioralOverviewData } from './behaviorData';
import { ShieldCheck, HeartPulse, AlertTriangle, Target, ArrowUpRight } from 'lucide-react';

interface Props {
    overview: BehavioralOverviewData;
    isPreview: boolean;
}

export function BehaviorOverview({ overview, isPreview }: Props) {
    return (
        <section className="flex flex-col bg-[#141416] border border-[#202126] rounded-xl p-6 lg:p-7 relative overflow-hidden">
            {/* Section Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 gap-2 border-b border-[#1E1F24]">
                <div>
                    <div className="flex items-center gap-2.5">
                        <h2 className="font-display text-[18px] lg:text-[20px] font-bold tracking-tight text-[#F3F3F5]">
                            BEHAVIORAL OVERVIEW
                        </h2>
                        {isPreview && (
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1C1A2E] text-[#C4B5FD] border border-[#3E3269]/60 font-medium">
                                PREVIEW DATA
                            </span>
                        )}
                    </div>
                    <p className="font-body text-[13px] text-[#9999A2] mt-0.5">
                        Core psychological indices derived from trade frequency, execution discipline, and composure.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-[12px] font-mono text-[#9999A2]">
                    <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                    <span>58 Evaluated Executions</span>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
                {/* 1. DISCIPLINE SCORE */}
                <div className="flex flex-col justify-between p-4.5 rounded-lg bg-[#18181C] border border-[#202128] hover:border-[#2D2D38] transition-colors relative overflow-hidden group">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#9999A2] flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#8B5CF6]" />
                            Discipline Score
                        </span>
                        <span className="font-mono text-[11px] text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded font-semibold flex items-center gap-0.5">
                            <ArrowUpRight className="w-3 h-3" />
                            +{overview.disciplineChange}%
                        </span>
                    </div>

                    <div className="my-3">
                        <div className="flex items-baseline gap-2">
                            <span className="font-mono text-[32px] font-bold text-[#F3F3F5] tracking-tight leading-none">
                                {overview.disciplineScore}
                            </span>
                            <span className="font-mono text-[13px] text-[#6F7078]">/ 100</span>
                            <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#8B5CF6]/15 text-[#C4B5FD] font-semibold border border-[#8B5CF6]/30 ml-auto">
                                Grade {overview.disciplineGrade}
                            </span>
                        </div>
                        <p className="font-body text-[12px] text-[#9999A2] mt-1.5">
                            High procedural execution across 58 trades.
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <div className="w-full h-1.5 bg-[#25252E] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#6D5CE7] to-[#8B5CF6] rounded-full transition-all duration-700"
                                style={{ width: `${overview.disciplineScore}%` }}
                            />
                        </div>
                        <div className="flex justify-between font-mono text-[10px] text-[#6F7078]">
                            <span>Min 70 Standard</span>
                            <span>Target 85+</span>
                        </div>
                    </div>
                </div>

                {/* 2. RULE ADHERENCE */}
                <div className="flex flex-col justify-between p-4.5 rounded-lg bg-[#18181C] border border-[#202128] hover:border-[#2D2D38] transition-colors relative overflow-hidden group">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#9999A2] flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5 text-[#10B981]" />
                            Rule Adherence
                        </span>
                        <span className="font-mono text-[11px] text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded font-semibold">
                            Target &gt;90%
                        </span>
                    </div>

                    <div className="my-3">
                        <div className="flex items-baseline gap-2">
                            <span className="font-mono text-[32px] font-bold text-[#10B981] tracking-tight leading-none">
                                {overview.ruleAdherence}%
                            </span>
                            <span className="font-mono text-[12px] text-[#6F7078] ml-auto">
                                {overview.rulesCompliantCount}/{overview.rulesTotalCount} setups
                            </span>
                        </div>
                        <p className="font-body text-[12px] text-[#9999A2] mt-1.5">
                            Only 5 discretionary rule breaches recorded.
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <div className="w-full h-1.5 bg-[#25252E] rounded-full overflow-hidden flex">
                            <div className="h-full bg-[#10B981]" style={{ width: `${overview.ruleAdherence}%` }} />
                            <div className="h-full bg-[#EF4444]" style={{ width: `${100 - overview.ruleAdherence}%` }} />
                        </div>
                        <div className="flex justify-between font-mono text-[10px] text-[#6F7078]">
                            <span className="text-[#10B981]">{overview.rulesCompliantCount} Compliant</span>
                            <span className="text-[#EF4444]">{overview.rulesTotalCount - overview.rulesCompliantCount} Deviations</span>
                        </div>
                    </div>
                </div>

                {/* 3. EMOTIONAL STABILITY */}
                <div className="flex flex-col justify-between p-4.5 rounded-lg bg-[#18181C] border border-[#202128] hover:border-[#2D2D38] transition-colors relative overflow-hidden group">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#9999A2] flex items-center gap-1.5">
                            <HeartPulse className="w-3.5 h-3.5 text-[#38BDF8]" />
                            Emotional Stability
                        </span>
                        <span className="font-mono text-[11px] text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded font-semibold">
                            {overview.tiltRiskLevel} Tilt Risk
                        </span>
                    </div>

                    <div className="my-3">
                        <div className="flex items-baseline gap-2">
                            <span className="font-mono text-[32px] font-bold text-[#F3F3F5] tracking-tight leading-none">
                                {overview.emotionalStability}
                            </span>
                            <span className="font-mono text-[13px] text-[#6F7078]">/ 100</span>
                            <span className="font-mono text-[12px] text-[#38BDF8] ml-auto">
                                {overview.calmStatePercentage}% Calm
                            </span>
                        </div>
                        <p className="font-body text-[12px] text-[#9999A2] mt-1.5">
                            Minimal tilt after adverse runs; low anxiety flags.
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <div className="w-full h-1.5 bg-[#25252E] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#38BDF8] to-[#10B981] rounded-full"
                                style={{ width: `${overview.emotionalStability}%` }}
                            />
                        </div>
                        <div className="flex justify-between font-mono text-[10px] text-[#6F7078]">
                            <span>Composure index</span>
                            <span>Stable zone</span>
                        </div>
                    </div>
                </div>

                {/* 4. OVERTRADING RISK */}
                <div className="flex flex-col justify-between p-4.5 rounded-lg bg-[#18181C] border border-[#202128] hover:border-[#2D2D38] transition-colors relative overflow-hidden group">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-[#9999A2] flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-[#10B981]" />
                            Overtrading Risk
                        </span>
                        <span className="font-mono text-[11px] text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded font-semibold">
                            {overview.overtradingRisk} (Safe)
                        </span>
                    </div>

                    <div className="my-3">
                        <div className="flex items-baseline gap-2">
                            <span className="font-mono text-[32px] font-bold text-[#10B981] tracking-tight leading-none">
                                {overview.overtradingPercentage}%
                            </span>
                            <span className="font-mono text-[12px] text-[#6F7078] ml-auto">
                                {overview.avgTradesPerDay} / day
                            </span>
                        </div>
                        <p className="font-body text-[12px] text-[#9999A2] mt-1.5">
                            Strict adherence to max {overview.maxTradesPerDayLimit} trades/day ceiling.
                        </p>
                    </div>

                    <div className="space-y-1.5">
                        <div className="w-full h-1.5 bg-[#25252E] rounded-full overflow-hidden flex">
                            <div className="h-full bg-[#10B981]" style={{ width: `${overview.overtradingPercentage}%` }} />
                            <div className="h-full bg-[#202128]" style={{ width: `${100 - overview.overtradingPercentage}%` }} />
                        </div>
                        <div className="flex justify-between font-mono text-[10px] text-[#6F7078]">
                            <span>Avg 1.8 Trades</span>
                            <span>Cap: 3.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

