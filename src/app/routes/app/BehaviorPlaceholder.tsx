import { PageContainer, PageHeader } from '../../../components/PageContainer';

export function BehaviorPlaceholder() {
    return (
        <PageContainer
            header={
                <PageHeader
                    title="Behavioral Intelligence"
                    description="Heatmaps and indicators showing your cognitive state across trading sessions."
                />
            }
        >
            <div className="glass-fill border border-white/5 rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 text-brand-purple flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                </div>
                <h3 className="text-xl font-display font-semibold text-white mb-2">Behavior Implementation Pending</h3>
                <p className="text-sm text-[#b9cacb] max-w-md mx-auto">
                    Psychology evaluation metrics and pattern isolation are pending future tasks.
                </p>
            </div>
        </PageContainer>
    );
}
