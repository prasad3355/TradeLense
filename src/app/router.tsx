import { createBrowserRouter, useNavigate } from 'react-router-dom';
import LandingView from '../components/LandingView';

import { RootLayout } from './layouts/RootLayout';
import { AppLayout } from './layouts/AppLayout';

import { Login } from './routes/public/Login';
import { Signup } from './routes/public/Signup';
import { ForgotPassword } from './routes/public/ForgotPassword';
import { UpdatePassword } from './routes/public/UpdatePassword';

import { JournalPlaceholder } from './routes/app/JournalPlaceholder';
import { DashboardPlaceholder } from './routes/app/DashboardPlaceholder';
import { AnalyticsPlaceholder } from './routes/app/AnalyticsPlaceholder';
import { BehaviorPlaceholder } from './routes/app/BehaviorPlaceholder';
import { CoachPlaceholder } from './routes/app/CoachPlaceholder';
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
                element: <DashboardPlaceholder />,
            },
            {
                path: 'journal',
                element: <JournalPlaceholder />,
            },
            {
                path: 'dashboard',
                element: <DashboardPlaceholder />,
            },
            {
                path: 'analytics',
                element: <AnalyticsPlaceholder />,
            },
            {
                path: 'behavior',
                element: <BehaviorPlaceholder />,
            },
            {
                path: 'coach',
                element: <CoachPlaceholder />,
            },
            {
                path: 'settings',
                element: <SettingsPlaceholder />,
            },
        ],
    },
]);
