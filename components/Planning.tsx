
import React, { useState } from 'react';
import { Cycle, Goal, Tactic } from '../types';
import { Plus, Trash2, Sparkles, Target, BarChart3 } from 'lucide-react';
import { suggestTactics } from '../services/geminiService';

interface Props {
  cycle: Cycle;
  updateCycle: (updater: (prev: Cycle | null) => Cycle | null) => void;
}

const Planning: React.FC<Props> = ({ cycle, updateCycle }) => {
  const [loadingTactics, setLoadingTactics] = useState<string | null>(null);

  const addGoal = () => {
    if (cycle.goals.length >= 3) return;
    updateCycle(prev => prev ? {
      ...prev,
      goals: [...prev.goals, {
        id: crypto.randomUUID(),
        title: '',
        description: '',
        tactics: [],
        lagIndicator: '',
        targetLagValue: 0,
        currentLagValue: 0
      }]
    } : null);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    updateCycle(prev => prev ? {
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, ...updates } : g)
    } : null);
  };

  const handleSuggestTactics = async (goalId: string, title: string) => {
    if (!title) return;
    setLoadingTactics(goalId);
    try {
      const suggestions = await suggestTactics(title);
      updateGoal(goalId, {
        tactics: [...(cycle.goals.find(g => g.id === goalId)?.tactics || []), ...suggestions.map(s => ({
          id: crypto.randomUUID(),
          description: s.description || 'New Tactic',
          frequency: (s.frequency as 'daily' | 'weekly') || 'weekly',
          target: s.target || 1
        }))]
      });
    } catch (e) {}
    setLoadingTactics(null);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <section className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
          <Target className="text-blue-600" size={32} />
          Core Vision
        </h3>
        <textarea
          value={cycle.vision}
          onChange={(e) => updateCycle(p => p ? {...p, vision: e.target.value} : null)}
          className="w-full h-40 p-8 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-blue-500 focus:outline-none text-slate-700 text-lg italic transition-all"
        />
      </section>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-slate-900">12-Week Goals</h3>
          <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full">{cycle.goals.length} / 3</span>
        </div>

        {cycle.goals.map((goal, idx) => (
          <div key={goal.id} className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden group">
            <div className="p-8 border-b border-slate-50 bg-slate-50/30">
              <div className="flex items-start justify-between gap-6 mb-8">
                <div className="flex-1 flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shrink-0">
                    {idx + 1}
                  </div>
                  <input
                    type="text"
                    value={goal.title}
                    onChange={(e) => updateGoal(goal.id, { title: e.target.value })}
                    placeholder="Goal Title"
                    className="w-full text-2xl font-black bg-transparent border-none focus:outline-none placeholder:text-slate-200"
                  />
                </div>
                <button onClick={() => updateCycle(p => p ? {...p, goals: p.goals.filter(g => g.id !== goal.id)} : null)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <BarChart3 size={14} /> Lag Indicator (Desired Outcome)
                  </label>
                  <input
                    type="text"
                    value={goal.lagIndicator}
                    onChange={(e) => updateGoal(goal.id, { lagIndicator: e.target.value })}
                    placeholder="e.g. Total Revenue"
                    className="w-full p-4 bg-white border border-slate-100 rounded-2xl focus:border-blue-500 focus:outline-none text-sm font-bold"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    Target Value
                  </label>
                  <input
                    type="number"
                    value={goal.targetLagValue}
                    onChange={(e) => updateGoal(goal.id, { targetLagValue: parseInt(e.target.value) })}
                    className="w-full p-4 bg-white border border-slate-100 rounded-2xl focus:border-blue-500 focus:outline-none text-sm font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Weekly Tactics (Lead Indicators)</h4>
                <button 
                  onClick={() => handleSuggestTactics(goal.id, goal.title)}
                  disabled={loadingTactics === goal.id}
                  className="text-blue-600 text-xs font-black flex items-center gap-1 hover:underline disabled:opacity-50"
                >
                  <Sparkles size={14} /> {loadingTactics === goal.id ? 'Analyzing...' : 'AI Suggest Tactics'}
                </button>
              </div>

              <div className="space-y-3">
                {goal.tactics.map(tactic => (
                  <div key={tactic.id} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl group/tactic">
                    <input
                      type="text"
                      value={tactic.description}
                      onChange={(e) => updateGoal(goal.id, { tactics: goal.tactics.map(t => t.id === tactic.id ? {...t, description: e.target.value} : t) })}
                      className="flex-1 bg-transparent border-none focus:outline-none font-bold text-slate-700 text-sm"
                    />
                    <div className="flex items-center gap-2">
                      <select 
                        value={tactic.frequency}
                        onChange={(e) => updateGoal(goal.id, { tactics: goal.tactics.map(t => t.id === tactic.id ? {...t, frequency: e.target.value as any} : t) })}
                        className="bg-white text-xs font-bold border border-slate-200 rounded-lg px-2 py-1"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </select>
                      <input
                        type="number"
                        value={tactic.target}
                        onChange={(e) => updateGoal(goal.id, { tactics: goal.tactics.map(t => t.id === tactic.id ? {...t, target: parseInt(e.target.value)} : t) })}
                        className="w-12 text-center text-xs font-bold bg-white border border-slate-200 rounded-lg py-1"
                      />
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => updateGoal(goal.id, { tactics: [...goal.tactics, { id: crypto.randomUUID(), description: '', frequency: 'weekly', target: 1 }] })}
                  className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-300 font-bold text-sm hover:border-blue-200 hover:text-blue-500 transition-all"
                >
                  + Add Tactic
                </button>
              </div>
            </div>
          </div>
        ))}

        {cycle.goals.length < 3 && (
          <button onClick={addGoal} className="w-full py-16 border-4 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center gap-4 text-slate-300 hover:text-blue-500 hover:border-blue-100 transition-all bg-white/50">
            <Plus size={48} />
            <span className="font-black text-xl">Start New 12-Week Focus</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Planning;
