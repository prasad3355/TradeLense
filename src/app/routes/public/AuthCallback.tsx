import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { AuthLayout } from '../../auth/components/AuthLayout';
import { Loader2, XCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

type ProcessStatus = 'verifying' | 'success' | 'error';

export function AuthCallback() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<ProcessStatus>('verifying');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const processAuth = async () => {
            try {
                const url = new URL(window.location.href);
                const hashParams = new URLSearchParams(url.hash.substring(1));
                const searchParams = new URLSearchParams(url.search);

                const error = hashParams.get('error') || searchParams.get('error');
                const errorCode = hashParams.get('error_code') || searchParams.get('error_code');

                if (error || errorCode) {
                    if (isMounted) {
                        setStatus('error');
                        setErrorMessage('Your confirmation link is invalid or has expired.');
                    }
                    return;
                }

                const { error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    if (isMounted) {
                        setStatus('error');
                        setErrorMessage('Authentication session error. Please log in again.');
                    }
                    return;
                }

                if (isMounted) {
                    setStatus('success');
                    setTimeout(() => {
                        if (isMounted) {
                            navigate('/login?verified=true', { replace: true });
                        }
                    }, 1500);
                }
            } catch (err) {
                if (isMounted) {
                    setStatus('error');
                    setErrorMessage('An unexpected error occurred during verification.');
                }
            }
        };

        processAuth();

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    return (
        <AuthLayout title={
            status === 'verifying' ? "Verifying Email" :
                status === 'success' ? "Verification Complete" :
                    "Verification Failed"
        } subtitle={
            status === 'verifying' ? "Please wait while we verify your session." : ""
        }>
            <div className="flex flex-col items-center justify-center py-10 text-center min-h-[220px]">

                {status === 'verifying' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <Loader2 className="w-8 h-8 animate-spin text-brand-cyan" />
                        <p className="text-[#849495] text-sm">Verifying your secure link...</p>
                    </motion.div>
                )}

                {status === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="flex flex-col items-center"
                    >
                        <div className="relative flex items-center justify-center w-20 h-20 mb-6">
                            <motion.svg
                                className="absolute inset-0 w-full h-full text-brand-cyan drop-shadow-[0_0_12px_rgba(0,219,231,0.4)]"
                                viewBox="0 0 50 50"
                            >
                                <motion.circle
                                    cx="25"
                                    cy="25"
                                    r="22"
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                />
                                <motion.path
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 25 l7 7 l13 -13"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
                                />
                            </motion.svg>
                        </div>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.5 }}
                            className="text-xl font-bold text-white mb-2"
                        >
                            Email verified
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                            className="text-[#849495] text-sm"
                        >
                            Your Tradelense account is ready.
                        </motion.p>
                    </motion.div>
                )}

                {status === 'error' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="flex flex-col items-center w-full"
                    >
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 mb-6 relative">
                            <XCircle className="w-8 h-8 text-red-400" />
                            <div className="absolute inset-0 rounded-full border border-red-500/30 animate-ping opacity-20"></div>
                        </div>

                        <h2 className="text-xl font-bold text-white mb-2">Verification link expired</h2>
                        <p className="text-[#849495] text-sm max-w-[280px] mb-8 leading-relaxed">
                            {errorMessage || 'Request a new confirmation email to continue.'}
                        </p>

                        <Link
                            to="/login"
                            className="flex w-full max-w-[280px] justify-center items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all active:scale-[0.98]"
                        >
                            Return to Sign In
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                    </motion.div>
                )}
            </div>
        </AuthLayout>
    );
}
