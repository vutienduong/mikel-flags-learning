export interface Country {
  code: string;
  name: string;
  capital: string;
  population: number;
  area: number;
  languages: string[];
  region: string;
  flagUrl: string;
}

export type QuizQuestionType =
  | "flag-to-name"
  | "name-to-flag"
  | "capital"
  | "population";

export interface QuizQuestion {
  type: QuizQuestionType;
  correct: Country;
  options: Country[]; // 4 shuffled choices; correct is one of them
}

const QUESTION_TYPES: QuizQuestionType[] = [
  "flag-to-name",
  "name-to-flag",
  "capital",
  "population",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateQuiz(countries: Country[]): QuizQuestion[] {
  const pool = shuffle(countries);
  const selected = pool.slice(0, 10);

  return selected.map((correct, i) => {
    const type = QUESTION_TYPES[i % QUESTION_TYPES.length];
    const wrong = shuffle(pool.filter((c) => c.code !== correct.code)).slice(0, 3);
    const options = shuffle([correct, ...wrong]);
    return { type, correct, options };
  });
}
