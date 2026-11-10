import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import { AnalyticsHeader } from './AnalyticsHeader';
import { AnalyticsEmptyState } from './AnalyticsEmptyState';
import { AnalyticsPopulatedView } from './AnalyticsPopulatedView';

// Hardcoded preview data corresponding to the illustrative metrics
export const previewData = {
    tradeCount: 65,
    netPl: 2482.50,
    currRunUp: 2482.50,
    winRate: 64.2,
    profitFactor: 1.82,
    expectancy: 42.18,
    maxDrawdown: -486.20,
    // Add other statically rendered data points as needed inside the populated view
};

export function Analytics() {
    const { session } = useAuth();
    const [trades, setTrades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPreview, setIsPreview] = useState(false);

    useEffect(() => {
        const fetchTrades = async () => {
            if (!session?.access_token) return;
            setLoading(true);
            try {
                const res = await fetch(`/api/trades?page=1&pageSize=1000`, {
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setTrades(data.data || []);
                }
            } catch (err) {
                console.error('Error fetching analytics trades', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrades();
    }, [session]);

    const hasRealTrades = trades.length > 0;
    const showPreview = isPreview && !hasRealTrades;
    const isZeroState = !hasRealTrades && !showPreview;

    return (
        <div className={`flex flex-col w-full ${showPreview ? '' : 'gap-8'}`}>
            {/* AnalyticsHeader is suppressed during Preview: the preview stage has its own hero */}
            {!showPreview && (
                <AnalyticsHeader
                    showPreview={showPreview}
                    togglePreview={() => setIsPreview(!isPreview)}
                    hasRealTrades={hasRealTrades}
                    tradeCount={trades.length}
                />
            )}
            {isZeroState && (
                <AnalyticsEmptyState onExplorePreview={() => setIsPreview(true)} />
            )}
            {!isZeroState && (
                <AnalyticsPopulatedView
                    isPreview={showPreview}
                    trades={showPreview ? previewData : trades}
                    onExitPreview={() => setIsPreview(false)}
                />
            )}
        </div>
    );
}

