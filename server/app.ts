import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env';
import { healthRouter } from './routes/health';
import testAuthRouter from './routes/test-auth';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

export function createApp(): Express {
    const app = express();

    // Basic middleware foundation

    // Security headers
    app.use(helmet({
        contentSecurityPolicy: false, // Omitted temporarily as Vite handles dev SPA CSP differently
    }));

    // Secure CORS configuration
    const allowedOrigins = env.NODE_ENV === 'production'
        ? [env.VITE_APP_URL || 'https://tradelense.app']
        : ['http://localhost:5173', 'http://localhost:3000'];

    app.use(cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    }));

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
