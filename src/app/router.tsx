import { createBrowserRouter, useNavigate } from 'react-router-dom';
import LandingView from '../components/LandingView';

import { RootLayout } from './layouts/RootLayout';
import { AppLayout } from './layouts/AppLayout';

import { LoginPlaceholder } from './routes/public/LoginPlaceholder';
import { SignupPlaceholder } from './routes/public/SignupPlaceholder';
import { ForgotPasswordPlaceholder } from './routes/public/ForgotPasswordPlaceholder';

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
                element: <LoginPlaceholder />,
            },
            {
                path: 'signup',
                element: <SignupPlaceholder />,
            },
            {
                path: 'forgot-password',
                element: <ForgotPasswordPlaceholder />,
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
