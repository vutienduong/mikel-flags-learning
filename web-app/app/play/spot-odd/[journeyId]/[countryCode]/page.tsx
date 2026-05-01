"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { getCountry, getJourney, getNextCountryCode } from "../../../../../lib/journey";
import {
  calculateOddFlagScore,
  calculateOddFlagStars,
  getOddFlagRule,
} from "../../../../../lib/spotOddFlag";
import { useGameProgressStore } from "../../../../../lib/store";
import type { Country, GameSession } from "../../../../../lib/types";

type Phase = "playing" | "result";
type FeedbackKind = "correct" | "wrong" | null;

function playTone(kind: Exclude<FeedbackKind, null>) {
  const AudioContextClass =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;

  const audioContext = new AudioContextClass();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(kind === "correct" ? 660 : 180, now);
  if (kind === "correct") {
    oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.12);
  } else {
    oscillator.frequency.exponentialRampToValueAtTime(120, now + 0.14);
  }

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(kind === "correct" ? 0.08 : 0.06, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.2);
}

function triggerFeedback(kind: Exclude<FeedbackKind, null>) {
  playTone(kind);
  if ("vibrate" in navigator) {
    navigator.vibrate(kind === "correct" ? [18, 24, 18] : [45]);
  }
}

function FlagArtwork({ country, odd }: { country: Country; odd: boolean }) {
  const rule = getOddFlagRule(country);

  if (rule.className === "flag-fallback") {
    return (
      <img
        src={country.flagUrl}
        alt={country.name}
        className={odd ? "fallback-odd" : ""}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }

  return <div className={`${rule.className} flag-art ${odd ? "is-odd" : ""}`} />;
}

function RealFlagPreview({ country }: { country: Country }) {
  return (
    <img
      src={country.flagUrl}
      alt={country.name}
      style={{
        width: 46,
        aspectRatio: "3 / 2",
        borderRadius: 7,
        border: "2px solid #e7eef4",
        objectFit: "cover",
      }}
    />
  );
}

export default function SpotOddFlagPage() {
  const params = useParams<{ journeyId: string; countryCode: string }>();
  const country = getCountry(params.countryCode);
  const journey = getJourney(params.journeyId);
  const startSession = useGameProgressStore((s) => s.startSession);
  const finishSession = useGameProgressStore((s) => s.finishSession);
  const [phase, setPhase] = useState<Phase>("playing");
  const [selected, setSelected] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [feedback, setFeedback] = useState<FeedbackKind>(null);
  const [session, setSession] = useState<GameSession | null>(null);
  const startTime = useRef(Date.now());
  const oddIndex = useMemo(() => Math.floor(Math.random() * 9), [params.countryCode]);
  const nextCountryCode = journey && country ? getNextCountryCode(journey, country.code) : null;
  const nextCountry = nextCountryCode ? getCountry(nextCountryCode) : null;

  useEffect(() => {
    if (!country) return;
    setSession(startSession(country.code, params.journeyId));
    startTime.current = Date.now();
  }, [country, params.journeyId, startSession]);

  useEffect(() => {
    if (phase !== "playing") return;
    const interval = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          setPhase("result");
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [phase]);

  if (!country) {
    return (
      <div className="page narrow-page">
        <Link href="/quick-play" className="secondary-button">
          ← Quick Play
        </Link>
        <h1 className="section-title" style={{ marginTop: 24 }}>
          Flag not found
        </h1>
      </div>
    );
  }

  const activeCountry = country;

  function handlePick(index: number) {
    if (phase !== "playing" || selected !== null) return;
    const correct = index === oddIndex;
    const nextMistakes = correct ? mistakes : mistakes + 1;
    triggerFeedback(correct ? "correct" : "wrong");
    setFeedback(correct ? "correct" : "wrong");
    setSelected(index);
    setMistakes(nextMistakes);

    if (!correct) {
      window.setTimeout(() => {
        setSelected(null);
        setFeedback(null);
      }, 650);
      return;
    }

    const elapsedMs = Date.now() - startTime.current;
    const stars = calculateOddFlagStars(nextMistakes, elapsedMs);
    const finishedSession: GameSession = {
      ...(session ?? startSession(activeCountry.code, params.journeyId)),
      endedAt: new Date().toISOString(),
      result: "win",
      score: calculateOddFlagScore(nextMistakes, secondsLeft),
      stars,
      mistakes: nextMistakes,
      timeSpentMs: elapsedMs,
    };

    finishSession(finishedSession);
    window.setTimeout(() => {
      setFeedback(null);
      setPhase("result");
    }, 500);
  }

  const didWin = selected === oddIndex;
  const finalStars = didWin ? calculateOddFlagStars(mistakes, Date.now() - startTime.current) : 0;
  const timerPercent = (secondsLeft / 10) * 100;
  const rule = getOddFlagRule(activeCountry);

  return (
    <div>
      <header className="game-header">
        <div className="game-pill">◴ {secondsLeft}s</div>
        <h1 style={{ color: "var(--primary-bright)", fontSize: 28, fontWeight: 900 }}>
          Odd Flag Quest
        </h1>
        <div className="game-pill" style={{ justifySelf: "end" }}>
          ☆ Score: {didWin ? Math.max(100, 300 - mistakes * 50) : 0}
        </div>
      </header>

      <main className="page">
        <section className="toy-card game-board">
          <h2 className="section-title">Find the Odd Flag!</h2>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              justifyContent: "center",
              marginTop: 6,
            }}
          >
            <RealFlagPreview country={activeCountry} />
            <p className="body-copy">{rule.prompt}</p>
          </div>

          <div className="flag-grid">
            {Array.from({ length: 9 }, (_, index) => {
              const isOdd = index === oddIndex;
              const isSelected = selected === index;
              const showCorrect = phase === "result" && isOdd;
              const tileClass = showCorrect || (isSelected && isOdd)
                ? "is-correct"
                : isSelected
                  ? "is-wrong"
                  : "";

              return (
                <button
                  key={index}
                  className={`flag-tile ${tileClass}`}
                  type="button"
                  disabled={phase === "result"}
                  onClick={() => handlePick(index)}
                  aria-label={`Flag choice ${index + 1}`}
                >
                  <FlagArtwork country={activeCountry} odd={isOdd} />
                  {(showCorrect || isSelected) && (
                    <span className={`result-mark ${isOdd ? "correct" : "wrong"}`}>
                      {isOdd ? "✓" : "×"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {feedback && (
            <div className={`tap-feedback ${feedback}`} aria-live="polite">
              <span>{feedback === "correct" ? "Great!" : "Try again"}</span>
            </div>
          )}

          {phase === "result" && (
            <section className="result-modal">
              <p className="kicker">{didWin ? "Great job!" : "Nice try"}</p>
              <h2 className="section-title">{didWin ? "Correct!" : "Time is up"}</h2>
              <div className="stars">{"★".repeat(finalStars)}{"☆".repeat(3 - finalStars)}</div>
              <p className="body-copy" style={{ marginTop: 8 }}>
                +{didWin ? 10 + finalStars * 5 : 0} XP
              </p>
              <div className="action-row" style={{ marginTop: 22 }}>
                {didWin && nextCountryCode ? (
                  <Link
                    href={`/journey/${params.journeyId}/unlock/${nextCountryCode}?from=${activeCountry.code}`}
                    className="primary-button"
                  >
                    {nextCountry ? `Unlock ${nextCountry.name}` : "Next Country"}
                  </Link>
                ) : didWin && params.journeyId !== "quick" ? (
                  <Link
                    href={`/journey/${params.journeyId}/complete?from=${activeCountry.code}`}
                    className="primary-button"
                  >
                    Claim Reward
                  </Link>
                ) : (
                  <Link href="/journey" className="primary-button">
                    Back to Map
                  </Link>
                )}
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => window.location.reload()}
                >
                  Replay
                </button>
              </div>
            </section>
          )}
        </section>
      </main>

      <footer className="game-footer">
        <div style={{ width: "min(900px, 100%)", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <strong className="kicker">Level Progress</strong>
            <strong style={{ color: "var(--primary-bright)" }}>{timerPercent}%</strong>
          </div>
          <div className="progress-track" style={{ height: 30 }}>
            <div className="progress-fill" style={{ width: `${timerPercent}%` }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <Link href="/quick-play" style={{ color: "var(--muted)", fontWeight: 900 }}>
              How to Play
            </Link>
            <Link href="/journey" style={{ color: "var(--muted)", fontWeight: 900 }}>
              Exit Game
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
