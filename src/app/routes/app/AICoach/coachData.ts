export interface ChatMessage {
    id: string;
    sender: 'user' | 'assistant';
    text: string;
    timestamp: string;
    metadata?: {
        sessionContext?: string;
        tags?: string[];
        ruleReference?: string;
    };
    takeaways?: string[];
    actionItems?: string[];
}

export interface PromptOption {
    id: string;
    text: string;
    category: 'Analysis' | 'Execution' | 'Risk' | 'Habits';
    iconName: 'mistakes' | 'exit' | 'overtrade' | 'risk' | 'habits' | 'discipline';
}

export const suggestedPromptsList: PromptOption[] = [
    {
        id: 'p-1',
        text: 'Analyse my recent trading mistakes.',
        category: 'Analysis',
        iconName: 'mistakes',
    },
    {
        id: 'p-2',
        text: 'Why do I keep exiting trades early?',
        category: 'Execution',
        iconName: 'exit',
    },
    {
        id: 'p-3',
        text: 'Am I overtrading?',
        category: 'Habits',
        iconName: 'overtrade',
    },
    {
        id: 'p-4',
        text: 'Help me improve my risk management.',
        category: 'Risk',
        iconName: 'risk',
    },
    {
        id: 'p-5',
        text: 'What are my strongest trading habits?',
        category: 'Habits',
        iconName: 'habits',
    },
    {
        id: 'p-6',
        text: 'How can I improve my discipline?',
        category: 'Execution',
        iconName: 'discipline',
    },
];

export const sampleConversation: ChatMessage[] = [
    {
        id: 'msg-1',
        sender: 'user',
        text: 'Analyse my recent trading mistakes and what is holding back my win rate.',
        timestamp: '10:42 AM',
        metadata: {
            sessionContext: 'London / NY Overlap',
        },
    },
    {
        id: 'msg-2',
        sender: 'assistant',
        text: 'Looking across your 58 recorded executions, your overarching technical edge is strong (71% win rate in London). However, two specific psychological friction patterns are currently eroding your net expectancy:',
        timestamp: '10:43 AM',
        metadata: {
            sessionContext: 'Diagnostic Vector',
            tags: ['Early Exits', 'Post-Loss Urgency'],
            ruleReference: 'Rule 4 & 5 Audit',
        },
        takeaways: [
            'Premature profit taking on 10 executions forfeited approximately +$410 in planned R-multiples.',
            'Discretionary stop adjustments occur primarily when holding trades longer than 45 minutes.',
            'A minor impulse frequency spike occurs in late NY sessions when liquidity dries up.',
        ],
        actionItems: [
            'Institute a mandatory "Hands-Off Orders" rule once target 1R is hit—let the trailing stop manage the remainder.',
            'Cease new entries past 16:30 UTC when your discipline score historically drops from 91 down to 74.',
        ],
    },
    {
        id: 'msg-3',
        sender: 'user',
        text: 'Why do I keep exiting trades early even when the setup was verified?',
        timestamp: '10:45 AM',
        metadata: {
            sessionContext: 'Psychology Exploration',
        },
    },
    {
        id: 'msg-4',
        sender: 'assistant',
        text: 'Your early exits are driven by loss aversion rather than technical invalidation. When your trade is floating in positive territory (+0.8R to +1.2R), your psychological focus shifts from executing the probabilistic system to defending paper gains.',
        timestamp: '10:46 AM',
        metadata: {
            sessionContext: 'Loss Aversion Isolation',
            tags: ['Loss Aversion', 'Execution Gap'],
        },
        takeaways: [
            'Realized R:R on early closed trades was 1.15R vs planned target of 2.20R (a 48% edge discount).',
            '8 of the 10 premature exits eventually reached full 2.0R take-profit without touching the original stop loss.',
            'The anxiety manifests primarily on days following a losing trade.',
        ],
        actionItems: [
            'Split exits into scale-out brackets: take 33% off at 1.5R to lock psychological baseline, then leave remaining 67% with hard target.',
            'Cover the floating P&L column on your broker screen during active executions to reduce dopamine attachment.',
        ],
    },
];

export const cannedResponses: Record<string, { text: string; takeaways: string[]; actionItems: string[] }> = {
    'Analyse my recent trading mistakes.': {
        text: 'Diagnostic review of your recent 58 executions reveals a solid 65.5% calm execution profile, but two recurring behavioral leak points are capping your profit factor:',
        takeaways: [
            'Premature profit taking accounts for 82% of all execution deviations.',
            'Late New York session trading shows a 26/100 tilt vulnerability compared to 12/100 in London.',
            'Impulse entries without a complete 4-point pre-trade checklist yielded a negative net return (-$490.00).',
        ],
        actionItems: [
            'Filter out late NY scalps; restrict entries to London opens and high-volume overlaps.',
            'Maintain strict adherence to setup checklist: 74% win rate when 100% complete.',
        ],
    },
    'Why do I keep exiting trades early?': {
        text: 'Forensic evaluation indicates your premature exits stem from cognitive loss aversion. You are experiencing elevated anxiety when trades float into profit, preferring immediate emotional certainty over expected value.',
        takeaways: [
            'Average realized R:R on panic-closed trades was only 1.05R versus your system target of 2.20R.',
            '80% of prematurely closed winners continued smoothly to original profit targets without hitting initial stop loss.',
        ],
        actionItems: [
            'Implement an automated two-tranche scale out: close 33% at 1.5R and move stop to break-even.',
            'Hide unrealized dollar P&L from your terminal display while trades are active.',
        ],
    },
    'Am I overtrading?': {
        text: 'Your average trade volume is 1.8 trades per session against a 3.0 maximum limit, which places your overall overtrading risk in the safe "Low (22%)" category. However, timing distribution shows localized clustering:',
        takeaways: [
            'Overtrading is negligible during London sessions (only 5.9% frequency).',
            'Overtrading spikes to 25.0% during low-volume Asian sessions when boredom or impatience arises.',
        ],
        actionItems: [
            'Enforce a strict 2-trade cap during Asian sessions.',
            'Institute a mandatory 30-minute cooldown if you close any position at a loss.',
        ],
    },
    'Help me improve my risk management.': {
        text: 'Your core risk mechanics are strong: average risk per position is 1.24% against a 1.50% limit, and post-loss sizing is disciplined at 0.94x (no revenge sizing). To reach elite institutional consistency:',
        takeaways: [
            'Your Stop Loss compliance is 94.8% (55/58 setups strictly honored).',
            'Rule violations cost you -$720.00 this month, representing +22.5% in forfeited net returns.',
        ],
        actionItems: [
            'Maintain maximum 1.5% risk cap with zero discretion.',
            'Halt live trading for the remainder of the session after two consecutive stop-outs.',
        ],
    },
    'What are my strongest trading habits?': {
        text: 'Your behavioral profile displays several habits found in consistently profitable systematic traders:',
        takeaways: [
            'London Session Mastery: Discipline score of 91/100 and a 71% win rate with zero impulse trades.',
            'Revenge Trading Shield: 91.2% adherence to mandatory post-loss cooling off periods.',
            'High Setup Selectivity: 65.5% of your executions occur in a state of calm, focused detachment.',
        ],
        actionItems: [
            'Double down on London breakout and trend-continuation models.',
            'Protect your cognitive energy by avoiding low-quality discretionary setups outside primary hours.',
        ],
    },
    'How can I improve my discipline?': {
        text: 'Discipline is not willpower; it is procedural friction that makes violating rules difficult. Based on your behavioral data, here is the prescription to move your Discipline Score from 84 to 95+:',
        takeaways: [
            '53 out of 58 trades were compliant, proving you have the ability to execute rules systematically.',
            'All 5 rule breaches occurred either on Fridays or in the final hour of trading.',
        ],
        actionItems: [
            'Hard-close trading terminal 30 minutes before market close.',
            'Require a 60-second breathing pause before clicking the order entry button.',
        ],
    },
};

export const contextVectors = {
    disciplineScore: 84,
    disciplineRating: 'Strong (Grade A-)',
    riskPerTrade: '1.24%',
    riskBenchmark: '1.50% Max',
    emotionalStability: 78,
    tiltLevel: 'Low (22%)',
    consistencyChecklist: '91.4%',
    topSession: 'London (91/100 Discipline)',
};

