import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

/**
 * Tradelense V2 Authenticated Boundary
 * Protects deep application routes leveraging Supabase session state.
 */
export function AppRouteBoundary({ children }: { children: ReactNode }) {
    const { session, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!session) {
        // Safe return destination via state tracking
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}
