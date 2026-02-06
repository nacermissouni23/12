
import React from 'react';
import { Cycle } from '../types';
import { Calendar, Download, Wand2, CheckCircle, FileText, Sparkles } from 'lucide-react';

const MicroTools: React.FC<{ cycle: Cycle }> = ({ cycle }) => {
  const exportICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//12WY Catalyst//EN
BEGIN:VEVENT
SUMMARY:12WY Strategic Block
DESCRIPTION:Deep work on 12-week year tactics. No interruptions.
DTSTART:20250101T090000Z
DTEND:20250101T120000Z
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
          <button className="w-full bg-slate-50 text-slate-900 py-3 rounded-2xl font-bold hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center gap-2">
            <Sparkles size={18} /> Refine Vision
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <FileText className="text-green-600 mb-6 group-hover:scale-110 transition-transform" size={32} />
          <h3 className="text-xl font-bold text-slate-900 mb-2">PDF Weekly Planner</h3>
          <p className="text-slate-500 text-sm mb-6">Generate a clean, printable scorecard for the fridge. Analog tracking beats digital 50% of the time.</p>
          <button className="w-full bg-slate-50 text-slate-900 py-3 rounded-2xl font-bold hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-2">
            <Download size={18} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default MicroTools;
