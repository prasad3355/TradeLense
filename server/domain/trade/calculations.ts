import { Decimal } from 'decimal.js';

/**
 * Trade Domain Calculations
 * Enforces pure deterministic derivations for P&L, Risk/Reward, and Outcomes locally.
 * Utilizes `decimal.js` to eliminate IEEE 754 floating-point inaccuracies natively matching 
 * PostgreSQL NUMERIC exactness.
 */

// Supported Application Precision Limit (e.g. up to 8 decimal places supports most equities, crypto)
const CALCULATION_PRECISION = 8;

// Configure default precision/rounding
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

export function calculateRealizedPnL(
    side: 'LONG' | 'SHORT',
    entryPrice: number,
    exitPrice: number,
    positionSize: number,
    fees: number = 0
): number {
    const entry = new Decimal(entryPrice);
    const exit = new Decimal(exitPrice);
    const size = new Decimal(positionSize);
    const f = new Decimal(fees);

    let rawPnl: Decimal;

    if (side === 'LONG') {
        rawPnl = exit.minus(entry).times(size);
    } else {
        // SHORT
        rawPnl = entry.minus(exit).times(size);
    }

    const finalPnl = rawPnl.minus(f);

    // Bounds to standard precision and passes as an exact Javascript primitive number
    return finalPnl.toDecimalPlaces(CALCULATION_PRECISION).toNumber();
}

/**
 * Calculates Risk (absolute raw amount).
 */
export function calculateRisk(
    side: 'LONG' | 'SHORT',
    entryPrice: number,
    stopLoss: number
): number | null {
    const entry = new Decimal(entryPrice);
    const sl = new Decimal(stopLoss);

    let rawRisk: Decimal;
    if (side === 'LONG') {
        rawRisk = Decimal.max(0, entry.minus(sl));
    } else {
        rawRisk = Decimal.max(0, sl.minus(entry));
    }

    return rawRisk.toDecimalPlaces(CALCULATION_PRECISION).toNumber();
}

/**
 * Calculates Reward (absolute raw amount).
 */
export function calculateReward(
    side: 'LONG' | 'SHORT',
    entryPrice: number,
    takeProfit: number
): number | null {
    const entry = new Decimal(entryPrice);
    const tp = new Decimal(takeProfit);

    let rawReward: Decimal;
    if (side === 'LONG') {
        rawReward = Decimal.max(0, tp.minus(entry));
    } else {
        rawReward = Decimal.max(0, entry.minus(tp));
    }

    return rawReward.toDecimalPlaces(CALCULATION_PRECISION).toNumber();
}

/**
 * Determines outcome strictly via deterministic PNL logic evaluated precisely.
 */
export function determineOutcome(
    pnlRealized: number | null,
    isOpen: boolean
): 'WIN' | 'LOSS' | 'BREAK_EVEN' | 'OPEN' {
    if (isOpen || pnlRealized === null) {
        return 'OPEN';
    }

    const pnl = new Decimal(pnlRealized);

    if (pnl.isZero()) {
        return 'BREAK_EVEN';
    }

    return pnl.isPositive() ? 'WIN' : 'LOSS';
}
