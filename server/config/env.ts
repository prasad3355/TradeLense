/**
 * Environment configuration boundary.
 * Centralizes process.env parsing to ensure safe default boundaries.
 */

import { z } from 'zod';

const envSchema = z.object({
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.string().default('development'),
    VITE_APP_URL: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error("❌ Invalid environment variables:");
    console.error(_env.error.format());
    process.exit(1);
}

export const env = _env.data;
