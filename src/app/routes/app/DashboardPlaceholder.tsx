import { PageContainer, PageHeader } from '../../../components/PageContainer';

export function DashboardPlaceholder() {
    return (
        <PageContainer
            header={
                <PageHeader
                    title="Dashboard"
                    description="High-level overview of portfolio performance and cognitive metrics."
                />
            }
        >
            <div className="glass-fill border border-white/5 rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
                </div>
                <h3 className="text-xl font-display font-semibold text-white mb-2">Dashboard Implementation Pending</h3>
                <p className="text-sm text-[#b9cacb] max-w-md mx-auto">
                    This route evaluates correctly within the V2 layout shell. Product logic for the Dashboard will be constructed in a later phase.
                </p>
            </div>
        </PageContainer>
    );
}
