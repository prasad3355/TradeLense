import { Router, Response } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { validateRequest } from '../validation/validate';
import { ensureAuthenticated, requireOwnership } from '../auth/authorize';
import { AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Test validation schema
const updateProfileSchema = z.object({
    displayName: z.string().min(2).max(50).optional(),
    theme: z.enum(['dark', 'system']).optional()
});

/**
 * GET /api/v2/test-auth/me
 * Demonstrates basic authenticated context retrieval.
 */
router.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    // We use ensureAuthenticated to type-guard (narrow) req to SecureAuthRequest
    if (!ensureAuthenticated(req, res, () => { })) return;

    res.json({
        message: 'You are authenticated.',
        userId: req.user.id,
        userContext: req.user
    });
});

/**
 * PATCH /api/v2/test-auth/me
 * Demonstrates validation composition.
 */
router.patch('/me',
    requireAuth,
    validateRequest({ body: updateProfileSchema }),
    (req: AuthenticatedRequest, res: Response) => {

        if (!ensureAuthenticated(req, res, () => { })) return;

        res.json({
            message: 'Valid patch to own profile.',
            updates: req.body
        });
    });

/**
 * GET /api/v2/test-auth/resource/:resourceUserId
 * Demonstrates ownership validation pattern (e.g., trying to access someone else's resource).
 */
router.get('/resource/:resourceUserId', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    if (!ensureAuthenticated(req, res, () => { })) return;

    const { resourceUserId } = req.params;

    // Reject if the requested resource string does not exactly match the caller's JWT ID
    if (!requireOwnership(resourceUserId, req, res)) return;

    res.json({
        message: 'You securely accessed your own resource.',
        resourceOwnerId: resourceUserId
    });
});

export default router;
