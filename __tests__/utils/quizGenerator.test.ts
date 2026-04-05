import { generateQuiz } from "../../utils/quizGenerator";
import type { Country } from "../../utils/quizGenerator";

const mockCountries: Country[] = Array.from({ length: 20 }, (_, i) => ({
  code: `c${i}`,
  name: `Country ${i}`,
  capital: `Capital ${i}`,
  population: (i + 1) * 1_000_000,
  area: (i + 1) * 10_000,
  languages: [`Lang${i}`],
  region: i % 2 === 0 ? "Asia" : "Europe",
  flagUrl: `https://flagcdn.com/w320/c${i}.png`,
}));

describe("generateQuiz", () => {
  it("generates exactly 10 questions", () => {
    expect(generateQuiz(mockCountries)).toHaveLength(10);
  });

  it("each question has exactly 4 options", () => {
    generateQuiz(mockCountries).forEach((q) =>
      expect(q.options).toHaveLength(4)
    );
  });

  it("correct country is always among the options", () => {
    generateQuiz(mockCountries).forEach((q) =>
      expect(q.options.map((o) => o.code)).toContain(q.correct.code)
    );
  });

  it("options within a question are all unique countries", () => {
    generateQuiz(mockCountries).forEach((q) => {
      const codes = q.options.map((o) => o.code);
      expect(new Set(codes).size).toBe(4);
    });
  });

  it("all 4 question types appear across repeated runs", () => {
    const types = new Set<string>();
    for (let i = 0; i < 15; i++) {
      generateQuiz(mockCountries).forEach((q) => types.add(q.type));
    }
    expect(types).toContain("flag-to-name");
    expect(types).toContain("name-to-flag");
    expect(types).toContain("capital");
    expect(types).toContain("population");
  });
});
