import { Router, Response, NextFunction } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { TradeService } from '../domain/trade/service';
import { DomainError, TradeDomainErrors } from '../domain/trade/errors';

export const tradesRouter = Router();

// Secure all endpoints with strictly enforced JWT authentication
tradesRouter.use(requireAuth as any);

tradesRouter.get('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const result = await TradeService.getTrades(userId, req.query);
        res.status(200).json(result);
    } catch (error) {
        next(mapDomainError(error));
    }
});

tradesRouter.post('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const trade = await TradeService.createTrade(userId, req.body);
        res.status(201).json(trade);
    } catch (error) {
        next(mapDomainError(error));
    }
});

tradesRouter.get('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const trade = await TradeService.getTrade(req.params.id, userId);
        res.status(200).json(trade);
    } catch (error) {
        next(mapDomainError(error));
    }
});

tradesRouter.patch('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        const trade = await TradeService.updateTrade(req.params.id, userId, req.body);
        res.status(200).json(trade);
    } catch (error) {
        next(mapDomainError(error));
    }
});

tradesRouter.delete('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;
        await TradeService.deleteTrade(req.params.id, userId);
        res.status(204).send();
    } catch (error) {
        next(mapDomainError(error));
    }
});

/**
 * Maps deterministic domain errors into appropriate architectural HTTP errors
 */
function mapDomainError(err: any): any {
    if (err instanceof DomainError) {
        let statusCode = 400; // Validation, state, logical math collisions

        if (err.code === TradeDomainErrors.OWNERSHIP_ERROR) {
            statusCode = 404; // Obfuscate existence for unauthorized query probes
        }

        return {
            status: statusCode,
            code: err.code,
            message: err.message,
            isOperational: true
        };
    }
    return err;
}
