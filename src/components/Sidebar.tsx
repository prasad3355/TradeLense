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
        className={`fixed left-0 top-0 h-full w-64 flex flex-col p-4 lg:p-6 z-50 bg-[#0D0D0F] lg:bg-[#0D0D0F] border-r border-[#202126] font-sans select-none transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
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
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-[#15141B] flex items-center justify-center border border-[#282333]">
              <Terminal className="text-[#8B5CF6] w-4 h-4 lg:w-5 lg:h-5" />
            </div>
            <div>
              <h1 className="font-display text-lg lg:text-[20px] leading-tight text-[#E8E8EA] font-bold tracking-tight">
                Tradelense
              </h1>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-[#77777F] hover:text-[#D5D5D8] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded"
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
            const isAiCoach = item.label === 'AI COACH';

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 py-3 pr-4 rounded-lg text-left font-sans text-xs font-semibold tracking-wider transition-all duration-200 relative group outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] border-l-[3px] ${isActive
                  ? 'text-[#F3F3F5] bg-[#17151F] border-[#7C6CF2] pl-[13px]'
                  : 'text-[#85858C] hover:bg-[#141419] hover:text-[#D7D7DC] border-transparent pl-[13px]'
                  }`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110 text-[#7C6CF2]' : isAiCoach ? 'text-[#8B5CF6] opacity-70 group-hover:opacity-100 group-hover:scale-110' : 'text-[#77777F] group-hover:scale-110 group-hover:text-[#8B82F5]'}`} />
                <span>{item.label}</span>
                {isAiCoach && <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#8B5CF6] opacity-50" />}
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
            className="w-full py-3 bg-gradient-to-r from-[#6D5CE7] to-[#4F63D8] hover:brightness-110 active:scale-95 text-[#FFFFFF] font-semibold text-xs rounded-lg tracking-widest transition-all duration-200 border border-[#4F63D8]/30 hover:shadow-[0_0_15px_rgba(109,92,231,0.15)] flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
          >
            <UploadCloud className="w-4 h-4 text-[#FFFFFF]" />
            <span>UPLOAD TRADE</span>
          </button>

          <div className="pt-4 border-t border-[#202126] flex flex-col gap-1">
            <Link
              to="/app/settings"
              onClick={onClose}
              className="group flex items-center gap-3 px-4 py-2 text-[#77777F] hover:text-[#D5D5D8] hover:bg-[#141419] rounded-lg transition-colors duration-200 text-[11px] font-semibold tracking-wide outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#707078] group-hover:text-[#8B82F5]" />
              <span>SUPPORT DESK</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
