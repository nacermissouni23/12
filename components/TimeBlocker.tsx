
import React from 'react';
import { BlockType } from '../types';
import { Shield, Coffee, Zap, Info } from 'lucide-react';

const TimeBlocker: React.FC = () => {
  const blocks = [
    {
      type: BlockType.STRATEGIC,
      title: 'Strategic Block',
      duration: '3 Hours',
      description: 'Uninterrupted time for your highest impact tactics. No email, no slack, no phone.',
      color: 'bg-blue-600',
      icon: Shield
    },
    {
      type: BlockType.BUFFER,
      title: 'Buffer Block',
      duration: '30-60 Mins',
      description: 'Handle the administrative chaos. Emails, phone calls, and interruptions.',
      color: 'bg-orange-500',
      icon: Zap
    },
    {
      type: BlockType.BREAKOUT,
      title: 'Breakout Block',
      duration: '3 Hours',
      description: 'Renew your energy. No work allowed. Creativity, exercise, or rest.',
      color: 'bg-green-600',
      icon: Coffee
    }
  ];

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Performance Time Management</h2>
        <p className="text-slate-500 mt-2">Structure your day to protect your critical work.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {blocks.map(block => (
          <div key={block.type} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col h-full hover:shadow-md transition-all">
            <div className={`w-12 h-12 rounded-2xl ${block.color} text-white flex items-center justify-center mb-6 shadow-lg shadow-${block.color.split('-')[1]}-200`}>
              <block.icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">{block.title}</h3>
            <p className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">{block.duration}</p>
            <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
              {block.description}
            </p>
            <div className="pt-6 border-t border-slate-50">
              <span className="text-xs font-bold text-slate-400 uppercase">Focus Area</span>
              <p className="text-slate-700 font-semibold mt-1">
                {block.type === BlockType.STRATEGIC ? 'Deep Execution' : 
                 block.type === BlockType.BUFFER ? 'System Maintenance' : 'Recharge & Renewal'}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-3xl p-10 text-white overflow-hidden relative">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <h3 className="text-2xl font-bold">The Ideal Day Structure</h3>
            <p className="text-slate-400">
              Most high performers block their Strategic Time first thing in the morning when energy is highest. 
              Schedule Buffer blocks before lunch and at the end of the day.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 text-xs font-bold text-slate-500">08:00 AM</div>
                <div className="flex-1 h-12 bg-blue-600 rounded-xl flex items-center px-4 font-bold text-sm">Strategic Block (Goal 1 Tactic)</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 text-xs font-bold text-slate-500">11:00 AM</div>
                <div className="flex-1 h-12 bg-orange-500 rounded-xl flex items-center px-4 font-bold text-sm">Buffer Block</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 text-xs font-bold text-slate-500">12:00 PM</div>
                <div className="flex-1 h-12 bg-slate-800 border border-slate-700 rounded-xl flex items-center px-4 font-bold text-sm italic">Lunch & Mobility</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 text-xs font-bold text-slate-500">01:00 PM</div>
                <div className="flex-1 h-12 bg-blue-600/40 border border-blue-500/50 rounded-xl flex items-center px-4 font-bold text-sm">Second Strategic Focus</div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 aspect-square bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
            <div className="text-center">
              <p className="text-5xl font-black text-blue-500">15</p>
              <p className="text-xs uppercase font-bold text-blue-300">Min Planning</p>
              <p className="text-slate-500 mt-2 text-xs">at the start of<br/>every week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeBlocker;
