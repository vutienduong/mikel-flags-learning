"use client";

import Link from "next/link";
import countriesData from "../../data/countries.json";
import { badges } from "../../data/journeys";
import { journeys } from "../../data/journeys";
import { getJourneyCompletion } from "../../lib/journey";
import { useGameProgressStore } from "../../lib/store";

export default function ProgressPage() {
  const { progress, resetProgress } = useGameProgressStore();
  const learnedCount = progress.learnedCountryCodes.length;
  const totalCount = countriesData.length;
  const learnedPercent = Math.round((learnedCount / totalCount) * 100);
  const journey = journeys[0];
  const completion = getJourneyCompletion(journey, progress.journeyProgressById[journey.id]);

  return (
    <div className="page narrow-page">
      <div style={{ marginBottom: 28 }}>
        <p className="kicker">Junior Navigator</p>
        <h1 className="page-title">Your Progress</h1>
      </div>

      <section className="toy-card" style={{ padding: 28, marginBottom: 28 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr",
            gap: 28,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 112,
              height: 112,
              display: "grid",
              placeItems: "center",
              border: "12px solid #eef3f7",
              borderTopColor: "var(--primary-bright)",
              borderRadius: "50%",
              color: "var(--primary)",
              fontSize: 28,
              fontWeight: 900,
            }}
          >
            {learnedPercent}%
          </div>
          <div>
            <h2 className="section-title" style={{ fontSize: 32 }}>
              Countries learned
            </h2>
            <p style={{ fontSize: 34, fontWeight: 900 }}>
              {learnedCount} <span style={{ color: "#b9c4cf" }}>/ {totalCount}</span>
            </p>
            <div className="progress-track" style={{ marginTop: 14 }}>
              <div className="progress-fill green-fill" style={{ width: `${learnedPercent}%` }} />
            </div>
          </div>
        </div>
      </section>

      <div className="action-row" style={{ marginBottom: 34 }}>
        <section
          style={{
            minHeight: 128,
            padding: 24,
            borderRadius: 24,
            background: "var(--secondary)",
            boxShadow: "0 7px 0 var(--secondary-edge)",
          }}
        >
          <p className="kicker" style={{ color: "#755b00" }}>
            Current streak
          </p>
          <h2 style={{ color: "#6e5400", fontSize: 32, fontWeight: 900 }}>
            {progress.streak.current} days
          </h2>
        </section>
        <section
          style={{
            minHeight: 128,
            padding: 24,
            borderRadius: 24,
            background: "var(--primary-bright)",
            boxShadow: "0 7px 0 var(--primary)",
            color: "#ffffff",
          }}
        >
          <p className="kicker" style={{ color: "#e7f8ff" }}>
            XP Level
          </p>
          <h2 style={{ fontSize: 32, fontWeight: 900 }}>Level {progress.level}</h2>
        </section>
      </div>

      <section style={{ marginBottom: 34 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <h2 className="section-title" style={{ fontSize: 32 }}>
            Your Badges
          </h2>
          <Link href="/journey" style={{ color: "var(--primary)", fontWeight: 900 }}>
            View Map
          </Link>
        </div>
        <div className="explore-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {badges.map((badge) => {
            const unlocked = progress.badges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className="toy-card"
                style={{
                  minHeight: 136,
                  display: "grid",
                  placeItems: "center",
                  padding: 16,
                  textAlign: "center",
                  opacity: unlocked ? 1 : 0.38,
                  borderStyle: unlocked ? "solid" : "dashed",
                }}
              >
                <div style={{ fontSize: 30, color: "var(--primary-bright)" }}>{badge.icon}</div>
                <strong>{unlocked ? badge.title : "Locked"}</strong>
              </div>
            );
          })}
        </div>
      </section>

      <section className="toy-card" style={{ padding: 24, marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <strong>{journey.title}</strong>
          <strong style={{ color: "var(--primary)" }}>{completion.percent}%</strong>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${completion.percent}%` }} />
        </div>
      </section>

      <Link href="/" className="primary-button" style={{ width: "100%", marginBottom: 18 }}>
        ▶ Continue Journey
      </Link>

      <button
        type="button"
        className="danger-button"
        style={{ width: "100%" }}
        onClick={() => {
          if (window.confirm("Reset all local progress?")) resetProgress();
        }}
      >
        Reset Progress
      </button>
    </div>
  );
}
