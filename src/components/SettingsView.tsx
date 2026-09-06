import { useState, useEffect } from 'react';
import { ShieldCheck, Server, Key, AlertTriangle, Cpu, Disc, CheckCircle, Database, Copy, Check, Globe, HelpCircle, Download, FileText } from 'lucide-react';
import { Trade } from '../types';

interface SettingsViewProps {
  trades: Trade[];
}

export default function SettingsView({ trades }: SettingsViewProps) {
  const [riskCap, setRiskCap] = useState(() => {
    return parseFloat(localStorage.getItem('tradelense_risk_cap') || '1.5');
  });
  const [maxLossPerDay, setMaxLossPerDay] = useState(() => {
    return parseFloat(localStorage.getItem('tradelense_max_loss_day') || '3.0');
  });
  const [selectedExchange, setSelectedExchange] = useState(() => {
    return localStorage.getItem('tradelense_exchange') || 'binance';
  });
  
  // User Requested Settings (Task 9)
  const [timezone, setTimezone] = useState(() => {
    return localStorage.getItem('tradelense_timezone') || 'UTC';
  });
  const [rrFormat, setRrFormat] = useState(() => {
    return localStorage.getItem('tradelense_rr_format') || 'ratio';
  });
  const [imgQuality, setImgQuality] = useState(() => {
    return localStorage.getItem('tradelense_img_quality') || 'balanced';
  });
  const [exportPref, setExportPref] = useState(() => {
    return localStorage.getItem('tradelense_export_pref') || 'csv';
  });

  const [systemHealthy, setSystemHealthy] = useState<'pending' | 'healthy' | 'unreachable'>('pending');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  
  // Real-time Supabase Database status state
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; tableExists: boolean; error?: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    // Audit backend server health and key status
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setSystemHealthy('healthy');
        setHasApiKey(data.hasKey);
      })
      .catch(err => {
        console.error(err);
        setSystemHealthy('unreachable');
      });

    // Check database table existence status
    fetch('/api/db-status')
      .then(res => res.json())
      .then(data => setDbStatus(data))
      .catch(err => console.error("Database diagnostic query failed:", err));
  }, []);

  const handleCopySQL = () => {
    const rawSql = `CREATE TABLE IF NOT EXISTS trades (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) DEFAULT 'default-user' NOT NULL,
    pair VARCHAR(100) NOT NULL,
    direction VARCHAR(10) NOT NULL CHECK (direction IN ('LONG', 'SHORT')),
    entry_price NUMERIC(20, 8) NOT NULL,
    exit_price NUMERIC(20, 8) NOT NULL,
    stop_loss NUMERIC(20, 8),
    take_profit NUMERIC(20, 8),
    rr_ratio NUMERIC(10, 2),
    pips NUMERIC(15, 2),
    risk_percent NUMERIC(5, 2),
    reward_percent NUMERIC(5, 2),
    session VARCHAR(50),
    weekday VARCHAR(20),
    holding_time VARCHAR(50),
    trade_outcome VARCHAR(50),
    setup_type VARCHAR(100),
    market_structure TEXT,
    emotion VARCHAR(100) DEFAULT 'none',
    mistake_type VARCHAR(100) DEFAULT 'none',
    discipline_score INTEGER DEFAULT 95,
    execution_quality INTEGER DEFAULT 90,
    risk_management_quality INTEGER DEFAULT 90,
    confidence_score INTEGER DEFAULT 90,
    notes TEXT,
    image_url TEXT,
    pnl NUMERIC(20, 2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_created_at ON trades(created_at DESC);`;
    
    navigator.clipboard.writeText(rawSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleSaveSettings = () => {
    localStorage.setItem('tradelense_risk_cap', riskCap.toString());
    localStorage.setItem('tradelense_max_loss_day', maxLossPerDay.toString());
    localStorage.setItem('tradelense_exchange', selectedExchange);
    localStorage.setItem('tradelense_timezone', timezone);
    localStorage.setItem('tradelense_rr_format', rrFormat);
    localStorage.setItem('tradelense_img_quality', imgQuality);
    localStorage.setItem('tradelense_export_pref', exportPref);

    setSettingsSaved(true);
    setTimeout(() => {
      setSettingsSaved(false);
    }, 2000);
  };

  const handleExportCSV = () => {
    if (!trades || trades.length === 0) return;
    
    // Headers matching operational fields
    const headers = [
      'ID', 'Date/Time', 'Asset', 'Direction', 'Entry Price', 'Exit Price', 
      'Net PnL ($)', 'Stop Loss (SL)', 'Take Profit (TP)', 'Risk Reward (RR)', 
      'Pips/Pts', 'Risk %', 'Reward %', 'Duration', 'Session', 'Weekday', 
      'Setup Type', 'Emotion Influence', 'Execution Mistake', 'Discipline Score'
    ];
    
    const rows = trades.map(t => [
      t.id,
      t.time || '',
      t.asset || '',
      t.type || '',
      t.entryPrice || 0,
      t.exitPrice || 0,
      t.pnl || 0,
      t.sl || '',
      t.tp || '',
      t.rr || '',
      t.pips || '',
      t.riskPercent || '',
      t.rewardPercent || '',
      t.duration || '',
      t.session || '',
      t.day || '',
      t.setup_type || '',
      t.emotion_detected || 'none',
      t.mistake_type || 'none',
      t.discipline_score || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(val => {
        // Handle commas or quotes in notes or lists
        const str = String(val).replace(/"/g, '""');
        return str.includes(',') ? `"${str}"` : str;
      }).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tradelense_trades_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    if (!trades || trades.length === 0) return;
    const jsonStr = JSON.stringify(trades, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tradelense_journal_export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-24 font-sans max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-display font-bold text-white tracking-tight">System Settings Terminal</h2>
        <p className="text-xs text-[#849495] font-light">
          Manage regulatory size caps, connect exchanges, and inspect backend Gemini status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Side: General HUD variables */}
        <div className="md:col-span-7 space-y-6">
          <div className="glass-fill p-6 rounded-xl border border-white/5 space-y-6">
            <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
              Risk & Operational Preferences
            </h3>

            {/* Risk parameter sliders */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#b9cacb] font-medium">MAX RISK PER TRADE INDEX</span>
                  <span className="text-brand-cyan font-bold">{riskCap}%</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="5" 
                  step="0.1"
                  value={riskCap} 
                  onChange={(e) => setRiskCap(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-cyan"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#b9cacb] font-medium">MAX DRAWDOWN LOSS PER SESSION</span>
                  <span className="text-brand-purple font-bold">{maxLossPerDay}%</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  step="0.5"
                  value={maxLossPerDay} 
                  onChange={(e) => setMaxLossPerDay(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                />
              </div>
            </div>

            {/* Timezone option dropdown (Task 9) */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-[#849495] uppercase font-bold tracking-widest">
                System Timezone Alignment
              </label>
              <select 
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-[#131316] border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-brand-cyan/40 font-mono"
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="EST">EST/EDT (New York - Eastern Standard)</option>
                <option value="GMT">GMT (London - Greenwich Mean Time)</option>
                <option value="CET">CET/CEST (Frankfurt - Central European)</option>
                <option value="SGT">SGT (Singapore - Asian Finance Axis)</option>
                <option value="AEST">AEST (Sydney - Australian Standard)</option>
              </select>
            </div>

            {/* Preferred RR format dropdown (Task 9) */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-[#849495] uppercase font-bold tracking-widest">
                Preferred Risk-Reward Format
              </label>
              <select 
                value={rrFormat}
                onChange={(e) => setRrFormat(e.target.value)}
                className="w-full bg-[#131316] border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-brand-cyan/40 font-mono"
              >
                <option value="ratio">Ratio Representation (e.g. 1:3.0)</option>
                <option value="percent">Percentage Expectancy Basis (e.g. 3.0%)</option>
                <option value="multiplier">Dynamic Multiplier Format (e.g. 3.0x)</option>
              </select>
            </div>

            {/* Image quality preference dropdown (Task 9) */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-[#849495] uppercase font-bold tracking-widest">
                Upload Image Compression Quality
              </label>
              <select 
                value={imgQuality}
                onChange={(e) => setImgQuality(e.target.value)}
                className="w-full bg-[#131316] border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-brand-cyan/40 font-mono"
              >
                <option value="balanced">Balanced Saver (0.75 Quality JPEG - Highly Readable)</option>
                <option value="high">High Fidelity PNG (Uncompressed Lossless - High Storage)</option>
                <option value="extreme">Extreme Free-Tier Saver (0.40 Quality Scale - Fast/Tiny)</option>
              </select>
            </div>

            {/* Export preference dropdown (Task 9) */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-[#849495] uppercase font-bold tracking-widest">
                Default Export Standard
              </label>
              <select 
                value={exportPref}
                onChange={(e) => setExportPref(e.target.value)}
                className="w-full bg-[#131316] border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-brand-cyan/40 font-mono"
              >
                <option value="csv">Standard CSV Portfolio Format</option>
                <option value="json">Raw JSON Ledger Payload</option>
              </select>
            </div>

            {/* Broker Feed Connect dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-[#849495] uppercase font-bold tracking-widest">
                Broker Feed Connection (Simulated)
              </label>
              <select 
                value={selectedExchange}
                onChange={(e) => setSelectedExchange(e.target.value)}
                className="w-full bg-[#131316] border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-brand-cyan/40"
              >
                <option value="binance">Binance Institutional Spot & Futures API</option>
                <option value="coinbase">Coinbase Pro Websocket Channel</option>
                <option value="interactive">Interactive Brokers SmartRouting API</option>
                <option value="simulation">Tradelense Simulator offline simulated logs</option>
              </select>
            </div>

            {settingsSaved ? (
              <div className="bg-brand-emerald/10 border border-brand-emerald/20 p-3.5 rounded-lg flex items-center gap-2.5 text-brand-emerald text-xs font-sans">
                <CheckCircle className="w-5 h-5 flex-shrink-0 text-brand-emerald animate-pulse" />
                <span>Operational system controls compiled and saved dynamically.</span>
              </div>
            ) : (
              <button
                onClick={handleSaveSettings}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold uppercase tracking-widest text-white transition-all cursor-pointer"
              >
                SAVE COMPLIANCE CONTROLS
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Gemini Status logs */}
        <div className="md:col-span-5 space-y-6">
          <div className="glass-fill p-6 rounded-xl border border-white/5 space-y-5">
            <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">
              Institutional AI Status
            </h3>

            {/* Health parameters grid */}
            <div className="space-y-3 font-sans text-xs">
              <div className="flex justify-between items-center p-3 bg-black/40 border border-white/5 rounded">
                <span className="flex items-center gap-2 text-[#b9cacb] font-medium">
                  <Server className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Full-Stack Host</span>
                </span>
                <span className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  systemHealthy === 'healthy' ? 'bg-brand-emerald/15 text-brand-emerald' :
                  systemHealthy === 'pending' ? 'bg-yellow-500/15 text-yellow-500' :
                  'bg-red-500/15 text-red-500'
                }`}>
                  {systemHealthy === 'healthy' ? 'ONLINE' : systemHealthy === 'pending' ? 'BOOTING' : 'DISCONNECTED'}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-black/40 border border-white/5 rounded">
                <span className="flex items-center gap-2 text-[#b9cacb] font-medium">
                  <Key className="w-3.5 h-3.5 text-brand-purple" />
                  <span>API Key Configured</span>
                </span>
                <span className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  hasApiKey ? 'bg-brand-emerald/15 text-brand-emerald' : 'bg-red-500/15 text-red-400'
                }`}>
                  {hasApiKey ? 'ACTIVE (V4)' : 'DEMO FALLBACK'}
                </span>
              </div>
            </div>

            {/* API key informational prompt (HIDES DIRECT INPUT AS INSTRUCTIONS DIRECTED) */}
            {!hasApiKey && (
              <div className="bg-[#1b171c] border border-brand-purple/20 p-4 rounded-lg space-y-3 text-[11px]">
                <div className="flex items-start gap-2.5 text-brand-purple font-sans font-bold uppercase tracking-wide">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>How to connect Gemini AI key</span>
                </div>
                <p className="text-[#b9cacb] leading-relaxed font-light font-sans">
                  The terminal is currently using our high-fidelity client-server simulation because no <code className="text-white bg-white/5 px-1 py-0.5 rounded font-mono font-medium">GEMINI_API_KEY</code> variable is present.
                </p>
                <div className="text-white leading-relaxed font-light font-sans bg-black/30 p-2.5 rounded border border-white/5">
                  To activate real Gemini neural extraction, open the <span className="font-semibold text-brand-cyan">Settings &gt; Secrets</span> tool menu in AI Studio, add your API key, and restart the developer server.
                </div>
              </div>
            )}

            {hasApiKey && (
              <div className="bg-brand-emerald/5 border border-brand-emerald/20 p-4 rounded-lg space-y-1.5 text-xs text-brand-emerald">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>SECURE CLIENT TRUST ACTIVE</span>
                </div>
                <p className="text-[#b9cacb] leading-relaxed font-light text-[11px]">
                  Your private credential is safely stored and isolated within the server layer. No client browser code has visualization or logging access.
                </p>
              </div>
            )}
          </div>

          {/* Database & Storage Cloud Infrastructure Status Block */}
          <div className="glass-fill p-6 rounded-xl border border-white/5 space-y-4">
            <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-2">
              <Database className="w-4 h-4 text-brand-cyan" />
              <span>Real-Time Cloud Database</span>
            </h3>

            <div className="space-y-3 font-sans text-xs">
              <div className="flex justify-between items-center p-3 bg-black/40 border border-white/5 rounded">
                <span className="text-[#b9cacb] font-medium">Supabase Host Connection</span>
                <span className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  dbStatus?.connected ? 'bg-brand-emerald/15 text-brand-emerald' : 'bg-red-500/15 text-red-500 font-bold'
                }`}>
                  {dbStatus?.connected ? 'CONNECTED' : 'DISCONNECTED'}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-black/40 border border-white/5 rounded">
                <span className="text-[#b9cacb] font-medium">Schema Cache (trades)</span>
                <span className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  dbStatus?.tableExists ? 'bg-brand-emerald/15 text-brand-emerald' : 'bg-yellow-500/15 text-yellow-500 font-bold'
                }`}>
                  {dbStatus?.tableExists ? 'ACTIVE' : 'TABLE MISSING'}
                </span>
              </div>
            </div>

            {dbStatus && !dbStatus.tableExists && (
              <div className="bg-[#1c1713] border border-yellow-500/20 p-4 rounded-lg space-y-3 text-[11px]">
                <div className="flex items-start gap-2 text-yellow-500 font-sans font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>SQL SETUP ACTION REQUIRED</span>
                </div>
                <p className="text-[#b9cacb] leading-relaxed font-sans font-light">
                  Your Supabase rest endpoints are active, but the matching PostgreSQL trades structure does not exist yet inside your database.
                </p>
                <p className="text-white font-sans font-light bg-black/40 p-2 border border-white/5 rounded">
                  Copy our pre-compiled PostgreSQL setup script below, navigate to your <strong>Supabase SQL Editor</strong>, paste, and run it.
                </p>
                
                <button
                  onClick={handleCopySQL}
                  className="w-full py-2.5 bg-brand-cyan/10 hover:bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/20 rounded font-mono font-bold uppercase text-[10px] flex items-center justify-center gap-1.5 tracking-wider transition-all cursor-pointer"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-brand-emerald" />
                      <span>COPIED SUCCESSFULLY!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY POSTGRESQL SCHEMA SQL</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {dbStatus?.tableExists && (
              <div className="bg-brand-emerald/5 border border-brand-emerald/25 p-4 rounded flex items-start gap-2.5 text-xs text-brand-emerald">
                <CheckCircle className="w-4 h-4 text-brand-emerald mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-bold uppercase tracking-wider text-[11px]">POSTGRESQL SYNCHRONIZED</p>
                  <p className="text-[#b9cacb] leading-normal text-[11px] font-sans font-light">
                    Trade telemetry and media screenshots are fully matching database memory blocks.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Executive Portfolio Exporter (Task 10) */}
          <div className="glass-fill p-6 rounded-xl border border-white/5 space-y-4">
            <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3 flex items-center gap-2">
              <Download className="w-4 h-4 text-brand-cyan" />
              <span>Data Portability & Porting</span>
            </h3>
            
            <p className="text-xs text-[#b9cacb] font-sans font-light leading-relaxed">
              Tradelense operates with comprehensive data sovereignty. Extract your validated trade history ledger as local files anytime.
            </p>

            <div className="grid grid-cols-2 gap-3.5 pt-1.5">
              <button
                onClick={handleExportCSV}
                disabled={!trades || trades.length === 0}
                className="py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono font-bold uppercase text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group"
              >
                <Download className="w-3.5 h-3.5 text-brand-cyan group-hover:scale-110 transition-transform" />
                <span>EXPORT CSV</span>
              </button>

              <button
                onClick={handleExportJSON}
                disabled={!trades || trades.length === 0}
                className="py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono font-bold uppercase text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group"
              >
                <FileText className="w-3.5 h-3.5 text-brand-purple group-hover:scale-110 transition-transform" />
                <span>EXPORT JSON</span>
              </button>
            </div>

            <div className="p-3 bg-black/40 border border-white/5 rounded-lg space-y-1">
              <div className="flex justify-between items-center text-[10px] font-mono text-[#849495]">
                <span>TOTAL EXPORTABLE RECORDS</span>
                <span className="text-brand-purple font-bold">{trades?.length || 0} Trades</span>
              </div>
              <p className="text-[10px] text-[#516365] font-sans font-light leading-normal">
                Files match standardized tax bookkeeping outputs directly. Future PDF report template exports initialized.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
