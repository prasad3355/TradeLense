import { motion } from 'motion/react';
import { useState } from 'react';
import { Brain, ShieldAlert, Sparkles, LineChart, Code, CheckCircle, Shield, ChevronRight } from 'lucide-react';

interface LandingViewProps {
  onStartPro: () => void;
}

export default function LandingView({ onStartPro }: LandingViewProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [subscribedPlan, setSubscribedPlan] = useState<string | null>(null);

  // Simulated live backtest runs on click
  const [backtestRunning, setBacktestRunning] = useState(false);
  const [backtestOutput, setBacktestOutput] = useState([
    'INITIALIZING_BACKTEST...',
    'ALPHA_COEFF: 0.842',
    'SHARPE_RATIO: 3.12 [SUCCESS]'
  ]);

  const handleRunBacktest = () => {
    if (backtestRunning) return;
    setBacktestRunning(true);
    setBacktestOutput(['INITIALIZING_BACKTEST...']);

    setTimeout(() => {
      setBacktestOutput(prev => [...prev, 'COMPUTING CORRELATION MATRIX...']);
    }, 600);
    setTimeout(() => {
      setBacktestOutput(prev => [...prev, 'DECODING IMMED_MARKET_TAPE...']);
    }, 1200);
    setTimeout(() => {
      setBacktestOutput(prev => [...prev, 'SHARPE_RATIO: 3.48 [SUCCESS]']);
      setBacktestRunning(false);
    }, 1800);
  };

  return (
    <div className="relative min-h-screen text-[#e5e2e1] overflow-x-hidden font-sans bg-black">
      {/* 3D Grid Background Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[120%] bg-[#0d0d0f] opacity-40">
          <div className="w-full h-full bg-[linear-gradient(rgba(0,219,231,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,219,231,0.05)_1px,transparent_1px)] bg-[size:45px_45px] [transform:perspective(1200px)_rotateX(60deg)_translateY(-200px)]" />
        </div>
        <div className="absolute bottom-0 inset-x-0 h-96 bg-gradient-to-t from-black via-transparent to-transparent" />
        {/* Soft atmospheric gradient bursts */}
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] rounded-full bg-brand-cyan/5 blur-[120px]" />
        <div className="absolute bottom-[30%] right-[15%] w-[600px] h-[600px] rounded-full bg-brand-purple/5 blur-[150px]" />
      </div>

      {/* Hero section */}
      <header className="relative pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center text-center z-10">
        {/* Interactive Announcement Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/25 mb-8 hover:bg-brand-cyan/15 group cursor-pointer transition-all duration-300"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-cyan animate-pulse" />
          <span className="font-mono text-[10px] text-brand-cyan tracking-widest font-semibold uppercase">
            VERSION 2.4 NOW LIVE
          </span>
          <ChevronRight className="w-3 h-3 text-brand-cyan group-hover:translate-x-1 transition-transform" />
        </motion.div>

        {/* Cinematic Title Hero */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl mb-6 font-extrabold tracking-tighter leading-none"
        >
          Your AI Trading <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-white to-brand-purple">
            Journal OS
          </span>
        </motion.h1>

        {/* Hero description */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-sans text-sm md:text-base text-[#b9cacb] max-w-2xl mx-auto mb-10 leading-relaxed font-light"
        >
          AI-powered trade journaling, psychology tracking, and performance analytics designed to help traders improve consistency and execution.
        </motion.p>

        {/* Action Controls */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-20"
        >
          <button 
            onClick={onStartPro}
            className="px-8 py-4 bg-brand-cyan text-black font-semibold rounded-lg shadow-[0_0_25px_rgba(0,219,231,0.35)] hover:scale-105 hover:bg-white active:scale-95 transition-all duration-300 select-none cursor-pointer"
          >
            Start Journaling
          </button>
          <button 
            onClick={() => {
              const el = document.getElementById('pro-features');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 active:scale-95 select-none animate-pulse"
          >
            Explore Features
          </button>
        </motion.div>
      </header>

      {/* Bento feature matrix */}
      <section className="relative py-12 px-4 md:px-8 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main card: AI Neural Scan */}
          <div 
            className="md:col-span-8 glass-fill p-8 rounded-xl relative overflow-hidden group border border-white/5 hover:border-brand-cyan/30 transition-all duration-300 flex flex-col justify-between min-h-[300px]"
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="relative z-10 max-w-md">
              <div className="w-12 h-12 rounded-lg bg-brand-cyan/20 flex items-center justify-center border border-brand-cyan/30 mb-6 font-bold shadow-[0_0_15px_rgba(0,219,231,0.15)]">
                <Brain className="w-6 h-6 text-brand-cyan" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3 text-white">Advanced AI OCR Scanner</h3>
              <p className="text-sm text-[#b9cacb] leading-relaxed font-light">
                Our neural visual scanner parses screenshot attachments, excel reports, or broker logs to instantly extract technical parameters, sentiment analysis, and position configurations.
              </p>
            </div>
            {/* Visual simulation overlay */}
            <div className="absolute right-0 bottom-0 w-2/5 h-full opacity-20 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none flex items-end justify-end">
              <div className="w-[120%] h-[80%] border-t border-l border-brand-cyan/20 bg-brand-cyan/5 rounded-tl-3xl p-4 [transform:perspective(400px)_rotateX(20deg)_rotateY(-15deg)]">
                <div className="w-full h-2 bg-brand-cyan/50 rounded animate-pulse mb-3" />
                <div className="w-3/4 h-2 bg-brand-cyan/30 rounded mb-2" />
                <div className="w-5/6 h-2 bg-brand-cyan/20 rounded" />
              </div>
            </div>
          </div>

          {/* Psychology integration */}
          <div 
            className="md:col-span-4 glass-fill p-8 rounded-xl border border-white/5 hover:border-brand-purple/30 transition-all duration-300 flex flex-col justify-between min-h-[300px]"
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-brand-purple/20 flex items-center justify-center border border-brand-purple/30 mb-6 font-bold shadow-[0_0_15px_rgba(235,178,255,0.15)]">
                <Sparkles className="w-6 h-6 text-brand-purple" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3 text-white">Trading Psychology Insights</h3>
              <p className="text-sm text-[#b9cacb] leading-relaxed font-light">
                Analyzes holding patterns and trade timing to audit revenge trading tendencies, fear-of-loss, and systemic greed variables during volatile sessions.
              </p>
            </div>
          </div>

          {/* Risk shield */}
          <div className="md:col-span-4 glass-fill p-8 rounded-xl border border-white/5 hover:border-brand-emerald/30 transition-all duration-300 flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="w-12 h-12 rounded-lg bg-brand-emerald/20 flex items-center justify-center border border-brand-emerald/30 mb-6 shadow-[0_0_15px_rgba(0,227,131,0.15)]">
                <Shield className="w-6 h-6 text-brand-emerald" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3 text-white">Risk Shield & Safety</h3>
              <p className="text-sm text-[#b9cacb] leading-relaxed font-light">
                Automated position sizing parameters dynamically aligned with your actual historical equity curve and drawdown thresholds. Optimize risk reward efficiently.
              </p>
            </div>
          </div>

          {/* Backtesting engine */}
          <div className="md:col-span-8 glass-fill p-8 rounded-xl border border-white/5 hover:border-brand-cyan/30 transition-all duration-300 min-h-[300px] flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="w-12 h-12 rounded-lg bg-[#141416] border border-white/10 flex items-center justify-center mb-6">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3 text-white">Trade Replay & Review</h3>
              <p className="text-sm text-[#b9cacb] leading-relaxed font-light">
                Examine trading strategies across historical curves in real-time. Click to execute a sandbox replay simulation and check parameters.
              </p>
              <button 
                onClick={handleRunBacktest}
                disabled={backtestRunning}
                className="mt-6 px-5 py-2.5 bg-brand-cyan/15 hover:bg-brand-cyan/25 text-brand-cyan font-semibold text-xs rounded-lg uppercase tracking-wider transition-colors"
              >
                {backtestRunning ? 'Compiling Sandbox...' : 'Run Backtest Model'}
              </button>
            </div>
            {/* Blinking Backtest Sandbox Terminal */}
            <div className="w-full md:w-72 bg-black/80 rounded-lg p-5 border border-white/15 font-mono text-xs select-none">
              <div className="flex items-center gap-1.5 mb-3 border-b border-white/10 pb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-brand-emerald/60" />
                <span className="text-[10px] text-[#849495] ml-auto uppercase font-bold tracking-widest">Sandbox shell_01</span>
              </div>
              <div className="space-y-2 text-brand-cyan">
                {backtestOutput.map((line, idx) => (
                  <div key={idx} className={line.includes('[SUCCESS]') ? 'text-brand-emerald font-bold' : ''}>
                    {line}
                  </div>
                ))}
                {backtestRunning && (
                  <div className="animate-pulse text-brand-purple font-semibold">
                    &gt; ANALYZING EDGE MATRIX...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tilt mock centerpiece teaser */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto z-10 text-center relative pointer-events-auto">
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
          Advanced Trading Analytics
        </h2>
        <p className="text-[#b9cacb] max-w-xl mx-auto text-sm font-light mb-16">
          A sleek, high-density visualization tracker designed to optimize your trading consistency and analysis without complexity.
        </p>

        {/* Realistic interactive mock panel */}
        <div className="max-w-4xl mx-auto bg-gradient-to-tr from-brand-cyan/5 via-[#121215] to-brand-purple/5 p-4 rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative group cursor-pointer overflow-hidden">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-brand-emerald/50" />
            <div className="text-[11px] font-mono text-[#849495] mx-auto uppercase tracking-widest leading-none font-bold">TRADELENSE_OS_SECURE_V2.4</div>
          </div>

          <div className="grid grid-cols-12 gap-4 text-left">
            <div className="col-span-4 bg-[#141416]/90 p-4 rounded-lg border border-white/5">
              <div className="text-[9px] font-mono text-[#849495] uppercase tracking-widest mb-2 font-bold">EQUITY INDEX</div>
              <div className="text-xl font-mono text-white font-bold">$1,248,392.54</div>
              <div className="mt-4 h-16 w-full relative overflow-hidden flex items-end">
                {/* Simulated sine-wave SVG path overlay */}
                <svg className="w-full h-10" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <path d="M0 35 Q 25 20, 50 30 T 100 10" fill="none" stroke="#00dbe7" strokeWidth="2" />
                </svg>
              </div>
            </div>
            
            <div className="col-span-4 bg-[#141416]/90 p-4 rounded-lg border border-white/5 flex flex-col justify-between">
              <div>
                <div className="text-[9px] font-mono text-[#849495] uppercase tracking-widest mb-2 font-bold">COGNITIVE SUMMARY</div>
                <div className="text-xs text-[#e5e2e1] leading-relaxed">
                  "Slight overtrading triggers on Wednesday sessions. Win rate drop identified after 3 consecutive failures."
                </div>
              </div>
              <div className="mt-3 text-[10px] font-mono text-brand-cyan font-bold">REDUCED EXPOSURE ADVISORY</div>
            </div>

            <div className="col-span-4 bg-brand-purple/5 p-4 rounded-lg border border-brand-purple/20 flex flex-col justify-between">
              <div>
                <div className="text-[9px] font-mono text-brand-purple uppercase tracking-widest mb-2 font-bold font-semibold">AI CO-PILOT ADVISORY</div>
                <div className="text-xs text-[#e5e2e1] leading-relaxed font-light">
                  Volatility in Asian sessions remains elevated. Strategy alignment is optimum with small size allocations.
                </div>
              </div>
              <button 
                onClick={onStartPro}
                className="mt-4 w-full py-2 bg-brand-purple text-black font-semibold text-xs rounded uppercase tracking-wider cursor-pointer"
              >
                OPEN TERMINAL HUD
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pro Features section */}
      <section id="pro-features" className="py-24 px-4 md:px-8 max-w-7xl mx-auto z-10 text-center relative">
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">Pro Features</h2>
        <p className="text-[#849495] max-w-xl mx-auto text-sm font-light mb-20">
          Unlock the full cognitive performance ledger. Empowering high-frequency execution with zero commercial friction.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Standard Tier */}
          <div className="glass-fill p-10 rounded-xl relative flex flex-col text-left border border-white/5 hover:border-brand-cyan/20 transition-all duration-300">
            <span className="font-mono text-[10px] text-brand-cyan tracking-widest uppercase mb-2 font-bold">
              CORE JOURNALING SYSTEM
            </span>
            <h3 className="text-3xl font-display font-medium text-white mb-6">Free Tier</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-mono font-bold">Standard</span>
              <span className="text-[#849495] text-xs font-light ml-2">/ default active</span>
            </div>

            <ul className="space-y-4 mb-10 flex-1 text-sm text-[#b9cacb]">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-brand-cyan flex-shrink-0" />
                <span>AI trade journaling</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-brand-cyan flex-shrink-0" />
                <span>screenshot uploads</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-brand-cyan flex-shrink-0" />
                <span>basic analytics</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-brand-cyan flex-shrink-0" />
                <span>trade history</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-brand-cyan flex-shrink-0" />
                <span>psychology tagging</span>
              </li>
            </ul>

            <button 
              disabled
              className="w-full py-3.5 rounded-lg font-mono font-bold text-xs tracking-widest bg-white/5 border border-white/10 text-white/40 cursor-not-allowed select-none text-center"
            >
              STANDARD ACCESS ENABLED
            </button>
          </div>

          {/* Pro Premium Advanced Features Tier */}
          <div className="glass-fill p-10 rounded-xl relative flex flex-col text-left border-2 border-brand-purple/35 shadow-[0_0_40px_rgba(235,178,255,0.06)] overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#e5bdff] text-black font-mono font-bold text-[9px] tracking-widest px-4 py-1 uppercase rounded-bl-lg animate-pulse">
              Early Access
            </div>
            
            <span className="font-mono text-[10px] text-brand-purple tracking-widest uppercase mb-2 font-bold">
              ADVANCED AI COMPILATIONS
            </span>
            <h3 className="text-3xl font-display font-medium text-white mb-6">Pro Plan</h3>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-5xl font-mono font-bold">Preview</span>
              <span className="text-[#849495] text-xs font-light ml-2">/ coming soon</span>
            </div>

            <ul className="space-y-4 mb-10 flex-1 text-sm text-[#b9cacb]">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-brand-purple flex-shrink-0" />
                <span>advanced AI insights</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-brand-purple flex-shrink-0" />
                <span>behavioral analytics</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-brand-purple flex-shrink-0" />
                <span>expectancy analysis</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-brand-purple flex-shrink-0" />
                <span>Trading DNA reports</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-brand-purple flex-shrink-0" />
                <span>advanced session analytics</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-brand-purple flex-shrink-0" />
                <span>export reports</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-brand-purple flex-shrink-0" />
                <span>deeper psychology tracking</span>
              </li>
            </ul>

            <button 
              onClick={() => setSubscribedPlan(subscribedPlan === 'Pro' ? null : 'Pro')}
              className={`w-full py-3.5 rounded-lg font-semibold text-xs tracking-widest transition-all uppercase ${
                subscribedPlan === 'Pro' 
                  ? 'bg-brand-emerald text-black shadow-[0_0_15px_rgba(0,227,131,0.3)]' 
                  : 'bg-brand-purple text-black hover:bg-white transition-colors shadow-[0_0_20px_rgba(235,178,255,0.2)]'
              }`}
            >
              {subscribedPlan === 'Pro' ? '✓ Waitlist Reserved' : 'Join Pro Waitlist'}
            </button>
          </div>
        </div>
      </section>

      {/* Footer bar */}
      <footer className="w-full bg-[#08080a] border-t border-white/5 py-12 px-6 mt-16 text-xs text-[#849495] z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="font-display text-white text-base font-bold tracking-tight">Tradelense</span>
            <p className="mt-1 font-light">&copy; 2026 Tradelense. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-8 font-mono">
            <a href="#" className="hover:text-brand-cyan transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-cyan transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-brand-cyan transition-colors">Security Audit</a>
            <a href="#" className="hover:text-brand-cyan transition-colors">Broker Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
