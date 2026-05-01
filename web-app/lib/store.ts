"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { journeys, southeastAsiaMilestone } from "../data/journeys";
import { getInitialJourneyProgress, getJourney, getNextCountryCode } from "./journey";
import type { GameSession, JourneyProgress, RewardBundle, UserGameProgress } from "./types";

type LegacyProgress = {
  learnedCodes?: string[];
  quizHighScore?: number;
  quizTotalPlayed?: number;
};

type GameProgressState = {
  progress: UserGameProgress;
  markLearned: (code: string) => void;
  updateHighScore: (score: number) => void;
  startSession: (countryCode: string, journeyId?: string) => GameSession;
  finishSession: (session: GameSession) => void;
  completeCountry: (
    journeyId: string | undefined,
    countryCode: string,
    stars: 0 | 1 | 2 | 3,
    session?: Partial<GameSession>
  ) => void;
  grantReward: (reward: RewardBundle) => void;
  resetProgress: () => void;
};

const primaryJourney = journeys[0];

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayKey() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

function makeInitialProgress(legacy?: LegacyProgress): UserGameProgress {
  const journeyProgressById: Record<string, JourneyProgress> = {};
  for (const journey of journeys) {
    journeyProgressById[journey.id] = getInitialJourneyProgress(journey);
  }

  const learnedCountryCodes = unique(legacy?.learnedCodes ?? []);

  return {
    schemaVersion: 2,
    xp: 0,
    level: 1,
    streak: {
      current: 1,
      best: 1,
    },
    learnedCountryCodes,
    unlockedJourneyIds: [primaryJourney.id],
    unlockedCountryCodes: [primaryJourney.countryCodes[0], ...learnedCountryCodes],
    badges: [],
    journeyProgressById,
    stats: {
      totalGamesPlayed: legacy?.quizTotalPlayed ?? 0,
      totalWins: 0,
      totalMistakes: 0,
      bestScore: legacy?.quizHighScore ?? 0,
      quizHighScore: legacy?.quizHighScore ?? 0,
      quizTotalPlayed: legacy?.quizTotalPlayed ?? 0,
    },
  };
}

function ensureJourney(progress: UserGameProgress, journeyId: string) {
  const journey = getJourney(journeyId);
  if (!journey) return progress;

  if (progress.journeyProgressById[journeyId]) return progress;

  return {
    ...progress,
    journeyProgressById: {
      ...progress.journeyProgressById,
      [journeyId]: getInitialJourneyProgress(journey),
    },
  };
}

function applyStreak(progress: UserGameProgress) {
  const today = todayKey();
  if (progress.streak.lastPlayedDate === today) return progress;

  const nextCurrent =
    progress.streak.lastPlayedDate === yesterdayKey()
      ? progress.streak.current + 1
      : 1;

  return {
    ...progress,
    streak: {
      current: nextCurrent,
      best: Math.max(progress.streak.best, nextCurrent),
      lastPlayedDate: today,
    },
  };
}

function calculateXp(stars: number, mistakes = 0) {
  return Math.max(5, 10 + stars * 5 - mistakes * 2);
}

export const useGameProgressStore = create<GameProgressState>()(
  persist(
    (set, get) => ({
      progress: makeInitialProgress(),
      markLearned: (code) =>
        set((state) => ({
          progress: {
            ...state.progress,
            learnedCountryCodes: unique([...state.progress.learnedCountryCodes, code]),
          },
        })),
      updateHighScore: (score) =>
        set((state) => ({
          progress: {
            ...state.progress,
            stats: {
              ...state.progress.stats,
              quizHighScore: Math.max(state.progress.stats.quizHighScore, score),
              quizTotalPlayed: state.progress.stats.quizTotalPlayed + 1,
              bestScore: Math.max(state.progress.stats.bestScore, score),
            },
          },
        })),
      startSession: (countryCode, journeyId) => ({
        id: `session-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        journeyId,
        countryCode,
        gameType: "spot_odd_flag",
        startedAt: new Date().toISOString(),
        score: 0,
        stars: 0,
        timeSpentMs: 0,
        mistakes: 0,
      }),
      finishSession: (session) => {
        if (session.result === "win") {
          get().completeCountry(session.journeyId, session.countryCode, session.stars, session);
        }
      },
      completeCountry: (journeyId, countryCode, stars, session = {}) =>
        set((state) => {
          let progress = applyStreak(state.progress);
          const mistakes = session.mistakes ?? 0;
          const score = session.score ?? stars * 100;
          const earnedXp = calculateXp(stars, mistakes);
          const badges = [...progress.badges];

          if (!badges.includes("first-quest")) badges.push("first-quest");
          const isSoutheastAsiaMilestone =
            journeyId === primaryJourney.id &&
            countryCode === southeastAsiaMilestone.finalCountryCode &&
            southeastAsiaMilestone.countryCodes.every((code) =>
              [...progress.learnedCountryCodes, countryCode].includes(code)
            );
          const shouldGrantSoutheastAsiaMilestone =
            isSoutheastAsiaMilestone &&
            southeastAsiaMilestone.reward.badges.some((badge) => !badges.includes(badge));

          if (shouldGrantSoutheastAsiaMilestone) {
            for (const badge of southeastAsiaMilestone.reward.badges) {
              if (!badges.includes(badge)) badges.push(badge);
            }
          }

          if (!badges.includes("flag-master")) {
            const totalStars =
              Object.values(progress.journeyProgressById).reduce(
                (sum, journeyProgress) => sum + journeyProgress.totalStars,
                0
              ) + stars;
            if (totalStars >= 20) badges.push("flag-master");
          }

          progress = {
            ...progress,
            xp:
              progress.xp +
              earnedXp +
              (shouldGrantSoutheastAsiaMilestone ? southeastAsiaMilestone.reward.xp : 0),
            level:
              Math.floor(
                (progress.xp +
                  earnedXp +
                  (shouldGrantSoutheastAsiaMilestone ? southeastAsiaMilestone.reward.xp : 0)) /
                  100
              ) + 1,
            learnedCountryCodes: unique([...progress.learnedCountryCodes, countryCode]),
            unlockedCountryCodes: unique([...progress.unlockedCountryCodes, countryCode]),
            badges,
            stats: {
              ...progress.stats,
              totalGamesPlayed: progress.stats.totalGamesPlayed + 1,
              totalWins: progress.stats.totalWins + 1,
              totalMistakes: progress.stats.totalMistakes + mistakes,
              bestScore: Math.max(progress.stats.bestScore, score),
            },
          };

          if (!journeyId || journeyId === "quick") return { progress };

          const journey = getJourney(journeyId);
          if (!journey) return { progress };

          progress = ensureJourney(progress, journeyId);
          const previous = progress.journeyProgressById[journeyId];
          const previousStars = previous.bestStarsByCountry[countryCode] ?? 0;
          const nextStars = Math.max(previousStars, stars);
          const nextCountryCode = getNextCountryCode(journey, countryCode);
          const completedCountryCodes = unique([
            ...previous.completedCountryCodes,
            countryCode,
          ]);
          const isJourneyComplete = completedCountryCodes.length >= journey.countryCodes.length;
          const justCompletedJourney = isJourneyComplete && previous.status !== "completed";
          const journeyRewardXp = justCompletedJourney ? journey.reward?.xp ?? 0 : 0;
          const nextBadges = [...progress.badges];

          if (justCompletedJourney && journey.reward?.badges) {
            for (const badge of journey.reward.badges) {
              if (!nextBadges.includes(badge)) nextBadges.push(badge);
            }
          }

          return {
            progress: {
              ...progress,
              xp: progress.xp + journeyRewardXp,
              level: Math.floor((progress.xp + journeyRewardXp) / 100) + 1,
              badges: nextBadges,
              unlockedCountryCodes: unique([
                ...progress.unlockedCountryCodes,
                countryCode,
                ...(nextCountryCode ? [nextCountryCode] : []),
              ]),
              journeyProgressById: {
                ...progress.journeyProgressById,
                [journeyId]: {
                  ...previous,
                  status: isJourneyComplete ? "completed" : "in_progress",
                  currentIndex: Math.max(
                    previous.currentIndex,
                    Math.min(journey.countryCodes.indexOf(countryCode) + 1, journey.countryCodes.length - 1)
                  ),
                  completedCountryCodes,
                  totalStars: previous.totalStars - previousStars + nextStars,
                  bestStarsByCountry: {
                    ...previous.bestStarsByCountry,
                    [countryCode]: nextStars,
                  },
                  completedAt: isJourneyComplete ? new Date().toISOString() : previous.completedAt,
                },
              },
            },
          };
        }),
      grantReward: (reward) =>
        set((state) => ({
          progress: {
            ...state.progress,
            xp: state.progress.xp + (reward.xp ?? 0),
            badges: unique([...state.progress.badges, ...(reward.badges ?? [])]),
            unlockedCountryCodes: unique([
              ...state.progress.unlockedCountryCodes,
              ...(reward.unlockCountries ?? []),
            ]),
          },
        })),
      resetProgress: () => set({ progress: makeInitialProgress() }),
    }),
    {
      name: "flags-progress",
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persisted: unknown) => {
        const state = persisted as Partial<GameProgressState> & LegacyProgress;
        if (state?.progress?.schemaVersion === 2) return state;
        return { progress: makeInitialProgress(state) };
      },
    }
  )
);

export const useProgressStore = useGameProgressStore;
