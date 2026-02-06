
import React, { useState, useEffect } from 'react';
import { Cycle } from '../types';
import { getAIFeedback } from '../services/geminiService';
import { Sparkles, Send, BrainCircuit } from 'lucide-react';

interface Props {
  cycle: Cycle;
}

const AICoach: React.FC<Props> = ({ cycle }) => {
  const [feedback, setFeedback] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const requestFeedback = async () => {
    setLoading(true);
    try {
      const result = await getAIFeedback(cycle.vision, cycle.goals);
      setFeedback(result || 'No feedback received.');
    } catch (e) {
      setFeedback('Failed to connect to AI Coach. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cycle.goals.length > 0 && !feedback) {
      requestFeedback();
    }
  }, []);

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <header className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 text-blue-600 rounded-2xl mb-2">
          <BrainCircuit size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">AI Strategy Coach</h2>
        <p className="text-slate-500 max-w-xl mx-auto">
          Gemini analyzes your 12-week plan for weaknesses and suggests optimizations for better execution.
        </p>
      </header>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
              <div>
                <p className="text-white font-bold">12WY Strategist</p>
                <p className="text-slate-400 text-xs">Ready to optimize your performance</p>
              </div>
            </div>
            <button 
              onClick={requestFeedback}
              disabled={loading}
              className="bg-white hover:bg-slate-50 text-slate-900 px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Refresh Analysis'}
            </button>
          </div>

          <div className="p-8 min-h-[400px] prose prose-slate max-w-none">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 pt-20">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium">Evaluating your 12-week framework...</p>
              </div>
            ) : feedback ? (
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium">
                {feedback}
              </div>
            ) : (
              <div className="text-center pt-20 text-slate-400">
                <p>Click "Refresh Analysis" to get feedback on your plan.</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl text-orange-800 text-sm">
            <h4 className="font-bold mb-1">Coach Tip</h4>
            <p>Ensure your tactics are 100% in your control. "Close 5 sales" is a goal. "Call 10 prospects" is a tactic.</p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl text-purple-800 text-sm">
            <h4 className="font-bold mb-1">Execution Check</h4>
            <p>Execution trumps strategy. A mediocre plan executed with 90% discipline beats a perfect plan with 50% discipline.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
