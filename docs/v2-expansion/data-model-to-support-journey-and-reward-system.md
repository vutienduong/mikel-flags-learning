Dưới đây là data model đủ để support **Journey + Reward System**, tận dụng data hiện có của app: `code`, `name`, `capital`, `population`, `area`, `languages`, `region`, `flagUrl` .

---

# 1. Country model

Giữ model hiện tại, thêm vài field phục vụ game.

```ts
export type Country = {
  code: string; // "VN"
  name: string;
  capital: string;
  population: number;
  area: number;
  languages: string[];
  region: string;
  flagUrl: string;

  subregion?: string;
  difficulty?: 1 | 2 | 3 | 4 | 5;
  funFacts?: string[];
};
```

---

# 2. Journey model

Journey là một learning path, ví dụ: “Southeast Asia”, “Europe Starter”, “World Explorer”.

```ts
export type Journey = {
  id: string; // "southeast-asia"
  title: string; // "Southeast Asia"
  description: string;
  region?: string;
  countryCodes: string[]; // ordered path
  unlockRequirement?: UnlockRequirement;
  reward?: RewardBundle;
};
```

Ví dụ:

```ts
export const journeys: Journey[] = [
  {
    id: "southeast-asia",
    title: "Southeast Asia",
    description: "Start your flag adventure near home.",
    region: "Asia",
    countryCodes: ["VN", "TH", "MY", "SG", "ID", "PH"],
    reward: {
      xp: 100,
      badges: ["southeast-asia-explorer"],
    },
  },
];
```

---

# 3. Journey progress

Track user đang đi tới đâu.

```ts
export type JourneyProgress = {
  journeyId: string;
  status: "locked" | "available" | "in_progress" | "completed";
  currentIndex: number;
  completedCountryCodes: string[];
  totalStars: number;
  bestStarsByCountry: Record<string, number>;
  completedAt?: string;
};
```

Ví dụ:

```ts
{
  journeyId: "southeast-asia",
  status: "in_progress",
  currentIndex: 2,
  completedCountryCodes: ["VN", "TH"],
  totalStars: 5,
  bestStarsByCountry: {
    VN: 3,
    TH: 2
  }
}
```

---

# 4. Level model

Mỗi country node trong journey có thể có nhiều challenge.

```ts
export type Level = {
  id: string; // "southeast-asia-vn-spot"
  journeyId: string;
  countryCode: string;
  order: number;
  gameType: GameType;
  difficulty: 1 | 2 | 3 | 4 | 5;
  reward: RewardBundle;
};
```

```ts
export type GameType =
  | "spot_odd_flag"
  | "flag_to_country"
  | "country_to_flag"
  | "capital_quiz"
  | "drag_match"
  | "speed_round";
```

---

# 5. Game session model

Dùng cho mỗi lần chơi.

```ts
export type GameSession = {
  id: string;
  levelId: string;
  journeyId?: string;
  countryCode: string;
  gameType: GameType;

  startedAt: string;
  endedAt?: string;

  result?: "win" | "lose" | "quit";
  score: number;
  stars: 0 | 1 | 2 | 3;
  timeSpentMs: number;
  mistakes: number;
};
```

---

# 6. Reward model

Reward nên generic để sau này mở rộng.

```ts
export type RewardBundle = {
  xp?: number;
  coins?: number;
  badges?: string[];
  stickers?: string[];
  unlockJourneys?: string[];
  unlockCountries?: string[];
};
```

Ví dụ:

```ts
{
  xp: 20,
  coins: 5,
  stickers: ["flag-vn-sticker"]
}
```

---

# 7. Badge model

```ts
export type Badge = {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: UnlockRequirement;
};
```

Ví dụ:

```ts
{
  id: "southeast-asia-explorer",
  title: "Southeast Asia Explorer",
  description: "Complete all countries in Southeast Asia.",
  icon: "🌏",
  requirement: {
    type: "complete_journey",
    journeyId: "southeast-asia"
  }
}
```

---

# 8. Unlock requirement

Dùng cho journey, badge, sticker, mini-game.

```ts
export type UnlockRequirement =
  | {
      type: "always";
    }
  | {
      type: "complete_journey";
      journeyId: string;
    }
  | {
      type: "complete_country";
      countryCode: string;
    }
  | {
      type: "earn_stars";
      stars: number;
    }
  | {
      type: "reach_level";
      level: number;
    }
  | {
      type: "daily_streak";
      days: number;
    };
```

---

# 9. User profile / global progress

```ts
export type UserGameProgress = {
  xp: number;
  level: number;
  coins: number;

  streak: {
    current: number;
    best: number;
    lastPlayedDate?: string;
  };

  learnedCountryCodes: string[];
  unlockedJourneyIds: string[];
  unlockedCountryCodes: string[];

  badges: string[];
  stickers: string[];

  journeyProgressById: Record<string, JourneyProgress>;

  stats: {
    totalGamesPlayed: number;
    totalWins: number;
    totalMistakes: number;
    bestScore: number;
  };
};
```

---

# 10. Recommended Zustand store shape

```ts
type GameStore = {
  progress: UserGameProgress;

  startSession: (level: Level) => GameSession;
  finishSession: (session: GameSession) => void;

  unlockJourney: (journeyId: string) => void;
  completeCountry: (
    journeyId: string,
    countryCode: string,
    stars: 0 | 1 | 2 | 3
  ) => void;

  grantReward: (reward: RewardBundle) => void;
  resetProgress: () => void;
};
```

---

# 11. Reward calculation logic

```ts
export function calculateLevelReward(session: GameSession): RewardBundle {
  const baseXp = 10;
  const starBonus = session.stars * 5;
  const mistakePenalty = session.mistakes * 2;

  return {
    xp: Math.max(5, baseXp + starBonus - mistakePenalty),
    coins: session.result === "win" ? session.stars : 0,
  };
}
```

---

# 12. Star logic

```ts
export function calculateStars(session: GameSession): 0 | 1 | 2 | 3 {
  if (session.result !== "win") return 0;

  if (session.mistakes === 0 && session.timeSpentMs <= 8000) return 3;
  if (session.mistakes <= 1 && session.timeSpentMs <= 12000) return 2;

  return 1;
}
```

---

# 13. Unlock next country logic

```ts
export function getNextCountryToUnlock(
  journey: Journey,
  progress: JourneyProgress
): string | null {
  const nextIndex = progress.currentIndex + 1;
  return journey.countryCodes[nextIndex] ?? null;
}
```

---

# 14. Minimal MVP tables/files

Nếu bạn dùng local JSON/Zustand trước, chỉ cần:

```txt
data/
  countries.json
  journeys.json
  badges.json
  stickers.json

store/
  gameProgressStore.ts

lib/
  reward.ts
  unlock.ts
  stars.ts
  journey.ts
```

---

# Opinion của tôi

MVP nên bắt đầu với **JourneyProgress + RewardBundle + UserGameProgress** trước. Đừng build quá sớm `coins`, `stickers`, `levels`, `badges` phức tạp.

Version đầu tiên chỉ cần:

```ts
UserGameProgress
Journey
JourneyProgress
GameSession
RewardBundle
```

Sau đó mới thêm badge/sticker system.
