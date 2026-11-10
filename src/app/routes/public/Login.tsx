import { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation, Navigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../auth/AuthContext';
import { AuthLayout } from '../../auth/components/AuthLayout';
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export function Login() {
    const { session } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState<string | null>(searchParams.get('error') || null);

    const isVerified = searchParams.get('verified') === 'true';

    // If authenticated, redirect away
    if (session) {
        return <Navigate to="/app/dashboard" replace />;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
            setError('Authentication is not configured for this environment.');
            return;
        }

        setLoading(true);

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                if (signInError.message.includes('Failed to fetch')) {
                    setError('Unable to connect to authentication service. Please try again.');
                } else if (signInError.message.includes('Invalid login credentials')) {
                    setError('Invalid email or password. If you recently signed up, please check your email to confirm your account.');
                } else {
                    setError(signInError.message);
                }
                return;
            }

            // Determine safe redirect path
            let fromPath = location.state?.from?.pathname || '/app/dashboard';

            // Explicitly prevent open redirects by ensuring the path is absolutely internal
            if (typeof fromPath !== 'string' || !fromPath.startsWith('/')) {
                fromPath = '/app/dashboard';
            }

            navigate(fromPath, { replace: true });
        } catch (err: any) {
            if (err?.message === 'Failed to fetch') {
                setError('Unable to connect to authentication service. Please try again.');
            } else {
                setError('An unexpected error occurred during sign in.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
            setError('Authentication is not configured for this environment.');
            return;
        }

        try {
            setError(null);
            setGoogleLoading(true);
            const { error: googleError } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/app/dashboard`
                }
            });

            if (googleError) {
                if (googleError.message.includes('Failed to fetch')) {
                    setError('Unable to connect to authentication service. Please try again.');
                } else {
                    setError(googleError.message);
                }
            }
        } catch (err: any) {
            if (err?.message === 'Failed to fetch') {
                setError('Unable to connect to authentication service. Please try again.');
            } else {
                setError('An unexpected error occurred during Google sign in.');
            }
        } finally {
            setGoogleLoading(false);
        }
    };


    return (
        <AuthLayout
            title="Sign in to your account"
            subtitle="Access your trading workstation and analytics"
        >
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                {/* Success Banner */}
                {isVerified && !error && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 flex items-start gap-3 animate-fade-in" role="alert">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-emerald-200">Email verified successfully. You can now sign in.</span>
                    </div>
                )}
                {/* Error Banner */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-3 animate-fade-in" role="alert">
                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-red-200">{error}</span>
                    </div>
                )}

                <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-[#849495] tracking-wide mb-1.5 ml-1">
                        EMAIL ADDRESS
                    </label>
                    <div className="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading || googleLoading}
                            className="block w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-[#849495] focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan sm:text-sm transition-colors disabled:opacity-50"
                            placeholder="trader@example.com"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between ml-1 mb-1.5">
                        <label htmlFor="password" className="block text-xs font-semibold text-[#849495] tracking-wide">
                            PASSWORD
                        </label>
                        <Link
                            to="/forgot-password"
                            className="text-xs font-semibold text-brand-cyan hover:text-brand-cyan/80 transition-colors focus-visible:ring-2 outline-none rounded"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="mt-1">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading || googleLoading}
                            className="block w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-[#849495] focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan sm:text-sm transition-colors disabled:opacity-50"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading || googleLoading || !email || !password}
                        className="flex w-full justify-center rounded-lg bg-brand-cyan px-4 py-2.5 text-sm font-bold text-[#002022] shadow-[0_0_15px_rgba(0,219,231,0.2)] hover:bg-brand-cyan/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#002022]" />
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/5"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-[#050505] text-[#849495]">OR</span>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading || googleLoading}
                    className="flex w-full justify-center items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                >
                    {googleLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                    ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                    )}
                    {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
                </button>
            </div>

            <div className="mt-8 text-center">
                <p className="text-sm text-[#849495]">
                    Don't have an account?{' '}
                    <Link
                        to="/signup"
                        className="font-semibold text-white hover:text-brand-cyan transition-colors"
                    >
                        Create an account
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
