import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';

/**
 * A strict generic type enforcing that a request is authenticated.
 */
export interface SecureAuthRequest extends AuthenticatedRequest {
    user: {
        id: string;
        [key: string]: any;
    };
}

/**
 * Ensures the authenticated user owns the resource they are attempting to access.
 * Returns 403 if the user is not the owner.
 *
 * @param resourceOwnerId The user ID attached to the resource being accessed.
 * @param req The authenticated request.
 * @param res The response.
 * @returns true if authorized, false otherwise (which handles sending the 403 response).
 */
export function requireOwnership(
    resourceOwnerId: string,
    req: SecureAuthRequest,
    res: Response
): boolean {
    if (!req.user || !req.user.id) {
        // Fallback for unexpected missing user in a protected route
        res.status(401).json({ error: 'Unauthenticated.' });
        return false;
    }

    if (resourceOwnerId !== req.user.id) {
        // Return a consistent 403 FORBIDDEN.
        // We use 403 uniformly here, though 404 could be used in DB fetch functions 
        // to prevent enumerating resources that don't belong to the user.
        res.status(403).json({
            error: {
                code: 'FORBIDDEN',
                message: 'You do not have permission to access this resource.'
            }
        });
        return false;
    }

    return true;
}

/**
 * Utility wrapper to enforce execution only if the user is explicitly authenticated.
 * This can be used to type-cast AuthenticatedRequest -> SecureAuthRequest inside handlers safely.
 */
export function ensureAuthenticated(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): req is SecureAuthRequest {
    if (!req.user || !req.user.id) {
        res.status(401).json({ error: 'Unauthenticated.' });
        return false;
    }
    return true;
}
