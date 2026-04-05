import { Image } from "expo-image";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useProgressStore } from "../../store/progressStore";
import { formatPopulation } from "../../utils/formatters";
import {
  generateQuiz,
  type Country,
  type QuizQuestion,
  type QuizQuestionType,
} from "../../utils/quizGenerator";

const ALL_COUNTRIES: Country[] = require("../../assets/data/countries.json");

type Phase = "idle" | "playing" | "result";

export default function QuizScreen() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const { quizHighScore, updateHighScore } = useProgressStore();

  function startQuiz() {
    setQuestions(generateQuiz(ALL_COUNTRIES));
    setIndex(0);
    setScore(0);
    setSelected(null);
    setPhase("playing");
  }

  function handleAnswer(code: string) {
    if (selected !== null) return;
    setSelected(code);
    if (code === questions[index].correct.code) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    const isLast = index + 1 >= questions.length;
    if (isLast) {
      updateHighScore(score);
      setPhase("result");
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  }

  if (phase === "idle") {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.title}>Quiz Mode</Text>
        <Text style={styles.subtitle}>10 questions · 4 types</Text>
        {quizHighScore > 0 && (
          <Text style={styles.highScore}>Best: {quizHighScore}/10</Text>
        )}
        <TouchableOpacity style={styles.primaryBtn} onPress={startQuiz}>
          <Text style={styles.primaryBtnText}>Start Quiz</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (phase === "result") {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.title}>Result</Text>
        <Text style={styles.resultScore}>{score}/10</Text>
        <Text style={styles.subtitle}>
          {score >= quizHighScore ? "🎉 New High Score!" : `Best: ${quizHighScore}/10`}
        </Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={startQuiz}>
          <Text style={styles.primaryBtnText}>Play Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const q = questions[index];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { flex: (index + 1) / 10 }]} />
        <View style={{ flex: 1 - (index + 1) / 10 }} />
      </View>
      <Text style={styles.progressText}>{index + 1} / 10</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        <QuestionPrompt question={q} />

        <View style={styles.options}>
          {q.options.map((option) => {
            const isCorrect = option.code === q.correct.code;
            const isSelected = option.code === selected;
            let bg = "#FFFFFF";
            if (selected !== null) {
              if (isCorrect) bg = "#D1FAE5";
              else if (isSelected) bg = "#FEE2E2";
            }

            if (q.type === "name-to-flag") {
              return (
                <TouchableOpacity
                  key={option.code}
                  style={[
                    styles.flagOption,
                    {
                      backgroundColor: bg,
                      borderColor:
                        isCorrect && selected !== null ? "#10B981" : "#E5E7EB",
                    },
                  ]}
                  onPress={() => handleAnswer(option.code)}
                >
                  <Image
                    source={{ uri: option.flagUrl }}
                    style={styles.flagOptionImg}
                    contentFit="cover"
                  />
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={option.code}
                style={[styles.textOption, { backgroundColor: bg }]}
                onPress={() => handleAnswer(option.code)}
              >
                <Text style={styles.textOptionText}>
                  {optionLabel(q.type, option)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selected !== null && (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>
              {index + 1 >= questions.length ? "See Results" : "Next →"}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function optionLabel(type: QuizQuestionType, country: Country): string {
  if (type === "capital") return country.capital;
  if (type === "population") return formatPopulation(country.population);
  return country.name;
}

function QuestionPrompt({ question }: { question: QuizQuestion }) {
  const { type, correct } = question;
  return (
    <View style={styles.prompt}>
      {type !== "name-to-flag" && (
        <Image
          source={{ uri: correct.flagUrl }}
          style={styles.promptFlag}
          contentFit="cover"
        />
      )}
      {(type === "name-to-flag" || type === "capital" || type === "population") && (
        <Text style={styles.promptCountry}>{correct.name}</Text>
      )}
      <Text style={styles.promptQuestion}>{PROMPT_TEXT[type]}</Text>
    </View>
  );
}

const PROMPT_TEXT: Record<QuizQuestionType, string> = {
  "flag-to-name": "Which country is this?",
  "name-to-flag": "Which flag belongs to this country?",
  capital: "What is the capital?",
  population: "What is the population?",
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: "#F9FAFB",
  },
  title: { fontSize: 28, fontWeight: "700", color: "#111827", textAlign: "center" },
  subtitle: { fontSize: 15, color: "#6B7280", marginTop: 8, textAlign: "center" },
  highScore: { fontSize: 18, color: "#2563EB", fontWeight: "600", marginTop: 16 },
  resultScore: { fontSize: 72, fontWeight: "800", color: "#2563EB", marginTop: 16 },
  primaryBtn: {
    backgroundColor: "#2563EB",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 40,
  },
  primaryBtnText: { color: "#FFFFFF", fontSize: 18, fontWeight: "700" },
  barBg: {
    flexDirection: "row",
    height: 6,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: { backgroundColor: "#2563EB" },
  progressText: {
    textAlign: "right",
    marginRight: 16,
    marginTop: 4,
    fontSize: 12,
    color: "#6B7280",
  },
  scroll: { padding: 16, paddingBottom: 40 },
  prompt: { alignItems: "center", marginBottom: 24 },
  promptFlag: { width: "100%", aspectRatio: 3 / 2, borderRadius: 10, marginBottom: 12 },
  promptCountry: { fontSize: 22, fontWeight: "700", color: "#111827", marginBottom: 6 },
  promptQuestion: { fontSize: 15, color: "#6B7280" },
  options: { gap: 10 },
  textOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  textOptionText: { fontSize: 15, fontWeight: "500", color: "#111827" },
  flagOption: {
    borderRadius: 12,
    borderWidth: 2,
    overflow: "hidden",
    marginBottom: 4,
  },
  flagOptionImg: { width: "100%", aspectRatio: 3 / 2 },
  nextBtn: {
    marginTop: 20,
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  nextBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
