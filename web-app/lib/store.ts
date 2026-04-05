import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ProgressState {
  learnedCodes: string[];
  quizHighScore: number;
  quizTotalPlayed: number;
  markLearned: (code: string) => void;
  updateHighScore: (score: number) => void;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      learnedCodes: [],
      quizHighScore: 0,
      quizTotalPlayed: 0,
      markLearned: (code) =>
        set((s) => ({
          learnedCodes: s.learnedCodes.includes(code)
            ? s.learnedCodes
            : [...s.learnedCodes, code],
        })),
      updateHighScore: (score) =>
        set((s) => ({
          quizHighScore: Math.max(s.quizHighScore, score),
          quizTotalPlayed: s.quizTotalPlayed + 1,
        })),
      resetProgress: () =>
        set({ learnedCodes: [], quizHighScore: 0, quizTotalPlayed: 0 }),
    }),
    {
      name: "flags-progress",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
