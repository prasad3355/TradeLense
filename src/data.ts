import { Trade, Stats, CognitiveInsight, RoadmapStep, HeatmapItem } from './types';

export const INITIAL_STATS: Stats = {
  totalBalance: 0,
  pnlPercentage: 0,
  riskRewardAvg: "0:0",
  disciplineScore: 0,
  ruleAdherence: 0,
  stopLossMgmt: 0,
  winRate: 0,
  longWinRate: 0,
  shortWinRate: 0
};

export const INITIAL_TRADES: Trade[] = [];

export const INITIAL_INSIGHTS: CognitiveInsight[] = [];

export const INITIAL_ROADMAP: RoadmapStep[] = [];

// Generates 40 items for psychology heatmap grid (10x4) with neutral starting values
export const HEATMAP_DATA: HeatmapItem[] = Array.from({ length: 40 }, (_, i) => {
  return {
    id: i + 1,
    intensity: 0,
    state: "Neutral",
    time: `Session ${i + 1}`
  };
});
