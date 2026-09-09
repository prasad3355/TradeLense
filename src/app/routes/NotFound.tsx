import { Link } from 'react-router-dom';

export function NotFound() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center font-sans text-center px-4">
            <h1 className="font-display text-5xl font-bold text-white mb-4">404</h1>
            <p className="text-[#b9cacb] mb-8 font-light tracking-wide uppercase text-sm">
                Terminal Route Not Found
            </p>
            <Link
                to="/"
                className="px-6 py-3 bg-brand-cyan/10 hover:bg-brand-cyan/20 border border-brand-cyan/20 text-brand-cyan text-xs font-semibold rounded-lg tracking-widest uppercase transition-all"
            >
                Return to Foundation
            </Link>
        </div>
    );
}
