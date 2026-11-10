import React from 'react';
import { BehavioralInsight } from './behaviorData';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Lightbulb } from 'lucide-react';

interface Props {
    insights: BehavioralInsight[];
    isPreview: boolean;
}

export function BehaviorInsights({ insights, isPreview }: Props) {
    return (
        <div className="flex flex-col bg-[#141416] border border-[#202126] rounded-xl p-6 lg:p-7 gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2 border-b border-[#1E1F24]">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-display text-[18px] font-bold text-[#F3F3F5] tracking-tight flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-[#C4B5FD]" />
                            BEHAVIORAL INSIGHTS &amp; OBSERVATIONS
                        </h3>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1C1A2E] text-[#C4B5FD] border border-[#3E3269]/60 font-medium">
                            ILLUSTRATIVE DEMO
                        </span>
                    </div>
                    <p className="font-body text-[13px] text-[#9999A2] mt-0.5">
                        Actionable findings highlighting strategic strengths and tilt vulnerabilities.
                    </p>
                </div>
                <span className="font-mono text-[11px] text-[#7070A0]">
                    3 Cognitive Hypotheses
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {insights.map((ins) => {
                    const isPositive = ins.type === 'positive';
                    return (
                        <div
                            key={ins.id}
                            className={`p-4.5 rounded-xl border flex flex-col justify-between space-y-3.5 transition-all ${
                                isPositive
                                    ? 'bg-[#15171D] border-[#222E2C]'
                                    : 'bg-[#1B151C] border-[#3D252E]'
                            }`}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span
                                        className={`font-mono text-[10px] px-2 py-0.5 rounded font-semibold border ${
                                            isPositive
                                                ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30'
                                                : 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30'
                                        }`}
                                    >
                                        {ins.tag}
                                    </span>
                                    {isPositive ? (
                                        <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                                    ) : (
                                        <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                                    )}
                                </div>

                                <h4 className="font-display text-[14px] font-bold text-white mb-2 leading-snug">
                                    {ins.title}
                                </h4>

                                <p className="font-body text-[12px] text-[#9999A2] leading-relaxed mb-3">
                                    {ins.observation}
                                </p>

                                <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1.5">
                                    <span className="font-mono text-[10px] text-[#C4B5FD] uppercase tracking-wider block">
                                        Prescribed Action:
                                    </span>
                                    <p className="font-body text-[11px] text-[#E2E2EE] leading-relaxed">
                                        {ins.recommendation}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-white/5 flex items-center justify-between font-mono text-[11px]">
                                <span className="text-[#6F7078]">Measurable Impact</span>
                                <span className={isPositive ? 'text-[#10B981] font-semibold' : 'text-[#EF4444] font-semibold'}>
                                    {ins.impact}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Disclaimer pill */}
            <div className="pt-2 text-center">
                <span className="font-mono text-[10px] text-[#6F7078] bg-[#101014] px-3 py-1 rounded-full border border-[#1E1E28]">
                    NOTE: These observations are illustrative sample benchmarks for preview purposes and do not mutate your database records.
                </span>
            </div>
        </div>
    );
}

