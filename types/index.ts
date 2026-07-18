export interface Player {
  id: string;
  name: string;
  phone: string;
  lastPlayed: Date;
  score: number;
  coupon: string;
  reward: string;
  createdAt: Date;
}

export interface GameState {
  score: number;
  timeRemaining: number;
  isGameRunning: boolean;
  isPaused: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  reward: string;
  redeemed: boolean;
  playerId: string;
  createdAt: Date;
}

export interface RewardTier {
  minScore: number;
  maxScore: number;
  discount: string;
  type: 'percentage' | 'fixed' | 'free';
}
