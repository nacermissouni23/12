
export enum BlockType {
  STRATEGIC = 'STRATEGIC',
  BUFFER = 'BUFFER',
  BREAKOUT = 'BREAKOUT'
}

export interface Tactic {
  id: string;
  description: string;
  frequency: 'daily' | 'weekly';
  target: number; 
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  tactics: Tactic[];
  lagIndicator: string; // The measurable result (e.g., "$10k revenue")
  targetLagValue: number;
  currentLagValue: number;
}

export interface WeeklyExecution {
  weekNumber: number;
  completions: Record<string, number>;
  reflections: string;
  score: number;
}

export interface AccountabilityPartner {
  id: string;
  name: string;
}

export interface Cycle {
  id: string;
  startDate: string;
  vision: string;
  goals: Goal[];
  executions: WeeklyExecution[];
  onboardingCompleted: boolean;
  streak: number;
}
