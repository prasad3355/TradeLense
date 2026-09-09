import { Router, Request, Response } from 'express';

export const healthRouter = Router();

healthRouter.get('/health', (req: Request, res: Response) => {
    // A minimal health endpoint that indicates the backend process is running.
    // Note: External dependencies (DB, AI) are not tested yet.
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
    });
});
