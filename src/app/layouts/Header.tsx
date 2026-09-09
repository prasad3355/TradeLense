import { Menu, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
    onOpenSidebar: () => void;
}

export function Header({ onOpenSidebar }: HeaderProps) {
    const location = useLocation();
    const currentPath = location.pathname;

    // Simple title mapping
    let pageTitle = 'Tradelense';
    if (currentPath.includes('dashboard')) pageTitle = 'Dashboard';
    else if (currentPath.includes('journal')) pageTitle = 'Journal';
    else if (currentPath.includes('analytics')) pageTitle = 'Analytics';
    else if (currentPath.includes('behavior')) pageTitle = 'Behavioral Intelligence';
    else if (currentPath.includes('coach')) pageTitle = 'AI Coach';
    else if (currentPath.includes('settings')) pageTitle = 'Settings';

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 py-4 bg-black/80 backdrop-blur-xl border-b border-white/5">
            <div className="flex items-center gap-4">
                <button
                    onClick={onOpenSidebar}
                    className="lg:hidden p-2 -ml-2 text-[#b9cacb] hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded"
                    aria-label="Open menu"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <h2 className="font-display font-bold text-white tracking-tight uppercase text-sm lg:text-base">
                    {pageTitle}
                </h2>
            </div>

            <div className="flex items-center gap-4">
                {/* Placeholder for future notifications */}
                <button
                    className="p-2 text-[#b9cacb] hover:text-white transition-colors relative outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded-full"
                    aria-label="Notifications"
                >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-cyan opacity-80" />
                </button>

                {/* Placeholder for future user profile/plan badge */}
                <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-white/10 select-none">
                    <div className="text-right hidden md:block">
                        <div className="text-xs font-semibold text-white tracking-wide">User Account</div>
                        <div className="text-[10px] text-brand-purple font-mono uppercase tracking-widest font-bold">Pro Plan</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold text-[#b9cacb]">
                        U
                    </div>
                </div>
            </div>
        </header>
    );
}
