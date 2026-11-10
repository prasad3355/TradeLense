import React from 'react';
import { suggestedPromptsList, PromptOption } from './coachData';
import {
    AlertTriangle,
    DoorOpen,
    Flame,
    Shield,
    Sparkles,
    CheckCircle,
    ArrowUpRight
} from 'lucide-react';

interface Props {
    onSelectPrompt: (promptText: string) => void;
}

export function SuggestedPrompts({ onSelectPrompt }: Props) {
    const getIcon = (iconName: PromptOption['iconName']) => {
        switch (iconName) {
            case 'mistakes':
                return <AlertTriangle className="w-4 h-4 text-[#EF4444]" />;
            case 'exit':
                return <DoorOpen className="w-4 h-4 text-[#F59E0B]" />;
            case 'overtrade':
                return <Flame className="w-4 h-4 text-[#EC4899]" />;
            case 'risk':
                return <Shield className="w-4 h-4 text-[#10B981]" />;
            case 'habits':
                return <Sparkles className="w-4 h-4 text-[#38BDF8]" />;
            case 'discipline':
                return <CheckCircle className="w-4 h-4 text-[#8B5CF6]" />;
        }
    };

    return (
        <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#9999A2] font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    Suggested Coaching Inquiries
                </span>
                <span className="font-mono text-[10px] text-[#6F7078]">
                    Click card to populate prompt composer
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {suggestedPromptsList.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => onSelectPrompt(p.text)}
                        className="group text-left p-3.5 rounded-xl bg-[#151518] border border-[#202126] hover:border-[#3E2E60] hover:bg-[#1A1824] transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2.5 relative overflow-hidden active:scale-[0.98]"
                        type="button"
                    >
                        <div className="flex items-center justify-between w-full">
                            <div className="p-1.5 rounded-lg bg-[#1F1F24] border border-[#2B2B36] group-hover:bg-[#251F38] group-hover:border-[#6D5CE7]/40 transition-colors">
                                {getIcon(p.iconName)}
                            </div>
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1F1F24] text-[#849495] group-hover:text-[#C4B5FD] transition-colors border border-transparent group-hover:border-[#3E3269]/50">
                                {p.category}
                            </span>
                        </div>

                        <p className="font-display text-[13px] font-semibold text-[#E2E2EE] group-hover:text-white leading-snug transition-colors">
                            {p.text}
                        </p>

                        <div className="flex items-center gap-1 font-mono text-[11px] text-[#7070A0] group-hover:text-[#C4B5FD] transition-colors pt-1">
                            <span>Populate inquiry</span>
                            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

