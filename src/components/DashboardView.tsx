import { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { Trade, Stats, CognitiveInsight, HeatmapItem } from '../types';
import { Brain, ArrowUpRight, ArrowDownRight, ShieldAlert, Award, TrendingUp, AlertTriangle, Search, Filter, RotateCcw } from 'lucide-react';
import TradeDetailView from './TradeDetailView';

interface DashboardViewProps {
  stats: Stats;
  trades: Trade[];
  insights: CognitiveInsight[];
  onTriggerAudit: () => void;
  onDeleteTrade: (id: string) => void;
  onUpdateTrade: (updated: Trade) => void;
}

export default function DashboardView({ stats, trades, insights, onTriggerAudit, onDeleteTrade, onUpdateTrade }: DashboardViewProps) {
  const [activeTimeline, setActiveTimeline] = useState<'1D' | '1W' | '1M'>('1W');
  const [activeAnalyTab, setActiveAnalyTab] = useState<'session' | 'day' | 'setup' | 'emotion'>('session');
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  const isLowData = trades.length < 3;

  // Flow Pattern Index: percentage of trades executed without heavy emotional intrusion
  const flowPatternIndex = trades.length > 0 
    ? Math.round((trades.filter(t => !t.emotion_detected || t.emotion_detected === 'none').length / trades.length) * 100) 
    : 0;

  // 1. Monthly PNL Calculations (Current system year/month)
  const currentYear = 2026;
  const currentMonthIdx = 4; // May (0-indexed)

  const currentMonthTrades = trades.filter(t => {
    const d = new Date(t.time);
    return !isNaN(d.getTime()) && d.getFullYear() === currentYear && d.getMonth() === currentMonthIdx;
  });

  const monthlyPnL = currentMonthTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);

  // Previous month comparison (April)
  const prevMonthIdx = 3;
  const prevMonthYear = currentYear;

  const prevMonthTrades = trades.filter(t => {
    const d = new Date(t.time);
    return !isNaN(d.getTime()) && d.getFullYear() === prevMonthYear && d.getMonth() === prevMonthIdx;
  });

  const prevMonthPnL = prevMonthTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);

  let pnlTrendText = "";
  let isPnlTrendPositive = true;
  if (!isLowData && prevMonthTrades.length > 0) {
    if (prevMonthPnL !== 0) {
      const pnlChangePercent = Math.round(((monthlyPnL - prevMonthPnL) / Math.abs(prevMonthPnL)) * 100);
      isPnlTrendPositive = pnlChangePercent >= 0;
      pnlTrendText = `${isPnlTrendPositive ? '+' : ''}${pnlChangePercent}% vs. April 2026`;
    } else {
      isPnlTrendPositive = monthlyPnL >= 0;
      pnlTrendText = "Developing trend";
    }
  } else {
    isPnlTrendPositive = monthlyPnL >= 0;
    pnlTrendText = isLowData ? "Need more trades for confidence scoring" : "Developing trend (no baseline)";
  }

  // 2. Win Rate Calculations
  const totalTradesCount = trades.length;
  const winsCount = trades.filter(t => (t.pnl || 0) >= 0).length;
  const realWinRate = totalTradesCount > 0 ? Math.round((winsCount / totalTradesCount) * 100) : 0;

  // 3. Average Risk : Reward Calculations
  const validRRTrades = trades.filter(t => typeof t.rr === 'number' && !isNaN(t.rr) && t.rr > 0);
  const realAvgRR = validRRTrades.length > 0
    ? parseFloat((validRRTrades.reduce((sum, t) => sum + t.rr!, 0) / validRRTrades.length).toFixed(2))
    : 0;

  let rrExpectancyClassification = "Awaiting Data";
  let rrExpectancyColor = "text-[#849495]";
  let ratingPercent = 0;
  if (!isLowData) {
    ratingPercent = Math.min(100, Math.round((realAvgRR / 4.0) * 100));
    if (realAvgRR >= 3.0) {
      rrExpectancyClassification = "Strong";
      rrExpectancyColor = "text-brand-cyan";
    } else if (realAvgRR >= 2.0) {
      rrExpectancyClassification = "Balanced";
      rrExpectancyColor = "text-brand-emerald";
    } else {
      rrExpectancyClassification = "Weak";
      rrExpectancyColor = "text-orange-400";
    }
  } else {
    rrExpectancyClassification = "Awaiting Data";
    rrExpectancyColor = "text-zinc-500";
    ratingPercent = 0;
  }

  // 4. Total Trades (Long / Short split)
  const longsCount = trades.filter(t => t.type === 'LONG').length;
  const shortsCount = trades.filter(t => t.type === 'SHORT').length;

  // 5. Average Trade Duration helper
  const parseDurationToMinutes = (durStr: string): number => {
    if (!durStr) return 0;
    let minutes = 0;
    const cleanStr = durStr.toLowerCase().trim();
    const regex = /(\d+(?:\.\d+)?)\s*([dhm])/g;
    let match;
    let matchedAny = false;
    while ((match = regex.exec(cleanStr)) !== null) {
      matchedAny = true;
      const value = parseFloat(match[1]);
      const unit = match[2];
      if (unit === 'd') {
        minutes += value * 24 * 60;
      } else if (unit === 'h') {
        minutes += value * 60;
      } else if (unit === 'm') {
        minutes += value;
      }
    }
    if (!matchedAny) {
      const rawNum = parseFloat(cleanStr);
      if (!isNaN(rawNum)) {
        return rawNum;
      }
    }
    return minutes;
  };

  const formatMinutesToDuration = (minutes: number): string => {
    if (minutes <= 0) return '0m';
    if (minutes < 60) {
      return `${Math.round(minutes)}m`;
    }
    const hours = minutes / 60;
    if (hours < 24) {
      return `${hours.toFixed(1)} hrs`;
    }
    const days = hours / 24;
    return `${days.toFixed(1)} days`;
  };

  const durationMinutesList = trades.map(t => parseDurationToMinutes(t.duration)).filter(m => m > 0);
  const avgDurationMinutes = durationMinutesList.length > 0 
    ? (durationMinutesList.reduce((sum, m) => sum + m, 0) / durationMinutesList.length)
    : 0;
  const avgDurationText = avgDurationMinutes > 0 ? formatMinutesToDuration(avgDurationMinutes) : "Awaiting session analysis";

  // 6. Best Trading Session
  const sessionNames = ['London', 'New York', 'Asian'] as const;
  const sessionStats = sessionNames.map(s => {
    const sTrades = trades.filter(t => t.session === s);
    const sPnL = sTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const sWins = sTrades.filter(t => (t.pnl || 0) >= 0).length;
    const sWinRate = sTrades.length > 0 ? (sWins / sTrades.length) : 0;
    return { name: s, pnl: sPnL, winRate: sWinRate, count: sTrades.length };
  });

  const profitableSessions = sessionStats.filter(s => s.count > 0 && s.pnl > 0);
  let bestSessionText = "Awaiting session analysis";
  if (profitableSessions.length > 0) {
    profitableSessions.sort((a, b) => b.pnl - a.pnl);
    bestSessionText = `${profitableSessions[0].name} (+$${profitableSessions[0].pnl.toLocaleString()})`;
  } else {
    const playedSession = sessionStats.filter(s => s.count > 0);
    if (playedSession.length > 0) {
      playedSession.sort((a, b) => b.winRate - a.winRate);
      bestSessionText = `${playedSession[0].name} (${Math.round(playedSession[0].winRate * 100)}% WR)`;
    } else {
      bestSessionText = "Awaiting session analysis";
    }
  }

  // 7. Best Performing Pair
  const pairPnLMap: Record<string, number> = {};
  trades.forEach(t => {
    if (t.asset) {
      const assetClean = t.asset.toUpperCase().trim();
      pairPnLMap[assetClean] = (pairPnLMap[assetClean] || 0) + (t.pnl || 0);
    }
  });

  let bestPerformingPairText = "Awaiting trade logs";
  let highestPairPnL = -Infinity;
  Object.entries(pairPnLMap).forEach(([pair, pnl]) => {
    if (pnl > highestPairPnL) {
      highestPairPnL = pnl;
      bestPerformingPairText = pair;
    }
  });
  if (highestPairPnL <= 0 || bestPerformingPairText === "Awaiting trade logs") {
    const activePairs = Object.keys(pairPnLMap);
    if (activePairs.length > 0) {
      bestPerformingPairText = `${activePairs[0]} (Developing)`;
    } else {
      bestPerformingPairText = "Awaiting trade logs";
    }
  } else {
    bestPerformingPairText = `${bestPerformingPairText} (+$${highestPairPnL.toLocaleString()})`;
  }

  // 8. Current Streak
  const chronologicalTrades = [...trades].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  let currentStreakText = "Behavioral patterns still forming";
  if (chronologicalTrades.length > 0) {
    const lastIsWin = (chronologicalTrades[chronologicalTrades.length - 1].pnl || 0) >= 0;
    let streakCount = 0;
    for (let i = chronologicalTrades.length - 1; i >= 0; i--) {
      const isWin = (chronologicalTrades[i].pnl || 0) >= 0;
      if (isWin === lastIsWin) {
        streakCount++;
      } else {
        break;
      }
    }
    currentStreakText = `${streakCount} ${lastIsWin ? 'Win' : 'Loss'}${streakCount > 1 ? 's' : ''}`;
  }

  // Dynamically compute the equity curve based strictly on real database-driven trade records
  const getDynamicPerformanceData = () => {
    if (trades.length === 0) {
      return [
        { name: 'Empty Ledger', pnl: 0 }
      ];
    }
    // Sort chronological (by date/time values)
    const chronTrades = [...trades].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    
    let filtered = chronTrades;
    if (trades.length >= 5) {
      const now = new Date('2026-05-23T14:31:44Z').getTime();
      const oneDay = 24 * 60 * 60 * 1000;
      if (activeTimeline === '1D') {
        filtered = chronTrades.filter(t => now - new Date(t.time).getTime() <= oneDay);
      } else if (activeTimeline === '1W') {
        filtered = chronTrades.filter(t => now - new Date(t.time).getTime() <= 7 * oneDay);
      } else if (activeTimeline === '1M') {
        filtered = chronTrades.filter(t => now - new Date(t.time).getTime() <= 30 * oneDay);
      }
      if (filtered.length === 0) {
        filtered = chronTrades.slice(-5);
      }
    }

    let cumulative = 0;
    return filtered.map((t, idx) => {
      cumulative += (t.pnl || 0);
      const date = new Date(t.time);
      const label = isNaN(date.getTime()) ? `T-${idx + 1}` : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return {
        name: label,
        pnl: cumulative
      };
    });
  };

  // Convert real trade records directly to psychology heatmap intensity (40 indicators)
  const getDynamicHeatmapData = (): HeatmapItem[] => {
    return Array.from({ length: 40 }, (_, i) => {
      const trade = trades[i];
      if (!trade) {
        return {
          id: i + 1,
          intensity: 0 as const,
          state: "Neutral",
          time: `Slot ${i + 1}`
        };
      }
      
      let intensity: 0 | 1 | 2 | 3 = 0;
      let state = "Neutral";
      const emo = trade.emotion_detected?.toLowerCase();
      
      if (emo === 'none' || !emo) {
        intensity = 2; // Stable flow
        state = "Calm (Flow)";
      } else if (emo === 'hesitation') {
        intensity = 1; // Low arousal
        state = "Hesitation (Calm)";
      } else {
        intensity = 3; // High intrusion
        state = trade.emotion_detected || "Anxious";
      }

      return {
        id: i + 1,
        intensity,
        state,
        time: trade.asset || `Execution ${i + 1}`
      };
    });
  };
  
  // Real-time PostgreSQL database search and multi-filtering logic configurations
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSession, setFilterSession] = useState('ALL');
  const [filterWeekday, setFilterWeekday] = useState('ALL');
  const [filterSetup, setFilterSetup] = useState('ALL');
  const [filterOutcome, setFilterOutcome] = useState('ALL');
  const [filterEmotion, setFilterEmotion] = useState('ALL');
  const [filterDirection, setFilterDirection] = useState('ALL');
  const [filterMinRR, setFilterMinRR] = useState('ALL');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Compute filtered trades
  const filteredTrades = trades.filter((t) => {
    // 1. Text Search Input matches (asset pair and journal annotations)
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const assetMatch = t.asset?.toLowerCase().includes(q);
      const notesMatch = t.notes?.toLowerCase().includes(q);
      const structMatch = t.market_structure?.toLowerCase().includes(q);
      if (!assetMatch && !notesMatch && !structMatch) return false;
    }

    // 2. Session Match
    if (filterSession !== 'ALL') {
      if (t.session?.toLowerCase() !== filterSession.toLowerCase()) return false;
    }

    // 3. Day of week Match
    if (filterWeekday !== 'ALL') {
      if (t.day?.toLowerCase() !== filterWeekday.toLowerCase()) return false;
    }

    // 4. Trading Setup Match
    if (filterSetup !== 'ALL') {
      if (t.setup_type?.toLowerCase() !== filterSetup.toLowerCase()) return false;
    }

    // 5. Outcome Match
    if (filterOutcome !== 'ALL') {
      if (t.estimatedOutcome?.toLowerCase() !== filterOutcome.toLowerCase()) return false;
    }

    // 6. Emotion Match
    if (filterEmotion !== 'ALL') {
      if (t.emotion_detected?.toLowerCase() !== filterEmotion.toLowerCase()) return false;
    }

    // 7. Buy/Sell direction Match
    if (filterDirection !== 'ALL') {
      if (t.type?.toLowerCase() !== filterDirection.toLowerCase()) return false;
    }

    // 8. Math RR limits Multipliers Match
    if (filterMinRR !== 'ALL') {
      const minVal = parseFloat(filterMinRR);
      if (!t.rr || t.rr < minVal) return false;
    }

    return true;
  });

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterSession('ALL');
    setFilterWeekday('ALL');
    setFilterSetup('ALL');
    setFilterOutcome('ALL');
    setFilterEmotion('ALL');
    setFilterDirection('ALL');
    setFilterMinRR('ALL');
  };

  // Multi-color logic for state cell blocks
  const getHeatmapColor = (intensity: number) => {
    switch (intensity) {
      case 0: return 'bg-[#18181b] hover:bg-white/10'; // Neutral
      case 1: return 'bg-brand-purple/20 border border-brand-purple/20 hover:bg-brand-purple/30'; // Low arousal / calm
      case 2: return 'bg-brand-emerald/30 border border-brand-emerald/30 hover:bg-brand-emerald/40'; // Stable flow
      case 3: return 'bg-brand-cyan/40 border border-brand-cyan/40 hover:bg-brand-cyan/50 shadow-[0_0_8px_rgba(0,219,231,0.2)]'; // High focus / greedy alert
      default: return 'bg-[#18181b]';
    }
  };

  // Recharts custom payload for the gauge
  const radialData = [
    {
      name: 'All Session',
      value: stats.winRate,
      fill: '#00dbe7',
    }
  ];

  if (trades.length === 0) {
    return (
      <div className="space-y-6 pb-24 font-sans max-w-7xl mx-auto">
        {/* HUD Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-white tracking-tight">
              Portfolio Executive Summary
            </h2>
            <p className="text-xs text-[#849495] font-light">
              Risk parameters, cognitive insights, and execution auditing.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-12 px-4 max-w-xl mx-auto text-center font-sans relative">
          <div className="absolute inset-0 bg-radial-gradient from-brand-cyan/5 via-transparent to-transparent pointer-events-none z-0" />
          <div className="glass-fill relative z-10 w-full p-8 md:p-10 rounded-2xl border border-white/5 shadow-2xl space-y-6">
            <div className="mx-auto w-16 h-16 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan shadow-[0_0_20px_rgba(0,219,231,0.15)] animate-pulse">
              <Brain size={32} />
            </div>
            
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-brand-cyan tracking-widest uppercase font-bold">
                TRADELENSE CORE ENGINE
              </div>
              <h3 className="text-xl font-display font-bold text-white tracking-tight">
                Awaiting First Execution Upload
              </h3>
              <p className="text-xs text-[#849495] leading-relaxed max-w-sm mx-auto">
                Upload your first trade to begin building your AI trading intelligence profile.
              </p>
            </div>

            <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-left space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded bg-brand-cyan/15 text-brand-cyan font-mono text-[10px] flex items-center justify-center font-bold mt-0.5">1</span>
                <div>
                  <p className="text-xs font-semibold text-white">Upload Screenshot Reference</p>
                  <p className="text-[11px] text-[#849495] mt-0.5">Drag & drop your chart capture with optional TradingView long/short tool models.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded bg-brand-cyan/15 text-brand-cyan font-mono text-[10px] flex items-center justify-center font-bold mt-0.5">2</span>
                <div>
                  <p className="text-xs font-semibold text-white">Neural OCR Candlestick Scanning</p>
                  <p className="text-[11px] text-[#849495] mt-0.5">Gemini instantly extracts entry, stop loss, take profit levels, and emotional cues.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded bg-brand-cyan/15 text-brand-cyan font-mono text-[10px] flex items-center justify-center font-bold mt-0.5">3</span>
                <div>
                  <p className="text-xs font-semibold text-white">Live Recalculation & Biomechanical Feedback</p>
                  <p className="text-[11px] text-[#849495] mt-0.5">Stream performance curves, win rate distribution matrices, and executive psychology audits.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
                Press SCAN SNAPS in sidebar to start
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 font-sans max-w-7xl mx-auto">
      
      {/* HUD Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white tracking-tight">
            Portfolio Executive Summary
          </h2>
          <p className="text-xs text-[#849495] font-light">
            Risk parameters, cognitive insights, and execution auditing.
          </p>
        </div>
      </div>

      {/* Primary KPI Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Monthly Performance PNL card */}
        <div className="glass-fill p-5 rounded-xl border border-white/5 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 rounded-full blur-2xl group-hover:bg-brand-cyan/10 transition-colors pointer-events-none" />
          <div className="text-[10px] font-mono text-[#849495] tracking-widest uppercase font-bold mb-2">
            MONTHLY PERFORMANCE PNL
          </div>
          <div className={`text-2xl font-mono font-bold leading-none tracking-tight ${monthlyPnL >= 0 ? "text-brand-emerald" : "text-red-400"}`}>
            {monthlyPnL >= 0 ? "+" : ""}${monthlyPnL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className={`mt-4 flex items-center gap-1.5 text-[11px] font-semibold font-sans ${isPnlTrendPositive ? 'text-brand-emerald' : 'text-red-400'}`}>
            {isPnlTrendPositive ? <ArrowUpRight className="w-4 h-4 animate-bounce" /> : <ArrowDownRight className="w-4 h-4" />}
            <span title={pnlTrendText} className="truncate">
              {pnlTrendText}
            </span>
          </div>
        </div>

        {/* Win Rate Card */}
        <div className="glass-fill p-5 rounded-xl border border-white/5 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/5 rounded-full blur-2xl group-hover:bg-brand-cyan/10 transition-colors pointer-events-none" />
          <div className="text-[10px] font-mono text-[#849495] tracking-widest uppercase font-bold mb-2">
            WIN RATE INDEX
          </div>
          <div className="text-2xl font-mono text-white font-bold leading-none tracking-tight">
            {realWinRate}%
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-[#849495] font-mono">
            <Award className="w-4 h-4 text-brand-cyan" />
            <span>{winsCount} wins / {totalTradesCount} trades</span>
          </div>
        </div>

        {/* Average Risk to Reward average Card */}
        <div className="glass-fill p-5 rounded-xl border border-white/5 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-emerald/5 rounded-full blur-2xl group-hover:bg-brand-emerald/10 transition-colors pointer-events-none" />
          <div className="text-[10px] font-mono text-[#849495] tracking-widest uppercase font-bold mb-2">
            AVERAGE RISK : REWARD
          </div>
          <div className="text-2xl font-mono text-white font-bold leading-none tracking-tight">
            1 : {realAvgRR.toFixed(2)}
          </div>
          {/* Quality check bar indicator */}
          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-[#849495]">
              <span>EXPECTANCY</span>
              <span className={`font-bold ${rrExpectancyColor}`}>{rrExpectancyClassification}</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-cyan transition-all duration-500" 
                style={{ width: `${ratingPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Total Executions logged */}
        <div className="glass-fill p-5 rounded-xl border border-white/5 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 rounded-full blur-2xl group-hover:bg-brand-purple/10 transition-colors pointer-events-none" />
          <div className="text-[10px] font-mono text-[#849495] tracking-widest uppercase font-bold mb-2">
            TOTAL EXECUTIONS
          </div>
          <div className="text-2xl font-mono text-white font-bold leading-none tracking-tight">
            {totalTradesCount} <span className="text-xs text-[#849495]">POSITIONS</span>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-[#ebb2ff] font-sans">
            <TrendingUp className="w-4 h-4 text-brand-purple" />
            <span>{longsCount} Long / {shortsCount} Short split</span>
          </div>
        </div>

      </div>

      {/* Secondary Compact Analytics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Average Trade Duration Card */}
        <div className="glass-fill p-4 rounded-xl border border-white/5 flex flex-col justify-between relative overflow-hidden group">
          <span className="text-[9px] font-mono text-[#849495] tracking-widest uppercase font-bold mb-1">
            Avg Trade Duration
          </span>
          <div className="text-base font-mono text-white font-semibold">
            {trades.length < 3 ? "Awaiting session analysis" : avgDurationText}
          </div>
          <p className="text-[9px] font-mono text-zinc-500 mt-2">
            Mean holding times
          </p>
        </div>

        {/* Best Trading Session Card */}
        <div className="glass-fill p-4 rounded-xl border border-white/5 flex flex-col justify-between relative overflow-hidden group">
          <span className="text-[9px] font-mono text-[#849495] tracking-widest uppercase font-bold mb-1">
            Best trading Session
          </span>
          <div className="text-base font-mono text-brand-cyan font-semibold truncate" title={bestSessionText}>
            {trades.length < 3 ? "Awaiting session analysis" : bestSessionText}
          </div>
          <p className="text-[9px] font-mono text-zinc-500 mt-2">
            Highest return session
          </p>
        </div>

        {/* Best Performing Pair Card */}
        <div className="glass-fill p-4 rounded-xl border border-white/5 flex flex-col justify-between relative overflow-hidden group">
          <span className="text-[9px] font-mono text-[#849495] tracking-widest uppercase font-bold mb-1">
            Best Performing Pair
          </span>
          <div className="text-base font-mono text-brand-emerald font-semibold truncate" title={bestPerformingPairText}>
            {trades.length < 3 ? "Awaiting trade logs" : bestPerformingPairText}
          </div>
          <p className="text-[9px] font-mono text-zinc-500 mt-2">
            Top cumulative asset
          </p>
        </div>

        {/* Current Execution Streak Card */}
        <div className="glass-fill p-4 rounded-xl border border-white/5 flex flex-col justify-between relative overflow-hidden group">
          <span className="text-[9px] font-mono text-[#849495] tracking-widest uppercase font-bold mb-1">
            Current Streak
          </span>
          <div className="text-base font-mono text-[#ebb2ff] font-semibold">
            {trades.length < 1 ? "Behavioral patterns still forming" : currentStreakText}
          </div>
          <p className="text-[9px] font-mono text-zinc-500 mt-2">
            Consecutive run metrics
          </p>
        </div>

      </div>

      {/* Secondary Main Interactive Core Grid (Bento columns) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Module: Equity Curve Area Graph */}
        <div className="md:col-span-8 glass-fill p-6 rounded-xl border border-white/5 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider">
                Total PnL Curve Cumulative
              </h3>
              <p className="text-[11px] text-[#849495] font-light">
                Relative portfolio net returns against volatile benchmarks.
              </p>
            </div>
            {/* Timeline Selector Controls */}
            <div className="flex bg-[#131316] p-1 rounded-lg border border-white/15">
              {(['1D', '1W', '1M'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTimeline(t)}
                  className={`px-3 py-1 text-[10px] font-mono font-bold tracking-wider rounded transition-all select-none ${
                    activeTimeline === t 
                      ? 'bg-brand-cyan text-black font-semibold' 
                      : 'text-[#849495] hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getDynamicPerformanceData()}>
                <defs>
                  <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00dbe7" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#00dbe7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  stroke="#516365" 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fontSize: 9, fontFamily: 'monospace' }} 
                />
                <YAxis 
                  stroke="#516365" 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fontSize: 9, fontFamily: 'monospace' }} 
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#131316', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '11px', fontFamily: 'monospace' }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="pnl" 
                  stroke="#00dbe7" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorPnl)" 
                  dot={{ r: 3, fill: '#00dbe7', stroke: '#00dbe7' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Module: Win Rate Radial & Psychology Heatmap summary */}
        <div className="md:col-span-4 glass-fill p-6 rounded-xl border border-white/5 flex flex-col justify-between relative">
          <div>
            <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider mb-2">
              Historical Win distribution
            </h3>
            <p className="text-[11px] text-[#849495] mb-4 font-light">
              Win margins decomposed by long versus short entry types.
            </p>
          </div>

          <div className="flex items-center justify-around gap-2 mb-4">
            {/* Radial Bar Gauge */}
            <div className="w-28 h-28 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="75%" 
                  outerRadius="100%" 
                  barSize={10} 
                  data={radialData}
                  startAngle={180}
                  endAngle={-180}
                >
                  <RadialBar
                    dataKey="value"
                    cornerRadius={5}
                    background={{ fill: '#141416' }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-mono text-white font-bold">{stats.winRate}%</span>
                <span className="text-[8px] font-mono text-[#849495] uppercase font-bold tracking-widest">WIN RATE</span>
              </div>
            </div>

            {/* Split Metrics list */}
            <div className="space-y-3 font-mono text-[10px] flex-1">
              <div className="border border-white/5 bg-white/[0.02] p-2.5 rounded">
                <div className="text-[#849495] uppercase font-bold">LONG BREAK WINRATE</div>
                <div className="text-brand-cyan text-sm font-semibold mt-0.5">
                  {trades.filter(t => t.type === 'LONG').length > 0 ? `${stats.longWinRate}%` : 'N/A'}
                </div>
              </div>
              <div className="border border-white/5 bg-white/[0.02] p-2.5 rounded">
                <div className="text-[#849495] uppercase font-bold">SHORT DEVI WINRATE</div>
                <div className="text-brand-purple text-sm font-semibold mt-0.5">
                  {trades.filter(t => t.type === 'SHORT').length > 0 ? `${stats.shortWinRate}%` : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Psychology Heatmap Micro Grid */}
          <div className="border-t border-white/5 pt-4 mt-2 relative">
            <div className="flex justify-between items-center mb-2 text-[10px] font-mono">
              <span className="text-[#849495] uppercase font-bold">PSYCHOLOGY HEATMAP (30D)</span>
              <span className="text-brand-cyan font-bold uppercase tracking-wider">FLOW PATTERN: {flowPatternIndex}%</span>
            </div>
            
            <div className="grid grid-cols-10 gap-1.5 relative">
              {getDynamicHeatmapData().map((cell) => (
                <div 
                  key={cell.id} 
                  className={`w-full aspect-square rounded transition-all duration-300 cursor-crosshair ${getHeatmapColor(cell.intensity)}`}
                  title={`${cell.time}: State is ${cell.state}`}
                />
              ))}

              {isLowData && (
                <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center text-center p-2 rounded border border-white/5 z-20">
                  <Brain className="w-5 h-5 text-brand-cyan mb-1 animate-pulse" />
                  <p className="text-[10px] font-bold text-white uppercase tracking-widest">Awaiting behavioral pattern data</p>
                  <p className="text-[8px] text-[#849495] max-w-[185px] leading-tight mt-0.5">Need more executions for confidence scoring.</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center mt-3 text-[9px] font-mono text-[#849495]">
              <span>LOW FOCUS (CALM)</span>
              <span>HIGH FOCUS (REACHED)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Cognitive Intelligence Streaming alerts */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        <div className="md:col-span-4 glass-fill p-6 rounded-xl border border-white/5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded bg-brand-cyan/15 border border-brand-cyan/30 flex items-center justify-center">
              <Brain className="w-5 h-5 text-brand-cyan animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-sans font-bold text-white tracking-wider uppercase mb-1">
                Cognitive Assistant HUD
              </h3>
              <p className="text-xs text-[#b9cacb] font-light leading-relaxed">
                Connect live telemetry and compute behavioral anomalies instantly. Generate an executive psychiatry forensic report.
              </p>
            </div>
          </div>

          <button
            onClick={onTriggerAudit}
            className="w-full mt-6 py-2.5 bg-brand-cyan/15 border border-brand-cyan/30 hover:bg-brand-cyan/25 text-brand-cyan text-xs font-semibold rounded uppercase tracking-wider transition-colors duration-200"
          >
            Generate Psychology Audit
          </button>
        </div>

        {/* Cognitive Insight stream */}
        <div className="md:col-span-8 glass-fill p-6 rounded-xl border border-white/5 space-y-4">
          <div className="border-b border-white/5 pb-3">
            <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider">
              Cognitive Anomaly stream
            </h3>
            <p className="text-[11px] text-[#849495] font-light">
              AI warning cues flagged during real-time position holds and market releases.
            </p>
          </div>

          <div className="space-y-3">
            {insights.length === 0 ? (
              <div className="p-8 text-center border border-white/5 bg-black/20 rounded-lg">
                <Brain className="w-5 h-5 text-zinc-600 mx-auto mb-2 animate-pulse" />
                <p className="text-xs text-[#849495] font-light">Awaiting real trade registrations to stream behavioral insights.</p>
              </div>
            ) : (
              insights.map((insight) => (
                <div 
                  key={insight.id}
                  className="flex items-start gap-3.5 p-3.5 bg-black/40 border border-white/5 rounded-lg hover:border-white/10 transition-colors"
                >
                  <div className={`mt-0.5 rounded p-1 ${
                    insight.type === 'danger' ? 'bg-red-500/10 text-red-500' :
                    insight.type === 'warning' ? 'bg-[#ebb2ff]/10 text-[#ebb2ff]' :
                    insight.type === 'success' ? 'bg-[#00e383]/10 text-[#00e383]' :
                    'bg-brand-cyan/10 text-brand-cyan'
                  }`}>
                    {insight.type === 'danger' || insight.type === 'warning' ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : (
                      <Award className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-sans font-bold text-white leading-tight">
                      {insight.title}
                    </h4>
                    <p className="text-[11px] text-[#b9cacb] mt-1 font-light leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Advanced Performance & Intelligence Metrics Engine */}
      <div className="glass-fill p-6 rounded-xl border border-white/5 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
          <div>
            <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-cyan" />
              <span>Advanced Intelligence Performance Matrix</span>
            </h3>
            <p className="text-[11px] text-[#849495] font-light">
              Deconstructed performance vectors computed dynamically from verified screenshot uploads.
            </p>
          </div>

          {/* Tab selectors */}
          <div className="flex flex-wrap bg-[#101012] p-1 rounded-lg border border-white/10 gap-1">
            {(['session', 'day', 'setup', 'emotion'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveAnalyTab(tab)}
                className={`px-3 py-1.5 text-[10px] font-mono font-bold tracking-widest uppercase rounded transition-all cursor-pointer ${
                  activeAnalyTab === tab 
                    ? 'bg-brand-cyan text-black font-semibold shadow-[0_0_12px_rgba(0,219,231,0.25)]' 
                    : 'text-[#849495] hover:text-white'
                }`}
              >
                {tab === 'session' ? 'Sessions' : tab === 'day' ? 'Days (DNA)' : tab === 'setup' ? 'Setups (WinRate)' : 'Psychology Bias'}
              </button>
            ))}
          </div>
        </div>

        {/* Tab contents */}
        <div className="mt-4">
          
          {/* Tab 1: Sessions */}
          {activeAnalyTab === 'session' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['London', 'New York', 'Asian', 'London/NY Overlap'].map(session => {
                const list = trades.filter(t => t.session === session);
                const wins = list.filter(t => t.pnl >= 0).length;
                const rate = list.length > 0 ? Math.round((wins / list.length) * 100) : 0;
                const totalPnl = list.reduce((sum, t) => sum + t.pnl, 0);
                
                return (
                  <div key={session} className="bg-black/40 border border-white/5 p-4 rounded-lg flex flex-col justify-between relative overflow-hidden group">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-[#849495] uppercase font-bold tracking-widest">{session} Session</span>
                      <div className={`text-lg font-mono font-bold ${totalPnl >= 0 ? 'text-brand-emerald' : 'text-red-400'}`}>
                        {totalPnl >= 0 ? '+' : ''}${totalPnl.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-[#849495]">
                        <span>WINRATE ({list.length} TRADES)</span>
                        <span className="text-white font-bold">{rate}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${rate >= 60 ? 'bg-brand-cyan' : rate >= 40 ? 'bg-brand-purple' : 'bg-red-500'}`} 
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 2: Day-of-Week */}
          {activeAnalyTab === 'day' && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
                const list = trades.filter(t => t.day === day);
                const wins = list.filter(t => t.pnl >= 0).length;
                const rate = list.length > 0 ? Math.round((wins / list.length) * 100) : 0;
                const totalPnl = list.reduce((sum, t) => sum + t.pnl, 0);

                return (
                  <div key={day} className="bg-black/40 border border-white/5 p-3.5 rounded-lg flex flex-col justify-between">
                    <div>
                      <span className="text-[8.5px] font-mono text-[#849495] uppercase font-bold">{day}</span>
                      <div className={`text-sm font-mono font-bold mt-1 ${totalPnl >= 0 ? 'text-brand-emerald' : 'text-red-400'}`}>
                        {totalPnl >= 0 ? '+' : ''}${totalPnl.toLocaleString()}
                      </div>
                    </div>

                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between text-[9px] font-mono text-[#849495]">
                        <span>WIN RATE</span>
                        <span className="text-white">{rate}%</span>
                      </div>
                      <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${totalPnl >= 0 ? 'bg-brand-cyan' : 'bg-brand-purple'}`} 
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                      <div className="text-[9px] font-mono text-[#516365] text-right">{list.length} executions</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 3: Setups (Win Rate) */}
          {activeAnalyTab === 'setup' && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {['breakout', 'liquidity sweep', 'reversal', 'scalp', 'trend continuation'].map(setup => {
                const list = trades.filter(t => t.setup_type === setup);
                const wins = list.filter(t => t.pnl >= 0).length;
                const rate = list.length > 0 ? Math.round((wins / list.length) * 100) : 0;
                const totalPnl = list.reduce((sum, t) => sum + t.pnl, 0);

                return (
                  <div key={setup} className="bg-black/30 border border-white/5 p-4 rounded-lg flex flex-col justify-between">
                    <div>
                      <span className="text-[8.5px] font-mono text-brand-cyan uppercase font-bold tracking-widest">{setup}</span>
                      <div className={`text-base font-mono font-bold mt-1 ${totalPnl >= 0 ? 'text-brand-emerald' : 'text-red-400'}`}>
                        {totalPnl >= 0 ? '+' : ''}${totalPnl.toLocaleString()}
                      </div>
                    </div>

                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between text-[9px] font-mono text-[#849495]">
                        <span>WIN % ({list.length})</span>
                        <span className="text-white font-bold">{rate}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-cyan" 
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 4: Psychology & Bias */}
          {activeAnalyTab === 'emotion' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-brand-cyan/5 border border-brand-cyan/15 p-4 rounded-lg flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-brand-cyan uppercase font-bold tracking-widest">EMOTIONAL INTRUSION RATE</span>
                  <div className="text-3xl font-mono text-white font-bold mt-2">
                    {trades.filter(t => t.emotion_detected && t.emotion_detected !== 'none').length > 0 
                      ? Math.round((trades.filter(t => t.emotion_detected && t.emotion_detected !== 'none').length / trades.length) * 100) 
                      : 0}%
                  </div>
                  <p className="text-[10px] text-[#849495] mt-1 font-light">Proportion of executed trades influenced by emotional spikes.</p>
                </div>

                <div className="bg-brand-purple/5 border border-brand-purple/15 p-4 rounded-lg flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-brand-purple uppercase font-bold tracking-widest">MAJOR IMPEDIMENT BIAS</span>
                  <div className="text-lg font-sans text-white font-bold mt-2 uppercase tracking-tight">
                    {(() => {
                      const emotionalTrades = trades.filter(t => t.emotion_detected && t.emotion_detected !== 'none');
                      if (emotionalTrades.length === 0) return 'NONE';
                      
                      const map: Record<string, number> = {};
                      emotionalTrades.forEach(t => {
                        if (t.emotion_detected) {
                          map[t.emotion_detected] = (map[t.emotion_detected] || 0) + 1;
                        }
                      });
                      
                      let topEmo = 'none';
                      let maxCount = 0;
                      Object.entries(map).forEach(([emo, count]) => {
                        if (count > maxCount) {
                          maxCount = count;
                          topEmo = emo;
                        }
                      });
                      return topEmo;
                    })()}
                  </div>
                  <p className="text-[10px] text-[#849495] mt-1 font-light">The psychiatric bias with the highest recurrence over recent holds.</p>
                </div>

                <div className="bg-[#131118]/50 border border-white/5 p-4 rounded-lg col-span-2 space-y-3">
                  <span className="text-[9px] font-mono text-[#849495] uppercase font-bold">EXECUTIVE COGNITIVE SUMMARY</span>
                  <div className="text-xs text-[#b9cacb] font-light leading-relaxed">
                    Over the last <span className="text-white font-semibold">{trades.length} executions</span>, {
                      trades.filter(t => t.emotion_detected === 'revenge behavior').length > 0 
                      ? `revenge behavior and overtrading has caused severe mathematical pnl drawdowns ($ ${Math.abs(trades.filter(t => t.emotion_detected === 'revenge behavior').reduce((sum, t) => sum + (t.pnl || 0), 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}).`
                      : `disciplined adherence has remained excellent (average win-rate at ${stats.winRate}%).`
                    } Make sure to preserve stop loss buffers under institutional supply bounds immediately to protect assets.
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Execution logs ledger dashboard */}
      <div className="glass-fill rounded-xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider">
              Recent Executions Archive
            </h3>
            <p className="text-[11px] text-[#849495] font-light">
              Verified executions synchronized with backend PostgreSQL database.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-[#131316] border border-white/10 rounded-full font-mono text-[9px] text-[#849495] uppercase font-bold tracking-widest leading-none">
              {filteredTrades.length} / {trades.length} REFLOGS SHOWN
            </div>
          </div>
        </div>

        {/* Search & Advanced Filters Bar */}
        <div className="p-4 bg-[#0a0a0c] border-b border-white/5 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#516365]" />
              <input
                type="text"
                placeholder="Search asset pair, notes, structural annotations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#131316] border border-white/5 rounded-lg text-xs text-white placeholder-[#516365] focus:outline-none focus:border-brand-cyan/40 font-sans transition-colors"
              />
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  showAdvancedFilters 
                    ? 'bg-brand-cyan/10 border-brand-cyan text-brand-cyan' 
                    : 'bg-[#131316] border-white/5 text-[#849495] hover:text-white hover:border-white/10'
                }`}
              >
                <Filter size={12} />
                <span>FILTERS</span>
                {(filterSession !== 'ALL' || filterWeekday !== 'ALL' || filterSetup !== 'ALL' || filterOutcome !== 'ALL' || filterEmotion !== 'ALL' || filterDirection !== 'ALL' || filterMinRR !== 'ALL') && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan inline-block animate-pulse" />
                )}
              </button>

              {(searchTerm || filterSession !== 'ALL' || filterWeekday !== 'ALL' || filterSetup !== 'ALL' || filterOutcome !== 'ALL' || filterEmotion !== 'ALL' || filterDirection !== 'ALL' || filterMinRR !== 'ALL') && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 px-3 py-2 bg-[#131316] border border-red-500/10 text-red-400 hover:bg-red-500/5 rounded-lg text-xs font-mono font-semibold hover:border-red-500/20 transition-all cursor-pointer"
                  title="Reset all filters"
                >
                  <RotateCcw size={12} />
                  <span>RESET</span>
                </button>
              )}
            </div>
          </div>

          {/* Collapsible Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 pt-2 border-t border-white/5">
              {/* Direction SELECT */}
              <div className="flex flex-col gap-1">
                <span className="text-[8.5px] font-mono text-[#516365] uppercase font-bold tracking-wider">Direction</span>
                <select
                  value={filterDirection}
                  onChange={(e) => setFilterDirection(e.target.value)}
                  className="bg-[#131316] border border-white/5 rounded px-2 py-1.5 text-xs text-[#b9cacb] focus:outline-none focus:border-brand-cyan/40 font-mono"
                >
                  <option value="ALL">ALL SIDE</option>
                  <option value="LONG">LONG</option>
                  <option value="SHORT">SHORT</option>
                </select>
              </div>

              {/* Session SELECT */}
              <div className="flex flex-col gap-1">
                <span className="text-[8.5px] font-mono text-[#516365] uppercase font-bold tracking-wider">Session</span>
                <select
                  value={filterSession}
                  onChange={(e) => setFilterSession(e.target.value)}
                  className="bg-[#131316] border border-white/5 rounded px-2 py-1.5 text-xs text-[#b9cacb] focus:outline-none focus:border-brand-cyan/40 font-mono"
                >
                  <option value="ALL">ALL SESSION</option>
                  <option value="London">London</option>
                  <option value="New York">New York</option>
                  <option value="Asian">Asian</option>
                  <option value="London/NY Overlap">London/NY Overlap</option>
                  <option value="None">None</option>
                </select>
              </div>

              {/* Weekday SELECT */}
              <div className="flex flex-col gap-1">
                <span className="text-[8.5px] font-mono text-[#516365] uppercase font-bold tracking-wider">Trading Day</span>
                <select
                  value={filterWeekday}
                  onChange={(e) => setFilterWeekday(e.target.value)}
                  className="bg-[#131316] border border-white/5 rounded px-2 py-1.5 text-xs text-[#b9cacb] focus:outline-none focus:border-brand-cyan/40 font-mono"
                >
                  <option value="ALL">ALL DAYS</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                </select>
              </div>

              {/* Setup Type SELECT */}
              <div className="flex flex-col gap-1">
                <span className="text-[8.5px] font-mono text-[#516365] uppercase font-bold tracking-wider">Model Setup</span>
                <select
                  value={filterSetup}
                  onChange={(e) => setFilterSetup(e.target.value)}
                  className="bg-[#131316] border border-white/5 rounded px-2 py-1.5 text-xs text-[#b9cacb] focus:outline-none focus:border-brand-cyan/40 font-mono"
                >
                  <option value="ALL">ALL SETUPS</option>
                  <option value="breakout">Breakout</option>
                  <option value="reversal">Reversal</option>
                  <option value="liquidity sweep">Liquidity Sweep</option>
                  <option value="trend continuation">Trend Continuation</option>
                  <option value="support resistance bounce">SR Bounce</option>
                  <option value="scalp">Scalp</option>
                  <option value="intraday">Intraday</option>
                  <option value="swing trade">Swing Trade</option>
                </select>
              </div>

              {/* Outcome SELECT */}
              <div className="flex flex-col gap-1">
                <span className="text-[8.5px] font-mono text-[#516365] uppercase font-bold tracking-wider">Outcome</span>
                <select
                  value={filterOutcome}
                  onChange={(e) => setFilterOutcome(e.target.value)}
                  className="bg-[#131316] border border-white/5 rounded px-2 py-1.5 text-xs text-[#b9cacb] focus:outline-none focus:border-brand-cyan/40 font-mono"
                >
                  <option value="ALL">ALL OUTCOMES</option>
                  <option value="TP_HIT">TP Hit</option>
                  <option value="SL_HIT">SL Hit</option>
                  <option value="TRAILING_SL">Trailing SL</option>
                  <option value="MANUAL_CLOSED">Manual Close</option>
                </select>
              </div>

              {/* Emotion SELECT */}
              <div className="flex flex-col gap-1">
                <span className="text-[8.5px] font-mono text-[#516365] uppercase font-bold tracking-wider">Emotional Tone</span>
                <select
                  value={filterEmotion}
                  onChange={(e) => setFilterEmotion(e.target.value)}
                  className="bg-[#131316] border border-white/5 rounded px-2 py-1.5 text-xs text-[#b9cacb] focus:outline-none focus:border-brand-cyan/40 font-mono text-ellipsis overflow-hidden whitespace-nowrap"
                >
                  <option value="ALL">ALL STATES</option>
                  <option value="none">None (Stable)</option>
                  <option value="fear exits">Fear Exits</option>
                  <option value="greed">Greed</option>
                  <option value="impatience">Impatience</option>
                  <option value="overconfidence">Overconfidence</option>
                  <option value="revenge behavior">Revenge hold</option>
                </select>
              </div>

              {/* RR Minimum SELECT */}
              <div className="flex flex-col gap-1 col-span-2">
                <span className="text-[8.5px] font-mono text-[#516365] uppercase font-bold tracking-wider">Min Risk-Reward</span>
                <select
                  value={filterMinRR}
                  onChange={(e) => setFilterMinRR(e.target.value)}
                  className="bg-[#131316] border border-white/5 rounded px-2 py-1.5 text-xs text-[#b9cacb] focus:outline-none focus:border-brand-cyan/40 font-mono w-full"
                >
                  <option value="ALL">ANY Math Ratio</option>
                  <option value="1.0">≥ 1:1 RR</option>
                  <option value="2.0">≥ 2:1 RR</option>
                  <option value="3.0">≥ 3:1 RR</option>
                  <option value="4.0">≥ 4:1 RR</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="bg-[#101012] border-b border-white/5 text-[10px] text-[#516365] tracking-widest uppercase font-mono font-bold">
                <th className="py-4 px-6">ASSET CLASS</th>
                <th className="py-4 px-6">TYPE</th>
                <th className="py-4 px-6">ENTRY</th>
                <th className="py-4 px-6">EXIT</th>
                <th className="py-4 px-6">DURATION</th>
                <th className="py-4 px-6">NET RETURN PNL</th>
                <th className="py-4 px-6">TIME (UTC)</th>
                <th className="py-4 px-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTrades.map((t) => {
                const isProfit = t.pnl >= 0;
                return (
                  <tr 
                    key={t.id} 
                    onClick={() => setSelectedTrade(t)}
                    className="hover:bg-[#141416]/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6 font-semibold text-white group-hover:text-brand-cyan transition-colors">{t.asset}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded text-[9px] font-mono tracking-widest font-bold ${
                        t.type === 'LONG' 
                          ? 'bg-brand-cyan/10 text-brand-cyan' 
                          : 'bg-brand-purple/10 text-brand-purple'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-[#b9cacb] font-medium">${t.entryPrice.toLocaleString()}</td>
                    <td className="py-4 px-6 font-mono text-[#b9cacb] font-medium">${t.exitPrice.toLocaleString()}</td>
                    <td className="py-4 px-6 text-[#849495]">{t.duration}</td>
                    <td className={`py-4 px-6 font-mono font-bold ${isProfit ? 'text-brand-emerald' : 'text-red-400'}`}>
                      {isProfit ? '+' : ''}${t.pnl.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-[#849495] font-mono text-[10px]">{t.time.replace('T', ' ').replace('Z', '')}</td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedTrade(t)}
                          className="text-[10px] text-brand-cyan hover:text-white font-mono font-semibold hover:underline bg-transparent border-none cursor-pointer"
                        >
                          DIAGNOSE
                        </button>
                        <span className="text-white/10">/</span>
                        <button
                          onClick={() => {
                            const confirmed = confirm("Purge this execution entry from index permanently?");
                            if (confirmed) onDeleteTrade(t.id);
                          }}
                          className="text-[10px] text-red-500/70 hover:text-red-400 font-mono font-semibold hover:underline bg-transparent border-none cursor-pointer"
                        >
                          PURGE
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {trades.length === 0 && (
            <div className="p-20 text-center font-sans">
              <div className="w-12 h-12 rounded-full bg-brand-cyan/10 text-brand-cyan flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Brain size={22} />
              </div>
              <p className="text-sm font-semibold text-white">Upload your first trade to begin building your AI trading intelligence profile.</p>
              <p className="text-xs text-[#516365] mt-1">Our neural OCR engine will instantly reconstruct trade geometries and mental indicators.</p>
            </div>
          )}
          {trades.length > 0 && filteredTrades.length === 0 && (
            <div className="p-20 text-center font-sans">
              <div className="w-12 h-12 rounded-full bg-brand-cyan/10 text-brand-cyan flex items-center justify-center mx-auto mb-4">
                <Brain size={22} className="text-zinc-500 animate-pulse" />
              </div>
              <p className="text-sm font-semibold text-white">No positions match your search criteria.</p>
              <p className="text-xs text-[#516365] mt-1">Try resetting the custom filters or search term parameters above.</p>
            </div>
          )}
        </div>
      </div>

      {selectedTrade && (
        <TradeDetailView
          trade={selectedTrade}
          onClose={() => setSelectedTrade(null)}
          onUpdateTrade={(updated) => {
            onUpdateTrade(updated);
            setSelectedTrade(updated);
          }}
          onDeleteTrade={onDeleteTrade}
        />
      )}

    </div>
  );
}
