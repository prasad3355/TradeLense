import { Search, Bell, Settings as SettingsIcon, ShieldCheck, HeartPulse } from 'lucide-react';

interface NavbarProps {
  onSettingsClick: () => void;
  onPageClick: (view: 'landing' | 'dashboard' | 'trades' | 'coach' | 'settings') => void;
}

export default function Navbar({ onSettingsClick, onPageClick }: NavbarProps) {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 z-30 bg-black/40 backdrop-blur-3xl border-b border-white/5 flex justify-between items-center px-margin-desktop font-sans">
      
      {/* Search Input Area */}
      <div className="flex items-center gap-xl w-1/3">
        <div className="relative w-full max-w-xs group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#849495] w-4 h-4 group-focus-within:text-brand-cyan transition-colors" />
          <input
            type="text"
            placeholder="Search markets, assets, metrics..."
            className="w-full bg-[#131316] border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-xs font-sans text-white placeholder-[#849495] focus:outline-none focus:border-brand-cyan/40 focus:ring-1 focus:ring-brand-cyan/25 transition-all duration-300"
          />
        </div>
      </div>

      {/* Primary Links */}
      <nav className="flex items-center gap-10">
        <a 
          href="#"
          onClick={(e) => { e.preventDefault(); onPageClick('dashboard'); }}
          className="text-white hover:text-brand-cyan text-xs font-semibold tracking-wider transition-colors duration-200"
        >
          MARKETS
        </a>
        <a 
          href="#"
          onClick={(e) => { e.preventDefault(); onPageClick('coach'); }}
          className="text-[#849495] hover:text-brand-cyan text-xs font-semibold tracking-wider transition-colors duration-200"
        >
          ANALYTICS
        </a>
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onPageClick('landing'); }}
          className="text-[#849495] hover:text-brand-purple text-xs font-semibold tracking-wider transition-colors duration-200"
        >
          FEATURES
        </a>
      </nav>

      {/* Right controls */}
      <div className="flex items-center gap-md w-1/3 justify-end">
        {/* System telemetry indicator */}
        <div className="hidden lg:flex items-center gap-sm bg-brand-cyan/5 border border-brand-cyan/15 rounded-full px-3 py-1 text-[10px] text-brand-cyan font-mono tracking-widest leading-none font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
          <span>ACTIVE MONITORING</span>
        </div>

        {/* Action icons */}
        <button className="text-[#849495] hover:text-white p-2 hover:bg-white/[0.04] rounded-lg transition-all active:scale-95 duration-200 relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-purple" />
        </button>

        <button 
          onClick={onSettingsClick}
          className="text-[#849495] hover:text-white p-2 hover:bg-white/[0.04] rounded-lg transition-all active:scale-95 duration-200"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>

        {/* Profile Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden border border-brand-cyan/40 shadow-[0_0_10px_rgba(0,219,231,0.15)] ml-2 flex-shrink-0">
          <img 
            alt="Institutional Profile" 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
