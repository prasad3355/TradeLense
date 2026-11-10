export interface BehavioralOverviewData {
    disciplineScore: number;
    disciplineGrade: string;
    disciplineChange: number;
    ruleAdherence: number;
    rulesCompliantCount: number;
    rulesTotalCount: number;
    emotionalStability: number;
    calmStatePercentage: number;
    tiltRiskLevel: 'Low' | 'Moderate' | 'High';
    overtradingRisk: 'Low' | 'Moderate' | 'High';
    overtradingPercentage: number;
    avgTradesPerDay: number;
    maxTradesPerDayLimit: number;
}

export interface EmotionalStateItem {
    name: string;
    tradesCount: number;
    percentage: number;
    winRate: number;
    pnl: number;
    avgRR: number;
    color: string;
    description: string;
}

export interface SessionBehaviorItem {
    session: string;
    disciplineScore: number;
    ruleAdherence: number;
    overtradeRate: number;
    winRate: number;
    tiltIndex: number;
    pnl: number;
    tradeCount: number;
    tag: string;
    tagColor: string;
    highlight: string;
}

export interface RuleAdherenceItem {
    ruleName: string;
    complianceRate: number;
    followedCount: number;
    totalCount: number;
    targetRate: number;
    impact: string;
}

export interface ConsistencyMetric {
    title: string;
    value: string;
    subtext: string;
    status: 'optimal' | 'good' | 'warning';
    progress: number;
}

export interface RiskHabitItem {
    metric: string;
    actual: string;
    benchmark: string;
    status: 'passed' | 'warning';
    description: string;
}

export interface TrendDataPoint {
    session: string;
    date: string;
    disciplineScore: number;
    emotionalStability: number;
    pnl: number;
}

export interface BehavioralInsight {
    id: string;
    title: string;
    tag: string;
    type: 'positive' | 'warning' | 'info';
    observation: string;
    recommendation: string;
    impact: string;
}

export const sampleBehaviorData: {
    overview: BehavioralOverviewData;
    emotionalStates: EmotionalStateItem[];
    sessions: SessionBehaviorItem[];
    rules: RuleAdherenceItem[];
    costOfViolations: { compliantPnl: number; nonCompliantPnl: number; netLossToRuleBreaks: number };
    consistency: ConsistencyMetric[];
    riskHabits: RiskHabitItem[];
    trends: TrendDataPoint[];
    insights: BehavioralInsight[];
} = {
    overview: {
        disciplineScore: 84,
        disciplineGrade: 'A-',
        disciplineChange: 6.2,
        ruleAdherence: 91.4,
        rulesCompliantCount: 53,
        rulesTotalCount: 58,
        emotionalStability: 78,
        calmStatePercentage: 72.4,
        tiltRiskLevel: 'Low',
        overtradingRisk: 'Low',
        overtradingPercentage: 22.0,
        avgTradesPerDay: 1.8,
        maxTradesPerDayLimit: 3.0,
    },
    emotionalStates: [
        {
            name: 'Calm & Focused',
            tradesCount: 38,
            percentage: 65.5,
            winRate: 71.1,
            pnl: 2280.00,
            avgRR: 2.24,
            color: '#10B981',
            description: 'Methodical setup identification and relaxed trade execution.'
        },
        {
            name: 'FOMO & Chasing',
            tradesCount: 9,
            percentage: 15.5,
            winRate: 33.3,
            pnl: -490.00,
            avgRR: 1.05,
            color: '#F59E0B',
            description: 'Entering after extended momentum without pullback confirmation.'
        },
        {
            name: 'Hesitant / Anxious',
            tradesCount: 6,
            percentage: 10.3,
            winRate: 50.0,
            pnl: -140.00,
            avgRR: 1.30,
            color: '#8B5CF6',
            description: 'Second-guessing entries and premature stop adjustments.'
        },
        {
            name: 'Overconfident',
            tradesCount: 3,
            percentage: 5.2,
            winRate: 66.7,
            pnl: 920.00,
            avgRR: 1.90,
            color: '#38BDF8',
            description: 'Increased size following winning streaks with looser criteria.'
        },
        {
            name: 'Revenge / Frustrated',
            tradesCount: 2,
            percentage: 3.5,
            winRate: 0.0,
            pnl: -87.50,
            avgRR: 0.40,
            color: '#EF4444',
            description: 'Rapid re-entries immediately after taking an unexpected loss.'
        }
    ],
    sessions: [
        {
            session: 'London Session',
            disciplineScore: 91,
            ruleAdherence: 94.1,
            overtradeRate: 5.9,
            winRate: 71.0,
            tiltIndex: 12,
            pnl: 1420.00,
            tradeCount: 34,
            tag: 'DOMINANT EDGE',
            tagColor: '#38BDF8',
            highlight: 'Strongest patience and lowest impulse count during high liquidity opens.'
        },
        {
            session: 'New York Session',
            disciplineScore: 78,
            ruleAdherence: 89.5,
            overtradeRate: 15.8,
            winRate: 58.0,
            tiltIndex: 26,
            pnl: 642.50,
            tradeCount: 19,
            tag: 'SOLID BASE',
            tagColor: '#818CF8',
            highlight: 'Good execution early; minor discipline decline in final hour of trade.'
        },
        {
            session: 'Asia Session',
            disciplineScore: 72,
            ruleAdherence: 83.3,
            overtradeRate: 25.0,
            winRate: 50.0,
            tiltIndex: 38,
            pnl: 420.00,
            tradeCount: 12,
            tag: 'FATIGUE RISK',
            tagColor: '#F59E0B',
            highlight: 'Higher tendency to force trades in sideways low-volatility ranges.'
        }
    ],
    rules: [
        {
            ruleName: 'Stop Loss Defined & Respected',
            complianceRate: 94.8,
            followedCount: 55,
            totalCount: 58,
            targetRate: 95.0,
            impact: 'Protected capital on 55/58 setups without manual widening'
        },
        {
            ruleName: 'Pre-Trade Checklist Verified',
            complianceRate: 91.4,
            followedCount: 53,
            totalCount: 58,
            targetRate: 90.0,
            impact: '74% win rate when all 4 checklist points checked'
        },
        {
            ruleName: 'Position Sizing <= 1.5% Account Risk',
            complianceRate: 89.6,
            followedCount: 52,
            totalCount: 58,
            targetRate: 90.0,
            impact: '6 trades exceeded recommended sizing by 0.3%-0.8%'
        },
        {
            ruleName: 'Target RR >= 2.0:1 Baseline',
            complianceRate: 86.2,
            followedCount: 50,
            totalCount: 58,
            targetRate: 85.0,
            impact: 'Positive expectancy maintained despite 8 low-RR trades'
        },
        {
            ruleName: 'No Premature Panic Exits',
            complianceRate: 82.8,
            followedCount: 48,
            totalCount: 58,
            targetRate: 85.0,
            impact: '10 trades closed prematurely gave back +$410 in unrealized edge'
        }
    ],
    costOfViolations: {
        compliantPnl: 3202.50,
        nonCompliantPnl: -720.00,
        netLossToRuleBreaks: 720.00
    },
    consistency: [
        {
            title: 'Revenge Cooldown Adherence',
            value: '91.2%',
            subtext: 'Observed >30 min buffer after a stop-out before re-entering',
            status: 'optimal',
            progress: 91
        },
        {
            title: 'Daily Trade Cap Compliance',
            value: '95.0%',
            subtext: 'Stayed at or below maximum 3 trades per trading session',
            status: 'optimal',
            progress: 95
        },
        {
            title: 'Timeframe Horizon Discipline',
            value: '84.5%',
            subtext: 'Held trades for planned duration without early fatigue close',
            status: 'good',
            progress: 84
        },
        {
            title: 'Execution Spacing Index',
            value: '88.0%',
            subtext: 'Evenly distributed entries without clustered rush entries',
            status: 'good',
            progress: 88
        }
    ],
    riskHabits: [
        {
            metric: 'Average Risk Per Execution',
            actual: '1.24%',
            benchmark: '1.50% Max Cap',
            status: 'passed',
            description: 'Portfolio exposure safely below maximum loss boundary per position.'
        },
        {
            metric: 'Post-Loss Sizing Multiplier',
            actual: '0.94x',
            benchmark: '<= 1.00x',
            status: 'passed',
            description: 'No revenge sizing increase observed after encountering losing trades.'
        },
        {
            metric: 'Realized vs Planned R:R',
            actual: '2.14 / 2.20',
            benchmark: '>= 90% Capture',
            status: 'passed',
            description: '97.2% capture efficiency between planned target and final execution.'
        },
        {
            metric: 'Consecutive Loss Hard Stop',
            actual: '2 Losses Max',
            benchmark: '3 Losses Limit',
            status: 'passed',
            description: 'Trading halted automatically after 2 consecutive adverse executions.'
        }
    ],
    trends: [
        { session: 'S-01', date: 'Oct 01', disciplineScore: 76, emotionalStability: 70, pnl: 180 },
        { session: 'S-02', date: 'Oct 03', disciplineScore: 78, emotionalStability: 72, pnl: -90 },
        { session: 'S-03', date: 'Oct 05', disciplineScore: 82, emotionalStability: 75, pnl: 240 },
        { session: 'S-04', date: 'Oct 08', disciplineScore: 80, emotionalStability: 74, pnl: 310 },
        { session: 'S-05', date: 'Oct 10', disciplineScore: 85, emotionalStability: 79, pnl: 150 },
        { session: 'S-06', date: 'Oct 12', disciplineScore: 83, emotionalStability: 76, pnl: -110 },
        { session: 'S-07', date: 'Oct 15', disciplineScore: 88, emotionalStability: 82, pnl: 420 },
        { session: 'S-08', date: 'Oct 17', disciplineScore: 84, emotionalStability: 80, pnl: 210 },
        { session: 'S-09', date: 'Oct 19', disciplineScore: 87, emotionalStability: 81, pnl: 290 },
        { session: 'S-10', date: 'Oct 22', disciplineScore: 86, emotionalStability: 79, pnl: -80 },
        { session: 'S-11', date: 'Oct 24', disciplineScore: 89, emotionalStability: 83, pnl: 380 },
        { session: 'S-12', date: 'Oct 26', disciplineScore: 92, emotionalStability: 85, pnl: 440 },
        { session: 'S-13', date: 'Oct 29', disciplineScore: 88, emotionalStability: 82, pnl: 160 },
        { session: 'S-14', date: 'Oct 31', disciplineScore: 91, emotionalStability: 86, pnl: -60 }
    ],
    insights: [
        {
            id: 'ins-1',
            title: 'Stronger discipline during London sessions.',
            tag: 'SESSION EDGE',
            type: 'positive',
            observation: 'Your discipline score averages 91/100 during London compared to 78 in New York and 72 in Asia. Impulse entries are 0 across 34 London executions.',
            recommendation: 'Concentrate primary risk allocation and complex setups within the 08:00–12:00 UTC window where your psychological clarity is peak.',
            impact: '+$1,420.00 net London P&L (71% win rate)'
        },
        {
            id: 'ins-2',
            title: 'Increased risk after consecutive losses.',
            tag: 'TILT VULNERABILITY',
            type: 'warning',
            observation: 'After experiencing two consecutive losses, trade hesitation drops but entry haste rises by 38%, leading to tighter initial stops and early scratches.',
            recommendation: 'Enforce a mandatory 45-minute terminal walkaway after back-to-back losses to reset sympathetic nervous system activation.',
            impact: '-$720.00 preventable friction on non-compliant trades'
        },
        {
            id: 'ins-3',
            title: 'Better consistency when following predefined setups.',
            tag: 'PLAYBOOK COMPLIANCE',
            type: 'positive',
            observation: 'Trades executing with a 100% completed pre-flight checklist achieve a 74.2% win rate and 2.3R average, compared to 36.4% on discretionary ad-hoc setups.',
            recommendation: 'Mandate screenshot checklist validation prior to order submission to preserve your proven high-expectancy setups.',
            impact: '+$3,202.50 generated on fully compliant executions'
        }
    ]
};

