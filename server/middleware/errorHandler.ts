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
    if (process.env.NODE_ENV !== 'test') {
        console.error(`[Error] ${req.method} ${req.path} -`, err.message || err);
    }

    const statusCode = err.status || err.statusCode || 500;

    // Map HTTP Status to canonical Error Code
    const codeMap: Record<number, string> = {
        400: 'VALIDATION_ERROR',
        401: 'UNAUTHENTICATED',
        403: 'FORBIDDEN',
        404: 'NOT_FOUND',
        409: 'CONFLICT',
        429: 'RATE_LIMITED',
        500: 'INTERNAL_ERROR'
    };

    const code = err.code || codeMap[statusCode] || 'INTERNAL_ERROR';

    // Prevent leaking internal errors
    const message = (err.isOperational || statusCode < 500)
        ? err.message
        : 'An unexpected internal error occurred.';

    res.status(statusCode).json({
        error: {
            code,
            message,
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
