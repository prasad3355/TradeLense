import { useState, FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../auth/AuthContext';
import { AuthLayout } from '../../auth/components/AuthLayout';
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export function Signup() {
    const { session } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [displayName, setDisplayName] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // If authenticated, redirect away
    if (session) {
        return <Navigate to="/app/dashboard" replace />;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        // Basic client validation
        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);

        try {
            const { error: signUpError, data } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        display_name: displayName.trim() || undefined
                    }
                }
            });

            if (signUpError) {
                setError(signUpError.message);
                return;
            }

            // If email confirmation is enabled and the session is not immediately returned
            if (data?.user && !data.session) {
                setSuccess(true);
            }

        } catch (err) {
            setError('An unexpected error occurred during sign up.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <AuthLayout title="Check your email">
                <div className="flex flex-col items-center justify-center py-6 text-center animate-fade-in space-y-4">
                    <div className="w-16 h-16 bg-brand-cyan/10 rounded-full flex items-center justify-center border border-brand-cyan/20">
                        <CheckCircle2 className="w-8 h-8 text-brand-cyan" />
                    </div>
                    <p className="text-[#b9cacb] text-sm max-w-sm">
                        We've sent a verification link to <strong className="text-white">{email}</strong>.
                        Please check your inbox and click the link to activate your account.
                    </p>
                    <Link
                        to="/login"
                        className="mt-4 font-semibold text-brand-cyan hover:text-white transition-colors text-sm"
                    >
                        Return to Sign In
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Create an account"
            subtitle="Secure your access to Tradelense V2"
        >
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
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

                <div>
                    <label htmlFor="displayName" className="block text-xs font-semibold text-[#849495] tracking-wide mb-1.5 ml-1">
                        DISPLAY NAME <span className="text-[#849495]/50">(OPTIONAL)</span>
                    </label>
                    <input
                        id="displayName"
                        name="displayName"
                        type="text"
                        autoComplete="name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        disabled={loading}
                        className="block w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-[#849495] focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan sm:text-sm transition-colors disabled:opacity-50"
                        placeholder="Alex Neo"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-xs font-semibold text-[#849495] tracking-wide mb-1.5 ml-1">
                        PASSWORD
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        className="block w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-[#849495] focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan sm:text-sm transition-colors disabled:opacity-50"
                        placeholder="••••••••"
                    />
                </div>

                <div>
                    <label htmlFor="confirm" className="block text-xs font-semibold text-[#849495] tracking-wide mb-1.5 ml-1">
                        CONFIRM PASSWORD
                    </label>
                    <input
                        id="confirm"
                        name="confirm"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        disabled={loading}
                        className="block w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-[#849495] focus:border-brand-cyan focus:outline-none focus:ring-1 focus:ring-brand-cyan sm:text-sm transition-colors disabled:opacity-50"
                        placeholder="••••••••"
                    />
                </div>

                <div className="pt-3">
                    <button
                        type="submit"
                        disabled={loading || !email || !password || !confirm}
                        className="flex w-full justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-black shadow-lg hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-black" />
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-[#849495]">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="font-semibold text-white hover:text-brand-cyan transition-colors"
                    >
                        Sign in instead
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
