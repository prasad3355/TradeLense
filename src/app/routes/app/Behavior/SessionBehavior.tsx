import React from 'react';
import { SessionBehaviorItem } from './behaviorData';
import { Clock, Compass, TrendingUp, AlertTriangle } from 'lucide-react';

interface Props {
    sessions: SessionBehaviorItem[];
}

export function SessionBehavior({ sessions }: Props) {
    return (
        <div className="flex flex-col bg-[#141416] border border-[#202126] rounded-xl p-6 lg:p-7 gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2 border-b border-[#1E1F24]">
                <div>
                    <h3 className="font-display text-[18px] font-bold text-[#F3F3F5] tracking-tight flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#38BDF8]" />
                        TRADING BEHAVIOR BY SESSION
                    </h3>
                    <p className="font-body text-[13px] text-[#9999A2] mt-0.5">
                        Psychological variance and discipline drift across market operating windows.
                    </p>
                </div>
                <span className="font-mono text-[11px] px-2.5 py-1 bg-[#1C1A2E] text-[#C4B5FD] border border-[#3E3269]/60 rounded-md font-semibold self-start sm:self-auto">
                    LONDON DOMINANT (DISCIPLINE 91/100)
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sessions.map((sess) => {
                    const isDominant = sess.disciplineScore >= 90;
                    return (
                        <div
                            key={sess.session}
                            className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                                isDominant
                                    ? 'bg-[#1C1A2E]/70 border-[#3E3269]/70 shadow-[0_4px_20px_rgba(109,92,231,0.12)]'
                                    : 'bg-[#18181C] border-[#202128]'
                            }`}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="font-display text-[15px] text-white font-bold">
                                            {sess.session}
                                        </span>
                                    </div>
                                    <span
                                        className="font-mono text-[10px] px-2 py-0.5 rounded font-semibold border"
                                        style={{
                                            color: sess.tagColor,
                                            backgroundColor: `${sess.tagColor}15`,
                                            borderColor: `${sess.tagColor}35`,
                                        }}
                                    >
                                        {sess.tag}
                                    </span>
                                </div>

                                <p className="font-body text-[12px] text-[#9999A2] leading-relaxed mb-4 min-h-[36px]">
                                    {sess.highlight}
                                </p>

                                {/* Key Behavioral Metrics */}
                                <div className="space-y-2.5 pt-1 border-t border-[#22222C]">
                                    <div className="flex items-center justify-between font-mono text-[11px]">
                                        <span className="text-[#9999A2]">Discipline Index:</span>
                                        <span className="text-[#F3F3F5] font-semibold">{sess.disciplineScore}/100</span>
                                    </div>
                                    <div className="w-full h-1.5 rounded-full bg-[#1F2028] overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${sess.disciplineScore}%`,
                                                backgroundColor: sess.tagColor,
                                            }}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between font-mono text-[11px]">
                                        <span className="text-[#9999A2]">Rule Adherence:</span>
                                        <span className="text-[#10B981] font-semibold">{sess.ruleAdherence}%</span>
                                    </div>

                                    <div className="flex items-center justify-between font-mono text-[11px]">
                                        <span className="text-[#9999A2]">Overtrade Rate:</span>
                                        <span className={sess.overtradeRate > 20 ? 'text-[#EF4444]' : 'text-[#849495]'}>
                                            {sess.overtradeRate}%
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between font-mono text-[11px]">
                                        <span className="text-[#9999A2]">Tilt Vulnerability:</span>
                                        <span className={sess.tiltIndex > 30 ? 'text-[#F59E0B]' : 'text-[#10B981]'}>
                                            {sess.tiltIndex}/100 ({sess.tiltIndex > 30 ? 'Elevated' : 'Low'})
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Session P&L footer */}
                            <div className="mt-5 pt-3 border-t border-[#22222C] flex items-center justify-between font-mono text-[12px]">
                                <span className="text-[#6F7078] text-[11px]">{sess.tradeCount} Trades</span>
                                <span className="text-[#10B981] font-bold">
                                    +${sess.pnl.toFixed(2)} ({sess.winRate}% WR)
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

