export type Country = {
  code: string;
  name: string;
  capital: string;
  population: number;
  area: number;
  languages: string[];
  region: string;
  flagUrl: string;
};

export type GameType = "spot_odd_flag" | "flag_to_country" | "country_to_flag";

export type RewardBundle = {
  xp?: number;
  badges?: string[];
  unlockCountries?: string[];
};

export type Journey = {
  id: string;
  title: string;
  description: string;
  region?: string;
  heroImage: string;
  countryCodes: string[];
  reward?: RewardBundle;
};

export type JourneyProgress = {
  journeyId: string;
  status: "locked" | "available" | "in_progress" | "completed";
  currentIndex: number;
  countryCodes: string[];
  completedCountryCodes: string[];
  totalStars: number;
  bestStarsByCountry: Record<string, number>;
  completedAt?: string;
};

export type GameSession = {
  id: string;
  journeyId?: string;
  countryCode: string;
  gameType: GameType;
  startedAt: string;
  endedAt?: string;
  result?: "win" | "lose";
  score: number;
  stars: 0 | 1 | 2 | 3;
  timeSpentMs: number;
  mistakes: number;
};

export type UserGameProgress = {
  schemaVersion: 3;
  xp: number;
  level: number;
  streak: {
    current: number;
    best: number;
    lastPlayedDate?: string;
  };
  learnedCountryCodes: string[];
  unlockedJourneyIds: string[];
  unlockedCountryCodes: string[];
  badges: string[];
  journeyProgressById: Record<string, JourneyProgress>;
  stats: {
    totalGamesPlayed: number;
    totalWins: number;
    totalMistakes: number;
    bestScore: number;
    quizHighScore: number;
    quizTotalPlayed: number;
  };
};
