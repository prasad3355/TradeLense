import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase Service Client
 * WARNING: This client bypasses RLS. Never export this to the frontend.
 * Use strictly for admin-level operations or secure server-side logic.
 */
export function getSupabaseAdmin() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('SERVER FATAL ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must remain strictly configured for server operations.');
    }

    return createClient(
        supabaseUrl,
        supabaseServiceKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}
