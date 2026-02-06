
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Target, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  Users,
  Wrench
} from 'lucide-react';
import { Cycle } from './types';
import Dashboard from './components/Dashboard';
import Planning from './components/Planning';
import WeeklyExecutionView from './components/WeeklyExecutionView';
import TimeBlocker from './components/TimeBlocker';
import AICoach from './components/AICoach';
import Onboarding from './components/Onboarding';
import Accountability from './components/Accountability';
import MicroTools from './components/MicroTools';

const STORAGE_KEY = '12wy_state_v2';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'planning' | 'execution' | 'timeblocking' | 'coach' | 'accountability' | 'tools'>('dashboard');
  const [cycle, setCycle] = useState<Cycle | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setCycle(JSON.parse(saved));
    } else {
      const newCycle: Cycle = {
        id: crypto.randomUUID(),
        startDate: new Date().toISOString(),
        vision: '',
        goals: [],
        executions: Array.from({ length: 12 }, (_, i) => ({
          weekNumber: i + 1,
          completions: {},
          reflections: '',
          score: 0
        })),
        onboardingCompleted: false,
        streak: 0
      };
      setCycle(newCycle);
    }
  }, []);

  useEffect(() => {
    if (cycle) localStorage.setItem(STORAGE_KEY, JSON.stringify(cycle));
  }, [cycle]);

  const updateCycle = (updater: (prev: Cycle | null) => Cycle | null) => {
    setCycle(prev => updater(prev));
  };

  if (cycle && !cycle.onboardingCompleted) {
    return <Onboarding cycle={cycle} onComplete={() => updateCycle(c => c ? {...c, onboardingCompleted: true} : null)} />;
  }

  const renderContent = () => {
    if (!cycle) return null;
    switch (activeTab) {
      case 'dashboard': return <Dashboard cycle={cycle} onNavigateToWeek={() => setActiveTab('execution')} />;
      case 'planning': return <Planning cycle={cycle} updateCycle={updateCycle} />;
      case 'execution': return <WeeklyExecutionView cycle={cycle} updateCycle={updateCycle} />;
      case 'timeblocking': return <TimeBlocker />;
      case 'accountability': return <Accountability cycle={cycle} />;
      case 'tools': return <MicroTools cycle={cycle} />;
      case 'coach': return <AICoach cycle={cycle} />;
      default: return null;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'planning', label: '12-Week Plan', icon: Target },
    { id: 'execution', label: 'Execution', icon: TrendingUp },
    { id: 'timeblocking', label: 'Time Blocks', icon: Clock },
    { id: 'accountability', label: 'Groups', icon: Users },
    { id: 'tools', label: 'Toolkit', icon: Wrench },
    { id: 'coach', label: 'AI Coach', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <nav className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col h-auto md:h-screen sticky top-0 z-10 shadow-sm">
        <div className="p-6">
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">12</div>
            Catalyst
          </h1>
        </div>
        <div className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === item.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={18} strokeWidth={2.5} />
              {item.label}
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Execution Streak</span>
              <span className="text-xs font-bold text-blue-600">🔥 {cycle?.streak || 0}</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(1/12)*100}%` }} />
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
        <div className="max-w-5xl mx-auto p-6 md:p-12">{renderContent()}</div>
      </main>
    </div>
  );
};

export default App;
