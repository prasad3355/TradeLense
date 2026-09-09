import { PageContainer, PageHeader } from '../../../components/PageContainer';

export function JournalPlaceholder() {
    return (
        <PageContainer
            header={
                <PageHeader
                    title="Journal"
                    description="A complete record of trading executions, annotations, and screenshot analysis."
                />
            }
        >
            <div className="glass-fill border border-white/5 rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14 11-4 4" /><path d="m10 11 4 4" /><circle cx="12" cy="12" r="10" /></svg>
                </div>
                <h3 className="text-xl font-display font-semibold text-white mb-2">Journal Implementation Pending</h3>
                <p className="text-sm text-[#b9cacb] max-w-md mx-auto">
                    Trade CRUD operations and database linkages are scheduled for Phase 2. The layout shell is responsive.
                </p>
            </div>
        </PageContainer>
    );
}
