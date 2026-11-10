import { Menu, Bell, LogOut } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface HeaderProps {
    onOpenSidebar: () => void;
}

export function Header({ onOpenSidebar }: HeaderProps) {
    const location = useLocation();
    const currentPath = location.pathname;
    const { user, signOut } = useAuth();

    // Simple title mapping.
    // Analytics and Journal routes suppress the top-bar label because each renders its own h1.
    const isAnalyticsRoute = currentPath.includes('analytics');
    const isJournalRoute = currentPath.includes('journal');
    const isBehaviorRoute = currentPath.includes('behavior');
    const isCoachRoute = currentPath.includes('coach');
    let pageTitle = 'Tradelense';
    if (currentPath.includes('dashboard')) pageTitle = 'Dashboard';
    else if (currentPath.includes('journal')) pageTitle = '';
    else if (currentPath.includes('analytics')) pageTitle = '';
    else if (currentPath.includes('behavior')) pageTitle = 'Behavioral Intelligence';
    else if (currentPath.includes('coach')) pageTitle = 'AI Coach';
    else if (currentPath.includes('settings')) pageTitle = 'Settings';

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 py-2.5 lg:py-3 bg-[#0D0D0F] border-b border-white/10">
            <div className="flex items-center gap-4">
                <button
                    onClick={onOpenSidebar}
                    className="lg:hidden p-2 -ml-2 text-[#b9cacb] hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded"
                    aria-label="Open menu"
                >
                    <Menu className="w-5 h-5" />
                </button>
                {!isAnalyticsRoute && !isJournalRoute && !isBehaviorRoute && !isCoachRoute && (
                    <h2 className="font-display font-bold text-white tracking-tight uppercase text-sm lg:text-base">
                        {pageTitle}
                    </h2>
                )}
            </div>

            <div className="flex items-center gap-4">
                <button
                    className="p-2 text-[#b9cacb] hover:text-white transition-colors relative outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded-full"
                    aria-label="Notifications"
                >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-cyan opacity-80" />
                </button>

                <div className="hidden sm:flex items-center justify-between gap-3 p-2 bg-[#111114] border border-[#202126] rounded-lg select-none ml-2">
                    <div className="text-right hidden md:block px-1">
                        <div className="text-xs font-semibold text-[#DADADF] tracking-wide">
                            {user?.email || 'User Account'}
                        </div>
                        <div className="text-[10px] text-[#777780] font-mono uppercase tracking-widest font-bold">Pro Plan</div>
                    </div>
                    <div className="w-8 h-8 rounded-md bg-[#15141B] border border-[#282333] flex items-center justify-center text-xs font-bold text-[#8B5CF6] overflow-hidden shadow-sm shadow-[#8B5CF6]/10">
                        {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                    </div>
                </div>

                <button
                    onClick={signOut}
                    className="ml-2 p-2 text-[#849495] hover:text-white hover:bg-white/5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded flex items-center gap-2"
                    title="Sign Out"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        </header>
    );
}
