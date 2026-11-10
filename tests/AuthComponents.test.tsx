import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Signup } from '../src/app/routes/public/Signup';
import { Login } from '../src/app/routes/public/Login';
import { ForgotPassword } from '../src/app/routes/public/ForgotPassword';
import { AuthCallback } from '../src/app/routes/public/AuthCallback';
import { supabase } from '../src/lib/supabase';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock AuthContext
vi.mock('../src/app/auth/AuthContext', () => ({
    useAuth: () => ({ session: null, isLoading: false })
}));

// Mock framer-motion to avoid Happy DOM animation AbortError on unmount
vi.mock('motion/react', () => {
    return {
        motion: {
            div: ({ children, className, ...props }: any) => <div className={className} data-testid="motion-div">{children}</div>,
            svg: ({ children, className, ...props }: any) => <svg className={className} data-testid="motion-svg">{children}</svg>,
            circle: ({ children, className, ...props }: any) => <circle className={className}>{children}</circle>,
            path: ({ children, className, ...props }: any) => <path className={className}>{children}</path>,
            h2: ({ children, className, ...props }: any) => <h2 className={className}>{children}</h2>,
            p: ({ children, className, ...props }: any) => <p className={className}>{children}</p>,
        }
    };
});

// Mock Supabase Auth
vi.mock('../src/lib/supabase', () => ({
    supabase: {
        auth: {
            signUp: vi.fn(),
            signInWithPassword: vi.fn(),
            signInWithOAuth: vi.fn(),
            resetPasswordForEmail: vi.fn(),
            resend: vi.fn(),
            getSession: vi.fn(),
        }
    }
}));

describe('Authentication Components', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockNavigate.mockClear();
        // Setup env vars mock
        Object.defineProperty(import.meta, 'env', { value: { VITE_SUPABASE_URL: 'http://mock', VITE_SUPABASE_ANON_KEY: 'mock' }, configurable: true });

        // Mock window.location for origin check
        Object.defineProperty(window, 'location', {
            value: {
                origin: 'http://localhost:3000',
                href: 'http://localhost:3000/auth/callback'
            },
            configurable: true
        });
    });

    describe('Signup', () => {
        it('validates password match', async () => {
            render(<MemoryRouter><Signup /></MemoryRouter>);
            const emailInput = screen.getByLabelText(/EMAIL ADDRESS/i);
            const passInput = screen.getByLabelText(/^PASSWORD/i);
            const confirmInput = screen.getByLabelText(/CONFIRM PASSWORD/i);
            const submitObj = screen.getByRole('button', { name: /Create Account/i });

            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passInput, { target: { value: 'password123' } });
            fireEvent.change(confirmInput, { target: { value: 'password999' } });
            fireEvent.click(submitObj);

            await waitFor(() => {
                expect(screen.getAllByText('Passwords do not match.').length).toBeGreaterThan(0);
            });
            expect(supabase.auth.signUp).not.toHaveBeenCalled();
        });

        it('shows success and resend if unconfirmed, and includes emailRedirectTo in req', async () => {
            vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({
                data: { user: { id: '1' } as any, session: null },
                error: null
            });

            render(<MemoryRouter><Signup /></MemoryRouter>);
            fireEvent.change(screen.getByLabelText(/EMAIL ADDRESS/i), { target: { value: 'test@example.com' } });
            fireEvent.change(screen.getByLabelText(/^PASSWORD/i), { target: { value: 'password123' } });
            fireEvent.change(screen.getByLabelText(/CONFIRM PASSWORD/i), { target: { value: 'password123' } });
            fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

            await waitFor(() => {
                expect(supabase.auth.signUp).toHaveBeenCalledWith({
                    email: 'test@example.com',
                    password: 'password123',
                    options: expect.objectContaining({
                        emailRedirectTo: 'http://localhost:3000/auth/callback'
                    })
                });
                expect(screen.getByText(/Check your email to verify your Tradelense account./i)).not.toBeNull();
            });

            // Resend email
            vi.mocked(supabase.auth.resend).mockResolvedValueOnce({ data: {} as any, error: null });

            // Mock alert
            window.alert = vi.fn();
            const resendBtn = screen.getByRole('button', { name: /Resend Email/i });
            fireEvent.click(resendBtn);

            await waitFor(() => {
                expect(supabase.auth.resend).toHaveBeenCalledWith({ type: 'signup', email: 'test@example.com' });
                expect(window.alert).toHaveBeenCalledWith('Confirmation email resent. Please check your inbox.');
            });
        });
    });

    describe('Login', () => {
        it('handles unconfirmed account / invalid credentials appropriately', async () => {
            vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
                data: { user: null, session: null },
                error: { message: 'Invalid login credentials', name: 'AuthApiError', status: 400 } as any
            });

            render(<MemoryRouter><Login /></MemoryRouter>);
            fireEvent.change(screen.getByLabelText(/EMAIL ADDRESS/i), { target: { value: 'test@example.com' } });
            fireEvent.change(screen.getByLabelText(/^PASSWORD/i), { target: { value: 'wrong_password' } });
            fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

            await waitFor(() => {
                expect(screen.getByText(/If you recently signed up, please check your email/i)).not.toBeNull();
            });
        });

        it('triggers Google OAuth', async () => {
            vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValueOnce({
                data: { provider: 'google', url: '' },
                error: null
            });

            render(<MemoryRouter><Login /></MemoryRouter>);
            const googleBtn = screen.getByRole('button', { name: /Continue with Google/i });
            fireEvent.click(googleBtn);

            await waitFor(() => {
                expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
                    provider: 'google',
                    options: { redirectTo: expect.any(String) }
                });
            });
        });

        it('displays success message when verified=true is in URL', () => {
            render(<MemoryRouter initialEntries={['/login?verified=true']}><Login /></MemoryRouter>);
            expect(screen.getByText(/Email verified successfully. You can now sign in./i)).not.toBeNull();
        });

        it('displays error message from URL', () => {
            render(<MemoryRouter initialEntries={['/login?error=Safe+error+message']}><Login /></MemoryRouter>);
            expect(screen.getByText(/Safe error message/i)).not.toBeNull();
        });
    });

    describe('Forgot Password', () => {
        it('submits forgot password correctly', async () => {
            vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValueOnce({
                data: {} as any,
                error: null
            });

            render(<MemoryRouter><ForgotPassword /></MemoryRouter>);
            fireEvent.change(screen.getByLabelText(/EMAIL ADDRESS/i), { target: { value: 'test@example.com' } });
            fireEvent.click(screen.getByRole('button', { name: /Send Recovery Link/i }));

            await waitFor(() => {
                expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
                    'test@example.com',
                    expect.objectContaining({ redirectTo: expect.any(String) })
                );
                expect(screen.getByText(/you will receive a password reset link shortly/i)).not.toBeNull();
            });
        });
    });

    describe('AuthCallback', () => {
        it('renders success state and redirects to verified status', async () => {
            Object.defineProperty(window, 'location', {
                value: { href: 'http://localhost:3000/auth/callback' },
                configurable: true
            });
            vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({ data: { session: {} } as any, error: null });

            render(<MemoryRouter><AuthCallback /></MemoryRouter>);

            // Transition from verifying to success
            await waitFor(() => {
                expect(screen.getByText(/Email verified/i)).not.toBeNull();
            });

            // Redirects after timeout
            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/login?verified=true', { replace: true });
            }, { timeout: 2000 });
        });

        it('renders safe error state if URL contains error', async () => {
            Object.defineProperty(window, 'location', {
                value: { href: 'http://localhost:3000/auth/callback#error=otp_expired' },
                configurable: true
            });

            render(<MemoryRouter><AuthCallback /></MemoryRouter>);

            await waitFor(() => {
                expect(screen.getByText(/Verification link expired/i)).not.toBeNull();
                expect(screen.getByText(/Your confirmation link is invalid or has expired./i)).not.toBeNull();
            });
        });

        it('renders error state if getSession fails', async () => {
            Object.defineProperty(window, 'location', {
                value: { href: 'http://localhost:3000/auth/callback' },
                configurable: true
            });
            vi.mocked(supabase.auth.getSession).mockResolvedValueOnce({ data: { session: null }, error: { message: 'Session error' } as any });

            render(<MemoryRouter><AuthCallback /></MemoryRouter>);

            await waitFor(() => {
                expect(screen.getByText(/Verification Failed/i)).not.toBeNull();
                expect(screen.getByText(/Authentication session error. Please log in again./i)).not.toBeNull();
            });
        });
    });
});
