import React from 'react';
import { ConsistencyMetric } from './behaviorData';
import { Gauge, Check, ShieldAlert, Sparkles } from 'lucide-react';

interface Props {
    metrics: ConsistencyMetric[];
}

export function TradingConsistency({ metrics }: Props) {
    return (
        <div className="flex flex-col bg-[#141416] border border-[#202126] rounded-xl p-6 lg:p-7 gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2 border-b border-[#1E1F24]">
                <div>
                    <h3 className="font-display text-[18px] font-bold text-[#F3F3F5] tracking-tight flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-[#8B5CF6]" />
                        TRADING CONSISTENCY
                    </h3>
                    <p className="font-body text-[13px] text-[#9999A2] mt-0.5">
                        Pacing stability, revenge cooldown obedience, and emotional composure buffers.
                    </p>
                </div>
                <span className="font-mono text-[11px] px-2.5 py-1 bg-[#1C1A2E] text-[#C4B5FD] border border-[#3E3269]/60 rounded-md font-semibold self-start sm:self-auto">
                    HIGH EXECUTION RHYTHM
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m) => {
                    const isOptimal = m.status === 'optimal';
                    return (
                        <div
                            key={m.title}
                            className="p-4 rounded-lg bg-[#18181C] border border-[#202128] flex flex-col justify-between space-y-3"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#9999A2]">
                                        {m.title}
                                    </span>
                                    {isOptimal ? (
                                        <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                                    ) : (
                                        <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                                    )}
                                </div>
                                <span className="font-mono text-[26px] font-bold text-[#F3F3F5] tracking-tight">
                                    {m.value}
                                </span>
                                <p className="font-body text-[11px] text-[#849495] mt-1 line-clamp-2">
                                    {m.subtext}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <div className="w-full h-1.5 rounded-full bg-[#25252E] overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${m.progress}%`,
                                            backgroundColor: isOptimal ? '#10B981' : '#8B5CF6',
                                        }}
                                    />
                                </div>
                                <div className="flex justify-between font-mono text-[9px] text-[#6F7078]">
                                    <span>Target: &gt;80%</span>
                                    <span className={isOptimal ? 'text-[#10B981]' : 'text-[#C4B5FD]'}>Pass</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

