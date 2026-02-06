
import React, { useState } from 'react';
import { Cycle } from '../types';
import { Calendar, Download, Wand2, CheckCircle, FileText, Sparkles, Loader2 } from 'lucide-react';
import { refineVision } from '../services/geminiService';

interface Props {
  cycle: Cycle;
  updateCycle: (updater: (prev: Cycle | null) => Cycle | null) => void;
}

const MicroTools: React.FC<Props> = ({ cycle, updateCycle }) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleRefineVision = async () => {
    if (!cycle.vision) {
      alert("Please enter a vision in the Planning tab first!");
      return;
    }
    setLoading('vision');
    try {
      const refined = await refineVision(cycle.vision);
      updateCycle(prev => prev ? { ...prev, vision: refined } : null);
      alert("Vision refined and updated in your plan!");
    } catch (e) {
      alert("Failed to refine vision. Check API key.");
    } finally {
      setLoading(null);
    }
  };

  const handlePrintPlanner = () => {
    window.print();
  };

  const exportICS = () => {
    const start = new Date(cycle.startDate);
    const dateStr = start.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//12WY Catalyst//EN
BEGIN:VEVENT
SUMMARY:12WY Strategic Block
DESCRIPTION:Deep work on 12-week year tactics. No interruptions.
DTSTART:${dateStr}
DTEND:${dateStr}
RRULE:FREQ=DAILY;COUNT=84
END:VEVENT
END:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'strategic_blocks.ics';
    a.click();
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Execution Toolkit</h2>
        <p className="text-slate-500">Free micro-tools to power up your 12-week cycles.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <Calendar className="text-blue-600 mb-6 group-hover:scale-110 transition-transform" size={32} />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Calendar Export</h3>
          <p className="text-slate-500 text-sm mb-6">Instantly block off 3-hour strategic windows in Google/Apple calendar for the next 84 days.</p>
          <button onClick={exportICS} className="w-full bg-slate-50 text-slate-900 py-3 rounded-2xl font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2">
            <Download size={18} /> Export .ics
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <Wand2 className="text-purple-600 mb-6 group-hover:scale-110 transition-transform" size={32} />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Vision Enhancer</h3>
          <p className="text-slate-500 text-sm mb-6">AI will take your messy thoughts and turn them into a clear, compelling 1-page vision statement.</p>
          <button 
            onClick={handleRefineVision}
            disabled={loading === 'vision'}
            className="w-full bg-slate-50 text-slate-900 py-3 rounded-2xl font-bold hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading === 'vision' ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />} 
            Refine Vision
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <FileText className="text-green-600 mb-6 group-hover:scale-110 transition-transform" size={32} />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Print Weekly Planner</h3>
          <p className="text-slate-500 text-sm mb-6">Open the print dialog to generate a clean, printable scorecard for the fridge.</p>
          <button 
            onClick={handlePrintPlanner}
            className="w-full bg-slate-50 text-slate-900 py-3 rounded-2xl font-bold hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Download size={18} /> Print PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default MicroTools;
