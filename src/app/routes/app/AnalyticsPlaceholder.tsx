import { PageContainer, PageHeader } from '../../../components/PageContainer';

export function AnalyticsPlaceholder() {
    return (
        <PageContainer
            header={
                <PageHeader
                    title="Analytics"
                    description="In-depth statistical reporting, risk-to-reward ratios, and equity curve matrices."
                />
            }
        >
            <div className="glass-fill border border-white/5 rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" /></svg>
                </div>
                <h3 className="text-xl font-display font-semibold text-white mb-2">Analytics Implementation Pending</h3>
                <p className="text-sm text-[#b9cacb] max-w-md mx-auto">
                    Chart generation and data aggregation logic is scheduled for a future capability task.
                </p>
            </div>
        </PageContainer>
    );
}
