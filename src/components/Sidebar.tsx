import { LayoutDashboard, Compass, BrainCircuit, Settings, UploadCloud, HelpCircle, Terminal, Eye, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  activeView: 'landing' | 'dashboard' | 'trades' | 'coach' | 'settings';
  onViewChange: (view: 'landing' | 'dashboard' | 'trades' | 'coach' | 'settings') => void;
  onUploadClick: () => void;
}

export default function Sidebar({ activeView, onViewChange, onUploadClick }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
    { id: 'trades', label: 'TRADES / SCAN', icon: Compass },
    { id: 'coach', label: 'AI COACH', icon: BrainCircuit },
    { id: 'settings', label: 'SETTINGS', icon: Settings },
  ] as const;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col p-md z-40 bg-black/60 backdrop-blur-3xl border-r border-white/5 font-sans select-none">
      {/* Brand Header */}
      <div 
        className="flex items-center gap-sm mb-xl px-sm cursor-pointer hover:opacity-90 active:scale-95 transition-all"
        onClick={() => onViewChange('landing')}
      >
        <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 flex items-center justify-center border border-brand-cyan/30 shadow-[0_0_15px_rgba(0,219,231,0.2)]">
          <Terminal className="text-brand-cyan w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h1 className="font-display text-[20px] leading-tight text-white font-bold tracking-tight">
            Tradelense
          </h1>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 flex flex-col gap-sm">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex items-center gap-md px-md py-3 rounded-lg text-left font-sans text-xs font-semibold tracking-wider transition-all duration-300 relative group ${
                isActive
                  ? 'text-brand-cyan bg-brand-cyan/10 border-l-2 border-brand-cyan shadow-[0_0_20px_rgba(0,219,231,0.08)]'
                  : 'text-[#b9cacb] hover:bg-white/[0.03] hover:text-white hover:translate-x-1'
              }`}
            >
              <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110 text-brand-cyan' : 'group-hover:scale-110'}`} />
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-brand-cyan animate-ping" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Upload and Secondary Items */}
      <div className="mt-auto pt-md flex flex-col gap-sm">
        <button
          onClick={onUploadClick}
          className="w-full py-3 bg-gradient-to-r from-brand-cyan to-brand-emerald hover:brightness-115 active:scale-95 text-[#002022] font-semibold text-xs rounded-lg tracking-widest transition-all duration-200 shadow-[0_0_20px_rgba(0,219,231,0.2)] flex items-center justify-center gap-2"
        >
          <UploadCloud className="w-4 h-4" />
          <span>UPLOAD TRADE</span>
        </button>

        <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-1">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onViewChange('settings'); }}
            className="flex items-center gap-md px-md py-2 text-[#849495] hover:text-brand-emerald transition-colors duration-200 text-[11px] font-semibold tracking-wide"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>SUPPORT DESK</span>
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onViewChange('settings'); }}
            className="flex items-center gap-md px-md py-2 text-[#849495] hover:text-brand-cyan transition-colors duration-200 text-[11px] font-semibold tracking-wide"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>API ACCESS</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
