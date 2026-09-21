import { z } from 'zod';

export const SideEnum = z.enum(['LONG', 'SHORT']);
export const OutcomeEnum = z.enum(['WIN', 'LOSS', 'BREAK_EVEN', 'OPEN']);

// Core base schema fields for reusability
const TradeBaseSchema = z.object({
    symbol: z.string().min(1).max(20).toUpperCase(),
    asset_class: z.string().max(50).nullable().optional(),
    side: SideEnum.nullable().optional(),
    setup_type: z.string().max(100).nullable().optional(),

    // ISO 8601 UTC
    entry_timestamp: z.string().datetime(),
    exit_timestamp: z.string().datetime().nullable().optional(),

    // Strict numeric business constraints (Prices > 0, Size > 0, Fees >= 0)
    entry_price: z.number().positive().nullable().optional(),
    exit_price: z.number().positive().nullable().optional(),
    stop_loss: z.number().positive().nullable().optional(),
    take_profit: z.number().positive().nullable().optional(),
    position_size: z.number().positive().nullable().optional(),
    fees: z.number().nonnegative().default(0),
    currency: z.string().max(10).default('USD'),

    notes: z.string().max(5000).nullable().optional(),
    mistakes: z.string().max(5000).nullable().optional(),
});

/**
 * CLIENT SUPPLIED: Create Trade Payload
 * The client MUST NOT supply server-controlled fields like pnl_realized, user_id, 
 * entry_source, or outcome. Unknown fields are stripped/rejected via .strict().
 */
export const CreateTradeInput = TradeBaseSchema.strict();

/**
 * CLIENT SUPPLIED: Update Trade Payload
 * All editable fields become natively optional. Immutable fields (entry_source, user_id) 
 * remain absolutely forbidden in the payload boundary.
 */
export const UpdateTradeInput = TradeBaseSchema.partial().strict();

// Infer types
export type CreateTradePayload = z.infer<typeof CreateTradeInput>;
export type UpdateTradePayload = z.infer<typeof UpdateTradeInput>;
