import React from 'react';
import { RiskHabitItem } from './behaviorData';
import { ShieldCheck, CheckCircle2, Sliders } from 'lucide-react';

interface Props {
    habits: RiskHabitItem[];
}

export function RiskHabits({ habits }: Props) {
    return (
        <div className="flex flex-col bg-[#141416] border border-[#202126] rounded-xl p-6 lg:p-7 gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2 border-b border-[#1E1F24]">
                <div>
                    <h3 className="font-display text-[18px] font-bold text-[#F3F3F5] tracking-tight flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                        RISK MANAGEMENT HABITS
                    </h3>
                    <p className="font-body text-[13px] text-[#9999A2] mt-0.5">
                        Behavioral capital protection reflexes observed during live market engagement.
                    </p>
                </div>
                <span className="font-mono text-[11px] px-2.5 py-1 bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 rounded-md font-semibold self-start sm:self-auto">
                    ALL BENCHMARKS SATISFIED
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {habits.map((habit) => (
                    <div
                        key={habit.metric}
                        className="p-4 rounded-lg bg-[#18181C] border border-[#202128] flex flex-col justify-between space-y-3"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-mono text-[11px] uppercase tracking-wider text-[#9999A2]">
                                    {habit.metric}
                                </span>
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                            </div>

                            <div className="flex items-baseline gap-2">
                                <span className="font-mono text-[22px] font-bold text-[#F3F3F5] tracking-tight">
                                    {habit.actual}
                                </span>
                            </div>

                            <span className="font-mono text-[11px] text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded inline-block mt-1 font-semibold">
                                Rule: {habit.benchmark}
                            </span>

                            <p className="font-body text-[12px] text-[#849495] mt-2.5 leading-relaxed">
                                {habit.description}
                            </p>
                        </div>

                        <div className="pt-2 border-t border-[#202128] flex items-center justify-between font-mono text-[10px] text-[#6F7078]">
                            <span>Validation</span>
                            <span className="text-[#10B981]">Compliant</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

