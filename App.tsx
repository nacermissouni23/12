
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { loadUserCycle, saveUserCycle } from './services/dbService';
import { 
  LayoutDashboard, 
  Target, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  Wrench,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Cycle } from './types';
import Dashboard from './components/Dashboard';
import Planning from './components/Planning';
import WeeklyExecutionView from './components/WeeklyExecutionView';
import TimeBlocker from './components/TimeBlocker';
import AICoach from './components/AICoach';
import Onboarding from './components/Onboarding';
import MicroTools from './components/MicroTools';

const AppContent: React.FC = () => {
  const { user, signIn, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'planning' | 'execution' | 'timeblocking' | 'coach' | 'tools'>('dashboard');
  const [cycle, setCycle] = useState<Cycle | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load cycle from Firestore when user logs in
  useEffect(() => {
    if (user) {
      loadUserCycle(user.uid).then(loadedCycle => {
        if (loadedCycle) {
          setCycle(loadedCycle);
        } else {
          // Initialize new cycle if none exists
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
      });
    } else {
      setCycle(null);
    }
  }, [user]);

  // Persist cycle to Firestore on change
  useEffect(() => {
    if (user && cycle) {
      const timeoutId = setTimeout(() => {
        saveUserCycle(user.uid, cycle);
      }, 1000); // Debounce saves
      return () => clearTimeout(timeoutId);
    }
  }, [cycle, user]);

  const updateCycle = (updater: (prev: Cycle | null) => Cycle | null) => {
    setCycle(prev => updater(prev));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl max-w-md w-full text-center space-y-6">
           <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-4">12</div>
           <h1 className="text-3xl font-black text-slate-900">12 Week Catalyst</h1>
           <p className="text-slate-500">Sign in to sync your progress across all devices and never lose your plan.</p>
           <button onClick={signIn} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
             Sign in with Google
           </button>
        </div>
      </div>
    );
  }

  if (cycle && !cycle.onboardingCompleted) {
    return <Onboarding cycle={cycle} onComplete={() => updateCycle(c => c ? {...c, onboardingCompleted: true} : null)} />;
  }

  const renderContent = () => {
    if (!cycle) return <div className="p-8 text-center text-slate-400">Loading your plan...</div>;
    switch (activeTab) {
      case 'dashboard': return <Dashboard cycle={cycle} onNavigateToWeek={() => setActiveTab('execution')} />;
      case 'planning': return <Planning cycle={cycle} updateCycle={updateCycle} />;
      case 'execution': return <WeeklyExecutionView cycle={cycle} updateCycle={updateCycle} />;
      case 'timeblocking': return <TimeBlocker />;
      case 'tools': return <MicroTools cycle={cycle} updateCycle={updateCycle} />;
      case 'coach': return <AICoach cycle={cycle} updateCycle={updateCycle} />;
      default: return null;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'planning', label: '12-Week Plan', icon: Target },
    { id: 'execution', label: 'Execution', icon: TrendingUp },
    { id: 'timeblocking', label: 'Time Blocks', icon: Clock },
    { id: 'tools', label: 'Toolkit', icon: Wrench },
    { id: 'coach', label: 'AI Coach', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-20 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">12</div>
          Catalyst
        </h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation (Desktop + Mobile Overlay) */}
      <nav className={`
        fixed inset-0 z-10 bg-white md:bg-transparent md:static md:w-64 md:h-screen md:flex flex-col border-r border-slate-200 transition-transform duration-300 md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0 pt-20 px-6' : '-translate-x-full md:p-0'}
      `}>
        <div className="hidden md:block p-6">
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">12</div>
            Catalyst
          </h1>
        </div>
        
        <div className="flex-1 space-y-1 md:px-3 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-600 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'stroke-[2.5px]' : 'stroke-2'} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-3 px-4 py-3 pb-0">
               <img src={user.photoURL || ''} className="w-8 h-8 rounded-full bg-slate-200" alt="Profile" />
               <div className="flex-1 overflow-hidden">
                 <p className="text-xs font-bold text-slate-900 truncate">{user.displayName}</p>
                 <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
               </div>
               <button onClick={logout} className="text-slate-400 hover:text-red-500 transition-colors"><LogOut size={16}/></button>
            </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 h-[calc(100vh-64px)] md:h-screen overflow-y-auto scroll-smooth">
        {/* Overlay for mobile menu */}
        {mobileMenuOpen && (
           <div 
             className="fixed inset-0 bg-black/20 z-0 md:hidden glass"
             onClick={() => setMobileMenuOpen(false)}
           />
        )}
        <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8">
           {renderContent()}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
