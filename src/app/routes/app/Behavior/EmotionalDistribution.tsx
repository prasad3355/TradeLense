import React from 'react';
import { EmotionalStateItem } from './behaviorData';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Brain, Smile, Flame, AlertCircle } from 'lucide-react';

interface Props {
    items: EmotionalStateItem[];
}

export function EmotionalDistribution({ items }: Props) {
    const chartData = items.map((item) => ({
        name: item.name,
        value: item.tradesCount,
        color: item.color,
        pnl: item.pnl,
        winRate: item.winRate,
    }));

    return (
        <div className="flex flex-col bg-[#141416] border border-[#202126] rounded-xl p-6 lg:p-7 gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2 border-b border-[#1E1F24]">
                <div>
                    <h3 className="font-display text-[18px] font-bold text-[#F3F3F5] tracking-tight flex items-center gap-2">
                        <Brain className="w-4 h-4 text-[#8B5CF6]" />
                        EMOTIONAL STATE DISTRIBUTION
                    </h3>
                    <p className="font-body text-[13px] text-[#9999A2] mt-0.5">
                        Correlation between psychological mindset, win rate, and realized profitability.
                    </p>
                </div>
                <span className="font-mono text-[11px] px-2.5 py-1 bg-[#1C1A2E] text-[#C4B5FD] border border-[#3E3269]/60 rounded-md font-semibold self-start sm:self-auto">
                    CALM DOMINANT (65.5%)
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Donut Chart visual */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[240px]">
                    <div className="w-full h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={58}
                                    outerRadius={88}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#141416" strokeWidth={2} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="bg-[#1A1A22] border border-[#2D2E3B] p-2.5 rounded-lg shadow-xl font-mono text-[11px] text-[#E2E2EE] space-y-1">
                                                    <div className="font-semibold text-white">{data.name}</div>
                                                    <div>Trades: {data.value}</div>
                                                    <div className={data.pnl >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}>
                                                        P&amp;L: {data.pnl >= 0 ? `+$${data.pnl.toFixed(2)}` : `-$${Math.abs(data.pnl).toFixed(2)}`}
                                                    </div>
                                                    <div className="text-[#38BDF8]">Win Rate: {data.winRate}%</div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Donut Center Label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="font-mono text-[22px] font-bold text-white tracking-tight">58</span>
                        <span className="font-mono text-[10px] uppercase text-[#9999A2] tracking-wider">Trades</span>
                    </div>
                </div>

                {/* Detailed Breakdown List */}
                <div className="lg:col-span-7 flex flex-col gap-2.5">
                    {items.map((state) => {
                        const isProfit = state.pnl >= 0;
                        return (
                            <div
                                key={state.name}
                                className="p-3 rounded-lg bg-[#18181C] border border-[#202128] hover:border-[#2B2B36] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: state.color }}
                                    />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-display text-[13px] font-semibold text-[#F3F3F5]">
                                                {state.name}
                                            </span>
                                            <span className="font-mono text-[10px] text-[#849495]">
                                                ({state.tradesCount} · {state.percentage}%)
                                            </span>
                                        </div>
                                        <p className="font-body text-[11px] text-[#7070A0] line-clamp-1">
                                            {state.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 font-mono text-[11px] justify-between sm:justify-end border-t sm:border-t-0 pt-1.5 sm:pt-0 border-[#202128]">
                                    <div className="text-left sm:text-right">
                                        <span className="text-[#849495] text-[10px] block">WIN RATE</span>
                                        <span className="text-[#F3F3F5] font-semibold">{state.winRate}%</span>
                                    </div>
                                    <div className="text-right min-w-[75px]">
                                        <span className="text-[#849495] text-[10px] block">NET P&amp;L</span>
                                        <span className={`font-semibold ${isProfit ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                                            {isProfit ? `+$${state.pnl.toFixed(2)}` : `-$${Math.abs(state.pnl).toFixed(2)}`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

