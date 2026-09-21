import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export interface ValidationSchema {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
}

/**
 * Validates request payload, query, and path parameters against Zod schemas.
 * Rejects invalid requests with a consistent 400 VALIDATION_ERROR response.
 */
export const validateRequest = (schema: ValidationSchema) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (schema.body) {
                req.body = await schema.body.parseAsync(req.body);
            }
            if (schema.query) {
                req.query = (await schema.query.parseAsync(req.query)) as any;
            }
            if (schema.params) {
                req.params = (await schema.params.parseAsync(req.params)) as any;
            }
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Invalid request.',
                        details: error.issues.map(err => ({
                            path: err.path.join('.'),
                            message: err.message
                        }))
                    }
                });
                return;
            }
            next(error);
        }
    };
};
