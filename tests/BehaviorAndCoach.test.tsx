import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Behavior } from '../src/app/routes/app/Behavior/Behavior';
import { AICoach } from '../src/app/routes/app/AICoach/AICoach';

vi.mock('../src/app/auth/AuthContext', () => ({
    useAuth: () => ({ session: null, isLoading: false })
}));

// Mock recharts ResponsiveContainer to avoid size calculation errors in happy-dom
vi.mock('recharts', async () => {
    const actual = await vi.importActual<any>('recharts');
    return {
        ...actual,
        ResponsiveContainer: ({ children }: any) => <div style={{ width: 400, height: 300 }}>{children}</div>,
    };
});

describe('Behavioral Intelligence and AI Coach UI Components', () => {
    describe('Behavior Component', () => {
        it('renders empty state initially and switches to preview mode on CTA click', () => {
            render(
                <MemoryRouter>
                    <Behavior />
                </MemoryRouter>
            );

            expect(screen.getByText('Behavioral Intelligence')).toBeDefined();
            expect(
                screen.getByText('Understand the habits, decisions and emotional patterns behind your trading performance.')
            ).toBeDefined();

            // Verify empty state CTAs
            expect(screen.getByText('YOUR BEHAVIORAL PROFILE AWAITS')).toBeDefined();
            expect(screen.getByText('Upload First Trade')).toBeDefined();
            const exploreBtn = screen.getByText('Explore Behavior Preview');
            expect(exploreBtn).toBeDefined();

            // Click Explore Behavior Preview
            fireEvent.click(exploreBtn);

            // Verify populated preview dashboard is rendered
            expect(screen.getByText('BEHAVIORAL OVERVIEW')).toBeDefined();
            expect(screen.getAllByText('Discipline Score').length).toBeGreaterThanOrEqual(1);
            expect(screen.getByText('Rule Adherence')).toBeDefined();
            expect(screen.getAllByText('Emotional Stability').length).toBeGreaterThanOrEqual(1);
            expect(screen.getByText('Overtrading Risk')).toBeDefined();
            expect(screen.getByText('EMOTIONAL STATE DISTRIBUTION')).toBeDefined();
            expect(screen.getByText('TRADING BEHAVIOR BY SESSION')).toBeDefined();
            expect(screen.getByText('RULE ADHERENCE BREAKDOWN')).toBeDefined();
            expect(screen.getByText('TRADING CONSISTENCY')).toBeDefined();
            expect(screen.getByText('RISK MANAGEMENT HABITS')).toBeDefined();
            expect(screen.getByText('BEHAVIORAL INSIGHTS & OBSERVATIONS')).toBeDefined();
        });

        it('displays the three required sample behavioral observations in preview', () => {
            render(
                <MemoryRouter>
                    <Behavior />
                </MemoryRouter>
            );

            // Activate preview
            fireEvent.click(screen.getByText('Explore Behavior Preview'));

            expect(screen.getByText('Stronger discipline during London sessions.')).toBeDefined();
            expect(screen.getByText('Increased risk after consecutive losses.')).toBeDefined();
            expect(screen.getByText('Better consistency when following predefined setups.')).toBeDefined();
        });
    });

    describe('AI Coach Component', () => {
        it('renders the AI Coach header and visible UI preview status label', () => {
            render(
                <MemoryRouter>
                    <AICoach />
                </MemoryRouter>
            );

            expect(screen.getAllByText('AI Coach').length).toBeGreaterThanOrEqual(1);
            expect(screen.getByText('Understand your trading decisions and develop better trading habits.')).toBeDefined();
            expect(screen.getByText('UI PREVIEW — AI NOT CONNECTED')).toBeDefined();
        });

        it('renders the Context Vectors sidebar with all 4 metrics', () => {
            render(
                <MemoryRouter>
                    <AICoach />
                </MemoryRouter>
            );

            expect(screen.getByText('Trader Context Vectors')).toBeDefined();
            expect(screen.getByText('Trading Discipline')).toBeDefined();
            expect(screen.getByText('Risk Management')).toBeDefined();
            expect(screen.getByText('Emotional Control')).toBeDefined();
            expect(screen.getByText('Consistency')).toBeDefined();
        });

        it('renders the suggested questions and populates composer on selection', () => {
            render(
                <MemoryRouter>
                    <AICoach />
                </MemoryRouter>
            );

            // Click reset to view the welcome state with all 6 suggested prompt cards
            const resetBtn = screen.getByText('Reset to Welcome State');
            fireEvent.click(resetBtn);

            expect(screen.getByText('Analyse my recent trading mistakes.')).toBeDefined();
            expect(screen.getByText('Why do I keep exiting trades early?')).toBeDefined();
            expect(screen.getByText('Am I overtrading?')).toBeDefined();
            expect(screen.getByText('Help me improve my risk management.')).toBeDefined();
            expect(screen.getByText('What are my strongest trading habits?')).toBeDefined();
            expect(screen.getByText('How can I improve my discipline?')).toBeDefined();

            // Clicking prompt card should populate the composer input
            fireEvent.click(screen.getByText('Why do I keep exiting trades early?'));
            const input = screen.getByPlaceholderText('Ask AI Coach about your habits, discipline, or session errors...') as HTMLInputElement;
            expect(input.value).toBe('Why do I keep exiting trades early?');
        });
    });
});
