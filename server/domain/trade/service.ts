import { CreateTradeInput, UpdateTradeInput, GetTradesQueryInput } from './schema';
import { validateTradeGeometry } from './rules';
import { calculateRealizedPnL, determineOutcome } from './calculations';
import { TradeDomainErrors, DomainError } from './errors';
import { TradeRepository } from './repository';

export const TradeService = {
    async getTrades(userId: string, query: unknown) {
        const parsed = GetTradesQueryInput.safeParse(query);
        if (!parsed.success) {
            throw new DomainError(TradeDomainErrors.INVALID_TRADE, parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', '));
        }

        const options = parsed.data;
        const result = await TradeRepository.findAllByOwner(userId, options);

        const totalPages = Math.ceil(result.total / options.pageSize);

        return {
            data: result.data,
            pagination: {
                page: options.page,
                pageSize: options.pageSize,
                total: result.total,
                totalPages,
                hasNextPage: options.page < totalPages,
                hasPreviousPage: options.page > 1
            }
        };
    },

    async createTrade(userId: string, payload: unknown) {
        // 1. Strict input validation
        const parsed = CreateTradeInput.safeParse(payload);
        if (!parsed.success) {
            throw new DomainError(TradeDomainErrors.INVALID_TRADE, parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', '));
        }

        const data = parsed.data;

        // 2. Validate logical geometry
        validateTradeGeometry({
            entry_timestamp: data.entry_timestamp,
            exit_timestamp: data.exit_timestamp,
            entry_price: data.entry_price,
            exit_price: data.exit_price,
            position_size: data.position_size,
            side: data.side,
            stop_loss: data.stop_loss,
            take_profit: data.take_profit
        });

        // 3. Deterministic calculation
        let pnl_realized = null;
        if (data.side && data.entry_price != null && data.exit_price != null && data.position_size != null) {
            pnl_realized = calculateRealizedPnL(
                data.side,
                data.entry_price,
                data.exit_price,
                data.position_size,
                data.fees || 0
            );
        }

        const isOpen = !data.exit_timestamp;
        const outcome = determineOutcome(pnl_realized, isOpen);

        // 4. Persistence formatting (explicitly mapping server-controlled fields)
        const tradeData = {
            ...data,
            user_id: userId,
            entry_source: 'MANUAL', // explicitly overridden per security contract
            pnl_realized,
            outcome,
        };

        return await TradeRepository.create(tradeData);
    },

    async getTrade(id: string, userId: string) {
        const trade = await TradeRepository.findByIdAndOwner(id, userId);
        if (!trade) {
            throw new DomainError(TradeDomainErrors.OWNERSHIP_ERROR, 'Trade not found or access denied.');
        }
        return trade;
    },

    async updateTrade(id: string, userId: string, payload: unknown) {
        // 1. Establish ownership explicitly
        const existing = await TradeRepository.findByIdAndOwner(id, userId);
        if (!existing) {
            throw new DomainError(TradeDomainErrors.OWNERSHIP_ERROR, 'Trade not found or access denied.');
        }

        // 2. Validate incoming updates
        const parsed = UpdateTradeInput.safeParse(payload);
        if (!parsed.success) {
            throw new DomainError(TradeDomainErrors.INVALID_TRADE, parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', '));
        }

        const updates = parsed.data;

        // 3. Contextual evaluation (merging updates onto existing state for mathematical rules)
        const mergedState = { ...existing, ...updates };

        validateTradeGeometry({
            entry_timestamp: mergedState.entry_timestamp,
            exit_timestamp: mergedState.exit_timestamp,
            entry_price: mergedState.entry_price,
            exit_price: mergedState.exit_price,
            position_size: mergedState.position_size,
            side: mergedState.side,
            stop_loss: mergedState.stop_loss,
            take_profit: mergedState.take_profit
        });

        // 4. Deterministic Recalculation
        let pnl_realized = null;
        if (mergedState.side && mergedState.entry_price != null && mergedState.exit_price != null && mergedState.position_size != null) {
            pnl_realized = calculateRealizedPnL(
                mergedState.side,
                mergedState.entry_price,
                mergedState.exit_price,
                mergedState.position_size,
                mergedState.fees || 0
            );
        }

        const isOpen = !mergedState.exit_timestamp;
        const outcome = determineOutcome(pnl_realized, isOpen);

        // 5. Payload finalization
        const finalUpdateData = {
            ...updates,
            pnl_realized,
            outcome
        };

        return await TradeRepository.update(id, userId, finalUpdateData);
    },

    async deleteTrade(id: string, userId: string): Promise<boolean> {
        const deleted = await TradeRepository.delete(id, userId);
        if (!deleted) {
            throw new DomainError(TradeDomainErrors.OWNERSHIP_ERROR, 'Trade not found or access denied.');
        }
        return true;
    }
};
