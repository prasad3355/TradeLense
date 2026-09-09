import { PageContainer, PageHeader } from '../../../components/PageContainer';

export function CoachPlaceholder() {
    return (
        <PageContainer
            header={
                <PageHeader
                    title="AI Coach"
                    description="Interactive Gemini-powered assistant evaluating your trading psychology and habits."
                />
            }
        >
            <div className="glass-fill border border-white/5 rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                </div>
                <h3 className="text-xl font-display font-semibold text-white mb-2">Coach Implementation Pending</h3>
                <p className="text-sm text-[#b9cacb] max-w-md mx-auto">
                    Gemini stream communication and context-window injection are scheduled for Phase 3.
                </p>
            </div>
        </PageContainer>
    );
}
