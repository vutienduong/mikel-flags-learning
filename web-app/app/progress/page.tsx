"use client";

import { useProgressStore } from "../../lib/store";
import countriesData from "../../data/countries.json";

export default function ProgressPage() {
  const { learnedCodes, quizHighScore, quizTotalPlayed, resetProgress } = useProgressStore();

  const learnedCount = learnedCodes.length;
  const totalCount = countriesData.length;
  const learnedPercent = Math.round((learnedCount / totalCount) * 100);

  return (
    <div className="container" style={{ padding: "40px 16px", maxWidth: "800px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "32px" }}>Your Progress</h1>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Countries Learned</p>
          <p style={styles.statValue}>{learnedCount} / {totalCount}</p>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${learnedPercent}%` }} />
          </div>
          <p style={styles.statSub}>{learnedPercent}% completed</p>
        </div>

        <div style={styles.statCard}>
          <p style={styles.statLabel}>Quiz High Score</p>
          <p style={styles.statValue}>{quizHighScore} <span style={{ fontSize: "16px", color: "#6b7280" }}>/ 10</span></p>
        </div>

        <div style={styles.statCard}>
          <p style={styles.statLabel}>Quizzes Played</p>
          <p style={styles.statValue}>{quizTotalPlayed}</p>
        </div>
      </div>

      <div style={{ marginTop: "64px", textAlign: "center" }}>
        <button
          onClick={() => {
            if (confirm("Are you sure you want to reset all your progress?")) {
              resetProgress();
            }
          }}
          style={styles.resetBtn}
        >
          Reset All Progress
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, any> = {
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
  },
  statCard: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    border: "1px solid #f3f4f6",
  },
  statLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: "8px",
  },
  statValue: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#111827",
  },
  progressBar: {
    height: "6px",
    backgroundColor: "#e5e7eb",
    borderRadius: "3px",
    marginTop: "16px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10b981",
  },
  statSub: {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "8px",
  },
  resetBtn: {
    color: "#ef4444",
    backgroundColor: "transparent",
    fontSize: "14px",
    fontWeight: "600",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid #fee2e2",
  },
};
