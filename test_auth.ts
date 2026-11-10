import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const VITE_SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const VITE_SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
    console.error("Missing supabase env vars");
    process.exit(1);
}

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

async function run() {
    const testEmail = `test_${Date.now()}@example.com`;
    const password = `Password123!`;

    console.log(`Testing signup with ${testEmail}`);
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: password
    });

    console.log("Signup:", { data: signUpData, error: signUpError?.message });

    if (!signUpData.session) {
        console.log("No session returned. This means email confirmation is required.");
    }

    console.log(`\nTesting login with unconfirmed email...`);
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: password
    });

    console.log("Login:", { data: loginData, error: loginError?.message });
}
run();
