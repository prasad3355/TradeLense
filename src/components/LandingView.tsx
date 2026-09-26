export default function LandingView({ onStartPro }: { onStartPro: () => void }) {
  return (
    <div className="bg-obsidian-900 text-slate-400 antialiased relative selection:bg-cyan-glow selection:text-black">
      {/* Ambient Top Aurora Glow */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-cyan-glow/10 via-electricViolet/5 to-transparent blur-[120px] pointer-events-none -z-10"
      ></div>

      {/* MainHeader */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-obsidian-900/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          <a aria-label="TRADELENSE OS Homepage" className="flex items-center gap-2.5 group" href="#">
            <div className="w-8 h-8 rounded-lg bg-obsidian-800 border border-white/10 flex items-center justify-center text-cyan-glow group-hover:border-cyan-glow/40 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
            </div>
            <div className="flex items-center tracking-tight">
              <span className="text-xl font-bold text-cream tracking-wider">TRADELENSE</span>
              <span className="text-xs ml-1.5 px-1.5 py-0.5 rounded bg-cyan-glow/10 text-cyan-glow font-mono font-semibold tracking-normal border border-cyan-glow/20">OS</span>
            </div>
          </a>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium" data-purpose="desktop-nav">
            <a className="flex items-center gap-1 text-slate-300 hover:text-cream transition-colors group cursor-pointer" href="#features">
              <span>Products</span>
              <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-cream transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </a>
            <a className="flex items-center gap-1 text-slate-300 hover:text-cream transition-colors group cursor-pointer" href="#dashboard">
              <span>Solutions</span>
              <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-cream transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </a>
            <a className="text-slate-300 hover:text-cream transition-colors" href="#dashboard">
              Supported Brokers
            </a>
            <a className="text-slate-300 hover:text-cream transition-colors" href="#pricing">
              Pricing
            </a>
            <a className="flex items-center gap-1 text-slate-300 hover:text-cream transition-colors group cursor-pointer" href="#features">
              <span>Resources</span>
              <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-cream transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </a>
          </nav>

          <div className="flex items-center gap-6">
            <a className="text-sm font-medium text-slate-300 hover:text-cream transition-colors" href="#dashboard">
              Log In
            </a>
            <a className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-electricViolet to-softPink hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/10 transition-all duration-200" href="#dashboard">
              <span>Get Started</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* HeroSection */}
      <section className="relative pt-20 pb-28 md:pt-28 md:pb-36 px-4 sm:px-6 lg:px-8 text-center bg-cyber-grid">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.08] mb-6">
            <span className="text-cream block">Your AI Trading</span>
            <span className="text-tradelense-gradient block mt-1">Journal OS</span>
          </h1>
          <p className="max-w-2xl text-base sm:text-lg md:text-xl text-slate-400 font-normal leading-relaxed mb-10">
            AI-powered trade journaling, psychology tracking, and performance analytics designed to help traders improve consistency and execution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto" data-purpose="hero-actions">
            <a className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-cyan-glow text-obsidian-950 hover:bg-cyan-bright transition-all duration-200 cyan-glow-sm hover:scale-[1.02] active:scale-[0.98] text-center shadow-lg shadow-cyan-glow/20" href="#dashboard">
              Start Journaling
            </a>
            <a className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-medium text-sm text-cream bg-obsidian-800/80 hover:bg-obsidian-700/80 border border-white/10 hover:border-white/20 transition-all duration-200 text-center" href="#features">
              Explore Features
            </a>
          </div>
          <div className="mt-16 pt-8 border-t border-white/[0.06] w-full flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs font-mono text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><strong className="text-cream">2.4M+</strong> Trades Journaled</span>
            <span className="text-white/20 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5"><strong className="text-cream">8,500+</strong> Active Traders</span>
            <span className="text-white/20 hidden sm:inline">•</span>
            <span>FTMO / NinjaTrader / IBKR / Topstep Synced</span>
            <span className="text-white/20 hidden sm:inline">•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              4.8 / 5 Rating
            </span>
          </div>
        </div>
      </section>

      {/* AuthenticDashboardSection */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-obsidian-950 relative" id="dashboard">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-cream tracking-tight mb-4">
              Your trades. Your data. Your edge.
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Tradelense turns every execution ticket into structured metrics, measurable psychology, and institutional-grade telemetry.
            </p>
          </div>
          
          <div className="rounded-2xl border border-white/10 bg-obsidian-850 shadow-2xl overflow-hidden" data-purpose="os-dashboard-window">
            <div className="bg-obsidian-800 px-4 py-3 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span className="ml-3 text-xs font-mono text-slate-400 tracking-wider">TRADELENSE_OS_SECURE_V2.4 — LIVE WORKSPACE</span>
              </div>
              <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Broker Sync: LIVE</span>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">June 2024</span>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
              {/* Top Telemetry KPI Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Net P&L Card */}
                <div className="p-4 rounded-xl bg-obsidian-800/60 border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <span>Net P&amp;L</span>
                      <span className="text-[10px] bg-slate-800 px-1 rounded text-slate-300">35</span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">+$7,183.75</div>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                  </div>
                </div>
                {/* Profit Factor Card */}
                <div className="p-4 rounded-xl bg-obsidian-800/60 border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono text-slate-400">Profit factor</div>
                    <div className="text-2xl font-bold font-mono text-cream mt-1">2.17</div>
                  </div>
                  <div className="w-10 h-10 relative flex items-center justify-center">
                    <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
                      <path className="text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5"></path>
                      <path className="text-emerald-400" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="72, 100" strokeWidth="3.5"></path>
                    </svg>
                  </div>
                </div>
                {/* Trade Win % Card */}
                <div className="p-4 rounded-xl bg-obsidian-800/60 border border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono text-slate-400">Trade win %</div>
                    <div className="text-2xl font-bold font-mono text-cream mt-1">42.42%</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <span className="text-emerald-400 font-bold">14W</span>
                    <span className="text-slate-500">/</span>
                    <span className="text-rose-400 font-bold">19L</span>
                  </div>
                </div>
                {/* Avg Win/Loss Trade Card */}
                <div className="p-4 rounded-xl bg-obsidian-800/60 border border-white/[0.06]">
                  <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-1">
                    <span>Avg win/loss trade</span>
                    <span className="text-cream font-bold">2.95</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex mt-2">
                    <div className="bg-emerald-400 h-full w-[72%]"></div>
                    <div className="bg-rose-500 h-full w-[28%]"></div>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono mt-1.5">
                    <span className="text-emerald-400">+$951 avg</span>
                    <span className="text-rose-400">-$322 avg</span>
                  </div>
                </div>
              </div>

              {/* Main Dashboard Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Trading Heatmap Calendar */}
                <div className="lg:col-span-7 bg-obsidian-800/40 p-4 sm:p-5 rounded-2xl border border-white/[0.06] flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-cream">June 2024</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/20">Monthly: +$5.13K (13 days)</span>
                    </div>
                    <div className="text-xs font-mono text-slate-400">35 Executions</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-mono text-slate-400 mb-2">
                    <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5 text-xs font-mono">
                    {/* Row 1 */}
                    <div className="h-16 rounded border border-white/5 bg-obsidian-900/40 p-1 opacity-30"></div>
                    <div className="h-16 rounded border border-white/5 bg-obsidian-900/40 p-1 opacity-30"></div>
                    <div className="h-16 rounded border border-white/5 bg-obsidian-900/40 p-1 opacity-30"></div>
                    <div className="h-16 rounded border border-white/5 bg-obsidian-900/40 p-1 opacity-30"></div>
                    <div className="h-16 rounded border border-white/5 bg-obsidian-900/40 p-1 opacity-30"></div>
                    <div className="h-16 rounded border border-white/5 bg-obsidian-900/40 p-1 opacity-30"></div>
                    <div className="h-16 rounded border border-white/5 bg-obsidian-900/40 p-1 text-slate-400">1</div>
                    {/* Row 2 */}
                    <div className="h-16 rounded border border-white/5 bg-obsidian-900/40 p-1 text-slate-400">2</div>
                    <div className="h-16 rounded border border-white/5 bg-obsidian-900/40 p-1 text-slate-400">3</div>
                    <div className="h-16 rounded border border-white/5 bg-obsidian-900/40 p-1 text-slate-400">4</div>
                    <div className="h-16 rounded border border-emerald-500/40 bg-emerald-950/30 p-1.5 flex flex-col justify-between">
                      <span className="text-slate-400 text-[10px]">5</span>
                      <div className="text-right">
                        <div className="text-emerald-400 font-bold text-xs">+$1.05K</div>
                        <div className="text-[9px] text-slate-400">1 trd • 100%</div>
                      </div>
                    </div>
                    <div className="h-16 rounded border border-white/5 bg-obsidian-900/40 p-1 text-slate-400">6</div>
                    <div className="h-16 rounded border border-white/5 bg-obsidian-900/40 p-1 text-slate-400">7</div>
                    <div className="h-16 rounded border border-white/5 bg-obsidian-900/40 p-1 text-slate-400">8</div>
                    {/* Row 3 */}
                    <div className="h-16 rounded border border-white/5 bg-obsidian-900/40 p-1 text-slate-400">9</div>
                    <div className="h-16 rounded border border-emerald-500/40 bg-emerald-950/30 p-1.5 flex flex-col justify-between">
                      <span className="text-slate-400 text-[10px]">10</span>
                      <div className="text-right">
                        <div className="text-emerald-400 font-bold text-xs">+$600</div>
                        <div className="text-[9px] text-slate-400">1 trd • 100%</div>
                      </div>
                    </div>
                    <div className="h-16 rounded border border-emerald-500/40 bg-emerald-950/30 p-1.5 flex flex-col justify-between">
                      <span className="text-slate-400 text-[10px]">11</span>
                      <div className="text-right">
                        <div className="text-emerald-400 font-bold text-xs">+$1.09K</div>
                        <div className="text-[9px] text-slate-400">2 trds • 50%</div>
                      </div>
                    </div>
                    <div className="h-16 rounded border border-white/5 bg-obsidian-900/40 p-1 text-slate-400">12</div>
                    <div className="h-16 rounded border border-rose-500/40 bg-rose-950/30 p-1.5 flex flex-col justify-between">
                      <span className="text-slate-400 text-[10px]">13</span>
                      <div className="text-right">
                        <div className="text-rose-400 font-bold text-xs">-$638</div>
                        <div className="text-[9px] text-slate-400">2 trds • 0%</div>
                      </div>
                    </div>
                    <div className="h-16 rounded border border-emerald-500/40 bg-emerald-950/30 p-1.5 flex flex-col justify-between">
                      <span className="text-slate-400 text-[10px]">14</span>
                      <div className="text-right">
                        <div className="text-emerald-400 font-bold text-xs">+$556</div>
                        <div className="text-[9px] text-slate-400">3 trds • 33%</div>
                      </div>
                    </div>
                    <div className="h-16 rounded border border-white/5 bg-obsidian-900/40 p-1 text-slate-400">15</div>
                    {/* Row 4 */}
                    <div className="h-16 rounded border border-white/5 bg-obsidian-900/40 p-1 text-slate-400">16</div>
                    <div className="h-16 rounded border border-rose-500/40 bg-rose-950/30 p-1.5 flex flex-col justify-between">
                      <span className="text-slate-400 text-[10px]">17</span>
                      <div className="text-right">
                        <div className="text-rose-400 font-bold text-xs">-$788</div>
                        <div className="text-[9px] text-slate-400">3 trds • 0%</div>
                      </div>
                    </div>
                    <div className="h-16 rounded border border-emerald-500/40 bg-emerald-950/30 p-1.5 flex flex-col justify-between">
                      <span className="text-slate-400 text-[10px]">18</span>
                      <div className="text-right">
                        <div className="text-emerald-400 font-bold text-xs">+$875</div>
                        <div className="text-[9px] text-slate-400">2 trds • 100%</div>
                      </div>
                    </div>
                    <div className="h-16 rounded border border-emerald-500/40 bg-emerald-950/30 p-1.5 flex flex-col justify-between">
                      <span className="text-slate-400 text-[10px]">19</span>
                      <div className="text-right">
                        <div className="text-emerald-400 font-bold text-xs">+$608</div>
                        <div className="text-[9px] text-slate-400">1 trd • 100%</div>
                      </div>
                    </div>
                    <div className="h-16 rounded border border-emerald-500/40 bg-emerald-950/30 p-1.5 flex flex-col justify-between">
                      <span className="text-slate-400 text-[10px]">20</span>
                      <div className="text-right">
                        <div className="text-emerald-400 font-bold text-xs">+$1.18K</div>
                        <div className="text-[9px] text-slate-400">5 trds • 40%</div>
                      </div>
                    </div>
                    <div className="h-16 rounded border border-emerald-500/40 bg-emerald-950/30 p-1.5 flex flex-col justify-between">
                      <span className="text-slate-400 text-[10px]">21</span>
                      <div className="text-right">
                        <div className="text-emerald-400 font-bold text-xs">+$113</div>
                        <div className="text-[9px] text-slate-400">3 trds • 50%</div>
                      </div>
                    </div>
                    <div className="h-16 rounded border border-white/5 bg-obsidian-900/40 p-1 text-slate-400">22</div>
                  </div>
                </div>

                {/* Zella Radar Chart & Equity Curve */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="bg-obsidian-800/40 p-5 rounded-2xl border border-white/[0.06] flex flex-col items-center">
                    <div className="w-full flex justify-between items-center mb-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Lense Consistency Score</span>
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">GRADE: A</span>
                    </div>
                    <div className="relative w-52 h-52 my-1 flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 200 200">
                        <polygon fill="none" points="100,20 170,60 170,140 100,180 30,140 30,60" stroke="rgba(255,255,255,0.08)" strokeWidth="1"></polygon>
                        <polygon fill="none" points="100,40 150,70 150,130 100,160 50,130 50,70" stroke="rgba(255,255,255,0.08)" strokeWidth="1"></polygon>
                        <polygon fill="none" points="100,60 130,80 130,120 100,140 70,120 70,80" stroke="rgba(255,255,255,0.08)" strokeWidth="1"></polygon>
                        <line stroke="rgba(255,255,255,0.1)" strokeWidth="1" x1="100" x2="100" y1="100" y2="20"></line>
                        <line stroke="rgba(255,255,255,0.1)" strokeWidth="1" x1="100" x2="170" y1="100" y2="60"></line>
                        <line stroke="rgba(255,255,255,0.1)" strokeWidth="1" x1="100" x2="170" y1="100" y2="140"></line>
                        <line stroke="rgba(255,255,255,0.1)" strokeWidth="1" x1="100" x2="100" y1="100" y2="180"></line>
                        <line stroke="rgba(255,255,255,0.1)" strokeWidth="1" x1="100" x2="30" y1="100" y2="140"></line>
                        <line stroke="rgba(255,255,255,0.1)" strokeWidth="1" x1="100" x2="30" y1="100" y2="60"></line>
                        <polygon fill="rgba(124, 58, 237, 0.3)" points="100,35 155,75 140,135 100,150 45,120 40,75" stroke="#7C3AED" strokeWidth="2"></polygon>
                        <circle cx="100" cy="35" fill="#E6A7DE" r="3"></circle>
                        <circle cx="155" cy="75" fill="#E6A7DE" r="3"></circle>
                        <circle cx="140" cy="135" fill="#E6A7DE" r="3"></circle>
                        <circle cx="100" cy="150" fill="#E6A7DE" r="3"></circle>
                        <circle cx="45" cy="120" fill="#E6A7DE" r="3"></circle>
                        <circle cx="40" cy="75" fill="#E6A7DE" r="3"></circle>
                      </svg>
                      <span className="absolute top-0 text-[10px] font-mono text-slate-400">Win %</span>
                      <span className="absolute right-0 top-12 text-[10px] font-mono text-slate-400">Profit Fac</span>
                      <span className="absolute right-1 bottom-10 text-[10px] font-mono text-slate-400">R:R</span>
                      <span className="absolute bottom-0 text-[10px] font-mono text-slate-400">Recovery</span>
                      <span className="absolute left-1 bottom-10 text-[10px] font-mono text-slate-400">Drawdown</span>
                      <span className="absolute left-0 top-12 text-[10px] font-mono text-slate-400">Discipline</span>
                    </div>
                    <div className="w-full text-center mt-2">
                      <div className="text-3xl font-extrabold font-mono text-cream">82.61 <span className="text-xs text-slate-400 font-normal">/ 100</span></div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 w-[82%]"></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-obsidian-800/40 p-4 rounded-2xl border border-white/[0.06]">
                    <div className="flex justify-between items-center text-xs font-mono mb-2">
                      <span className="text-slate-400">Cumulative Net Equity Curve</span>
                      <span className="text-emerald-400 font-bold">+$8,420 Peak</span>
                    </div>
                    <div className="h-24 w-full">
                      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 300 90">
                        <defs>
                          <linearGradient id="equityGrad" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#00D5D5" stopOpacity="0.35"></stop>
                            <stop offset="100%" stopColor="#00D5D5" stopOpacity="0.0"></stop>
                          </linearGradient>
                        </defs>
                        <path d="M 0,80 Q 50,75 80,60 T 150,45 T 220,25 T 300,10 L 300,90 L 0,90 Z" fill="url(#equityGrad)"></path>
                        <path d="M 0,80 Q 50,75 80,60 T 150,45 T 220,25 T 300,10" fill="none" stroke="#00D5D5" strokeWidth="2.5"></path>
                      </svg>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-2">
                      <span>06/01/24</span>
                      <span>06/15/24</span>
                      <span>06/30/24</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FeatureSuiteSection */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" data-purpose="4-pillar-features" id="features">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card 1: Advanced AI OCR Scanner (Col 7) */}
          <div className="lg:col-span-7 card-glass p-8 rounded-2xl relative overflow-hidden card-glass-hover">
            <div className="w-12 h-12 rounded-xl bg-cyan-glow/10 border border-cyan-glow/30 flex items-center justify-center text-cyan-glow mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04"></path>
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-cream mb-3">Advanced AI OCR Scanner</h3>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-md mb-8">
              Our neural visual scanner parses screenshot attachments, excel reports, or broker logs to instantly extract technical parameters, sentiment analysis, and position configurations.
            </p>
            <div className="relative w-full rounded-xl overflow-hidden border border-cyan-glow/20 bg-obsidian-950 p-4 shadow-2xl flex flex-col items-center justify-center">
              <div className="relative w-full rounded-lg overflow-hidden border-2 border-dashed border-cyan-glow/40 bg-black group shadow-[0_0_25px_rgba(0,213,213,0.15)]">
                <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-2.5 py-1 rounded-md bg-obsidian-900/90 backdrop-blur-md border border-cyan-glow/30 text-[10px] font-mono tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-cyan-bright animate-pulse"></span>
                  <span className="text-cyan-bright font-semibold">NEURAL OCR ACTIVE</span>
                  <span className="text-slate-500">//</span>
                  <span className="text-purple-400">ZONE DETECTION</span>
                </div>
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsK0X9KjUmQauM5rPzbEgx8I5o5yodIL-tGZLxGJuqTu57weBIURTemaYzGxYJsrt6sDzZg9vMNqGttENvMNC7cLhFWmXz8cPjMzhn69bJ9juwpOBzE8uz_peOkqFVHCgzEmlcO1VQzMGoh8tVGLK_9VKJyZ804m9X8PAbWl0sweUNqVxSPkizfQjcycDz3fSiEAwkDFRpTURLhvAqooGnTDBy1zIe0pDzRkOuXA1ySFDhlRrK4ipSHA" alt="Authentic dark mode TradingView desktop chart interface with green and red Japanese candlesticks, Long Position target hit, and neural AI scan line overlay" className="w-full h-auto block object-cover rounded-lg" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/60 via-transparent to-transparent pointer-events-none"></div>
              </div>
              <button type="button" className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-obsidian-800/80 hover:bg-obsidian-750 border border-cyan-glow/30 hover:border-cyan-glow text-cream text-xs font-mono font-bold tracking-wider transition-colors shadow-lg shadow-cyan-glow/10">
                <svg className="w-3.5 h-3.5 text-cyan-bright" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                <span>RESET SCANNER</span>
              </button>
            </div>
          </div>

          {/* Card 2: Trading Psychology Insights (Col 5) */}
          <div className="lg:col-span-5 card-glass p-8 rounded-2xl relative overflow-hidden card-glass-hover flex flex-col justify-between">
            <div className="w-12 h-12 rounded-xl bg-cyan-glow/10 border border-cyan-glow/30 flex items-center justify-center text-cyan-bright mb-6 shadow-[0_0_15px_rgba(0,213,213,0.15)]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-cream mb-3">Trading Psychology Insights</h3>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">Analyzes holding patterns and trade timing to audit revenge trading tendencies, fear-of-loss, and systemic greed variables during volatile sessions.</p>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 text-xs font-mono border border-rose-500/20">Revenge Risk: 8.4%</span>
              <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-mono border border-amber-500/20">FOMO Hesitation: LOW (12%)</span>
              <span className="px-2.5 py-1 rounded bg-cyan-glow/10 text-cyan-bright text-xs font-mono border border-cyan-glow/30">Discipline Index: 92/100</span>
            </div>
            <div className="p-4 rounded-xl bg-obsidian-850/80 border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Emotional Stability Score</span>
                <span className="text-xs font-mono font-bold text-cyan-bright bg-cyan-glow/10 px-2 py-0.5 rounded border border-cyan-glow/20">88 / 100</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                <div className="h-full bg-gradient-to-r from-cyan-glow to-electricViolet w-[88%]"></div>
              </div>
              <div className="space-y-2 pt-2 border-t border-white/5 font-mono text-[11px]">
                <div className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-bright"></span>
                    <span>Impulse Entry Detected</span>
                  </div>
                  <span className="text-slate-400 font-semibold">0 today</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    <span>Rule Adherence</span>
                  </div>
                  <span className="text-cyan-glow font-bold">94.2% London</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Tilt Vulnerability</span>
                  </div>
                  <span className="text-purple-400 font-semibold">MINIMAL (post-drawdown pause)</span>
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-purple-400">
                  <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> Cognitive Load Index
                </span>
                <span className="text-cyan-bright font-bold">STABLE • 18% LOAD</span>
              </div>
            </div>
          </div>

          {/* Card 3: Risk Shield & Safety (Col 5) */}
          <div className="lg:col-span-5 card-glass p-8 rounded-2xl relative overflow-hidden card-glass-hover">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-cream mb-3">Risk Shield &amp; Safety</h3>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Automated position sizing parameters dynamically aligned with your actual historical equity curve and drawdown thresholds. Optimize risk reward efficiently.
            </p>
          </div>

          {/* Card 4: Trade Replay & Review with Embedded Terminal (Col 7) */}
          <div className="lg:col-span-7 card-glass p-8 rounded-2xl relative overflow-hidden card-glass-hover flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-glow/10 border border-cyan-glow/30 flex items-center justify-center text-cyan-glow mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-cream mb-3">Trade Replay &amp; Review</h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
                Examine trading strategies across historical curves in real-time. Click to execute a sandbox replay simulation and check parameters.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4 border-t border-white/5">
              <button className="px-5 py-2.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold tracking-wider uppercase transition-colors" data-purpose="backtest-button">
                RUN BACKTEST MODEL
              </button>
              <div className="w-full sm:w-72 bg-black/90 rounded-lg border border-white/10 p-3 font-mono text-[11px] space-y-1.5 shadow-2xl">
                <div className="flex items-center justify-between pb-1 border-b border-white/10">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <span className="text-[9px] text-slate-400 tracking-wider">SANDBOX SHELL_01</span>
                </div>
                <div className="text-cyan-glow">INITIALIZING_BACKTEST...</div>
                <div className="text-cyan-bright">ALPHA_COEFF: 0.842</div>
                <div className="text-emerald-400 font-semibold">SHARPE_RATIO: 3.12 [SUCCESS]</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AdvancedTradingAnalyticsSection */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-y border-white/[0.06] bg-obsidian-950 relative" id="analytics">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-cream tracking-tight mb-4">
              Advanced Trading Analytics
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              A sleek, high-density visualization tracker designed to optimize your trading consistency and analysis without complexity.
            </p>
          </div>
          
          <div className="rounded-2xl border border-white/10 bg-obsidian-850 shadow-2xl overflow-hidden max-w-5xl mx-auto" data-purpose="analytics-hud">
            <div className="bg-obsidian-800 px-4 py-3 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              </div>
              <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">TRADELENSE_OS_SECURE_V2.4</span>
              <div className="w-12"></div>
            </div>
            
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl bg-obsidian-800/40 border border-white/[0.06] flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase">EQUITY INDEX</span>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-cream mt-2">$1,248,392.54</div>
                </div>
                <div className="mt-8 pt-4">
                  <svg className="w-full h-14" viewBox="0 0 200 50">
                    <path className="drop-shadow-[0_0_8px_rgba(0,213,213,0.8)]" d="M 0,40 Q 50,45 100,35 T 200,10" fill="none" stroke="#00D5D5" strokeWidth="2.5"></path>
                  </svg>
                </div>
              </div>
              
              <div className="p-5 rounded-xl bg-obsidian-800/40 border border-white/[0.06] flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase">COGNITIVE SUMMARY</span>
                  <p className="text-sm font-medium text-slate-300 mt-3 leading-relaxed">
                    "Slight overtrading triggers on Wednesday sessions. Win rate drop identified after 3 consecutive failures."
                  </p>
                </div>
                <div className="mt-6">
                  <span className="inline-block text-[11px] font-mono font-bold text-cyan-glow bg-cyan-glow/10 px-3 py-1 rounded border border-cyan-glow/20 tracking-wider">
                    REDUCED EXPOSURE ADVISORY
                  </span>
                </div>
              </div>
              
              <div className="p-5 rounded-xl bg-obsidian-800/40 border border-white/[0.06] flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-mono tracking-wider text-softPink uppercase">AI CO-PILOT ADVISORY</span>
                  <p className="text-sm font-medium text-slate-300 mt-3 leading-relaxed">
                    Volatility in Asian sessions remains elevated. Strategy alignment is optimum with small size allocations.
                  </p>
                </div>
                <div className="mt-6">
                  <button className="w-full py-3 px-4 rounded-xl font-bold font-mono text-xs uppercase tracking-wider bg-softPink text-obsidian-950 hover:bg-[#ffb6f6] transition-colors shadow-md">
                    OPEN TERMINAL HUD
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AICoachChatSection */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="ai-coach">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Interactive Chat Interface */}
          <div className="lg:col-span-7">
            <div className="card-glass rounded-2xl border border-white/10 shadow-2xl p-6 sm:p-8 relative">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-glow/15 border border-cyan-glow/30 flex items-center justify-center text-cyan-glow font-mono font-bold text-sm">
                    AI
                  </div>
                  <div>
                    <div className="text-sm font-bold text-cream">Tradelense Neural Behavioral Coach</div>
                    <div className="text-xs text-slate-400 font-mono">Synced with 420 executed tickets</div>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              </div>
              
              {/* Message Bubbles Stream */}
              <div className="space-y-4 font-sans text-sm">
                <div className="flex justify-end">
                  <div className="bg-obsidian-750 text-cream px-4 py-3 rounded-2xl rounded-tr-none border border-white/10 max-w-md">
                    Why did I lose money last week?
                  </div>
                </div>
                
                <div className="flex justify-start">
                  <div className="bg-cyan-glow/[0.08] text-slate-200 px-4 py-3.5 rounded-2xl rounded-tl-none border border-cyan-glow/20 max-w-lg space-y-2">
                    <p>
                      You took <strong>4 revenge trades</strong> within 3 minutes of a stop-out. Each averaged <span className="text-rose-400 font-mono font-bold">-$420</span>.
                    </p>
                    <p className="text-xs text-slate-400 font-mono">
                      That accounted for <strong>73%</strong> of last week's total losses, all matching identical emotional fatigue signatures. (based on 23 trades • mon - fri)
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <div className="bg-obsidian-750 text-cream px-4 py-3 rounded-2xl rounded-tr-none border border-white/10 max-w-md">
                    What rule adjustment will fix this?
                  </div>
                </div>
                
                <div className="flex justify-start">
                  <div className="bg-cyan-glow/[0.08] text-slate-200 px-4 py-3.5 rounded-2xl rounded-tl-none border border-cyan-glow/20 max-w-lg space-y-1">
                    <p>
                      Enforce an automatic <strong>15-minute terminal lock</strong> after any 1R loss.
                    </p>
                    <p className="text-xs text-emerald-400 font-mono">
                      Traders with your exact profile who activated this lock reduced their maximum weekly drawdown by 38.4%.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Simulated Prompt Input */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3">
                <div className="flex-1 bg-obsidian-850 px-4 py-3 rounded-xl border border-white/10 text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>&gt; Ask Tradelense AI anything about your trading...</span>
                  <kbd className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">Enter ↵</kbd>
                </div>
                <button className="px-4 py-3 rounded-xl bg-cyan-glow text-obsidian-950 font-bold text-xs uppercase hover:bg-cyan-bright transition-colors">
                  Query
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Column: Editorial & Pattern Intelligence Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-mono text-cyan-glow uppercase tracking-widest">03 — BEHAVIOR &amp; AI COACH</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-cream tracking-tight mt-2 mb-4">
                Ask your trading journal anything.
              </h2>
              <p className="text-slate-400 text-base leading-relaxed">
                AI Coach analyzes patterns directly from your historical executions to highlight hidden blind spots, psychological friction, and execution leaks.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-xl card-glass">
                <span className="text-[10px] font-mono uppercase text-rose-400 font-bold">TIME-OF-DAY LEAK</span>
                <p className="text-xs text-slate-300 mt-1 font-medium">You lose 62% of trades placed after 2:30pm ET.</p>
              </div>
              <div className="p-4 rounded-xl card-glass">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">BEHAVIORAL FRICTION</span>
                <p className="text-xs text-slate-300 mt-1 font-medium">Revenge entries cost -$8,420 last quarter.</p>
              </div>
              <div className="p-4 rounded-xl card-glass">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">OPTIMAL EDGE</span>
                <p className="text-xs text-slate-300 mt-1 font-medium">Opening-range breakout on NQ yields 3.4 Profit Factor.</p>
              </div>
              <div className="p-4 rounded-xl card-glass">
                <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">CURRENT STREAK</span>
                <p className="text-xs text-slate-300 mt-1 font-medium">9 winners in a row on Tuesday morning sessions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WorkflowSection */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-obsidian-950" id="workflow">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest font-semibold bg-gradient-to-r from-[#00F0FF] via-[#8B5CF6] to-[#A855F7] text-transparent bg-clip-text">HOW IT WORKS</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-cream tracking-tight mt-2 mb-3">
              Frictionless trade telemetry in 4 steps.
            </h2>
            <p className="text-slate-400 text-base">
              From trade screenshot to actionable behavioral edge in seconds.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="card-glass p-6 rounded-2xl relative border border-white/5 border-t-2 border-t-cyan-glow shadow-[0_0_20px_rgba(0,213,213,0.06)] hover:border-cyan-glow/30 transition-all duration-200 group">
              <div className="text-3xl font-black font-mono bg-gradient-to-br from-[#00F0FF]/80 to-[#8B5CF6]/50 text-transparent bg-clip-text mb-3">01</div>
              <h3 className="text-lg font-bold text-cream mb-2 tracking-wide group-hover:text-cyan-bright transition-colors">CAPTURE</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Drop chart screenshots, upload broker CSV files, or link your live API directly via webhook sync.
              </p>
            </div>
            {/* Step 2 */}
            <div className="card-glass p-6 rounded-2xl relative border border-white/5 border-t-2 border-t-cyan-glow shadow-[0_0_20px_rgba(0,213,213,0.06)] hover:border-cyan-glow/30 transition-all duration-200 group">
              <div className="text-3xl font-black font-mono bg-gradient-to-br from-[#00F0FF]/80 to-[#A855F7]/50 text-transparent bg-clip-text mb-3">02</div>
              <h3 className="text-lg font-bold text-cream mb-2 tracking-wide group-hover:text-cyan-bright transition-colors">EXTRACT</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Neural OCR automatically indexes symbol, execution price, position sizing, risk reward, and holding time.
              </p>
            </div>
            {/* Step 3 */}
            <div className="card-glass p-6 rounded-2xl relative border border-white/5 border-t-2 border-t-electricViolet shadow-[0_0_20px_rgba(124,58,237,0.08)] hover:border-purple-500/30 transition-all duration-200 group">
              <div className="text-3xl font-black font-mono bg-gradient-to-br from-[#8B5CF6]/90 to-[#C084FC]/60 text-transparent bg-clip-text mb-3">03</div>
              <h3 className="text-lg font-bold text-cream mb-2 tracking-wide group-hover:text-purple-400 transition-colors">REVIEW</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Verify AI tags, attach emotional state markers, and grade your trade discipline score on each entry.
              </p>
            </div>
            {/* Step 4 */}
            <div className="card-glass p-6 rounded-2xl relative border border-white/5 border-t-2 border-t-electricViolet shadow-[0_0_20px_rgba(124,58,237,0.08)] hover:border-purple-500/30 transition-all duration-200 group">
              <div className="text-3xl font-black font-mono bg-gradient-to-br from-[#A855F7]/90 to-[#E6A7DE]/60 text-transparent bg-clip-text mb-3">04</div>
              <h3 className="text-lg font-bold text-cream mb-2 tracking-wide group-hover:text-purple-400 transition-colors">ANALYZE</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                AI Coach models your execution tendencies to deliver immediate behavioral recommendations before next session.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PricingSection */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="pricing">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest font-bold bg-gradient-to-r from-[#00F0FF] via-[#A855F7] to-[#C084FC] text-transparent bg-clip-text">TRANSPARENT PLANS</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-cream tracking-tight mt-2 mb-4">
            Predictable pricing for dedicated traders.
          </h2>
          <p className="text-slate-400 text-base">
            Scale your edge with complete telemetry. No long-term commitments.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Free Plan */}
          <div className="card-glass p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="text-sm font-mono uppercase text-slate-400">Free Trader</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-cream">$0</span>
                <span className="text-xs font-mono uppercase tracking-widest font-bold bg-gradient-to-r from-[#00F0FF] via-[#A855F7] to-[#C084FC] text-transparent bg-clip-text">TRANSPARENT PLANS</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Essential trade recording for new prop firm applicants.</p>
              <ul className="mt-8 space-y-3 text-xs text-slate-300 font-sans">
                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-[#00F0FF] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg> Up to 50 trades / month</li>
                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-[#A855F7] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg> Basic Trading Calendar</li>
                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-[#00F0FF] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg> Standard P&amp;L Metrics</li>
              </ul>
            </div>
            <a className="mt-8 w-full py-3 rounded-xl border border-white/10 hover:border-white/30 text-cream text-xs font-bold uppercase tracking-wider text-center block transition-colors" href="#dashboard">
              Start Free
            </a>
          </div>
          {/* Pro Plan */}
          <div className="card-glass p-8 rounded-2xl border-2 border-cyan-glow relative flex flex-col justify-between cyan-glow-sm bg-obsidian-850" style={{borderColor: 'rgb(139, 92, 246)', boxShadow: 'rgba(168, 85, 247, 0.3) 0px 0px 35px -5px, rgba(0, 240, 255, 0.25) 0px 0px 20px -5px'}}>
            <span className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#00F0FF] to-[#A855F7] text-white font-mono font-bold text-[10px] tracking-widest uppercase shadow-lg shadow-purple-500/20">MOST POPULAR</span>
            <div>
              <div className="text-sm font-mono uppercase font-bold bg-gradient-to-r from-[#00F0FF] to-[#C084FC] text-transparent bg-clip-text">Pro Journaler</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-cream">$29</span>
                <span className="text-xs font-mono uppercase tracking-widest font-bold bg-gradient-to-r from-[#00F0FF] via-[#A855F7] to-[#C084FC] text-transparent bg-clip-text">TRANSPARENT PLANS</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Complete behavioral OS for prop and retail funded traders.</p>
              <ul className="mt-8 space-y-3 text-xs text-slate-200 font-sans">
                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-[#00F0FF] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg> Unlimited trade imports &amp; broker sync</li>
                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-[#A855F7] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg> Neural OCR Visual Scanner</li>
                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-[#00F0FF] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg> AI Behavioral Coach &amp; Revenge Warning</li>
                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-[#A855F7] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg> Multi-axis Spider / Radar Consistency Score</li>
                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-[#00F0FF] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg> Trade Sandbox Replay Terminal</li>
              </ul>
            </div>
            <a className="mt-8 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00F0FF] via-[#8B5CF6] to-[#A855F7] text-white text-xs font-bold font-mono uppercase tracking-wider text-center block shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all" href="#dashboard">Get Started Pro</a>
          </div>
          {/* Elite Firm Plan */}
          <div className="card-glass p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="text-sm font-mono uppercase text-slate-400">Elite / Desk</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-cream">$79</span>
                <span className="text-xs font-mono uppercase tracking-widest font-bold bg-gradient-to-r from-[#00F0FF] via-[#A855F7] to-[#C084FC] text-transparent bg-clip-text">TRANSPARENT PLANS</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Multi-account telemetry for high-volume traders &amp; mentors.</p>
              <ul className="mt-8 space-y-3 text-xs text-slate-300 font-sans">
                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-[#00F0FF] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg> All Pro Features Included</li>
                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-[#A855F7] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg> Up to 10 Sub-accounts / Desks</li>
                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-[#00F0FF] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg> Custom Risk Limits with Webhook Trigger</li>
                <li className="flex items-center gap-2"><svg className="w-4 h-4 text-[#A855F7] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg> Priority Telemetry Stream</li>
              </ul>
            </div>
            <a className="mt-8 w-full py-3 rounded-xl border border-white/10 hover:border-white/30 text-cream text-xs font-bold uppercase tracking-wider text-center block transition-colors" href="#dashboard">
              Contact Desk Sales
            </a>
          </div>
        </div>
      </section>

      {/* FinalCTASection */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] bg-gradient-to-b from-obsidian-900 to-obsidian-950 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-glow/10 rounded-full blur-[100px] pointer-events-none" style={{background: 'radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, rgba(0, 240, 255, 0.12) 60%, transparent 100%)'}}></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl sm:text-6xl font-extrabold text-cream tracking-tight mb-4">
            Build a better trading process.
          </h2>
          <p className="max-w-xl mx-auto text-base sm:text-lg text-slate-400 mb-10">
            Journal every trade. Understand your performance. Eliminate unforced psychological errors.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#00F0FF] via-[#8B5CF6] to-[#A855F7] hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-purple-500/20 transition-all duration-200" href="#dashboard">Get Started Free</a>
            <a className="w-full sm:w-auto px-8 py-4 rounded-xl font-medium text-sm text-cream bg-obsidian-800 border border-white/10 hover:border-white/20 transition-all duration-200" href="#features">
              Explore Tradelense OS
            </a>
          </div>
        </div>
      </section>

      {/* MainFooter */}
      <footer className="border-t border-white/[0.06] bg-obsidian-950 py-12 px-4 sm:px-6 lg:px-8 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-obsidian-800 border border-white/10 flex items-center justify-center text-cyan-glow font-bold text-xs">
              T
            </div>
            <span className="text-slate-400">© 2026 TRADELENSE OS Inc. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <a className="hover:text-cyan-glow transition-colors" href="#features">Features</a>
            <a className="hover:text-cyan-glow transition-colors" href="#analytics">Analytics</a>
            <a className="hover:text-cyan-glow transition-colors" href="#ai-coach">AI Coach</a>
            <a className="hover:text-cyan-glow transition-colors" href="#pricing">Pricing</a>
            <a className="hover:text-cyan-glow transition-colors" href="#">Privacy</a>
            <a className="hover:text-cyan-glow transition-colors" href="#">Terms</a>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400">System Operational • 99.98% uptime</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
