// Trade Domain Error Contracts

export const TradeDomainErrors = {
    INVALID_TRADE: 'INVALID_TRADE',
    INVALID_PRICE: 'INVALID_PRICE',
    INVALID_POSITION_SIZE: 'INVALID_POSITION_SIZE',
    INVALID_TIMESTAMPS: 'INVALID_TIMESTAMPS',
    INVALID_TRADE_GEOMETRY: 'INVALID_TRADE_GEOMETRY',
    INCOMPLETE_CLOSED_TRADE: 'INCOMPLETE_CLOSED_TRADE',
    INVALID_OUTCOME: 'INVALID_OUTCOME',
    FORBIDDEN_FIELD: 'FORBIDDEN_FIELD',
    OWNERSHIP_ERROR: 'OWNERSHIP_ERROR'
} as const;

export type TradeDomainError = typeof TradeDomainErrors[keyof typeof TradeDomainErrors];

export class DomainError extends Error {
    public readonly code: TradeDomainError;

    constructor(code: TradeDomainError, message: string) {
        super(message);
        this.code = code;
        this.name = 'DomainError';
    }
}
