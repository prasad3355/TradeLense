import { StrictMode } from 'react';
import LandingView from '../components/LandingView';

/**
 * Tradelense V2 Foundation Entry Point
 * Routing, authentication, and state management will be introduced in subsequent phases.
 */
export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#e5e2e1] font-sans">
      <LandingView onStartPro={() => console.log('Pro started. Routing is pending Phase 1.')} />
    </div>
  );
}
