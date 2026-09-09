import { LayoutDashboard, Compass, BrainCircuit, Settings, UploadCloud, HelpCircle, Terminal, PieChart, Activity, X } from 'lucide-react';
import { NavLink, Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  onUploadClick: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ onUploadClick, isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { path: '/app/dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
    { path: '/app/journal', label: 'JOURNAL', icon: Compass },
    { path: '/app/analytics', label: 'ANALYTICS', icon: PieChart },
    { path: '/app/behavior', label: 'BEHAVIOR', icon: Activity },
    { path: '/app/coach', label: 'AI COACH', icon: BrainCircuit },
    { path: '/app/settings', label: 'SETTINGS', icon: Settings },
  ] as const;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 flex flex-col p-4 lg:p-6 z-50 bg-[#0d0d0f] lg:bg-black/60 lg:backdrop-blur-3xl border-r border-white/5 font-sans select-none transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        aria-label="Sidebar navigation"
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 cursor-pointer hover:opacity-90 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded-lg"
          >
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-brand-cyan/10 flex items-center justify-center border border-brand-cyan/30 shadow-[0_0_15px_rgba(0,219,231,0.2)]">
              <Terminal className="text-brand-cyan w-4 h-4 lg:w-5 lg:h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="font-display text-lg lg:text-[20px] leading-tight text-white font-bold tracking-tight">
                Tradelense
              </h1>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-[#849495] hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left font-sans text-xs font-semibold tracking-wider transition-all duration-200 relative group outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan ${isActive
                    ? 'text-brand-cyan bg-brand-cyan/10 border-l-2 border-brand-cyan shadow-[0_0_20px_rgba(0,219,231,0.08)]'
                    : 'text-[#b9cacb] hover:bg-white/[0.03] hover:text-white'
                  }`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110 text-brand-cyan' : 'group-hover:scale-110'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-brand-cyan animate-ping" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Upload and Secondary Items */}
        <div className="mt-auto pt-6 flex flex-col gap-4">
          <button
            onClick={() => {
              onUploadClick();
              onClose();
            }}
            className="w-full py-3 bg-gradient-to-r from-brand-cyan to-brand-emerald hover:brightness-115 active:scale-95 text-[#002022] font-semibold text-xs rounded-lg tracking-widest transition-all duration-200 shadow-[0_0_20px_rgba(0,219,231,0.2)] flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
          >
            <UploadCloud className="w-4 h-4" />
            <span>UPLOAD TRADE</span>
          </button>

          <div className="pt-4 border-t border-white/5 flex flex-col gap-1">
            <Link
              to="/app/settings"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2 text-[#849495] hover:text-brand-emerald transition-colors duration-200 text-[11px] font-semibold tracking-wide outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>SUPPORT DESK</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
