import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ FRONTEND SUPABASE CLIENT: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing.');
}

/**
 * Browser-safe Supabase Client
 * WARNING: Never import this in server-side functions that require service-role privileges.
 */
export const supabase = createClient(
    supabaseUrl || 'https://missing-url.supabase.co',
    supabaseAnonKey || 'missing-key',
    {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
        },
    }
);
