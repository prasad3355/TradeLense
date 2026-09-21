/**
 * Trade Domain Calculations
 * Enforces pure deterministic derivations for P&L, Risk/Reward, and Outcomes locally
 * decoupled from the Database or API transport layer.
 */

// Note: For advanced asset classes with contract multipliers (e.g., standard Options equating to 100 shares), 
// this formula is naively linear. V1 Tradelense calculates raw delta * size cleanly.
export function calculateRealizedPnL(
    side: 'LONG' | 'SHORT',
    entryPrice: number,
    exitPrice: number,
    positionSize: number,
    fees: number = 0
): number {
    let rawPnl = 0;
    if (side === 'LONG') {
        rawPnl = (exitPrice - entryPrice) * positionSize;
    } else if (side === 'SHORT') {
        rawPnl = (entryPrice - exitPrice) * positionSize;
    }

    // JS floats are dangerous. We round to 4 decimal places for generic safe DB storage.
    // In future iterations, a decimal.js dependency should govern this logic securely.
    return Number((rawPnl - fees).toFixed(4));
}

/**
 * Calculates Risk (absolute raw amount).
 */
export function calculateRisk(
    side: 'LONG' | 'SHORT',
    entryPrice: number,
    stopLoss: number
): number | null {
    if (side === 'LONG') {
        return Math.max(0, entryPrice - stopLoss);
    } else {
        return Math.max(0, stopLoss - entryPrice);
    }
}

/**
 * Calculates Reward (absolute raw amount).
 */
export function calculateReward(
    side: 'LONG' | 'SHORT',
    entryPrice: number,
    takeProfit: number
): number | null {
    if (side === 'LONG') {
        return Math.max(0, takeProfit - entryPrice);
    } else {
        return Math.max(0, entryPrice - takeProfit);
    }
}

/**
 * Determines outcome strictly via deterministic PNL logic.
 */
export function determineOutcome(
    pnlRealized: number | null,
    isOpen: boolean
): 'WIN' | 'LOSS' | 'BREAK_EVEN' | 'OPEN' {
    if (isOpen || pnlRealized === null) {
        return 'OPEN';
    }

    // JS epsilon safe zero check
    if (Math.abs(pnlRealized) < 0.000001) {
        return 'BREAK_EVEN';
    }

    return pnlRealized > 0 ? 'WIN' : 'LOSS';
}
