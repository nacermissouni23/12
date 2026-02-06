
import React from 'react';
import { Cycle } from '../types';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Trophy, ArrowUpRight, Target, Flame, CalendarDays } from 'lucide-react';

const Dashboard: React.FC<{ cycle: Cycle; onNavigateToWeek: () => void }> = ({ cycle, onNavigateToWeek }) => {
  const chartData = cycle.executions.map(ex => ({
    week: `W${ex.weekNumber}`,
    score: ex.score
  }));

  const avgScore = cycle.executions.reduce((acc, curr) => acc + curr.score, 0) / 12;
  const daysLeft = 84 - Math.floor((Date.now() - new Date(cycle.startDate).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Active Cycle</div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Focus on Execution.</h2>
          <p className="text-slate-500 max-w-md italic">"{cycle.vision}"</p>
        </div>
        <button onClick={onNavigateToWeek} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-all shadow-2xl shadow-slate-200">
          Open Weekly Scorecard <ArrowUpRight size={20} />
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center"><Flame size={20} /></div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Urgency</span>
          </div>
          <div className="text-4xl font-black text-slate-900">{Math.max(0, daysLeft)}</div>
          <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-tight">Days Remaining</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Trophy size={20} /></div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Avg Execution</span>
          </div>
          <div className="text-4xl font-black text-slate-900">{Math.round(avgScore)}%</div>
          <p className={`text-xs font-bold mt-2 uppercase tracking-tight ${avgScore >= 85 ? 'text-green-600' : 'text-red-500'}`}>
            {avgScore >= 85 ? 'On Track (85%+)' : 'Needs Intensity'}
          </p>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl md:col-span-2 relative overflow-hidden group">
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 text-white rounded-xl flex items-center justify-center"><Target size={20} /></div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Goal Progress</span>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-black text-white">{cycle.goals.length} Goals Active</div>
              <div className="flex gap-2 mt-4">
                {cycle.goals.map(g => (
                  <div key={g.id} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(g.currentLagValue / g.targetLagValue) * 100 || 0}%` }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            Execution Baseline
            <span className="text-[10px] font-bold text-slate-400 border border-slate-100 px-2 py-0.5 rounded uppercase">12 Week View</span>
          </h3>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} dy={10} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} dx={-10} />
              <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 700 }} />
              <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={5} fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
