import { Request, Response, NextFunction } from 'express';

/**
 * Centralized error handler.
 * Ensures consistent JSON responses and prevents stack trace leakage.
 */
export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error(`[Error] ${req.method} ${req.path} -`, err.message || err);

    const statusCode = err.status || err.statusCode || 500;

    res.status(statusCode).json({
        error: {
            message: err.isOperational ? err.message : 'Internal Server Error',
            status: statusCode,
        },
    });
}

/**
 * 404 Not Found Handler
 */
export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
    res.status(404).json({
        error: {
            message: 'Not found',
            status: 404,
        },
    });
}
