
import React, { useState } from 'react';
import { Cycle, Tactic } from '../types';
import { CheckCircle2, ChevronLeft, ChevronRight, Info, AlertTriangle, Sparkles } from 'lucide-react';
import { getCorrectiveAction } from '../services/geminiService';

interface Props {
  cycle: Cycle;
  updateCycle: (updater: (prev: Cycle | null) => Cycle | null) => void;
}

const WeeklyExecutionView: React.FC<Props> = ({ cycle, updateCycle }) => {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [recoveryPlan, setRecoveryPlan] = useState<string | null>(null);
  const [loadingRecovery, setLoadingRecovery] = useState(false);

  const weekData = cycle.executions[selectedWeek];

  const handleToggleCompletion = (tacticId: string, current: number, target: number) => {
    updateCycle(prev => {
      if (!prev) return null;
      const newExecutions = [...prev.executions];
      const completions = { ...newExecutions[selectedWeek].completions };
      completions[tacticId] = (current >= target) ? 0 : (current + 1);
      
      // Calculate score
      let totalP = 0, totalD = 0;
      prev.goals.forEach(g => g.tactics.forEach(t => {
        totalP += t.target;
        const comp = t.id === tacticId ? completions[t.id] : (newExecutions[selectedWeek].completions[t.id] || 0);
        totalD += Math.min(t.target, comp);
      }));
      
      newExecutions[selectedWeek] = {
        ...newExecutions[selectedWeek],
        completions,
        score: totalP > 0 ? Math.round((totalD / totalP) * 100) : 0
      };
      
      return { ...prev, executions: newExecutions };
    });
  };

  const handleGetRecovery = async () => {
    setLoadingRecovery(true);
    const plan = await getCorrectiveAction(cycle, selectedWeek);
    setRecoveryPlan(plan);
    setLoadingRecovery(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setSelectedWeek(Math.max(0, selectedWeek - 1))} className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-2xl font-black text-slate-900">Week {selectedWeek + 1}</h2>
          <button onClick={() => setSelectedWeek(Math.min(11, selectedWeek + 1))} className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
            <ChevronRight size={20} />
          </button>
        </div>
        <div className={`px-6 py-2 rounded-full font-black text-xl border-2 ${
          weekData.score >= 85 ? 'bg-green-50 text-green-700 border-green-200' : 
          weekData.score >= 70 ? 'bg-orange-50 text-orange-700 border-orange-200' :
          'bg-red-50 text-red-700 border-red-200'
        }`}>
          {weekData.score}%
        </div>
      </header>

      {weekData.score < 85 && weekData.score > 0 && (
        <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6 justify-between animate-in slide-in-from-top duration-500">
          <div className="flex gap-4">
            <AlertTriangle className="text-red-600 shrink-0" size={32} />
            <div>
              <h4 className="font-bold text-red-900">Execution Under Pressure</h4>
              <p className="text-sm text-red-700">You are below the 85% success threshold. Don't let annualized thinking creep in.</p>
            </div>
          </div>
          <button 
            onClick={handleGetRecovery}
            disabled={loadingRecovery}
            className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-200 shrink-0"
          >
            <Sparkles size={18} />
            {loadingRecovery ? 'Analyzing...' : 'Help Me Recover'}
          </button>
        </div>
      )}

      {recoveryPlan && (
        <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-4 animate-in zoom-in-95 duration-300">
          <h4 className="text-blue-400 font-bold uppercase tracking-widest text-xs">AI Recovery Plan</h4>
          <div className="whitespace-pre-wrap text-sm leading-relaxed opacity-90">{recoveryPlan}</div>
          <button onClick={() => setRecoveryPlan(null)} className="text-xs text-slate-400 underline">Dismiss</button>
        </div>
      )}

      <div className="space-y-6">
        {cycle.goals.map(goal => (
          <section key={goal.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-black text-slate-900 uppercase tracking-wide text-sm">{goal.title}</h3>
              <div className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-100 uppercase">Lead Indicators</div>
            </div>
            <div className="divide-y divide-slate-50">
              {goal.tactics.map(tactic => {
                const completed = weekData.completions[tactic.id] || 0;
                const isComplete = completed >= tactic.target;
                return (
                  <div key={tactic.id} className="p-6 flex items-center justify-between hover:bg-slate-50/30 transition-colors group">
                    <div className="flex-1">
                      <p className={`font-bold ${isComplete ? 'text-slate-300 line-through' : 'text-slate-800'}`}>{tactic.description}</p>
                      <div className="flex gap-1 mt-2">
                        {Array.from({ length: tactic.target }).map((_, i) => (
                          <div key={i} className={`w-8 h-2 rounded-full ${i < completed ? 'bg-blue-600' : 'bg-slate-100'}`} />
                        ))}
                      </div>
                    </div>
                    <button onClick={() => handleToggleCompletion(tactic.id, completed, tactic.target)} className={`p-3 rounded-2xl transition-all ${isComplete ? 'bg-green-100 text-green-600' : 'bg-slate-50 text-slate-300 hover:text-blue-600 hover:bg-blue-50'}`}>
                      <CheckCircle2 size={28} />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default WeeklyExecutionView;
