import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { AuthLayout } from '../../auth/components/AuthLayout';
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export function UpdatePassword() {
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Watch for Supabase hash parsing on mount
    useEffect(() => {
        // If the URL contains an error from a broken magic link/recovery
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hashError = hashParams.get('error_description') || hashParams.get('error');
        if (hashError) {
            setError(decodeURIComponent(hashError));
        }

        // We could strictly enforce an active session (Supabase authenticates the user transparently via the link)
        // supabase.auth.getSession().then(...)
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

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
            const { error: updateError } = await supabase.auth.updateUser({
                password
            });

            if (updateError) {
                setError(updateError.message);
                return;
            }

            setSuccess(true);

            // Allow user a moment to see success, then transition them to dashboard.
            setTimeout(() => {
                navigate('/app/dashboard', { replace: true });
            }, 2500);

        } catch (err) {
            setError('An unexpected error occurred while updating your password.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <AuthLayout title="Password Updated">
                <div className="flex flex-col items-center justify-center py-6 text-center animate-fade-in space-y-4">
                    <div className="w-16 h-16 bg-brand-cyan/10 rounded-full flex items-center justify-center border border-brand-cyan/20">
                        <CheckCircle2 className="w-8 h-8 text-brand-cyan" />
                    </div>
                    <p className="text-[#b9cacb] text-sm max-w-sm">
                        Your password has been successfully reset. Redirecting you to your dashboard...
                    </p>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Set new password"
            subtitle="Please enter your new secure password below"
        >
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-3 animate-fade-in text-left" role="alert">
                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-red-100">Action Required</span>
                            <span className="text-sm text-red-200 mt-0.5 leading-relaxed">{error}</span>
                            <Link to="/forgot-password" className="text-xs text-red-300 hover:text-white underline mt-2">
                                Request a new link
                            </Link>
                        </div>
                    </div>
                )}

                <div>
                    <label htmlFor="password" className="block text-xs font-semibold text-[#849495] tracking-wide mb-1.5 ml-1 text-left">
                        NEW PASSWORD
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
                    <label htmlFor="confirm" className="block text-xs font-semibold text-[#849495] tracking-wide mb-1.5 ml-1 text-left">
                        CONFIRM NEW PASSWORD
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

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading || !password || !confirm}
                        className="flex w-full justify-center rounded-lg bg-brand-cyan px-4 py-2.5 text-sm font-bold text-[#002022] shadow-[0_0_15px_rgba(0,219,231,0.2)] hover:bg-brand-cyan/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-cyan transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-[#002022]" />
                        ) : (
                            'Update Password'
                        )}
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
}
