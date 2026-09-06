import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import LandingView from './components/LandingView';
import DashboardView from './components/DashboardView';
import TradesView from './components/TradesView';
import AICoachView from './components/AICoachView';
import SettingsView from './components/SettingsView';
import { Trade, Stats, CognitiveInsight } from './types';
import { INITIAL_STATS, INITIAL_TRADES, INITIAL_INSIGHTS } from './data';

export default function App() {
  const [activeView, setActiveView] = useState<'landing' | 'dashboard' | 'trades' | 'coach' | 'settings'>('landing');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [insights, setInsights] = useState<CognitiveInsight[]>(INITIAL_INSIGHTS);
  const [stats, setStats] = useState<Stats>(INITIAL_STATS);

  // Recalculates stats dynamically based on actual trade entries
  const calculateStats = (tradesArray: Trade[]): Stats => {
    if (tradesArray.length === 0) {
      return {
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
    }

    const totalPnL = tradesArray.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const baseCapital = 50000; // Realistic start baseline for prop/capital tracing
    const totalBalance = baseCapital + totalPnL;

    const totalTradesCount = tradesArray.length;
    const winCount = tradesArray.filter((t) => (t.pnl || 0) >= 0).length;
    const winRate = Math.round((winCount / totalTradesCount) * 100);

    const longs = tradesArray.filter((t) => t.type === 'LONG');
    const longWinnerCount = longs.filter((t) => (t.pnl || 0) >= 0).length;
    const longWinRate = longs.length > 0 ? Math.round((longWinnerCount / longs.length) * 100) : 0;

    const shorts = tradesArray.filter((t) => t.type === 'SHORT');
    const shortWinnerCount = shorts.filter((t) => (t.pnl || 0) >= 0).length;
    const shortWinRate = shorts.length > 0 ? Math.round((shortWinnerCount / shorts.length) * 100) : 0;

    const sumRR = tradesArray.reduce((sum, t) => sum + (t.rr || 0), 0);
    const avgRRValue = totalTradesCount > 0 ? (sumRR / totalTradesCount).toFixed(1) : "0.0";
    const riskRewardAvg = `1:${avgRRValue}`;

    const avgDiscipline = Math.round(tradesArray.reduce((sum, t) => sum + (t.discipline_score || 0), 0) / totalTradesCount);

    const warningFreeTrades = tradesArray.filter((t) => !t.validationWarnings || t.validationWarnings.length === 0).length;
    const ruleAdherence = Math.round((warningFreeTrades / totalTradesCount) * 100);

    const avgRiskMgt = Math.round(tradesArray.reduce((sum, t) => sum + (t.risk_management_quality || 0), 0) / totalTradesCount);

    const pnlPercentage = parseFloat(((totalBalance - baseCapital) / baseCapital * 100).toFixed(1));

    return {
      totalBalance,
      pnlPercentage,
      riskRewardAvg,
      disciplineScore: avgDiscipline,
      ruleAdherence,
      stopLossMgmt: avgRiskMgt,
      winRate,
      longWinRate,
      shortWinRate
    };
  };

  // Sync state stats when database index changes
  useEffect(() => {
    setStats(calculateStats(trades));
  }, [trades]);

  // Read index on bootstrap
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const res = await fetch('/api/trades');
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list)) {
            setTrades(list);
          }
        }
      } catch (err) {
        console.error("Critical database fetch failed:", err);
      }
    };
    fetchTrades();
  }, []);

  // Scroll back to top on route transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  // Inserts and registers OCR actions
  const handleAddTrade = async (newTrade: Trade) => {
    try {
      await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrade)
      });
    } catch (err) {
      console.error("Insertion cache mismatch:", err);
    }

    setTrades((prev) => [newTrade, ...prev]);

    // Push cognitive diagnostic insight to HUD feed
    const freshInsight: CognitiveInsight = {
      id: `in-ocr-${Date.now()}`,
      type: newTrade.pnl >= 0 ? "success" : "danger",
      title: `OCR Verified: ${newTrade.asset} registered`,
      description: `New position successfully parsed. Your discipline index shifted to ${Math.min(100, stats.disciplineScore + (newTrade.pnl >= 0 ? 1 : -2))}/100.`
    };
    setInsights((prev) => [freshInsight, ...prev]);
  };

  // Updates manual parameters or reviews on individual cells
  const handleUpdateTrade = async (updatedTrade: Trade) => {
    try {
      await fetch(`/api/trades/${updatedTrade.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTrade)
      });
    } catch (err) {
      console.error("Correction sync mismatch:", err);
    }

    setTrades((prev) => prev.map((t) => t.id === updatedTrade.id ? updatedTrade : t));
  };

  const handleDeleteTrade = async (id: string) => {
    try {
      await fetch(`/api/trades/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error("Purge action mismatch:", err);
    }

    setTrades((prev) => prev.filter((t) => t.id !== id));

    setInsights((prev) => [
      {
        id: `in-del-${Date.now()}`,
        type: "info",
        title: "Trade ledger purged",
        description: `Successfully removed trade token ${id} from memory. Balance is recalculated.`
      },
      ...prev
    ]);
  };

  const handleTriggerPsychAudit = () => {
    setActiveView('coach');
    // Scroll directly to the Forensic section for clear user routing
    setTimeout(() => {
      const el = document.getElementById('forensic-audit');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <div className="min-h-screen bg-black text-[#e5e2e1] font-sans">
      <AnimatePresence mode="wait">
        {activeView === 'landing' ? (
          // Immersive Full-Screen Landing Dashboard
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LandingView onStartPro={() => setActiveView('dashboard')} />
          </motion.div>
        ) : (
          // Core HUD Shell Layout Frame
          <motion.div
            key="terminal-hud"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex transition-all"
          >
            {/* Left Sidebar Menu */}
            <Sidebar 
              activeView={activeView} 
              onViewChange={setActiveView} 
              onUploadClick={() => setActiveView('trades')}
            />

            {/* Top Navigation bar */}
            <Navbar 
              onSettingsClick={() => setActiveView('settings')} 
              onPageClick={setActiveView}
            />

            {/* Structured Page Content Window Container */}
            <main className="flex-1 ml-64 pt-16 min-h-screen relative bg-black">
              {/* Radial ambient background light leak */}
              <div className="absolute inset-0 pointer-events-none z-0 ambient-glow opacity-30" />

              <div className="relative z-10 p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeView}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeView === 'dashboard' && (
                      <DashboardView 
                        stats={stats}
                        trades={trades}
                        insights={insights}
                        onTriggerAudit={handleTriggerPsychAudit}
                        onDeleteTrade={handleDeleteTrade}
                        onUpdateTrade={handleUpdateTrade}
                      />
                    )}

                    {activeView === 'trades' && (
                      <TradesView 
                        onAddTrade={handleAddTrade}
                        onNavigateToDashboard={() => setActiveView('dashboard')}
                      />
                    )}

                    {activeView === 'coach' && (
                      <div id="forensic-audit">
                        <AICoachView 
                          stats={stats}
                          trades={trades}
                        />
                      </div>
                    )}

                    {activeView === 'settings' && (
                      <SettingsView trades={trades} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
