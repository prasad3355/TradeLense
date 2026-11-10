import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { Search, ChevronDown, List, Grid, Plus, ArrowRightLeft, FolderOpen, Zap, PieChart, BrainCircuit } from 'lucide-react';
import TradeDetailView from '../../../components/TradeDetailView';
import { Trade } from '../../../types';

const previewTrades = [
    {
        id: 'p1',
        asset: 'XAUUSD',
        direction: 'LONG',
        pnl: 420.00,
        title: 'London Breakout // M15',
        ocr: 99.4,
        date: 'Jun 21',
        session: 'London Session',
        rr: '2.4R',
        duration: '24m',
        outcome: 'WIN',
        image: '/charts/chart-p1.svg',
    },
    {
        id: 'p2',
        asset: 'EURUSD',
        direction: 'SHORT',
        pnl: -180.00,
        title: 'Order Block Pullback',
        ocr: 98.1,
        date: 'Jun 19',
        session: 'NY Open',
        rr: '-1.0R',
        duration: '18m',
        outcome: 'LOSS',
        image: '/charts/chart-p2.svg',
    },
    {
        id: 'p3',
        asset: 'NAS100',
        direction: 'LONG',
        pnl: 635.00,
        title: 'Opening Range Drive',
        ocr: 99.8,
        date: 'Jun 14',
        session: 'NY AM Session',
        rr: '3.1R',
        duration: '42m',
        outcome: 'WIN',
        image: '/charts/chart-p3.svg',
    },
    {
        id: 'p4',
        asset: 'US30',
        direction: 'SHORT',
        pnl: 310.00,
        title: 'Daily High Sweep',
        ocr: 97.9,
        date: 'Jun 11',
        session: 'NY Close',
        rr: '1.8R',
        duration: '35m',
        outcome: 'WIN',
        image: '/charts/chart-p4.svg',
    },
    {
        id: 'p5',
        asset: 'BTCUSD',
        direction: 'LONG',
        pnl: -150.00,
        title: 'TrendLine Break',
        ocr: 96.5,
        date: 'Jun 09',
        session: 'Weekend Asia',
        rr: '-0.8R',
        duration: '1h 10m',
        outcome: 'LOSS',
        image: '/charts/chart-p5.svg',
    },
    {
        id: 'p6',
        asset: 'XAUUSD',
        direction: 'LONG',
        pnl: 556.00,
        title: 'Fair Value Gap Fill',
        ocr: 99.1,
        date: 'Jun 05',
        session: 'London Fix',
        rr: '2.8R',
        duration: '50m',
        outcome: 'WIN',
        image: '/charts/chart-p6.svg',
    },
    {
        id: 'p7',
        asset: 'EURUSD',
        direction: 'LONG',
        pnl: 1050.00,
        title: 'Liquidity Grab',
        ocr: 99.5,
        date: 'Jun 04',
        session: 'Frankfurt Open',
        rr: '4.2R',
        duration: '1h 22m',
        outcome: 'WIN',
        image: '/charts/chart-p7.svg',
    },
    {
        id: 'p8',
        asset: 'NAS100',
        direction: 'SHORT',
        pnl: -638.00,
        title: 'Mean Reversion',
        ocr: 98.7,
        date: 'Jun 02',
        session: 'NY Session',
        rr: '-1.2R',
        duration: '14m',
        outcome: 'LOSS',
        image: '/charts/chart-p8.svg',
    }
];

export function Journal() {
    const { session } = useAuth();
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isPreview, setIsPreview] = useState(false);
    const [viewMode, setViewMode] = useState<'gallery' | 'table'>('gallery');
    const [selectedTrade, setSelectedTrade] = useState<any | null>(null);

    const fetchTrades = async () => {
        if (!session?.access_token) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/trades?page=1&pageSize=20`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });
            if (!res.ok) {
                throw new Error('Failed to fetch trades');
            }
            const data = await res.json();
            setTrades(data.data || []);
        } catch (err: any) {
            setError(err.message || 'Error fetching trades');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrades();
    }, [session]);

    const hasRealTrades = trades.length > 0;
    const isJournalEmpty = !hasRealTrades;

    // State rules:
    //  - Zero real trades + no preview action → empty state
    //  - Zero real trades + preview action    → preview (sample data)
    //  - Real trades present + no preview action → real journal
    //  - Real trades present + preview action    → preview (sample, clearly labelled)
    const showPreview = isPreview;
    const displayTrades = showPreview ? previewTrades : trades;

    return (
        <div className="w-full text-[#F3F3F5] font-sans pb-16">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div className="flex items-center gap-4">
                    <h1 className="text-[26px] font-bold text-[#F3F3F5] tracking-tight">Journal</h1>
                    {/* Header Metrics */}
                    <div className="hidden sm:flex items-center gap-3 text-[11px] font-semibold mt-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${showPreview ? 'bg-[#8B5CF6]' : 'bg-[#6F7078]/50'}`} />
                        <span className="text-[#6F7078]">
                            {showPreview ? '12 Closed Trades' : `${trades.length} Closed Trades`}
                        </span>
                        <div className={`w-1 h-1 rounded-full ${showPreview ? 'bg-green-500/30' : 'bg-[#6F7078]/30'}`} />
                        <span className={showPreview ? 'text-green-500' : 'text-[#F3F3F5]'}>
                            {showPreview ? '+$1,842.00' : '$0.00'}
                        </span>
                        <div className={`w-1 h-1 rounded-full ${showPreview ? 'bg-[#8B5CF6]/30' : 'bg-[#6F7078]/30'}`} />
                        <span className="text-[#6F7078]">
                            {showPreview ? '58.3% WR' : '— WR'}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setIsPreview(!isPreview)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-[6px] border text-[11px] font-semibold transition-colors
                            ${showPreview ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30 text-[#8B5CF6]' : 'bg-transparent border-[#292929] text-[#F3F3F5] hover:bg-[#151515]'}`}
                    >
                        <div className={`w-1.5 h-1.5 rounded-full ${showPreview ? 'bg-[#8B5CF6]' : 'bg-[#8B5CF6]'}`} />
                        Journal Preview
                        <ArrowRightLeft className="w-3.5 h-3.5 opacity-50" />
                    </button>

                    <div className="flex bg-[#0D0D0F] rounded-[6px] border border-[#202126] p-0.5">
                        <button
                            onClick={() => setViewMode('gallery')}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-[4px] text-[11px] font-semibold transition-colors ${viewMode === 'gallery' ? 'bg-[#202126] text-[#F3F3F5]' : 'text-[#6F7078] hover:text-[#D5D5D8]'}`}
                        >
                            <Grid className="w-3.5 h-3.5" />
                            Gallery
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-[4px] text-[11px] font-semibold transition-colors ${viewMode === 'table' ? 'bg-[#202126] text-[#F3F3F5]' : 'text-[#6F7078] hover:text-[#D5D5D8]'}`}
                        >
                            <List className="w-3.5 h-3.5" />
                            Table
                        </button>
                    </div>

                    <button
                        onClick={() => {/* Use existing upload flow */ }}
                        className="flex items-center gap-1.5 bg-[#8B5CF6] hover:bg-[#7C6CF2] text-white px-3 py-1.5 rounded-[6px] text-[11px] font-semibold transition-colors whitespace-nowrap"
                    >
                        + Add Trade
                    </button>
                </div>
            </div>
            <p className="text-[13px] text-[#6F7078] mb-6">Your visual trading archive.</p>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2 p-2 bg-[#151515] border border-[#202126] rounded-xl mb-6">
                <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F7078] w-3.5 h-3.5" />
                    <input
                        type="text"
                        placeholder="Search instruments, tags, setups..."
                        disabled
                        className="w-full bg-[#0D0D0F] border border-[#202126] text-white pl-9 pr-3 py-1.5 rounded-lg text-[12px] focus:outline-none focus:border-[#8B5CF6]/50 placeholder-[#6F7078]"
                    />
                </div>

                {[
                    { label: 'June 2024', icon: <span className="w-3.5 h-3.5 flex items-center justify-center opacity-70">📅</span> },
                    { label: 'All Pairs', icon: <span className="w-3.5 h-3.5 flex items-center justify-center opacity-70">💸</span> },
                    { label: 'Side: All', icon: <ArrowRightLeft className="w-3 h-3 opacity-70 rotate-90" /> },
                    { label: 'Outcome: All', icon: <span className="w-3.5 h-3.5 border border-current rounded-full flex justify-center items-center text-[8px] opacity-70">✓</span> },
                    { label: 'All Sessions', icon: <span className="w-3 h-3 border border-current rounded-full opacity-70"></span> }
                ].map((filter, i) => (
                    <button key={i} disabled className="flex items-center gap-2 px-3 py-1.5 bg-[#151515] border border-[#202126] rounded-lg text-[11px] font-semibold text-[#F3F3F5] hover:bg-[#1A1A1A] transition-colors">
                        {filter.icon}
                        {filter.label}
                        <ChevronDown className="w-3 h-3 text-[#6F7078] ml-1" />
                    </button>
                ))}
            </div>

            {showPreview && (
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#0E0D16] border border-[#8B5CF6]/20 rounded-xl mb-6">
                    <div className="flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse flex-shrink-0" />
                        <p className="text-[12px]">
                            <span className="font-bold text-[#C4B5FD]">Sample Journal</span>
                            <span className="text-[#6F7078]"> · Demo Data — none of this is saved to your account.</span>
                        </p>
                    </div>
                    <button
                        onClick={() => setIsPreview(false)}
                        className="text-[11px] font-bold text-[#8B5CF6] hover:text-[#A78BFA] transition-colors flex items-center gap-1 pr-1 whitespace-nowrap"
                    >
                        {hasRealTrades ? 'Back to My Journal' : 'View Empty Journal'} <span className="text-[14px]">›</span>
                    </button>
                </div>
            )}

            {!showPreview && isJournalEmpty ? (
                // STATE 1: Zero real trades, no preview → empty state
                <div className="animate-in fade-in duration-300">
                    <div className="flex flex-col items-center justify-center py-16 bg-[#151515] border border-[#202126] rounded-xl mb-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-[#8B5CF6]/5 to-transparent pointer-events-none" />
                        <div className="w-16 h-16 bg-[#0D0D0F] border border-[#202126] rounded-2xl mb-6 shadow-xl flex items-center justify-center relative z-10">
                            <FolderOpen className="text-[#8B5CF6] w-7 h-7" />
                        </div>
                        <h2 className="text-xl font-bold text-[#F3F3F5] mb-2 relative z-10">Your Trading Journal is Ready</h2>
                        <p className="text-[#6F7078] text-[13px] text-center max-w-md mx-auto mb-8 relative z-10">
                            Your trade history will appear here once you start recording your trades.
                            Upload TradingView screenshots or record executions directly into your visual archive.
                        </p>

                        <div className="flex items-center gap-4 relative z-10">
                            <button className="bg-[#8B5CF6] text-white px-5 py-2 rounded-lg text-[12px] font-bold tracking-wide hover:bg-[#7C6CF2] transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                                + Add First Trade
                            </button>
                            <button
                                onClick={() => setIsPreview(true)}
                                className="bg-[#151515] border border-[#292929] text-[#F3F3F5] px-5 py-2 rounded-lg text-[12px] font-bold hover:bg-[#1A1A1E] transition-colors"
                            >
                                Explore Journal Preview
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-5 bg-[#151515] border border-[#202126] rounded-xl flex items-center gap-4 transition-colors hover:border-[#292929]">
                            <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center border border-[#8B5CF6]/20">
                                <Zap className="w-5 h-5 text-[#8B5CF6]" />
                            </div>
                            <div>
                                <h3 className="text-[13px] font-bold text-[#F3F3F5]">1-Click OCR Screenshot Ingestion</h3>
                            </div>
                        </div>
                        <div className="p-5 bg-[#151515] border border-[#202126] rounded-xl flex items-center gap-4 transition-colors hover:border-[#292929]">
                            <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center border border-[#8B5CF6]/20">
                                <PieChart className="w-5 h-5 text-[#8B5CF6]" />
                            </div>
                            <div>
                                <h3 className="text-[13px] font-bold text-[#F3F3F5]">Automated R:R & Session Metrics</h3>
                            </div>
                        </div>
                        <div className="p-5 bg-[#151515] border border-[#202126] rounded-xl flex items-center gap-4 transition-colors hover:border-[#292929]">
                            <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center border border-[#8B5CF6]/20">
                                <BrainCircuit className="w-5 h-5 text-[#8B5CF6]" />
                            </div>
                            <div>
                                <h3 className="text-[13px] font-bold text-[#F3F3F5]">Lens AI Psychological Tagging</h3>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // STATE 2: Journal Trades (Preview or Real)
                <div className="animate-in fade-in duration-300">
                    <div className="mb-8">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                            <h2 className="text-[14px] font-bold text-[#F3F3F5] uppercase tracking-wider flex items-center gap-3">
                                {showPreview ? 'JUNE 2024' : 'CURRENT MONTH'}
                                {showPreview && <span className="text-[10px] text-[#6F7078] font-bold tracking-widest leading-none">M-06 RECORD</span>}
                            </h2>
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] bg-[#151515] border border-[#202126] px-3 py-1.5 rounded-lg max-w-full">
                                <span className="text-[#6F7078]"><span className="text-[#F3F3F5] font-semibold">{showPreview ? '12' : displayTrades.length}</span> Trades</span>
                                <span className="w-1 h-1 rounded-full bg-[#202126]" />
                                <span className="text-[#6F7078]">Net P&L: <span className={`font-bold ${showPreview ? 'text-green-500' : 'text-[#F3F3F5]'}`}>{showPreview ? '+$1,842.00' : '+$0.00'}</span></span>
                                <span className="w-1 h-1 rounded-full bg-[#202126]" />
                                <span className="text-[#6F7078]">WR: <span className="text-[#F3F3F5] font-bold">{showPreview ? '58.3%' : '0%'}</span></span>
                                <span className="w-1 h-1 rounded-full bg-[#202126]" />
                                <span className="text-[#6F7078]">Avg R:R: <span className="text-[#F3F3F5] font-bold">{showPreview ? '2.15' : '0'}</span></span>
                            </div>
                        </div>

                        {viewMode === 'gallery' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {displayTrades.map((trade: any, idx: number) => {
                                    const isWin = trade.outcome === 'WIN';
                                    return (
                                        <div
                                            key={trade.id || idx}
                                            className="bg-[#171717] border border-[#202126] rounded-xl overflow-hidden flex flex-col hover:border-[#292929] transition-colors cursor-pointer group"
                                            onClick={() => setSelectedTrade(trade)}
                                        >
                                            <div className="relative w-full h-[160px] bg-[#0A0A10] border-b border-[#202126] overflow-hidden">
                                                {/* Chart screenshot — SVG illustration for preview, real image for live trades */}
                                                {trade.image ? (
                                                    <img
                                                        src={trade.image}
                                                        alt={`${trade.asset} chart — ${trade.title}`}
                                                        className="absolute inset-0 w-full h-full object-cover"
                                                        onError={(e) => {
                                                            // Graceful fallback: hide broken image, show gradient backdrop
                                                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                                                        }}
                                                        draggable={false}
                                                    />
                                                ) : (
                                                    // Fallback gradient for real trades without a screenshot yet
                                                    <div className="absolute inset-0 bg-gradient-to-br from-[#111118] to-[#0A0A10]" />
                                                )}
                                                {/* Overlay for metadata legibility */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A10]/70 via-transparent to-transparent pointer-events-none" />
                                                <div className="absolute top-3 left-3 flex flex-col">
                                                    <span className="text-[11px] font-bold text-white/90 tracking-wide drop-shadow-md">{trade.title}</span>
                                                </div>
                                                <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                                                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border border-transparent ${isWin ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                                        {trade.outcome} {isWin && trade.rr ? `+${trade.rr}` : trade.rr}
                                                    </span>
                                                </div>

                                                <div className="absolute bottom-3 left-3">
                                                    <span className="px-1.5 py-0.5 rounded-[4px] bg-[#09090C]/80 text-[9px] text-[#6F7078] font-mono flex items-center gap-1.5 backdrop-blur border border-white/5 font-semibold">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                        OCR {trade.ocr}%
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-3.5 flex flex-col gap-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[14px] font-bold text-[#F3F3F5] tracking-tight">{trade.asset}</span>
                                                        <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-[4px] ${trade.direction === 'LONG' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                                            {trade.direction}
                                                        </span>
                                                    </div>
                                                    <span className={`text-[13px] font-bold ${isWin ? 'text-emerald-500' : 'text-red-500'}`}>
                                                        {isWin ? '+' : '-'}${Math.abs(trade.pnl).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-[11px] text-[#6F7078] font-medium leading-loose">
                                                    <div className="flex flex-col">
                                                        <span className="flex gap-1.5"><span>{trade.date}</span><span>•</span><span>{trade.session}</span></span>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className="flex gap-1.5"><span>{trade.rr}</span><span>•</span><span>{trade.duration}</span></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-sm text-[#6F7078] border border-[#202126] rounded-xl bg-[#151515]">
                                Table View mode active. (Reusing existing table component context...)
                            </div>
                        )}
                    </div>
                    {showPreview && (
                        <div className="mb-8 pt-4">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-t border-[#202126] pt-8">
                                <h2 className="text-[14px] font-bold text-[#F3F3F5] uppercase tracking-wider flex items-center gap-3">
                                    MAY 2024
                                    <span className="text-[10px] text-[#6F7078] font-bold tracking-widest leading-none">M-05 RECORD</span>
                                </h2>
                                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] bg-[#151515] border border-[#202126] px-3 py-1.5 rounded-lg opacity-80 max-w-full">
                                    <span className="text-[#6F7078]"><span className="text-[#F3F3F5] font-semibold">23</span> Trades</span>
                                    <span className="w-1 h-1 rounded-full bg-[#202126]" />
                                    <span className="text-[#6F7078]">Net P&L: <span className="font-bold text-green-500">+$3,421.00</span></span>
                                    <span className="w-1 h-1 rounded-full bg-[#202126]" />
                                    <span className="text-[#6F7078]">WR: <span className="text-[#F3F3F5] font-bold">65.2%</span></span>
                                    <span className="w-1 h-1 rounded-full bg-[#202126]" />
                                    <span className="text-[#6F7078]">Avg R:R: <span className="text-[#F3F3F5] font-bold">2.40</span></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* If a real trade is clicked from table mode (left as placeholder for existing table integration if needed) */}
            {selectedTrade && !showPreview && (
                <TradeDetailView
                    trade={selectedTrade}
                    onClose={() => setSelectedTrade(null)}
                    onUpdateTrade={() => { }}
                    onDeleteTrade={() => { }}
                />
            )}
        </div>
    );
}
