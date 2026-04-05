"use client";

import { useState, useEffect } from "react";
import { generateQuiz, QuizQuestion, Country } from "../../lib/quizGenerator";
import { useProgressStore } from "../../lib/store";
import countriesData from "../../data/countries.json";
import { formatPopulation } from "../../lib/formatters";

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<"idle" | "playing" | "finished">("idle");
  const [selectedOption, setSelectedOption] = useState<Country | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const updateHighScore = useProgressStore((s) => s.updateHighScore);

  const startQuiz = () => {
    const q = generateQuiz(countriesData as Country[]);
    setQuestions(q);
    setCurrentIdx(0);
    setScore(0);
    setStatus("playing");
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const handleOptionSelect = (option: Country) => {
    if (selectedOption) return;
    
    setSelectedOption(option);
    const correct = option.code === questions[currentIdx].correct.code;
    setIsCorrect(correct);
    if (correct) setScore((s) => s + 1);

    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx((i) => i + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setStatus("finished");
        updateHighScore(score + (correct ? 1 : 0));
      }
    }, 1500);
  };

  if (status === "idle") {
    return (
      <div className="container" style={styles.center}>
        <h1 style={{ fontSize: "48px", marginBottom: "16px" }}>Ready?</h1>
        <p style={{ color: "#6b7280", marginBottom: "32px" }}>10 questions to test your flag knowledge.</p>
        <button onClick={startQuiz} style={styles.startBtn}>Start Quiz</button>
      </div>
    );
  }

  if (status === "finished") {
    return (
      <div className="container" style={styles.center}>
        <h1 style={{ fontSize: "48px", marginBottom: "8px" }}>Quiz Over!</h1>
        <p style={{ fontSize: "24px", color: "#2563eb", fontWeight: "bold", marginBottom: "32px" }}>
          Your Score: {score} / {questions.length}
        </p>
        <button onClick={startQuiz} style={styles.startBtn}>Try Again</button>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="container" style={{ padding: "40px 16px", maxWidth: "600px" }}>
      <div style={styles.progress}>
        Question {currentIdx + 1} of {questions.length}
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      <div style={styles.questionCard}>
        <h2 style={styles.questionTitle}>
          {q.type === "flag-to-name" && "Which country does this flag belong to?"}
          {q.type === "name-to-flag" && `Which one is the flag of ${q.correct.name}?`}
          {q.type === "capital" && `What is the capital of ${q.correct.name}?`}
          {q.type === "population" && `Which country has a population of about ${formatPopulation(q.correct.population)}?`}
        </h2>

        {q.type === "flag-to-name" && (
          <img src={q.correct.flagUrl} alt="Flag" style={styles.mainFlag} />
        )}

        <div style={styles.optionsGrid}>
          {q.options.map((opt) => {
            const isSelected = selectedOption?.code === opt.code;
            const isActuallyCorrect = opt.code === q.correct.code;
            
            let btnStyle = { ...styles.optionBtn };
            if (selectedOption) {
              if (isActuallyCorrect) btnStyle = { ...btnStyle, ...styles.optionCorrect };
              else if (isSelected) btnStyle = { ...btnStyle, ...styles.optionWrong };
            }

            return (
              <button
                key={opt.code}
                onClick={() => handleOptionSelect(opt)}
                disabled={!!selectedOption}
                style={btnStyle}
              >
                {q.type === "name-to-flag" ? (
                  <img src={opt.flagUrl} alt="Flag" style={styles.optionFlag} />
                ) : (
                  <span>
                    {q.type === "capital" ? opt.capital : opt.name}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, any> = {
  center: {
    height: "calc(100vh - 64px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  startBtn: {
    padding: "16px 40px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "bold",
  },
  progress: {
    marginBottom: "24px",
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: "600",
  },
  progressBar: {
    height: "8px",
    backgroundColor: "#e5e7eb",
    borderRadius: "4px",
    marginTop: "8px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2563eb",
    transition: "width 0.3s",
  },
  questionCard: {
    backgroundColor: "#ffffff",
    padding: "32px",
    borderRadius: "24px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  },
  questionTitle: {
    fontSize: "20px",
    fontWeight: "800",
    textAlign: "center",
    marginBottom: "24px",
  },
  mainFlag: {
    width: "100%",
    aspectRatio: "3/2",
    objectFit: "contain" as const,
    backgroundColor: "#f3f4f6",
    borderRadius: "12px",
    marginBottom: "32px",
    border: "1px solid #f3f4f6",
  },
  optionsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  optionBtn: {
    padding: "12px",
    borderRadius: "12px",
    backgroundColor: "#f9fafb",
    border: "2px solid #f3f4f6",
    fontSize: "15px",
    fontWeight: "600",
    color: "#374151",
    transition: "all 0.2s",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  optionCorrect: {
    backgroundColor: "#dcfce7",
    borderColor: "#22c55e",
    color: "#166534",
  },
  optionWrong: {
    backgroundColor: "#fee2e2",
    borderColor: "#ef4444",
    color: "#991b1b",
  },
  optionFlag: {
    width: "100%",
    height: "80px",
    objectFit: "contain" as const,
    borderRadius: "4px",
  },
};
