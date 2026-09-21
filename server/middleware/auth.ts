import { Request, Response, NextFunction } from 'express';
import { getSupabaseAdmin } from '../db/client';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        [key: string]: any;
    };
}

/**
 * Express Middleware to verify Supabase JWT
 * Extracts the user from the Authorization header access token.
 */
export const requireAuth = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Missing or invalid Authorization header.' });
            return;
        }

        const token = authHeader.split(' ')[1];

        // Verify token using the backend service client
        // .getUser(token) ensures the token is valid, not expired, and securely parses the user.
        const supabase = getSupabaseAdmin();
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            res.status(401).json({ error: 'Unauthorized: Invalid session token.' });
            return;
        }

        // Attach authenticated user identity to the request
        req.user = user;

        next();
    } catch (err) {
        console.error('Auth verification failed:', err);
        res.status(500).json({ error: 'Internal server error during authentication.' });
    }
};
