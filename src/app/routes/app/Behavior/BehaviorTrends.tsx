import React from 'react';
import { TrendDataPoint } from './behaviorData';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface Props {
    trends: TrendDataPoint[];
}

export function BehaviorTrends({ trends }: Props) {
    return (
        <div className="flex flex-col bg-[#141416] border border-[#202126] rounded-xl p-6 lg:p-7 gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2 border-b border-[#1E1F24]">
                <div>
                    <h3 className="font-display text-[18px] font-bold text-[#F3F3F5] tracking-tight flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#8B5CF6]" />
                        BEHAVIORAL TRENDS &amp; PROGRESSION
                    </h3>
                    <p className="font-body text-[13px] text-[#9999A2] mt-0.5">
                        Historical trajectory of execution discipline and psychological stability over recent sessions.
                    </p>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="flex items-center gap-1.5 text-[#C4B5FD]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                        Discipline Score
                    </span>
                    <span className="flex items-center gap-1.5 text-[#38BDF8]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
                        Emotional Stability
                    </span>
                </div>
            </div>

            <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="discGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                            </linearGradient>
                            <linearGradient id="emotGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1F2028" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#6F7078"
                            fontSize={11}
                            tickLine={false}
                            axisLine={{ stroke: '#202128' }}
                            fontFamily="JetBrains Mono"
                        />
                        <YAxis
                            domain={[50, 100]}
                            stroke="#6F7078"
                            fontSize={11}
                            tickLine={false}
                            axisLine={{ stroke: '#202128' }}
                            fontFamily="JetBrains Mono"
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload as TrendDataPoint;
                                    return (
                                        <div className="bg-[#1A1A22] border border-[#2D2E3B] p-3 rounded-lg shadow-xl font-mono text-[11px] text-[#E2E2EE] space-y-1.5">
                                            <div className="font-semibold text-white flex justify-between gap-4">
                                                <span>{data.session}</span>
                                                <span className="text-[#9999A2]">{label}</span>
                                            </div>
                                            <div className="text-[#C4B5FD] flex justify-between gap-4">
                                                <span>Discipline:</span>
                                                <span className="font-bold">{data.disciplineScore} / 100</span>
                                            </div>
                                            <div className="text-[#38BDF8] flex justify-between gap-4">
                                                <span>Stability:</span>
                                                <span className="font-bold">{data.emotionalStability} / 100</span>
                                            </div>
                                            <div className="text-white/80 border-t border-[#252532] pt-1 flex justify-between gap-4">
                                                <span>Session P&amp;L:</span>
                                                <span className={data.pnl >= 0 ? 'text-[#10B981] font-bold' : 'text-[#EF4444] font-bold'}>
                                                    {data.pnl >= 0 ? `+$${data.pnl}` : `-$${Math.abs(data.pnl)}`}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="disciplineScore"
                            stroke="#8B5CF6"
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#discGrad)"
                            name="Discipline Score"
                        />
                        <Area
                            type="monotone"
                            dataKey="emotionalStability"
                            stroke="#38BDF8"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#emotGrad)"
                            name="Emotional Stability"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

