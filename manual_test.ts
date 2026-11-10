// manual_test.ts
import { createApp } from './server/app';
import { errorHandler } from './server/middleware/errorHandler';
import request from 'supertest';
import { vi } from 'vitest';

const app = createApp();
app.use(errorHandler);

async function run() {
    const payload = {
        symbol: 'BTC_USD',
        side: 'LONG',
        entry_price: 50000,
        exit_price: 51000,
        entry_timestamp: new Date().toISOString(),
        exit_timestamp: new Date().toISOString()
    };
    console.log("Sending payload:", payload);
    const response = await request(app)
        .post('/api/trades')
        // We mock auth by hacking the middleware or just not mocking and seeing why 401
        // Wait, without auth mock it's 401. Let me just test Validation by sending without token headers
        .send(payload);

    console.log("Response:", response.status, response.body);
}

run();
