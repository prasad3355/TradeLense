import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, ArrowRight, BrainCircuit, Activity, Sparkles, ShieldCheck } from 'lucide-react';

interface Props {
    onExplorePreview: () => void;
}

export function BehaviorEmptyState({ onExplorePreview }: Props) {
    const navigate = useNavigate();

    return (
        <div
            className="relative w-full rounded-2xl overflow-hidden flex flex-col items-center"
            style={{
                background: 'linear-gradient(160deg, #0E0E12 0%, #111118 60%, #0B0B10 100%)',
                border: '1px solid #1E1E28',
                minHeight: 520,
            }}
        >
            {/* Subtle dot-grid background */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none select-none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <defs>
                    <pattern id="behavior-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                        <circle cx="1" cy="1" r="0.8" fill="#2A2A38" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#behavior-grid)" />
            </svg>

            {/* Radial violet glow behind illustration */}
            <div
                className="absolute pointer-events-none"
                style={{
                    top: '6%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 460,
                    height: 320,
                    background: 'radial-gradient(ellipse at center, rgba(124,60,237,0.14) 0%, rgba(99,57,202,0.06) 45%, transparent 70%)',
                    borderRadius: '50%',
                }}
            />

            {/* Telemetry status bar — top */}
            <div className="relative z-10 w-full flex items-center justify-between px-5 pt-4 pb-1">
                <div className="flex items-center gap-3 font-mono text-[10px] text-[#3C3C50] uppercase tracking-widest select-none">
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]/50" />
                        PSYCHOMETRIC SENSORS: READY
                    </span>
                    <span className="text-[#28283A]">·</span>
                    <span>COGNITIVE MATRIX: DORMANT</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[10px] text-[#3C3C50] uppercase tracking-widest select-none">
                    <span>TILT DETECTOR: ACTIVE</span>
                    <span className="text-[#28283A]">·</span>
                    <span>STREAM: AWAITING_EXECUTIONS</span>
                </div>
            </div>

            {/* Central illustration card */}
            <div className="relative z-10 flex flex-col items-center mt-5 mb-0 px-4">
                <div
                    className="relative"
                    style={{
                        width: 320,
                        height: 200,
                        background: 'linear-gradient(145deg, #16161F 0%, #111118 100%)',
                        border: '1px solid #252532',
                        borderRadius: 14,
                        overflow: 'hidden',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,60,237,0.12) inset',
                    }}
                >
                    {/* Top bar inside card */}
                    <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3.5 py-2 border-b border-[#1E1E28] bg-[#111118]/85 backdrop-blur-sm z-10">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                            <span className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                            <span className="w-2 h-2 rounded-full bg-[#28C840]" />
                        </div>
                        <span className="font-mono text-[9px] text-[#7070A0] uppercase tracking-widest">
                            BEHAVIORAL_VECTORS_V1
                        </span>
                        <div className="w-2 h-2" />
                    </div>

                    {/* SVG Brain wave / Cognitive pulses */}
                    <svg
                        viewBox="0 0 300 140"
                        className="absolute bottom-2 left-2 right-2 w-[calc(100%-16px)] h-[135px]"
                        aria-hidden="true"
                    >
                        <defs>
                            <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
                                <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.9" />
                                <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
                            </linearGradient>
                            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                            </linearGradient>
                        </defs>

                        {/* Grid lines */}
                        <line x1="0" y1="35" x2="300" y2="35" stroke="#1F202B" strokeDasharray="3 3" />
                        <line x1="0" y1="70" x2="300" y2="70" stroke="#1F202B" strokeDasharray="3 3" />
                        <line x1="0" y1="105" x2="300" y2="105" stroke="#1F202B" strokeDasharray="3 3" />

                        {/* Wave curve representing focus and emotional state */}
                        <polygon
                            points="10,120 40,95 80,105 120,60 160,85 200,45 240,65 280,30 280,120 10,120"
                            fill="url(#areaGrad)"
                        />
                        <path
                            d="M 10 120 Q 40 95, 80 105 T 160 85 T 240 65 T 280 30"
                            fill="none"
                            stroke="url(#waveGrad)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />

                        {/* Glowing node pulses */}
                        <circle cx="120" cy="60" r="4" fill="#8B5CF6" />
                        <circle cx="120" cy="60" r="8" fill="#8B5CF6" opacity="0.25" />
                        <circle cx="200" cy="45" r="4" fill="#38BDF8" />
                        <circle cx="280" cy="30" r="5" fill="#10B981" />
                        <circle cx="280" cy="30" r="10" fill="#10B981" opacity="0.2" />

                        {/* Baseline reference */}
                        <text x="15" y="25" fill="#6F7078" fontFamily="JetBrains Mono" fontSize="9">
                            CALM BASELINE: 80%
                        </text>
                    </svg>
                </div>

                {/* Status indicator */}
                <div className="relative w-full flex items-center justify-center mt-2.5">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#8B5CF6] opacity-90 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-ping" />
                        AWAITING RECORDED EXECUTIONS
                    </span>
                </div>
            </div>

            {/* Standby mode badge */}
            <div className="relative z-10 mt-3 flex items-center gap-2 px-3 py-1 rounded-full border border-[#2A2A3A] bg-[#14141C]/80 select-none">
                <Activity className="w-3 h-3 text-[#8B5CF6]" />
                <span className="font-mono text-[10px] text-[#A78BFA] uppercase tracking-widest">
                    PSYCHOLOGY PROFILER IN STANDBY
                </span>
            </div>

            {/* Heading */}
            <h2
                className="relative z-10 mt-4 font-display font-bold text-[#F0F0F6] tracking-widest uppercase text-center px-4"
                style={{ fontSize: 'clamp(18px, 4vw, 24px)', letterSpacing: '0.12em' }}
            >
                YOUR BEHAVIORAL PROFILE AWAITS
            </h2>

            {/* Description */}
            <p className="relative z-10 mt-2 font-body text-[13px] text-[#9999A2] text-center max-w-[480px] leading-relaxed px-6">
                Record your trade entries and exits to uncover emotional stability indexes, session discipline patterns, revenge trading triggers, and rule compliance breakdowns.
            </p>

            {/* CTAs */}
            <div className="relative z-10 mt-6 mb-9 flex flex-wrap items-center justify-center gap-3">
                <button
                    onClick={() => navigate('/app/journal')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-[13px] text-white transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    style={{
                        background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                        boxShadow: '0 4px 20px rgba(124,60,237,0.35)',
                    }}
                    type="button"
                >
                    <UploadCloud className="w-4 h-4 text-white" />
                    <span>Upload First Trade</span>
                </button>

                <button
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[#E2E2EE] text-[13px] font-medium transition-all hover:scale-[1.02] active:scale-[0.98] select-none cursor-pointer"
                    onClick={onExplorePreview}
                    type="button"
                    style={{
                        background: '#16161F',
                        border: '1px solid #262636',
                    }}
                >
                    <Sparkles className="w-4 h-4 text-[#C4B5FD]" />
                    <span>Explore Behavior Preview</span>
                    <ArrowRight className="w-4 h-4 text-[#9999A2]" />
                </button>
            </div>

            {/* Feature highlights pill row */}
            <div className="relative z-10 border-t border-[#1C1C24] w-full px-6 py-4 flex flex-wrap items-center justify-around gap-4 text-[11px] font-mono text-[#6F7078]">
                <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Discipline &amp; Tilt Scorer</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <BrainCircuit className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span>Emotional State Isolation</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>Overtrading &amp; Risk Habits</span>
                </div>
            </div>
        </div>
    );
}

