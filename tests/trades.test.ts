import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../server/app';
import { errorHandler } from '../server/middleware/errorHandler';
import { TradeRepository } from '../server/domain/trade/repository';

// Mock the auth middleware completely
vi.mock('../server/middleware/auth', () => {
    return {
        requireAuth: (req: any, res: any, next: any) => {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'Missing or invalid Authorization header.' });
            }
            const token = authHeader.split(' ')[1];
            if (token === 'valid_token_user_A') {
                req.user = { id: 'user_A' };
                next();
            } else if (token === 'valid_token_user_B') {
                req.user = { id: 'user_B' };
                next();
            } else {
                return res.status(401).json({ error: 'Unauthorized: Invalid session token.' });
            }
        }
    };
});

// Mock the trade repository
vi.mock('../server/domain/trade/repository', () => {
    return {
        TradeRepository: {
            create: vi.fn(),
            findByIdAndOwner: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            findAllByOwner: vi.fn(),
        }
    };
});

const app = createApp();
app.use(errorHandler);

describe('Trade API Lifecycle', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('POST /api/trades', () => {
        it('should fail if unauthenticated', async () => {
            const response = await request(app)
                .post('/api/trades')
                .send({ symbol: 'BTC_USD', side: 'LONG', entry_price: 50000, entry_timestamp: new Date().toISOString() });
            expect(response.status).toBe(401);
        });

        it('should fail with invalid payload', async () => {
            const response = await request(app)
                .post('/api/trades')
                .set('Authorization', 'Bearer valid_token_user_A')
                .send({ symbol: 'BTC_USD' }); // Missing required fields
            expect(response.status).toBe(400);
        });

        it('should succeed, derive user_id, and calculate pnl for a LONG trade', async () => {
            const payload = {
                symbol: 'BTC_USD',
                side: 'LONG',
                entry_price: 50000,
                exit_price: 51000,
                position_size: 1,
                entry_timestamp: new Date().toISOString(),
                exit_timestamp: new Date().toISOString()
            };

            vi.mocked(TradeRepository.create).mockResolvedValueOnce({
                id: '123',
                ...payload,
                user_id: 'user_A',
                pnl_realized: 1000,
                outcome: 'WIN'
            });

            const response = await request(app)
                .post('/api/trades')
                .set('Authorization', 'Bearer valid_token_user_A')
                .send(payload);

            expect(response.status).toBe(201);
            expect(response.body.user_id).toBe('user_A');
            expect(response.body.pnl_realized).toBe(1000);
            expect(response.body.outcome).toBe('WIN');

            // Verify repository was called correctly
            expect(TradeRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                user_id: 'user_A',
                pnl_realized: 1000,
                outcome: 'WIN'
            }));
        });

        it('should succeed, calculate pnl for a SHORT trade', async () => {
            const payload = {
                symbol: 'ETH_USD',
                side: 'SHORT',
                entry_price: 3000,
                exit_price: 3100,
                position_size: 1,
                entry_timestamp: new Date().toISOString(),
                exit_timestamp: new Date().toISOString()
            };

            vi.mocked(TradeRepository.create).mockResolvedValueOnce({
                id: '124',
                ...payload,
                user_id: 'user_A',
                pnl_realized: -100,
                outcome: 'LOSS'
            });

            const response = await request(app)
                .post('/api/trades')
                .set('Authorization', 'Bearer valid_token_user_A')
                .send(payload);

            expect(response.status).toBe(201);
            expect(TradeRepository.create).toHaveBeenCalledWith(expect.objectContaining({
                user_id: 'user_A',
                pnl_realized: -100,
                outcome: 'LOSS'
            }));
        });

        it('client cannot override user_id', async () => {
            const payload = {
                symbol: 'BTC_USD',
                side: 'LONG',
                entry_price: 50000,
                entry_timestamp: new Date().toISOString(),
                user_id: 'hacker_user' // Attempt override
            };

            const response = await request(app)
                .post('/api/trades')
                .set('Authorization', 'Bearer valid_token_user_A')
                .send(payload);

            // Zod .strict() mapping throws 400 for unexpected fields like user_id
            expect(response.status).toBe(400);
            expect(TradeRepository.create).not.toHaveBeenCalled();
        });
    });

    describe('GET /api/trades', () => {
        it('should fail if unauthenticated', async () => {
            const response = await request(app).get('/api/trades');
            expect(response.status).toBe(401);
        });

        it('should succeed with only authenticated user trades returning paginated output', async () => {
            vi.mocked(TradeRepository.findAllByOwner).mockResolvedValueOnce({
                data: [{ id: '1', symbol: 'BTC_USD' }],
                total: 1
            });

            const response = await request(app)
                .get('/api/trades?page=1&pageSize=10')
                .set('Authorization', 'Bearer valid_token_user_A');

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(1);
            expect(response.body.pagination.total).toBe(1);
            expect(response.body.pagination.page).toBe(1);

            // Verifies the user_id was passed down securely
            expect(TradeRepository.findAllByOwner).toHaveBeenCalledWith('user_A', expect.any(Object));
        });

        it('should successfully pass filters, sorting, and pagination down to repo', async () => {
            vi.mocked(TradeRepository.findAllByOwner).mockResolvedValueOnce({
                data: [{ id: '2' }],
                total: 1
            });

            const response = await request(app)
                .get('/api/trades?symbol=ETH&side=SHORT&outcome=WIN&status=CLOSED&page=2&pageSize=5')
                .set('Authorization', 'Bearer valid_token_user_A');

            expect(response.status).toBe(200);
            expect(TradeRepository.findAllByOwner).toHaveBeenCalledWith('user_A', expect.objectContaining({
                symbol: 'ETH',
                side: 'SHORT',
                outcome: 'WIN',
                status: 'CLOSED',
                page: 2,
                pageSize: 5
            }));
        });

        it('invalid query parameters fail', async () => {
            const response = await request(app)
                .get('/api/trades?pageSize=1000') // Above max 100
                .set('Authorization', 'Bearer valid_token_user_A');

            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/trades/:id', () => {
        it('should fail if unauthenticated', async () => {
            const response = await request(app).get('/api/trades/123');
            expect(response.status).toBe(401);
        });

        it('should return trade if owner', async () => {
            vi.mocked(TradeRepository.findByIdAndOwner).mockResolvedValueOnce({ id: '123', user_id: 'user_A' });

            const response = await request(app)
                .get('/api/trades/123')
                .set('Authorization', 'Bearer valid_token_user_A');

            expect(response.status).toBe(200);
            expect(response.body.id).toBe('123');
            expect(TradeRepository.findByIdAndOwner).toHaveBeenCalledWith('123', 'user_A');
        });

        it('should return 404/reject if trade requested by non-owner (or does not exist)', async () => {
            // Repo yields null when ownership fails
            vi.mocked(TradeRepository.findByIdAndOwner).mockResolvedValueOnce(null);

            const response = await request(app)
                .get('/api/trades/123')
                .set('Authorization', 'Bearer valid_token_user_B');

            expect(response.status).toBe(404);
            expect(TradeRepository.findByIdAndOwner).toHaveBeenCalledWith('123', 'user_B'); // Attempted with req.user.id
        });
    });

    describe('PATCH /api/trades/:id', () => {
        it('owner can update allowed fields, recalculates derivations', async () => {
            // Mock exist check
            vi.mocked(TradeRepository.findByIdAndOwner).mockResolvedValueOnce({
                id: '123', side: 'LONG', position_size: 1, entry_price: 1000, user_id: 'user_A'
            });
            vi.mocked(TradeRepository.update).mockResolvedValueOnce({
                id: '123', side: 'LONG', position_size: 1, entry_price: 1000, exit_price: 1500, pnl_realized: 500, outcome: 'WIN', user_id: 'user_A'
            });

            const response = await request(app)
                .patch('/api/trades/123')
                .set('Authorization', 'Bearer valid_token_user_A')
                .send({ exit_price: 1500, exit_timestamp: new Date().toISOString() });

            expect(response.status).toBe(200);
            expect(response.body.pnl_realized).toBe(500); // Verify derivation recalculation return string 
            expect(TradeRepository.update).toHaveBeenCalledWith('123', 'user_A', expect.objectContaining({
                exit_price: 1500,
                pnl_realized: 500,
                outcome: 'WIN'
            }));
        });

        it('unauthorized user cannot update another user trade', async () => {
            vi.mocked(TradeRepository.findByIdAndOwner).mockResolvedValueOnce(null);

            const response = await request(app)
                .patch('/api/trades/123')
                .set('Authorization', 'Bearer valid_token_user_B')
                .send({ notes: 'Hacked' });

            expect(response.status).toBe(404); // Or 403, depending on standard pattern (returns 404 for security)
            expect(TradeRepository.update).not.toHaveBeenCalled();
        });

        it('protected user_id cannot be changed via PATCH', async () => {
            vi.mocked(TradeRepository.findByIdAndOwner).mockResolvedValueOnce({
                id: '123', side: 'LONG', position_size: 1, entry_price: 1000, user_id: 'user_A'
            });

            const response = await request(app)
                .patch('/api/trades/123')
                .set('Authorization', 'Bearer valid_token_user_A')
                .send({ user_id: 'hacker_user' });

            // Zod .strict() rejects the unexpected key
            expect(response.status).toBe(400);
            expect(TradeRepository.update).not.toHaveBeenCalled();
        });
    });

    describe('DELETE /api/trades/:id', () => {
        it('unauthenticated request fails', async () => {
            const response = await request(app).delete('/api/trades/123');
            expect(response.status).toBe(401);
        });

        it('owner can delete', async () => {
            vi.mocked(TradeRepository.delete).mockResolvedValueOnce(true);

            const response = await request(app)
                .delete('/api/trades/123')
                .set('Authorization', 'Bearer valid_token_user_A');

            expect(response.status).toBe(204);
            expect(TradeRepository.delete).toHaveBeenCalledWith('123', 'user_A');
        });

        it('unauthorized user cannot delete another user trade', async () => {
            // User B attempting to delete User A's trade.
            // Repository `.delete` checks ownership in SQL and returns false if no rows matched.
            vi.mocked(TradeRepository.delete).mockResolvedValueOnce(false);

            const response = await request(app)
                .delete('/api/trades/123')
                .set('Authorization', 'Bearer valid_token_user_B');

            expect(response.status).toBe(404);
            expect(TradeRepository.delete).toHaveBeenCalledWith('123', 'user_B');
        });
    });

    describe('SECURITY: Ownership Isolation', () => {
        const TRADE_A_ID = 'trade_from_a';
        it('User B cannot GET User A trade', async () => {
            vi.mocked(TradeRepository.findByIdAndOwner).mockResolvedValueOnce(null);
            const res = await request(app).get(`/api/trades/${TRADE_A_ID}`).set('Authorization', 'Bearer valid_token_user_B');
            expect(res.status).toBe(404);
            expect(TradeRepository.findByIdAndOwner).toHaveBeenCalledWith(TRADE_A_ID, 'user_B');
        });

        it('User B cannot PATCH User A trade', async () => {
            vi.mocked(TradeRepository.findByIdAndOwner).mockResolvedValueOnce(null);
            const res = await request(app).patch(`/api/trades/${TRADE_A_ID}`).set('Authorization', 'Bearer valid_token_user_B').send({ notes: 'Hacked' });
            expect(res.status).toBe(404);
            expect(TradeRepository.update).not.toHaveBeenCalled();
        });

        it('User B cannot DELETE User A trade', async () => {
            vi.mocked(TradeRepository.delete).mockResolvedValueOnce(false);
            const res = await request(app).delete(`/api/trades/${TRADE_A_ID}`).set('Authorization', 'Bearer valid_token_user_B');
            expect(res.status).toBe(404);
            expect(TradeRepository.delete).toHaveBeenCalledWith(TRADE_A_ID, 'user_B');
        });
    });
});
