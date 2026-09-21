import { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../auth/AuthContext';
import { AuthLayout } from '../../auth/components/AuthLayout';
import { AlertCircle, Loader2 } from 'lucide-react';

export function Login() {
    const { session } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // If authenticated, redirect away
    if (session) {
        return <Navigate to="/app/dashboard" replace />;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                return;
            }

            // Determine redirect path
            const from = location.state?.from?.pathname || '/app/dashboard';
            navigate(from, { replace: true });
        } catch (err) {
            setError('An unexpected error occurred during sign in.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Sign in to your account"
            subtitle="Access your trading workstation and analytics"
        >
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
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
                            disabled={loading}
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
                            disabled={loading}
                            className="block w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-[#849495] focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan sm:text-sm transition-colors disabled:opacity-50"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading || !email || !password}
                        className="flex w-full justify-center rounded-lg bg-brand-cyan px-4 py-2.5 text-sm font-bold text-[#002022] shadow-[0_0_15px_rgba(0,219,231,0.2)] hover:bg-brand-cyan/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-[#002022]" />
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-[#849495]">
                    Don't have an account?{' '}
                    <Link
                        to="/signup"
                        className="font-semibold text-white hover:text-brand-cyan transition-colors"
                    >
                        Apply for Access
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
