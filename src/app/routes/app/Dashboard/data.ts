export const dummyData = {
    tradeCount: 35,
    netPl: 7183.75,
    profitFactor: 2.17,
    winRate: 42.42,
    wins: 14,
    breakeven: 2,
    losses: 19,
    avgWin: 951,
    avgLoss: 322,
    avgWinLossRatio: 2.95,
    monthlyStats: 5130,
    activeDays: 13,
    lenseScore: 82.61,

    recentTrades: [
        { asset: 'XAUUSD', side: 'LONG', entry: '2,345.20', exit: '2,356.80', netPl: 420.00, rr: '2.4R', status: 'WIN' },
        { asset: 'EURUSD', side: 'SHORT', entry: '1.08420', exit: '1.08120', netPl: -180.00, rr: '-1.0R', status: 'LOSS' },
        { asset: 'NAS100', side: 'LONG', entry: '18,420.0', exit: '18,615.0', netPl: 635.00, rr: '3.1R', status: 'WIN' },
        { asset: 'US30', side: 'SHORT', entry: '39,120.0', exit: '39,010.0', netPl: 310.00, rr: '1.8R', status: 'WIN' },
        { asset: 'BTCUSD', side: 'LONG', entry: '64,250.0', exit: '64,050.0', netPl: -150.00, rr: '-0.8R', status: 'LOSS' }
    ]
};

export const emptyData = {
    tradeCount: 0,
    netPl: 0,
    profitFactor: 0,
    winRate: 0,
    wins: 0,
    breakeven: 0,
    losses: 0,
    avgWin: 0,
    avgLoss: 0,
    avgWinLossRatio: 0,
    monthlyStats: 0,
    activeDays: 0,
    lenseScore: 0,
    recentTrades: []
};
