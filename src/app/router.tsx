import { createBrowserRouter, useNavigate } from 'react-router-dom';
import LandingView from '../components/LandingView';

import { RootLayout } from './layouts/RootLayout';
import { AppLayout } from './layouts/AppLayout';

import { Login } from './routes/public/Login';
import { Signup } from './routes/public/Signup';
import { ForgotPassword } from './routes/public/ForgotPassword';
import { UpdatePassword } from './routes/public/UpdatePassword';
import { AuthCallback } from './routes/public/AuthCallback';

import { Journal } from './routes/app/Journal';
import { Dashboard } from './routes/app/Dashboard/Dashboard';
import { Analytics } from './routes/app/Analytics/Analytics';
import { Behavior } from './routes/app/Behavior/Behavior';
import { AICoach } from './routes/app/AICoach/AICoach';
import { SettingsPlaceholder } from './routes/app/SettingsPlaceholder';

import { NotFound } from './routes/NotFound';
import { AppRouteBoundary } from './routes/AppRouteBoundary';

function LandingViewWrapper() {
    const navigate = useNavigate();
    return <LandingView onStartPro={() => navigate('/app')} />;
}

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                element: <LandingViewWrapper />,
            },
            {
                path: 'login',
                element: <Login />,
            },
            {
                path: 'signup',
                element: <Signup />,
            },
            {
                path: 'forgot-password',
                element: <ForgotPassword />,
            },
            {
                path: 'update-password',
                element: <UpdatePassword />,
            },
            {
                path: 'auth/callback',
                element: <AuthCallback />,
            },
        ],
    },
    {
        path: '/app',
        element: (
            <AppRouteBoundary>
                <AppLayout />
            </AppRouteBoundary>
        ),
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: 'journal',
                element: <Journal />,
            },
            {
                path: 'dashboard',
                element: <Dashboard />,
            },
            {
                path: 'analytics',
                element: <Analytics />,
            },
            {
                path: 'behavior',
                element: <Behavior />,
            },
            {
                path: 'coach',
                element: <AICoach />,
            },
            {
                path: 'ai-coach',
                element: <AICoach />,
            },
            {
                path: 'settings',
                element: <SettingsPlaceholder />,
            },
        ],
    },
]);
