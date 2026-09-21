export function LoginPlaceholder() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-xl text-white font-mono mb-2">Supabase Authentication Gateway</h2>
            <p className="text-sm text-[#b9cacb] mb-4">Deep application routes (/app/...) are protected and require a real Supabase session.</p>
            <div className="text-xs text-brand-purple font-mono bg-brand-purple/10 px-3 py-1 rounded">
                Login UI scheduled for future task
            </div>
        </div>
    );
}
