import React from 'react';
import { RuleAdherenceItem } from './behaviorData';
import { Target, CheckCircle2, AlertOctagon, TrendingDown, DollarSign } from 'lucide-react';

interface Props {
    rules: RuleAdherenceItem[];
    costOfViolations: {
        compliantPnl: number;
        nonCompliantPnl: number;
        netLossToRuleBreaks: number;
    };
}

export function RuleAdherence({ rules, costOfViolations }: Props) {
    return (
        <div className="flex flex-col bg-[#141416] border border-[#202126] rounded-xl p-6 lg:p-7 gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2 border-b border-[#1E1F24]">
                <div>
                    <h3 className="font-display text-[18px] font-bold text-[#F3F3F5] tracking-tight flex items-center gap-2">
                        <Target className="w-4 h-4 text-[#10B981]" />
                        RULE ADHERENCE BREAKDOWN
                    </h3>
                    <p className="font-body text-[13px] text-[#9999A2] mt-0.5">
                        Execution precision against predefined risk parameters and system rules.
                    </p>
                </div>
                <span className="font-mono text-[11px] px-2.5 py-1 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 rounded-md font-semibold self-start sm:self-auto">
                    OVERALL 91.4% COMPLIANCE
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Rules List */}
                <div className="lg:col-span-7 flex flex-col gap-3.5">
                    {rules.map((rule) => {
                        const isPassing = rule.complianceRate >= rule.targetRate;
                        return (
                            <div
                                key={rule.ruleName}
                                className="p-3.5 rounded-lg bg-[#18181C] border border-[#202128] space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {isPassing ? (
                                            <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                                        ) : (
                                            <AlertOctagon className="w-4 h-4 text-[#F59E0B] flex-shrink-0" />
                                        )}
                                        <span className="font-display text-[13px] font-semibold text-[#F3F3F5]">
                                            {rule.ruleName}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 font-mono text-[11px]">
                                        <span className={isPassing ? 'text-[#10B981] font-bold' : 'text-[#F59E0B] font-bold'}>
                                            {rule.complianceRate}%
                                        </span>
                                        <span className="text-[#6F7078]">
                                            ({rule.followedCount}/{rule.totalCount})
                                        </span>
                                    </div>
                                </div>

                                <div className="w-full h-1.5 rounded-full bg-[#1F2028] overflow-hidden flex">
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{
                                            width: `${rule.complianceRate}%`,
                                            backgroundColor: isPassing ? '#10B981' : '#F59E0B',
                                        }}
                                    />
                                </div>

                                <div className="flex items-center justify-between font-body text-[11px] text-[#849495]">
                                    <span>{rule.impact}</span>
                                    <span className="font-mono text-[#6F7078]">Target: &gt;={rule.targetRate}%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Financial Cost of Violations Card */}
                <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-xl bg-gradient-to-b from-[#1C1628] to-[#14141A] border border-[#3E2E60] relative overflow-hidden">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] uppercase tracking-wider text-[#C4B5FD] flex items-center gap-1.5 font-semibold">
                                <DollarSign className="w-3.5 h-3.5 text-[#8B5CF6]" />
                                Financial Cost of Rule Breaks
                            </span>
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 font-semibold">
                                FRICTION ESTIMATE
                            </span>
                        </div>

                        <div className="p-4 rounded-lg bg-[#0E0E14]/80 border border-[#2A243E] space-y-3">
                            <div className="flex items-center justify-between font-mono text-[12px]">
                                <span className="text-[#9999A2]">Compliant Trades P&amp;L (53)</span>
                                <span className="text-[#10B981] font-bold">
                                    +${costOfViolations.compliantPnl.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between font-mono text-[12px]">
                                <span className="text-[#9999A2]">Violated Rules P&amp;L (5)</span>
                                <span className="text-[#EF4444] font-bold">
                                    -${Math.abs(costOfViolations.nonCompliantPnl).toFixed(2)}
                                </span>
                            </div>
                            <div className="pt-2 border-t border-[#221E33] flex items-center justify-between font-mono text-[13px]">
                                <span className="text-white font-semibold">Net Edge Forfeited:</span>
                                <span className="text-[#EF4444] font-bold">
                                    -${costOfViolations.netLossToRuleBreaks.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <p className="font-body text-[12px] text-[#A78BFA] leading-relaxed">
                            Following your system without the 5 recorded deviations would have increased your monthly net return by <strong className="text-white">+22.5%</strong>.
                        </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#2A243E] font-mono text-[11px] text-[#6F7078] flex items-center justify-between">
                        <span>Zero Deviation Target</span>
                        <span className="text-[#10B981]">100% Achievable</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

