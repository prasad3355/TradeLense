import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, cannedResponses } from './coachData';
import { SuggestedPrompts } from './SuggestedPrompts';
import {
    BrainCircuit,
    Send,
    Paperclip,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    User,
    CornerDownLeft,
    Lightbulb
} from 'lucide-react';

interface Props {
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
    onSelectPrompt: (promptText: string) => void;
    composerText: string;
    setComposerText: (text: string) => void;
}

export function CoachChat({
    messages,
    onSendMessage,
    onSelectPrompt,
    composerText,
    setComposerText,
}: Props) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!composerText.trim()) return;
        onSendMessage(composerText.trim());
    };

    const hasMessages = messages.length > 0;

    return (
        <div className="flex-1 flex flex-col bg-[#141416] border border-[#202126] rounded-xl overflow-hidden min-h-[620px] relative">
            {/* Scrollable conversation / welcome body */}
            <div className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-6">
                {/* Welcome section when empty or at top */}
                {!hasMessages ? (
                    <div className="max-w-2xl mx-auto py-6 flex flex-col items-center text-center space-y-6 animate-fade-in">
                        {/* Coach Avatar Glowing Icon */}
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-[#1C1A2E] border border-[#6D5CE7]/40 flex items-center justify-center text-[#8B5CF6] shadow-[0_0_25px_rgba(109,92,231,0.25)]">
                                <BrainCircuit className="w-8 h-8" />
                            </div>
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#10B981] border-2 border-[#141416]" />
                        </div>

                        {/* Title & Introduction */}
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1C1A2E] text-[#C4B5FD] border border-[#3E3269]/60 font-mono text-[11px]">
                                <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
                                AI Trading Psychology Assistant
                            </div>
                            <h2 className="font-display text-2xl font-bold text-white tracking-tight">
                                Meet your Behavioral AI Coach
                            </h2>
                            <p className="font-body text-[13px] text-[#9999A2] leading-relaxed max-w-lg mx-auto">
                                I systematically evaluate your trade logs to diagnose cognitive biases, impulsive execution errors, loss aversion traps, and emotional tilt patterns.
                            </p>
                        </div>

                        {/* What the coach helps understand cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-left pt-2">
                            <div className="p-3.5 rounded-xl bg-[#18181C] border border-[#202128] space-y-1">
                                <div className="font-display text-[12px] font-bold text-white flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                                    Cognitive Biases
                                </div>
                                <p className="font-body text-[11px] text-[#849495] leading-relaxed">
                                    Isolate FOMO chasing, revenge trades, and hesitation before entry.
                                </p>
                            </div>

                            <div className="p-3.5 rounded-xl bg-[#18181C] border border-[#202128] space-y-1">
                                <div className="font-display text-[12px] font-bold text-white flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                                    Execution Gaps
                                </div>
                                <p className="font-body text-[11px] text-[#849495] leading-relaxed">
                                    Detect premature exits and moving stop loss habits in real terms.
                                </p>
                            </div>

                            <div className="p-3.5 rounded-xl bg-[#18181C] border border-[#202128] space-y-1">
                                <div className="font-display text-[12px] font-bold text-white flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                                    Session Pacing
                                </div>
                                <p className="font-body text-[11px] text-[#849495] leading-relaxed">
                                    Enforce cooldown buffers and maximum loss circuit breakers.
                                </p>
                            </div>
                        </div>

                        {/* Interactive Suggested Prompts */}
                        <div className="w-full pt-4">
                            <SuggestedPrompts onSelectPrompt={onSelectPrompt} />
                        </div>
                    </div>
                ) : (
                    /* Populated Conversation Stream */
                    <div className="space-y-6 max-w-4xl mx-auto">
                        {/* Conversation Header Pill */}
                        <div className="flex items-center justify-center">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-[#6F7078] bg-[#18181C] px-3 py-1 rounded-full border border-[#202128]">
                                Pre-recorded Demonstration Dialogue · Context: 58 Logged Executions
                            </span>
                        </div>

                        {messages.map((msg) => {
                            const isUser = msg.sender === 'user';
                            return (
                                <div
                                    key={msg.id}
                                    className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                                >
                                    {/* Coach Avatar (if assistant) */}
                                    {!isUser && (
                                        <div className="w-8 h-8 rounded-lg bg-[#1C1A2E] border border-[#6D5CE7]/50 flex items-center justify-center text-[#8B5CF6] flex-shrink-0 mt-0.5">
                                            <BrainCircuit className="w-4 h-4" />
                                        </div>
                                    )}

                                    {/* Message Bubble Container */}
                                    <div
                                        className={`flex flex-col max-w-[85%] sm:max-w-[78%] ${
                                            isUser ? 'items-end' : 'items-start'
                                        }`}
                                    >
                                        {/* Metadata Header */}
                                        <div className="flex items-center gap-2 mb-1 px-1 font-mono text-[10px] text-[#6F7078]">
                                            <span className="font-semibold text-[#9999A2]">
                                                {isUser ? 'You' : 'AI Coach'}
                                            </span>
                                            <span>·</span>
                                            <span>{msg.timestamp}</span>
                                            {msg.metadata?.sessionContext && (
                                                <>
                                                    <span>·</span>
                                                    <span className="text-[#8B5CF6]">
                                                        {msg.metadata.sessionContext}
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        {/* Bubble Body */}
                                        <div
                                            className={`p-4 rounded-2xl text-[13px] leading-relaxed transition-all ${
                                                isUser
                                                    ? 'bg-[#1C1728] border border-[#3E2E69]/70 text-[#F3F3F5] rounded-tr-none shadow-[0_2px_12px_rgba(0,0,0,0.3)]'
                                                    : 'bg-[#18181C] border border-[#24242E] text-[#D8D8DF] rounded-tl-none shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
                                            }`}
                                        >
                                            <p className="whitespace-pre-line">{msg.text}</p>

                                            {/* Takeaways list if present */}
                                            {msg.takeaways && msg.takeaways.length > 0 && (
                                                <div className="mt-3.5 pt-3 border-t border-white/5 space-y-2">
                                                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#C4B5FD] font-semibold flex items-center gap-1.5">
                                                        <Lightbulb className="w-3 h-3 text-[#8B5CF6]" />
                                                        Key Forensic Findings
                                                    </span>
                                                    <ul className="space-y-1.5 font-body text-[12px] text-[#A6A6B5]">
                                                        {msg.takeaways.map((item, idx) => (
                                                            <li key={idx} className="flex items-start gap-2">
                                                                <span className="text-[#8B5CF6] font-bold mt-0.5">•</span>
                                                                <span>{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Action items list if present */}
                                            {msg.actionItems && msg.actionItems.length > 0 && (
                                                <div className="mt-3 p-3 rounded-lg bg-[#0E0E14] border border-[#262335] space-y-1.5">
                                                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#10B981] font-semibold flex items-center gap-1.5">
                                                        <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                                                        Actionable Protocol
                                                    </span>
                                                    <ul className="space-y-1 font-body text-[12px] text-[#E2E2EE]">
                                                        {msg.actionItems.map((item, idx) => (
                                                            <li key={idx} className="flex items-start gap-2">
                                                                <span className="text-[#10B981] font-bold">✓</span>
                                                                <span>{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* User Avatar */}
                                    {isUser && (
                                        <div className="w-8 h-8 rounded-lg bg-[#252033] border border-[#3E3269]/60 flex items-center justify-center text-[#C4B5FD] flex-shrink-0 mt-0.5">
                                            <User className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Quick Suggestion Chips (when conversation is active) */}
            {hasMessages && (
                <div className="px-4 py-2 bg-[#101014] border-t border-[#1C1C24] flex items-center gap-2 overflow-x-auto select-none">
                    <span className="font-mono text-[10px] text-[#6F7078] uppercase whitespace-nowrap">
                        Inquiries:
                    </span>
                    <button
                        onClick={() => onSelectPrompt('Why do I keep exiting trades early?')}
                        className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-[#18181F] text-[#9999A2] hover:text-[#C4B5FD] hover:bg-[#201D2D] border border-[#22212C] transition-colors whitespace-nowrap cursor-pointer"
                        type="button"
                    >
                        Exiting trades early?
                    </button>
                    <button
                        onClick={() => onSelectPrompt('Am I overtrading?')}
                        className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-[#18181F] text-[#9999A2] hover:text-[#C4B5FD] hover:bg-[#201D2D] border border-[#22212C] transition-colors whitespace-nowrap cursor-pointer"
                        type="button"
                    >
                        Am I overtrading?
                    </button>
                    <button
                        onClick={() => onSelectPrompt('Help me improve my risk management.')}
                        className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-[#18181F] text-[#9999A2] hover:text-[#C4B5FD] hover:bg-[#201D2D] border border-[#22212C] transition-colors whitespace-nowrap cursor-pointer"
                        type="button"
                    >
                        Risk management tips
                    </button>
                </div>
            )}

            {/* Message Composer Footer */}
            <div className="p-3 lg:p-4 bg-[#0E0E12] border-t border-[#1E1F24]">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <div className="relative flex items-center bg-[#151518] border border-[#202128] focus-within:border-[#6D5CE7]/80 rounded-xl px-3 py-1.5 transition-all shadow-inner">
                        {/* Attachment button */}
                        <button
                            type="button"
                            className="p-1.5 text-[#6F7078] hover:text-[#D8D8DF] transition-colors cursor-pointer rounded-lg hover:bg-white/5 mr-1"
                            title="Attach trade screenshot (Preview)"
                        >
                            <Paperclip className="w-4 h-4" />
                        </button>

                        {/* Input Field */}
                        <input
                            type="text"
                            value={composerText}
                            onChange={(e) => setComposerText(e.target.value)}
                            placeholder="Ask AI Coach about your habits, discipline, or session errors..."
                            className="w-full bg-transparent border-none text-[#F3F3F5] placeholder-[#6F7078] text-[13px] focus:outline-none py-1.5"
                        />

                        {/* Send Button */}
                        <button
                            type="submit"
                            disabled={!composerText.trim()}
                            className={`p-2 rounded-lg font-medium transition-all flex items-center justify-center cursor-pointer ml-1 ${
                                composerText.trim()
                                    ? 'bg-[#6D5CE7] hover:bg-[#7C6CF2] text-white shadow-[0_0_12px_rgba(109,92,231,0.4)] active:scale-95'
                                    : 'bg-[#1E1E24] text-[#4F505A] cursor-not-allowed'
                            }`}
                            title="Send inquiry"
                        >
                            <Send className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Composer Disclaimer */}
                    <div className="flex items-center justify-between px-1 text-[10px] font-mono text-[#6F7078]">
                        <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
                            UI Preview Mode: Responses are simulated demo outputs. No Gemini API connection active.
                        </span>
                        <span className="hidden sm:inline">Press Enter ↵</span>
                    </div>
                </form>
            </div>
        </div>
    );
}

