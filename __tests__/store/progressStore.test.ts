import { act, renderHook } from "@testing-library/react-native";
import { useProgressStore } from "../../store/progressStore";

beforeEach(() => {
  useProgressStore.setState({
    learnedCodes: [],
    quizHighScore: 0,
    quizTotalPlayed: 0,
  });
});

describe("progressStore", () => {
  it("starts with empty state", () => {
    const { result } = renderHook(() => useProgressStore());
    expect(result.current.learnedCodes).toEqual([]);
    expect(result.current.quizHighScore).toBe(0);
    expect(result.current.quizTotalPlayed).toBe(0);
  });

  it("markLearned adds a country code", () => {
    const { result } = renderHook(() => useProgressStore());
    act(() => result.current.markLearned("vn"));
    expect(result.current.learnedCodes).toContain("vn");
  });

  it("markLearned does not add duplicates", () => {
    const { result } = renderHook(() => useProgressStore());
    act(() => {
      result.current.markLearned("vn");
      result.current.markLearned("vn");
    });
    expect(result.current.learnedCodes.filter((c) => c === "vn")).toHaveLength(1);
  });

  it("updateHighScore keeps the maximum", () => {
    const { result } = renderHook(() => useProgressStore());
    act(() => result.current.updateHighScore(7));
    expect(result.current.quizHighScore).toBe(7);
    act(() => result.current.updateHighScore(4));
    expect(result.current.quizHighScore).toBe(7);
    act(() => result.current.updateHighScore(9));
    expect(result.current.quizHighScore).toBe(9);
  });

  it("updateHighScore increments quizTotalPlayed each call", () => {
    const { result } = renderHook(() => useProgressStore());
    act(() => result.current.updateHighScore(5));
    act(() => result.current.updateHighScore(3));
    expect(result.current.quizTotalPlayed).toBe(2);
  });

  it("resetProgress clears all state", () => {
    const { result } = renderHook(() => useProgressStore());
    act(() => {
      result.current.markLearned("vn");
      result.current.updateHighScore(8);
      result.current.resetProgress();
    });
    expect(result.current.learnedCodes).toEqual([]);
    expect(result.current.quizHighScore).toBe(0);
    expect(result.current.quizTotalPlayed).toBe(0);
  });
});
