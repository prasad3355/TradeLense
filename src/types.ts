export interface Trade {
  id: string;
  asset: string;
  type: 'LONG' | 'SHORT';
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  time: string;
  duration: string;
  notes?: string;

  // Advanced Extraction Parameters
  sl?: number;
  tp?: number;
  rr?: number;
  pips?: number;
  riskPercent?: number;
  rewardPercent?: number;
  timeframe?: string;
  chartTime?: string;
  candleCount?: number;
  detectedTool?: 'LONG_POSITION' | 'SHORT_POSITION' | 'NONE';
  estimatedOutcome?: 'TP_HIT' | 'SL_HIT' | 'TRAILING_SL' | 'MANUAL_CLOSED';
  session?: 'London' | 'New York' | 'Asian' | 'London/NY Overlap' | 'None';
  day?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

  // Structured AI Intelligence Fields
  setup_type?: 'breakout' | 'trend continuation' | 'reversal' | 'support resistance bounce' | 'liquidity sweep' | 'scalp' | 'intraday' | 'swing trade';
  market_structure?: string;
  emotion_detected?: 'fear exits' | 'greed' | 'impatience' | 'overconfidence' | 'revenge behavior' | 'hesitation' | 'none';
  mistake_type?: 'early exit' | 'revenge trading' | 'FOMO entry' | 'oversized position' | 'moved stop loss' | 'poor RR' | 'overtrading' | 'late entry' | 'none';
  discipline_score?: number; // 0-100
  execution_quality?: number; // 0-100
  risk_management_quality?: number; // 0-100
  setup_quality?: number; // 0-100
  confidence_score?: number; // 0-100

  // Optional User Overrides
  size?: number; // e.g. position size in Lots/Contracts
  user_emotion?: string;
  user_notes?: string;
  image_url?: string;

  // Verification & warnings
  validationWarnings?: string[];
  extractionConfidenceLow?: boolean;
}

export interface Stats {
  totalBalance: number;
  pnlPercentage: number;
  riskRewardAvg: string;
  disciplineScore: number;
  ruleAdherence: number;
  stopLossMgmt: number;
  winRate: number;
  longWinRate: number;
  shortWinRate: number;
}

export interface CognitiveInsight {
  id: string;
  type: 'danger' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
}

export interface RoadmapStep {
  step: number;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'LOCKED';
  title: string;
  description: string;
}

export interface HeatmapItem {
  id: number;
  intensity: 0 | 1 | 2 | 3; // representing low focus to high focus
  state: string; // "Calm", "Focused", "Anxious", "Greedy"
  time: string;
}
