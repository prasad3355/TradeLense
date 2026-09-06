import React, { useState } from 'react';
import { Trade } from '../types';
import { 
  X, 
  Cpu, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  ShieldCheck, 
  Brain, 
  FileText, 
  Save, 
  Trash2, 
  Zap, 
  ChevronRight
} from 'lucide-react';

interface TradeDetailViewProps {
  trade: Trade;
  onClose: () => void;
  onUpdateTrade: (updated: Trade) => void;
  onDeleteTrade: (id: string) => void;
}

export default function TradeDetailView({ trade, onClose, onUpdateTrade, onDeleteTrade }: TradeDetailViewProps) {
  // Editable fields status
  const [isEditing, setIsEditing] = useState(false);
  const [entryPrice, setEntryPrice] = useState(trade.entryPrice);
  const [exitPrice, setExitPrice] = useState(trade.exitPrice);
  const [sl, setSl] = useState(trade.sl || 0);
  const [tp, setTp] = useState(trade.tp || 0);
  const [size, setSize] = useState(trade.size || 1.0);
  const [notes, setNotes] = useState(trade.notes || '');
  const [userNotes, setUserNotes] = useState(trade.user_notes || '');
  const [emotion, setEmotion] = useState(trade.emotion_detected || 'none');
  const [mistake, setMistake] = useState(trade.mistake_type || 'none');
  const [assetName, setAssetName] = useState(trade.asset);

  const handleSave = () => {
    // Re-verify outputs
    const calculatedPnl = Number(((exitPrice - entryPrice) * (trade.type === 'LONG' ? 1 : -1) * (trade.pips && trade.pnl ? (trade.pnl / trade.pips) : 100) * size).toFixed(2));
    
    const updatedTrade: Trade = {
      ...trade,
      asset: assetName,
      entryPrice: Number(entryPrice),
      exitPrice: Number(exitPrice),
      sl: sl ? Number(sl) : undefined,
      tp: tp ? Number(tp) : undefined,
      size: Number(size),
      notes,
      user_notes: userNotes,
      emotion_detected: emotion as any,
      mistake_type: mistake as any,
    };
    
    onUpdateTrade(updatedTrade);
    setIsEditing(false);
  };

  const isProfit = trade.pnl >= 0;

  return (
    <div id={`trade-detail-${trade.id}`} className="fixed inset-0 z-50 flex items-center justify-end bg-black/85 backdrop-blur-sm p-4 font-sans">
      {/* Drawer content panel */}
      <div className="w-full max-w-4xl h-[92vh] bg-[#0c0c0e] border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-2xl relative">
        
        {/* Header section with telemetry and absolute control */}
        <div className="px-6 py-4 bg-[#111114] border-b border-white/5 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${isProfit ? 'bg-brand-emerald animate-pulse' : 'bg-red-400'}`} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-sans font-black text-white tracking-widest">{trade.asset}</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono tracking-widest font-bold ${
                  trade.type === 'LONG' 
                    ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/10' 
                    : 'bg-brand-purple/10 text-brand-purple border border-brand-purple/10'
                }`}>
                  {trade.type}
                </span>
                <span className="text-[10px] font-mono text-[#516365]">ID: {trade.id}</span>
              </div>
              <p className="text-[11px] text-[#849495] font-light">
                Executed via {trade.session || 'London'} Session | {trade.timeframe || '1H'} Timeframe
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3.5 py-1.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded text-xs text-[#b9cacb] font-mono font-medium transition-colors"
            >
              {isEditing ? 'CANCEL' : 'CORRECT METRICS'}
            </button>
            <button
              onClick={onClose}
              className="p-1 px-2.5 bg-white/5 hover:bg-white/10 text-white rounded transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Scrollable analysis panels dashboard */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Visual Screenshot display & timeline (Left lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="glass-fill p-2.5 rounded-xl border border-white/5 overflow-hidden">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-wider text-[#849495] pb-2 px-1">
                  <span className="flex items-center gap-1.5"><Brain size={12} className="text-brand-cyan" /> Screen Analysis Canvas</span>
                  <span className="text-[#516365]">OCR RESOLVED</span>
                </div>
                
                <div className="bg-[#050506] rounded-lg border border-white/5 aspect-video w-full overflow-hidden relative flex items-center justify-center group">
                  <img 
                    src={trade.image_url || "/api/images/placeholder_btc"} 
                    alt={`${trade.asset} setup`} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain filter brightness-95"
                  />
                  
                  {/* Floating price tag markings (extracted coordinates visualization overlay) */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-3 flex justify-between font-mono text-[9px] text-[#b9cacb] opacity-80 backdrop-blur-[2px]">
                    <div className="flex gap-4">
                      <span>ENTRY: <strong className="text-white">${trade.entryPrice.toLocaleString()}</strong></span>
                      {trade.sl && <span>SL: <strong className="text-red-400">${trade.sl.toLocaleString()}</strong></span>}
                      {trade.tp && <span>TP: <strong className="text-brand-emerald">${trade.tp.toLocaleString()}</strong></span>}
                    </div>
                    <span>PnL outcome: <strong className={isProfit ? "text-brand-emerald" : "text-red-400"}>${trade.pnl.toLocaleString()}</strong></span>
                  </div>
                </div>
              </div>

              {/* Editable parameters overview if in editable mode */}
              {isEditing ? (
                <div className="glass-fill p-5 rounded-xl border border-brand-cyan/2 border-white/5 space-y-4">
                  <h4 className="text-xs font-mono font-bold uppercase text-brand-cyan flex items-center gap-2">
                    <Save size={13} /> Active Coordinates Tuning
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs text-[#b9cacb]">
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#849495]">ASSET</label>
                      <input 
                        type="text" 
                        value={assetName} 
                        onChange={(e) => setAssetName(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded px-2.5 py-1.5 text-white active:border-brand-cyan"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#849495]">ENTRY PRICE</label>
                      <input 
                        type="number" 
                        value={entryPrice} 
                        onChange={(e) => setEntryPrice(Number(e.target.value))}
                        className="w-full bg-black border border-white/10 rounded px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#849495]">EXIT PRICE</label>
                      <input 
                        type="number" 
                        value={exitPrice} 
                        onChange={(e) => setExitPrice(Number(e.target.value))}
                        className="w-full bg-black border border-white/10 rounded px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#849495]">STOP LOSS (SL)</label>
                      <input 
                        type="number" 
                        value={sl} 
                        onChange={(e) => setSl(Number(e.target.value))}
                        className="w-full bg-black border border-white/10 rounded px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#849495]">TAKE PROFIT (TP)</label>
                      <input 
                        type="number" 
                        value={tp} 
                        onChange={(e) => setTp(Number(e.target.value))}
                        className="w-full bg-black border border-white/10 rounded px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#849495]">SIZE (LOTS)</label>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={size} 
                        onChange={(e) => setSize(Number(e.target.value))}
                        className="w-full bg-black border border-white/10 rounded px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div className="space-y-1 col-span-2 md:col-span-1">
                      <label className="text-[10px] text-[#849495]">PSYCHIATRIC EMOTION</label>
                      <select 
                        value={emotion}
                        onChange={(e) => setEmotion(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded px-2 py-1.5 text-white"
                      >
                        <option value="none">none (Highly Disciplined)</option>
                        <option value="impatience">impatience</option>
                        <option value="greed">greed</option>
                        <option value="fear exits">fear exits</option>
                        <option value="overconfidence">overconfidence</option>
                        <option value="revenge behavior">revenge behavior</option>
                        <option value="hesitation">hesitation</option>
                      </select>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <label className="text-[10px] text-[#849495]">SYSTEMIC MISTAKE</label>
                      <select 
                        value={mistake}
                        onChange={(e) => setMistake(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded px-2 py-1.5 text-white"
                      >
                        <option value="none">none</option>
                        <option value="early exit">early exit</option>
                        <option value="revenge trading">revenge trading</option>
                        <option value="FOMO entry">FOMO entry</option>
                        <option value="oversized position">oversized position</option>
                        <option value="moved stop loss">moved stop loss</option>
                        <option value="poor RR">poor RR</option>
                        <option value="overtrading">overtrading</option>
                        <option value="late entry">late entry</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[#849495]">AI PARSED NOTES</label>
                      <textarea 
                        value={notes} 
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                        className="w-full bg-black border border-white/10 rounded px-2.5 py-1 text-xs text-[#b9cacb] font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-[#849495]">PERSONAL USER DIARY CORRECTIONS</label>
                      <textarea 
                        value={userNotes} 
                        onChange={(e) => setUserNotes(e.target.value)}
                        rows={2}
                        placeholder="Write personal trade learnings & execution errors log..."
                        className="w-full bg-black border border-white/10 rounded px-2.5 py-1 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1 text-xs font-mono text-[#849495]"
                    >
                      ABORT
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-1.5 bg-brand-cyan hover:bg-brand-cyan/80 text-[#0c0c0e] font-mono rounded text-xs font-black flex items-center gap-1.5"
                    >
                      <Save size={12} /> CONFIRM CHANGES
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Notes Card */}
                  <div className="glass-fill p-4 rounded-xl border border-white/5 space-y-2">
                    <span className="text-[9px] font-mono text-brand-cyan uppercase tracking-widest font-bold flex items-center gap-1.5">
                      <FileText size={12} /> Scanner Logs Notes
                    </span>
                    <p className="text-[11px] text-[#b9cacb] font-light leading-relaxed">
                      {trade.notes || 'No technical notes recorded for this holding structure.'}
                    </p>
                  </div>

                  {/* Personal overrides */}
                  <div className="glass-fill p-4 rounded-xl border border-white/5 space-y-2">
                    <span className="text-[9px] font-mono text-brand-purple uppercase tracking-widest font-bold flex items-center gap-1.5">
                      <Brain size={12} /> Personal Diary & Diagnostics
                    </span>
                    <p className="text-[11px] text-white font-light leading-relaxed">
                      {trade.user_notes || (
                        <span className="text-[#516365] italic">No custom overrides saved. Press "Correct Metrics" to logging your psychology state.</span>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Execution Horizon Timeline */}
              <div className="glass-fill p-4 rounded-xl border border-white/5 space-y-4">
                <span className="text-[9px] font-mono text-[#849495] uppercase tracking-wider font-bold block">
                  Execution Horizon Milestones
                </span>
                <div className="relative pl-6 space-y-3 font-mono text-[10px]">
                  <div className="absolute left-2.5 top-1 bottom-1.5 w-px bg-white/5" />
                  
                  <div className="relative">
                    <span className="absolute -left-5 w-2 h-2 rounded-full bg-brand-cyan/40 border border-brand-cyan" />
                    <div className="text-[#849495]">ENTRY EVENT</div>
                    <p className="text-white">Opened position of {trade.size || 1.0} lots at ${trade.entryPrice.toLocaleString()}</p>
                    <span className="text-[9px] text-[#516365]">Time: {trade.chartTime ? trade.chartTime.slice(11,19) + " UTC" : "Instant"}</span>
                  </div>

                  {trade.candleCount && (
                    <div className="relative">
                      <span className="absolute -left-5 w-2 h-2 rounded-full bg-white/10" />
                      <div className="text-[#849495]">CONSOLIDATION COGNITIVE CYCLE</div>
                      <p className="text-white">Holding across {trade.candleCount} candles on active charts</p>
                    </div>
                  )}

                  <div className="relative">
                    <span className={`absolute -left-5 w-2 h-2 rounded-full ${isProfit ? 'bg-brand-emerald' : 'bg-red-400'}`} />
                    <div className="text-[#516365] uppercase">EXIT EVENT & DISCHARGE</div>
                    <p className="text-white">Cleared position at ${trade.exitPrice.toLocaleString()}</p>
                    <span className="text-[9px] text-[#516365]">Duration: {trade.duration || '2.5 hours'}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Cognitive Intelligence, Audits, Core scores (Right lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Returns & Core Statistics block */}
              <div className={`p-5 rounded-xl border flex flex-col justify-between ${
                isProfit 
                  ? 'bg-brand-emerald/5 border-brand-emerald/15 text-brand-emerald' 
                  : 'bg-red-400/5 border-red-400/15 text-red-400'
              }`}>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest font-black text-[#849495]">NET RETURN STATUS</span>
                  <div className="text-3xl font-mono font-bold mt-1 text-white">
                    {isProfit ? '+' : ''}${trade.pnl.toLocaleString()}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/5 text-xs text-[#849495] font-mono">
                  <div>
                    <span>ESTIMATE OUTCOME</span>
                    <p className="text-white font-bold mt-0.5">{trade.estimatedOutcome || 'MANUAL_EX'}</p>
                  </div>
                  <div>
                    <span>RISK MATH</span>
                    <p className="text-white font-bold mt-0.5">RR {trade.rr || '2.5'}:1</p>
                  </div>
                </div>
              </div>

              {/* Cognitive Scores Rings Meter */}
              <div className="glass-fill p-5 rounded-xl border border-white/5 space-y-4">
                <span className="text-[9px] font-mono text-[#849495] uppercase tracking-wider font-bold block flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-brand-cyan" /> Executive Performance Matrix
                </span>
                
                <div className="space-y-3 font-mono text-[10px]">
                  
                  {/* Score item 1 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[#849495]">
                      <span>EXECUTION QUALITY</span>
                      <span className="text-brand-cyan font-bold">{trade.discipline_score || 90}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-cyan" 
                        style={{ width: `${trade.discipline_score || 90}%` }}
                      />
                    </div>
                  </div>

                  {/* Score item 2 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[#849495]">
                      <span>EXECUTION RISK QUALITY</span>
                      <span className="text-brand-purple font-bold">{trade.risk_management_quality || 85}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-purple" 
                        style={{ width: `${trade.risk_management_quality || 85}%` }}
                      />
                    </div>
                  </div>

                  {/* Score item 3 */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[#849495]">
                      <span>MATH EXECUTION SPEED</span>
                      <span className="text-brand-emerald font-bold">{trade.execution_quality || 95}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-emerald" 
                        style={{ width: `${trade.execution_quality || 95}%` }}
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* AI Psychological Review & Biases Audit card */}
              <div className="glass-fill p-5 rounded-xl border border-white/5 space-y-4">
                <span className="text-[9px] font-mono text-brand-purple uppercase tracking-widest font-black block flex items-center gap-1.5">
                  <Brain size={13} /> Institutional Cognitive Auditing
                </span>
                
                <div className="space-y-3">
                  <div className="p-3.5 bg-black/50 border border-white/5 rounded-lg">
                    <div className="text-[8.5px] font-mono text-[#849495] uppercase">Detected Psychological Emotion</div>
                    <div className="text-xs font-sans font-bold text-white uppercase tracking-tight mt-1">
                      {trade.emotion_detected && trade.emotion_detected !== 'none' 
                        ? trade.emotion_detected 
                        : 'NO EMOTIONAL INTRUSION (Highly Disciplined)'}
                    </div>
                    <p className="text-[10px] text-[#849495] font-light mt-1">
                      {trade.emotion_detected === 'revenge behavior' 
                        ? 'Immediate high bias detected to re-enter drawdown positions without model context confirmation.'
                        : trade.emotion_detected === 'impatience'
                        ? 'Exhibits early containment of trades prior to core supply level checks.'
                        : 'Adhering to plan criteria and institutional guidelines.'}
                    </p>
                  </div>

                  <div className="p-3.5 bg-black/50 border border-white/5 rounded-lg">
                    <div className="text-[8.5px] font-mono text-[#849495] uppercase">Systemic Core Mistake</div>
                    <div className="text-xs font-sans font-bold text-red-400 uppercase tracking-tight mt-1">
                      {trade.mistake_type && trade.mistake_type !== 'none' ? trade.mistake_type : 'NONE (Perfect Execution Pattern)'}
                    </div>
                    <p className="text-[10px] text-[#849495] font-light mt-1 text-justify">
                      {trade.mistake_type === 'moved stop loss' 
                        ? 'Violated hard stop bounds dynamically. Exposes trading capital to volatile black swan tail risks.'
                        : trade.mistake_type === 'early exit'
                        ? 'Exited position prematurely. Substantially reduces long-term expectation averages.'
                        : 'Maintained strict systematic execution parameters throughout.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Warn messages block if low confidence or coordinates low */}
              {trade.validationWarnings && trade.validationWarnings.length > 0 && (
                <div className="p-4 bg-brand-purple/5 border border-brand-purple/15 text-brand-purple rounded-xl text-xs flex gap-2 w-full leading-relaxed">
                  <span className="text-base">⚠️</span>
                  <div>
                    <strong className="block font-mono tracking-wider font-bold">STRUCTURAL VALIDATION WARNINGS</strong>
                    <ul className="list-disc pl-4 space-y-1 mt-1 font-sans text-[11px] text-[#b9cacb]">
                      {trade.validationWarnings.map((w,i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Action Area */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const ok = confirm(`Purge position token from persistent memory forever? This action cannot be reversed.`);
                    if (ok) {
                      onDeleteTrade(trade.id);
                      onClose();
                    }
                  }}
                  className="w-full py-2.5 bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 text-red-400 rounded font-mono font-bold text-[10px] hover:text-red-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 size={12} /> PURGE POSITION TOKEN
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
