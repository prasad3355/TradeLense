import React from 'react';
import { contextVectors } from './coachData';
import {
    ShieldCheck,
    Gauge,
    HeartPulse,
    CheckCircle2,
    SlidersHorizontal,
    Info
} from 'lucide-react';

export function CoachSidebar() {
    return (
        <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 flex flex-col gap-4 font-sans select-none">
            {/* Context Header */}
            <div className="p-4 rounded-xl bg-[#141416] border border-[#202126] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#1E1F24]">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#9999A2] font-semibold flex items-center gap-1.5">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        Trader Context Vectors
                    </span>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] font-semibold border border-[#10B981]/30">
                        ACTIVE
                    </span>
                </div>

                <p className="font-body text-[11px] text-[#849495] leading-relaxed">
                    Dynamic psychological telemetry used by the AI Coach to contextualize coaching advice.
                </p>

                {/* 1. TRADING DISCIPLINE */}
                <div className="p-3 rounded-lg bg-[#18181C] border border-[#202128] space-y-1.5">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] text-[#9999A2] flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#8B5CF6]" />
                            Trading Discipline
                        </span>
                        <span className="font-mono text-[11px] text-white font-bold">
                            {contextVectors.disciplineScore}/100
                        </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#202128] overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#6D5CE7] to-[#8B5CF6] rounded-full"
                            style={{ width: `${contextVectors.disciplineScore}%` }}
                        />
                    </div>
                    <div className="flex justify-between font-mono text-[10px] text-[#6F7078]">
                        <span>{contextVectors.disciplineRating}</span>
                        <span className="text-[#10B981]">Target: 80+</span>
                    </div>
                </div>

                {/* 2. RISK MANAGEMENT */}
                <div className="p-3 rounded-lg bg-[#18181C] border border-[#202128] space-y-1.5">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] text-[#9999A2] flex items-center gap-1.5">
                            <Gauge className="w-3.5 h-3.5 text-[#10B981]" />
                            Risk Management
                        </span>
                        <span className="font-mono text-[11px] text-[#10B981] font-bold">
                            {contextVectors.riskPerTrade}
                        </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#202128] overflow-hidden">
                        <div
                            className="h-full bg-[#10B981] rounded-full"
                            style={{ width: '82%' }}
                        />
                    </div>
                    <div className="flex justify-between font-mono text-[10px] text-[#6F7078]">
                        <span>Cap: {contextVectors.riskBenchmark}</span>
                        <span className="text-[#10B981]">Compliant</span>
                    </div>
                </div>

                {/* 3. EMOTIONAL CONTROL */}
                <div className="p-3 rounded-lg bg-[#18181C] border border-[#202128] space-y-1.5">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] text-[#9999A2] flex items-center gap-1.5">
                            <HeartPulse className="w-3.5 h-3.5 text-[#38BDF8]" />
                            Emotional Control
                        </span>
                        <span className="font-mono text-[11px] text-[#38BDF8] font-bold">
                            {contextVectors.emotionalStability}/100
                        </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#202128] overflow-hidden">
                        <div
                            className="h-full bg-[#38BDF8] rounded-full"
                            style={{ width: `${contextVectors.emotionalStability}%` }}
                        />
                    </div>
                    <div className="flex justify-between font-mono text-[10px] text-[#6F7078]">
                        <span>Tilt: {contextVectors.tiltLevel}</span>
                        <span className="text-[#38BDF8]">Calm Zone</span>
                    </div>
                </div>

                {/* 4. CONSISTENCY */}
                <div className="p-3 rounded-lg bg-[#18181C] border border-[#202128] space-y-1.5">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] text-[#9999A2] flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#C4B5FD]" />
                            Consistency
                        </span>
                        <span className="font-mono text-[11px] text-white font-bold">
                            {contextVectors.consistencyChecklist}
                        </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#202128] overflow-hidden">
                        <div
                            className="h-full bg-[#C4B5FD] rounded-full"
                            style={{ width: contextVectors.consistencyChecklist }}
                        />
                    </div>
                    <div className="flex justify-between font-mono text-[10px] text-[#6F7078]">
                        <span>Checklist Obedience</span>
                        <span className="text-[#10B981]">53/58 Setups</span>
                    </div>
                </div>
            </div>

            {/* Quick Session Focus Card */}
            <div className="p-4 rounded-xl bg-gradient-to-b from-[#1C1628] to-[#121218] border border-[#3E2E60] space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#C4B5FD] font-semibold flex items-center gap-1">
                    <Info className="w-3 h-3 text-[#8B5CF6]" />
                    Coach Focus Note
                </span>
                <p className="font-body text-[11.5px] text-[#E2E2EE] leading-relaxed">
                    Prioritize London breakout setups. Avoid adding discretionary size during late New York liquidity slowdowns.
                </p>
                <div className="pt-2 border-t border-[#2A243E] font-mono text-[10px] text-[#7070A0]">
                    Context: 58 Trades Recorded
                </div>
            </div>
        </aside>
    );
}

