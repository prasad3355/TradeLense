import { useState, FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../auth/AuthContext';
import { AuthLayout } from '../../auth/components/AuthLayout';
import { AlertCircle, Loader2, MailCheck } from 'lucide-react';

export function ForgotPassword() {
    const { session } = useAuth();

    const [email, setEmail] = useState('');
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
        setLoading(true);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                // Ensure redirect matches local dev or prod environment via current origin
                redirectTo: `${window.location.origin}/update-password`,
            });

            if (resetError) {
                // To avoid account enumeration, Supabase might not return an error for non-existent emails,
                // but any actual failure (e.g. rate limit) will trigger this.
                setError(resetError.message);
                return;
            }

            setSuccess(true);
        } catch (err) {
            setError('An unexpected error occurred requesting password reset.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <AuthLayout title="Reset Email Sent">
                <div className="flex flex-col items-center justify-center py-6 text-center animate-fade-in space-y-4">
                    <div className="w-16 h-16 bg-brand-cyan/10 rounded-full flex items-center justify-center border border-brand-cyan/20">
                        <MailCheck className="w-8 h-8 text-brand-cyan" />
                    </div>
                    <p className="text-[#b9cacb] text-sm max-w-sm leading-relaxed">
                        If an account exists for <strong className="text-white">{email}</strong>,
                        you will receive a password reset link shortly.
                    </p>
                    <Link
                        to="/login"
                        className="mt-6 font-semibold text-brand-cyan hover:text-white transition-colors text-sm px-4 py-2 bg-white/5 rounded-lg border border-white/10 hover:border-white/20"
                    >
                        Return to Sign In
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Reset your password"
            subtitle="Enter your email to receive a recovery link"
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

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading || !email}
                        className="flex w-full justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-black shadow-lg hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-black" />
                        ) : (
                            'Send Recovery Link'
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-8 text-center flex items-center justify-center gap-4">
                <Link
                    to="/login"
                    className="text-sm font-semibold text-[#849495] hover:text-white transition-colors"
                >
                    Back to Sign In
                </Link>
            </div>
        </AuthLayout>
    );
}
