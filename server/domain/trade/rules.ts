import { DomainError, TradeDomainErrors } from './errors';

export interface TradeStateValidationOptions {
    entry_timestamp: string;
    exit_timestamp?: string | null;
    entry_price?: number | null;
    exit_price?: number | null;
    position_size?: number | null;
    side?: 'LONG' | 'SHORT' | null;
    stop_loss?: number | null;
    take_profit?: number | null;
}

/**
 * Validates fundamental geometry separating impossible math states.
 */
export function validateTradeGeometry(trade: TradeStateValidationOptions): void {
    // 1. Chronology Constraint
    if (trade.exit_timestamp) {
        const entryTime = new Date(trade.entry_timestamp).getTime();
        const exitTime = new Date(trade.exit_timestamp).getTime();

        if (exitTime < entryTime) {
            throw new DomainError(
                TradeDomainErrors.INVALID_TIMESTAMPS,
                'Exit timestamp cannot precede the entry timestamp.'
            );
        }
    }

    // 2. Geometry Constraints
    // Note: The product permits exceptions if fields are explicitly null, but where provided, 
    // we require baseline logical positioning.
    if (trade.side && trade.entry_price) {
        const { side, entry_price, stop_loss, take_profit } = trade;

        if (side === 'LONG') {
            if (stop_loss && stop_loss >= entry_price) {
                throw new DomainError(
                    TradeDomainErrors.INVALID_TRADE_GEOMETRY,
                    'For a LONG trade, Stop Loss must logically be below Entry Price.'
                );
            }
            if (take_profit && take_profit <= entry_price) {
                throw new DomainError(
                    TradeDomainErrors.INVALID_TRADE_GEOMETRY,
                    'For a LONG trade, Take Profit must logically be above Entry Price.'
                );
            }
        }
        else if (side === 'SHORT') {
            if (stop_loss && stop_loss <= entry_price) {
                throw new DomainError(
                    TradeDomainErrors.INVALID_TRADE_GEOMETRY,
                    'For a SHORT trade, Stop Loss must logically be above Entry Price.'
                );
            }
            if (take_profit && take_profit >= entry_price) {
                throw new DomainError(
                    TradeDomainErrors.INVALID_TRADE_GEOMETRY,
                    'For a SHORT trade, Take Profit must logically be below Entry Price.'
                );
            }
        }
    }

    // 3. Close State Rules
    // Attempting to close a trade requires valid fields to guarantee analytical integrity.
    const hasExitTime = Boolean(trade.exit_timestamp);
    const hasExitPrice = typeof trade.exit_price === 'number';
    const hasEntryPrice = typeof trade.entry_price === 'number';
    const hasSize = typeof trade.position_size === 'number';

    if (hasExitTime) {
        if (!hasExitPrice || !hasEntryPrice || !hasSize || !trade.side) {
            throw new DomainError(
                TradeDomainErrors.INCOMPLETE_CLOSED_TRADE,
                'A closed trade requires an exit price, entry price, position size, and side to deterministically calculate P&L.'
            );
        }
    }
}
