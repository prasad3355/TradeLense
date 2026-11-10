import React from 'react';
import { BrainCircuit, Sparkles, RotateCcw, MessageSquarePlus } from 'lucide-react';

interface Props {
    hasMessages: boolean;
    onResetConversation: () => void;
    onLoadSample: () => void;
}

export function CoachHeader({ hasMessages, onResetConversation, onLoadSample }: Props) {
    return (
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#1E1F24]">
            {/* Title + Subtitle + Status Label */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="font-display text-[28px] lg:text-[32px] font-bold text-[#F3F3F5] tracking-tight leading-tight flex items-center gap-2.5">
                        <BrainCircuit className="w-7 h-7 text-[#8B5CF6]" />
                        AI Coach
                    </h1>

                    {/* Visible Required Status Label */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1A2E] text-[#C4B5FD] border border-[#6D5CE7]/60 shadow-[0_0_12px_rgba(109,92,231,0.25)] select-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse flex-shrink-0" />
                        <span className="font-mono text-[11px] font-semibold tracking-wider uppercase">
                            UI PREVIEW — AI NOT CONNECTED
                        </span>
                    </div>
                </div>
                <p className="font-body text-[13px] text-[#9999A2] leading-snug">
                    Understand your trading decisions and develop better trading habits.
                </p>
            </div>

            {/* Conversation Controls */}
            <div className="flex items-center gap-2">
                {hasMessages ? (
                    <button
                        onClick={onResetConversation}
                        className="inline-flex items-center gap-1.5 h-8.5 px-3 rounded-lg bg-[#151518] border border-[#202126] text-[#9999A2] hover:text-[#F3F3F5] hover:bg-[#1C1C22] text-[12px] font-mono transition-all cursor-pointer active:scale-95"
                        type="button"
                        title="Reset conversation to welcome state"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset to Welcome State</span>
                    </button>
                ) : (
                    <button
                        onClick={onLoadSample}
                        className="inline-flex items-center gap-1.5 h-8.5 px-3 rounded-lg bg-[#1F1935] border border-[#6D5CE7]/60 text-[#C4B5FD] hover:brightness-110 text-[12px] font-mono transition-all cursor-pointer active:scale-95 shadow-[0_0_10px_rgba(109,92,231,0.2)]"
                        type="button"
                    >
                        <MessageSquarePlus className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        <span>Load Sample Dialogue</span>
                    </button>
                )}
            </div>
        </header>
    );
}

