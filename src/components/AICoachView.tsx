import { useState } from 'react';
import { Trade, Stats } from '../types';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { 
  BrainCircuit, 
  ShieldAlert, 
  Zap, 
  TrendingUp, 
  MessageSquare, 
  CheckCircle,
  HelpCircle,
  Clock
} from 'lucide-react';

interface AICoachViewProps {
  stats: Stats;
  trades: Trade[];
}

export default function AICoachView({ stats, trades }: AICoachViewProps) {
  const [auditing, setAuditing] = useState(false);
  const [auditReport, setAuditReport] = useState<string | null>(null);

  // If insufficient data exists, show a clean, gorgeous low-data state instead of placeholder mock scores.
  if (trades.length < 3) {
    return (
      <div className="space-y-6 pb-24 font-sans max-w-7xl mx-auto">
        <div>
          <h2 className="text-2xl font-display font-bold text-white tracking-tight">AI Coach & Behavioral Profiler</h2>
          <p className="text-xs text-[#849495] font-light">
            Forensic analysis of cognitive biases, execution discipline, and stress response indexes.
          </p>
        </div>

        <div className="glass-fill p-10 rounded-2xl border border-white/5 text-center space-y-6 max-w-lg mx-auto mt-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient from-brand-purple/10 via-transparent to-transparent pointer-events-none z-0" />
          <div className="mx-auto w-16 h-16 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple shadow-[0_0_20px_rgba(235,178,255,0.15)] animate-pulse z-10 relative">
            <BrainCircuit size={32} />
          </div>
          
          <div className="space-y-2 z-10 relative">
            <h3 className="text-lg font-display font-bold text-white tracking-tight">
              Awaiting Behavioral Pattern Data
            </h3>
            <p className="text-xs text-[#849495] leading-relaxed max-w-sm mx-auto">
              We require at least 3 trade executions in the portfolio ledger to construct your discipline vector, calm timelines, and cognitive alert triggers.
            </p>
          </div>

          <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-left text-xs text-[#b9cacb] font-mono space-y-2.5 z-10 relative">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-ping" />
              <span>Current Executions: {trades.length} / 3 needed</span>
            </div>
            <p className="text-[11px] text-[#849495] leading-relaxed">
              Upload and register trade snapshots in the ledger. Once the threshold is met, the behavioral AI engine will automatically build your psychological matrix.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Dynamic calculations for the behavioral radar based on logged trade errors and mistakes
  const earlyExitsCount = trades.filter(t => t.mistake_type === 'early exit').length;
  const patienceValue = Math.max(0, Math.round(100 - (earlyExitsCount / trades.length) * 100));

  const oversizedCount = trades.filter(t => t.mistake_type === 'oversized position').length;
  const sizingValue = Math.max(0, Math.round(100 - (oversizedCount / trades.length) * 100));

  const overtradingCount = trades.filter(t => t.mistake_type === 'overtrading').length;
  const durabilityValue = Math.max(0, Math.round(100 - (overtradingCount / trades.length) * 100));

  const fomoCount = trades.filter(t => t.mistake_type === 'FOMO entry' || t.mistake_type === 'late entry').length;
  const fomoShieldValue = Math.max(0, Math.round(100 - (fomoCount / trades.length) * 100));

  const radarData = [
    { subject: 'Patience', value: patienceValue, fullMark: 100 },
    { subject: 'Risk Adherence', value: stats.ruleAdherence, fullMark: 100 },
    { subject: 'Stop Discipline', value: stats.stopLossMgmt, fullMark: 100 },
    { subject: 'Sizing Control', value: sizingValue, fullMark: 100 },
    { subject: 'Session Durability', value: durabilityValue, fullMark: 100 },
    { subject: 'FOMO Shield', value: fomoShieldValue, fullMark: 100 },
  ];

  // Map real emotional statuses from the last 10 executions onto the timeline
  const sessionCalmData = [...trades]
    .slice(-10)
    .map((trade, idx) => {
      const emo = trade.emotion_detected?.toLowerCase();
      let calm = 90;
      let anxiety = 10;
      if (emo === 'none' || !emo) {
        calm = 95;
        anxiety = 5;
      } else if (emo === 'hesitation') {
        calm = 70;
        anxiety = 30;
      } else {
        calm = 30;
        anxiety = 70;
      }
      return {
        name: trade.asset || `T-${idx + 1}`,
        calm,
        anxiety
      };
    });

  // Generate dynamic, trade-specific telemetry feedback cards based on actual ledger inputs
  const getDynamicAlerts = () => {
    const alerts = [];
    
    // Alert 1: Sizing / Revenge bias checks
    const revengeTrade = trades.find(t => t.mistake_type === 'revenge trading' || t.emotion_detected === 'revenge behavior');
    if (revengeTrade) {
      alerts.push({
        type: 'danger',
        title: `Revenge Bias Alert: ${revengeTrade.asset}`,
        description: `Your execution on ${revengeTrade.asset} registered a revenge trigger. Analytics indicate oversized positions and tight stop adjustments immediately following a prior loss. Capping contracts prevents balance slippage.`
      });
    } else {
      alerts.push({
        type: 'success',
        title: 'Nominal Revenge Defense',
        description: 'Elite emotional control verified. Your ledger shows no revenge trading or overtrading sequences following recent drawdowns.'
      });
    }

    // Alert 2: Profit holding efficiency checks
    const earlyExitTrade = trades.find(t => t.mistake_type === 'early exit');
    if (earlyExitTrade) {
      alerts.push({
        type: 'warning',
        title: `Holding Efficiency Cap: ${earlyExitTrade.asset}`,
        description: `Fear of giving gains back prompted an early exit on ${earlyExitTrade.asset}. Closing positions prior to structural invalidation limits average dynamic risk-to-reward ratios.`
      });
    } else {
      alerts.push({
        type: 'success',
        title: 'Holding Efficiency Upgrade',
        description: 'Excellent asset preservation logs: you consistently held recently closed positions to their formulated targets.'
      });
    }

    // Alert 3: Fomo / entry timing check
    const fomoTrade = trades.find(t => t.mistake_type === 'FOMO entry');
    if (fomoTrade) {
      alerts.push({
        type: 'warning',
        title: `Impatience Vector: ${fomoTrade.asset}`,
        description: `Chasing runaway candles on ${fomoTrade.asset} resulted in entering unfavorable high-slippage price blocks. Enter only at scheduled key demand pools.`
      });
    } else {
      alerts.push({
        type: 'info',
        title: 'FOMO Defense Integrity',
        description: 'Telemetry logs show clean entry executions within designated price levels, indicating highly disciplined waiting periods.'
      });
    }

    return alerts;
  };

  // Trigger Gemini-driven Psychiatric Auditing
  const handlePerformAudit = async () => {
    setAuditing(true);
    setAuditReport(null);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disciplineScore: stats.disciplineScore,
          ruleAdherence: stats.ruleAdherence,
          stopLossMgmt: stats.stopLossMgmt,
          recentTrades: trades
        })
      });

      if (!res.ok) {
        throw new Error('Audit engine responded with an error.');
      }

      const data = await res.json();
      setAuditReport(data.report);

    } catch (error) {
      console.error(error);
      setAuditReport(`## ⚠️ Live Audit Interrupted
Could not complete the live behavioral check. Review your API configuration settings in the secrets drawer or try again shortly.

### Mock Audit Summary
- **Current Score:** ${stats.disciplineScore}/100
- **Action Suggested:** Ensure max. drawdowns on your trading sessions are hard-capped.`);
    } finally {
      setAuditing(false);
    }
  };

  // Convert simple markdown lines for clean markup style rendering without heavier libs
  const renderAuditReport = (text: string) => {
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('##')) {
        return <h3 key={idx} className="text-base font-sans font-bold text-white mt-5 mb-2 border-b border-white/5 pb-1 uppercase tracking-wider">{trimmed.replace('##', '').trim()}</h3>;
      }
      if (trimmed.startsWith('###')) {
        return <h4 key={idx} className="text-xs font-sans font-bold text-[#ebb2ff] mt-4 mb-2">{trimmed.replace('###', '').trim()}</h4>;
      }
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-[#b9cacb] leading-relaxed my-1.5 list-inside font-sans font-light">
            {trimmed.substring(1).trim()}
          </li>
        );
      }
      if (trimmed.length === 0) {
        return <div key={idx} className="h-2" />;
      }
      return <p key={idx} className="text-xs text-[#b9cacb] leading-relaxed font-sans font-light my-2">{trimmed}</p>;
    });
  };

  return (
    <div className="space-y-6 pb-24 font-sans max-w-7xl mx-auto">
      
      {/* HUD title band */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white tracking-tight">AI Coach & Behavioral Profiler</h2>
          <p className="text-xs text-[#849495] font-light">
            Forensic analysis of cognitive biases, execution discipline, and stress response indexes.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-brand-purple/5 border border-brand-purple/20 text-[#ebb2ff] text-[10px] uppercase font-mono tracking-widest leading-none rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-brand-purple rounded-full animate-ping" />
            <span>ACTIVE PSYCHE TRACKING</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Radar Chart: Alignment index */}
        <div className="md:col-span-6 glass-fill p-6 rounded-xl border border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider mb-1">
              Discipline Alignment Vector
            </h3>
            <p className="text-[11px] text-[#849495] font-light mb-6">
              Executive mental control parameters scored across trade histories.
            </p>
          </div>

          <div className="w-full h-72 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  stroke="#849495" 
                  tick={{ fontSize: 9, fontFamily: 'sans-serif' }}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  stroke="rgba(255,255,255,0.1)"
                  tick={{ fontSize: 8 }}
                />
                <Radar 
                  name="Trader" 
                  dataKey="value" 
                  stroke="#ebb2ff" 
                  fill="#ebb2ff" 
                  fillOpacity={0.15} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Calm vs Anxiety distribution */}
        <div className="md:col-span-6 glass-fill p-6 rounded-xl border border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider mb-1">
              State Index Distribution
            </h3>
            <p className="text-[11px] text-[#849495] font-light mb-6">
              Relative Calmness versus Anxiety states logged over last 10 sessions.
            </p>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionCalmData}>
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
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#131316', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="calm" stackId="a" fill="#00e383" name="Calm State" />
                <Bar dataKey="anxiety" stackId="a" fill="#ff4d4d" name="Anxiety State" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Warnings & Anomalies tracker */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left: Alerts panel */}
        <div className="md:col-span-5 glass-fill p-6 rounded-xl border border-white/5 space-y-4">
          <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider mb-2">
            Behavioral Alerts Panel
          </h3>

          <div className="space-y-3">
            {getDynamicAlerts().map((alert, idx) => (
              <div 
                key={idx} 
                className={`p-4 rounded-lg flex gap-3 border ${
                  alert.type === 'danger' ? 'bg-red-500/10 border-red-500/20' :
                  alert.type === 'warning' ? 'bg-brand-purple/10 border-brand-purple/20' :
                  alert.type === 'success' ? 'bg-brand-emerald/10 border-brand-emerald/20' :
                  'bg-brand-cyan/10 border-brand-cyan/20'
                }`}
              >
                {alert.type === 'danger' ? (
                  <ShieldAlert className="w-5 h-5 text-red-400 mt-0.5 min-w-[20px]" />
                ) : alert.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-brand-emerald mt-0.5 min-w-[20px]" />
                ) : (
                  <Zap className={`w-5 h-5 mt-0.5 min-w-[20px] ${alert.type === 'warning' ? 'text-brand-purple' : 'text-brand-cyan'}`} />
                )}
                <div>
                  <h4 className={`text-xs font-sans font-bold ${
                    alert.type === 'danger' ? 'text-red-300' :
                    alert.type === 'warning' ? 'text-brand-purple' :
                    alert.type === 'success' ? 'text-brand-emerald' :
                    'text-brand-cyan'
                  }`}>{alert.title}</h4>
                  <p className="text-[11px] text-[#b9cacb] mt-1 font-light leading-relaxed">
                    {alert.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Forensic Auditing Screen Console */}
        <div className="md:col-span-7 glass-fill p-6 rounded-xl border border-white/5 flex flex-col">
          <div className="border-b border-white/5 pb-3 mb-4 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider">
                Psychiatric Forensic Audit Audit
              </h3>
              <p className="text-[11px] text-[#849495] font-light">
                Securely queries Gemini to model bias distributions.
              </p>
            </div>
            
            <button
              onClick={handlePerformAudit}
              disabled={auditing}
              className="px-4 py-2 bg-brand-purple hover:bg-white text-black font-semibold text-xs rounded transition-all tracking-wider uppercase flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {auditing ? (
                <>
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>AUDITING COGNITIONS...</span>
                </>
              ) : (
                <>
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span>RUN LIVE AUDIT</span>
                </>
              )}
            </button>
          </div>

          <div className="flex-1 bg-black/60 border border-white/5 rounded-lg p-5 min-h-[250px] font-sans overflow-y-auto">
            {auditReport ? (
              <div className="space-y-1">
                {renderAuditReport(auditReport)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <BrainCircuit className="w-10 h-10 text-brand-purple/40 mb-3 animate-pulse" />
                <h4 className="text-xs font-bold text-[#b9cacb] uppercase tracking-wider mb-1">Audit Machine Standby</h4>
                <p className="text-[11px] text-[#849495] max-w-xs font-light">
                  Click the button above to execute a real, psychiatric-level forensic performance check on your active trading behaviors.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
