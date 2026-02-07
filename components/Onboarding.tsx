
import React, { useState, useEffect } from 'react';
import { Cycle } from '../types';
import { Sparkles, ArrowRight, ShieldCheck, Target } from 'lucide-react';
import { generateVisionPrompts } from '../services/openRouterService';

interface Props {
  cycle: Cycle;
  updateCycle: (updater: (prev: Cycle | null) => Cycle | null) => void;
  onComplete: () => void;
}

const Onboarding: React.FC<Props> = ({ cycle, updateCycle, onComplete }) => {
  const [step, setStep] = useState(0);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [vision, setVision] = useState(cycle.vision || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    generateVisionPrompts()
      .then(setPrompts)
      .catch(err => {
        console.error('Failed to generate prompts:', err);
        // Fallback prompts
        setPrompts([
          "What would make this the most transformative 12 weeks of your life?",
          "What fear are you finally ready to overcome?",
          "If failure were impossible, what would you pursue?",
          "What daily habit would fundamentally change your trajectory?",
          "What will you regret NOT starting in the next 12 weeks?",
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const steps = [
    {
      title: "Welcome to your first 12 Week Year",
      desc: "Execution is the single greatest differentiator. We're going to turn your year into 12 weeks of focused intensity.",
      icon: <ShieldCheck className="text-blue-600" size={40} />
    },
    {
      title: "The Vision",
      desc: "A compelling vision is what keeps you going during week 8. Think 3 years out. Who are you? What have you built?",
      icon: <Sparkles className="text-purple-600" size={40} />
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Save vision and complete onboarding
      updateCycle(prev => prev ? {
        ...prev,
        vision: vision,
        onboardingCompleted: true
      } : null);
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-slate-50 rounded-3xl mb-4">{steps[step].icon}</div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{steps[step].title}</h1>
          <p className="text-slate-500 text-lg">{steps[step].desc}</p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-2">
              {loading ? (
                <div className="text-xs font-bold text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100 italic text-center">
                  Loading inspiration prompts...
                </div>
              ) : (
                prompts.map((p, i) => (
                  <div key={i} className="text-xs font-bold text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                    "{p}"
                  </div>
                ))
              )}
            </div>
            <textarea
              className="w-full h-48 p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-blue-500 focus:outline-none text-slate-800 text-lg transition-all"
              placeholder="Write your long-term vision here..."
              value={vision}
              onChange={(e) => setVision(e.target.value)}
            />
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={step === 1 && !vision.trim()}
          className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {step === 0 ? "Let's Get Started" : "Commit to this Vision"}
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
