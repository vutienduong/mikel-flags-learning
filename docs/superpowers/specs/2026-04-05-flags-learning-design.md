# Flags Learning App — Design Spec

**Date:** 2026-04-05
**Target:** Children learning world flags via React Native + Expo

---

## Overview

A mobile app for children to learn flags of ~195 countries. Each country has: flag image, capital, population, area, and languages. Two core modes: Flashcard (browse) and Quiz (test knowledge).

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Expo SDK 52 + Expo Router v4 |
| State | Zustand |
| Persistence | AsyncStorage (via Zustand persist middleware) |
| Images | expo-image + flagcdn.com (lazy-load PNG) |
| Data | countries.json bundled in app |

---

## Architecture

### File Structure

```
app/
├── (tabs)/
│   ├── _layout.tsx          # Tab bar (4 tabs)
│   ├── index.tsx            # Home screen
│   ├── flashcard.tsx        # Flashcard browse screen
│   ├── quiz.tsx             # Quiz screen
│   └── progress.tsx         # Progress/stats screen
├── country/[code].tsx       # Country detail screen
└── _layout.tsx              # Root layout

assets/
└── data/
    └── countries.json       # Bundled country data (~195 entries)

store/
└── progressStore.ts         # Zustand store with AsyncStorage persist

components/
├── CountryCard.tsx          # Reusable flag card
├── QuizQuestion.tsx         # Quiz question + options
└── RegionFilter.tsx         # Filter bar for flashcard screen
```

### Navigation Flow

- **Tab bar** with 4 tabs: Home / Flashcard / Quiz / Progress
- Flashcard → tap a card → `country/[code]` (detail, stack push)
- Quiz result shown inline (no navigation), with "Play again" button

---

## Data Model

### Country (countries.json)

```typescript
interface Country {
  code: string;        // ISO 3166-1 alpha-2, e.g. "VN"
  name: string;        // "Vietnam"
  capital: string;     // "Hanoi"
  population: number;  // 97000000
  area: number;        // 331212 (km²)
  languages: string[]; // ["Vietnamese"]
  region: string;      // "Asia" | "Europe" | "Africa" | "Americas" | "Oceania"
  flagUrl: string;     // "https://flagcdn.com/w320/vn.png"
}
```

### Zustand Progress Store

```typescript
interface ProgressStore {
  learnedCodes: string[];           // country codes viewed in flashcard
  quizHighScore: number;            // best quiz score
  quizTotalPlayed: number;          // total quiz sessions played
  markLearned: (code: string) => void;
  updateHighScore: (score: number) => void;
  resetProgress: () => void;
}
// Persisted to AsyncStorage automatically via Zustand persist middleware
```

### Quiz Session State (local to quiz screen)

```typescript
type QuizQuestionType = "flag-to-name" | "name-to-flag" | "capital" | "population";

interface QuizQuestion {
  type: QuizQuestionType;
  correct: Country;
  options: Country[];  // 4 choices including correct
}
```

---

## Screens

### Home Screen (`index.tsx`)
- Decorative background: random 6 flag thumbnails
- Quick stat: "X / 195 countries learned"
- Two primary CTAs: "Khám phá cờ" (→ Flashcard tab) and "Làm quiz" (→ Quiz tab)

### Flashcard Screen (`flashcard.tsx`)
- Region filter bar at top: All / Asia / Europe / Africa / Americas / Oceania
- FlatList of CountryCard components (2-column grid)
- Each card: flag image + country name + capital
- Tap card → Country Detail screen
- Navigating to Country Detail calls `markLearned(code)` (scroll-past does not count)

### Country Detail Screen (`country/[code].tsx`)
- Full-width flag image at top
- Info rows: Name, Capital, Population (formatted: "97M"), Area (formatted: "331K km²"), Languages, Region

### Quiz Screen (`quiz.tsx`)
- 10 questions per game, randomly mixed from 4 question types:
  - `flag-to-name`: show flag image, pick country name (4 options)
  - `name-to-flag`: show country name, pick correct flag (4 flag images)
  - `capital`: show flag + country name, pick correct capital (4 options)
  - `population`: show flag + country name, pick correct population from 4 real country populations
- Progress bar at top showing current question (e.g. 3/10)
- After each answer: highlight correct (green) / wrong (red), then Next button
- Score = number of correct answers out of 10
- Result screen (inline): score display (e.g. "7/10"), comparison to high score, "Play again" button

### Progress Screen (`progress.tsx`)
- Countries learned: progress bar + count (e.g. "47 / 195")
- Quiz high score
- Total quiz sessions played
- "Reset progress" button (with confirmation dialog)

---

## Key Implementation Notes

- **Flag images:** Loaded from `https://flagcdn.com/w320/{code.toLowerCase()}.png`. Use `expo-image` for caching. Show a placeholder while loading.
- **Population display:** Format with `Intl.NumberFormat` or a simple helper (97000000 → "97M", 500000 → "500K").
- **Quiz randomization:** Shuffle countries array, pick 10, generate wrong options by sampling other countries from same region when possible (makes it harder/more realistic).
- **No internet required for core data:** countries.json is bundled. Only flag images require network; graceful fallback (emoji flag or placeholder) if offline.

---

## Out of Scope (v1)

- User accounts / cloud sync
- Animations between flashcards (swipe gesture)
- Sound effects
- Localization (app in Vietnamese by default)
- Leaderboards
