/**
 * Environment configuration boundary.
 * Centralizes process.env parsing to ensure safe default boundaries.
 */

export const env = {
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    // Future Supabase, Stripe, Gemini keys will be typed and verified here via Zod
};
