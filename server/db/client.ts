import { createClient } from '@supabase/supabase-js';

// Ensure backend has access to required ENV for privileged DB operations
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    // We don't throw yet to avoid breaking the app during phase transitions, 
    // but we warn explicitly.
    console.warn('⚠️ SERVER SUPABASE CLIENT: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing.');
}

/**
 * Server-only Supabase Service Client
 * WARNING: This client bypasses RLS. Never export this to the frontend.
 * Use strictly for admin-level operations or secure server-side logic.
 */
export const supabaseAdmin = createClient(
    supabaseUrl || 'missing-url',
    supabaseServiceKey || 'missing-key',
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);
