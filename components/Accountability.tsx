
import React, { useState, useEffect } from 'react';
import { Cycle } from '../types';
import { Users, Timer, CheckCircle2, Share2, ClipboardList } from 'lucide-react';

const Accountability: React.FC<{ cycle: Cycle }> = ({ cycle }) => {
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const agenda = [
    { title: "Review Vision", desc: "Share your compelling vision with the group." },
    { title: "Last Week's Score", desc: "Report your execution percentage. Be honest." },
    { title: "Successes & Failures", desc: "What went right? What blocked you?" },
    { title: "Next Week's Intentions", desc: "Which tactics are you committing to?" }
  ];

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Weekly Accountability Meeting (WAM)</h2>
          <p className="text-slate-500">You are 7x more likely to succeed with a peer group.</p>
        </div>
        <button className="flex items-center gap-2 text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-xl">
          <Share2 size={18} /> Invite Peer
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <ClipboardList className="text-blue-600" size={20} />
              Meeting Agenda
            </h3>
            <div className="space-y-6">
              {agenda.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-blue-600 p-8 rounded-3xl text-white flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">Ready to report?</h3>
              <p className="text-blue-100 text-sm">Have your execution scorecard open.</p>
            </div>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-bold shadow-lg">
              Launch Group Video
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-3xl text-white text-center">
            <Timer className="mx-auto mb-4 text-blue-400" size={32} />
            <div className="text-5xl font-black mb-6 font-mono">{formatTime(timeLeft)}</div>
            <button 
              onClick={() => setTimerRunning(!timerRunning)}
              className={`w-full py-3 rounded-2xl font-bold transition-all ${
                timerRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {timerRunning ? 'Stop Timer' : 'Start 15-Min WAM'}
            </button>
            <p className="mt-4 text-[10px] text-slate-400 uppercase tracking-widest">Keep it tight. 15 mins max.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100">
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Users size={18} className="text-blue-600" />
              Partners
            </h4>
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-full mx-auto flex items-center justify-center text-slate-300 mb-2">
                ?
              </div>
              <p className="text-xs text-slate-400">Invite a partner to compare scores and hold each other accountable.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accountability;
