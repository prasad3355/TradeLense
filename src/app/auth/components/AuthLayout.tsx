import { ReactNode } from 'react';
import { Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-[#000000] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-cyan/5 via-black to-black font-sans selection:bg-brand-cyan/30">
            <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center z-10 animate-fade-in text-center">
                <Link
                    to="/"
                    className="flex items-center justify-center gap-3 w-12 h-12 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 shadow-[0_0_20px_rgba(0,219,231,0.2)] hover:scale-105 transition-transform outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
                    aria-label="Home"
                >
                    <Terminal className="text-brand-cyan w-6 h-6 animate-pulse" />
                </Link>
                <h2 className="mt-6 text-center text-2xl font-bold font-display tracking-tight text-white">
                    {title}
                </h2>
                {subtitle && (
                    <p className="mt-2 text-center text-sm text-[#b9cacb] max-w-sm">
                        {subtitle}
                    </p>
                )}
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 animate-fade-in-up">
                <div className="bg-[#050505] py-8 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.8)] border border-white/5 sm:rounded-2xl sm:px-10 backdrop-blur-3xl relative overflow-hidden">
                    {/* Subtle glass reflection */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
            </div>

            {/* Background design elements */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-cyan/20 blur-[120px] opacity-30 invert-0 MIX-BLEND-SCREEN" />
                <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-brand-purple/20 blur-[100px] opacity-20 MIX-BLEND-SCREEN" />
            </div>
        </div>
    );
}
