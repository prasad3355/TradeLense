import express, { Express } from 'express';
import { healthRouter } from './routes/health';
import testAuthRouter from './routes/test-auth';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

export function createApp(): Express {
    const app = express();

    // Basic middleware foundation

    // Configure JSON request parsing with a reasonable payload limit (e.g., 2mb)
    // Large binary uploads (like screenshots) will have separate handling in the future.
    app.use(express.json({ limit: '2mb' }));

    // API routes
    // Expose foundational /health directly at root, while preserving /api/health alias
    app.use('/', healthRouter);
    app.use('/api', healthRouter);

    // Mount test auth endpoints (demonstrates Auth/AuthZ/Validation stack)
    app.use('/api/v2/test-auth', testAuthRouter);

    // Catch-all 404 for API routes
    app.use('/api/*', notFoundHandler);

    // Note: the master error handler is attached in server.ts
    // after the Vite middleware, so that it catches API errors gracefully.

    return app;
}
