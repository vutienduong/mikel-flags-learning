"use client";

import Link from "next/link";
import { useProgressStore } from "../lib/store";
import countriesData from "../data/countries.json";
import { useMemo } from "react";

export default function HomePage() {
  const learnedCount = useProgressStore((s) => s.learnedCodes.length);
  const totalCount = countriesData.length;

  const decorFlags = useMemo(() => {
    return [...countriesData].sort(() => Math.random() - 0.5).slice(0, 12);
  }, []);

  return (
    <div style={styles.hero}>
      <div style={styles.flagGrid}>
        {decorFlags.map((c) => (
          <img key={c.code} src={c.flagUrl} alt="" style={styles.decorFlag} />
        ))}
      </div>
      <div style={styles.overlay} />

      <div className="container" style={styles.content}>
        <h1 style={styles.title}>Flags of the World</h1>
        <p style={styles.subtitle}>Master all flags of the world with ease and fun.</p>
        
        <div style={styles.stat}>
          {learnedCount} / {totalCount} flags learned
        </div>

        <div style={styles.actions}>
          <Link href="/explore" style={styles.primaryBtn}>
            Start Learning 🚩
          </Link>
          <Link href="/quiz" style={styles.secondaryBtn}>
            Take a Quiz ❓
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, any> = {
  hero: {
    position: "relative",
    height: "calc(100vh - 64px)",
    backgroundColor: "#111827",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
  },
  flagGrid: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gridTemplateRows: "repeat(3, 1fr)",
  },
  decorFlag: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: 0.2,
  },
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "radial-gradient(circle, rgba(17,24,39,0.4) 0%, rgba(17,24,39,0.9) 100%)",
  },
  content: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    color: "#ffffff",
  },
  title: {
    fontSize: "64px",
    fontWeight: "900",
    marginBottom: "16px",
    letterSpacing: "-1px",
  },
  subtitle: {
    fontSize: "20px",
    color: "#d1d5db",
    marginBottom: "32px",
    maxWidth: "600px",
    margin: "0 auto 32px",
  },
  stat: {
    display: "inline-block",
    padding: "8px 16px",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: "24px",
    fontSize: "14px",
    fontWeight: "600",
    border: "1px solid rgba(255,255,255,0.2)",
    marginBottom: "48px",
  },
  actions: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
  },
  primaryBtn: {
    padding: "16px 32px",
    backgroundColor: "#2563eb",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "700",
    color: "#ffffff",
    transition: "transform 0.2s",
  },
  secondaryBtn: {
    padding: "16px 32px",
    backgroundColor: "transparent",
    border: "2px solid rgba(255,255,255,0.3)",
    borderRadius: "12px",
    fontSize: "18px",
    fontWeight: "700",
    color: "#ffffff",
    transition: "background 0.2s",
  },
};
