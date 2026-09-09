import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { createServer as createViteServer } from 'vite';
import express from 'express';
import { env } from './server/config/env';
import { createApp } from './server/app';
import { errorHandler } from './server/middleware/errorHandler';
// Ignore type checking errors for Vite because Vite's own middleware typing can be complex
// and we just pass it through neutrally.

async function bootstrap() {
  const app = createApp();

  // Vite integration middleware (only in non-production)
  if (env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    // Use Vite middlewares to handle frontend serving and HMR
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Attach global error handler after all routes and Vite middlewares
  app.use(errorHandler);

  const server = app.listen(env.PORT, '0.0.0.0', () => {
    console.log(`[Tradelense Server] Foundation API running on port ${env.PORT}`);
  });

  // Graceful shutdown foundation
  const shutdown = () => {
    console.log('[Tradelense Server] Shutting down gracefully...');
    server.close(() => {
      console.log('[Tradelense Server] Closed remaining connections.');
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      console.error('[Tradelense Server] Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

bootstrap().catch((err) => {
  console.error('[Tradelense Server] Bootstrap Failed:', err);
  process.exit(1);
});
