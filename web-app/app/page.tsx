"use client";

import Link from "next/link";
import { getFunFact } from "../data/funFacts";
import { journeys } from "../data/journeys";
import { getCountry, getCurrentCountryCode, getJourneyCompletion } from "../lib/journey";
import { useGameProgressStore } from "../lib/store";

export default function HomePage() {
  const progress = useGameProgressStore((s) => s.progress);
  const journey = journeys[0];
  const journeyProgress = progress.journeyProgressById[journey.id];
  const currentCode = getCurrentCountryCode(journey, journeyProgress);
  const currentCountry = getCountry(currentCode);
  const completion = getJourneyCompletion(journey, journeyProgress);

  return (
    <div className="page narrow-page">
      <div className="dashboard-grid">
        <section style={{ display: "grid", gap: 8 }}>
          <p className="kicker">Welcome back, Explorer!</p>
          <h1 className="section-title">Ready for a new quest?</h1>
        </section>

        <section className="toy-card journey-card">
          <div className="card-badge">◎</div>
          <div style={{ display: "grid", gap: 18 }}>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 900 }}>{journey.title}</h2>
              <p className="kicker" style={{ marginTop: 4 }}>
                Current region
              </p>
            </div>

            <img
              src={journey.heroImage}
              alt={`${journey.title} landscape`}
              className="journey-hero-img"
            />

            <div style={{ display: "grid", gap: 10 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                  alignItems: "end",
                }}
              >
                <span style={{ fontWeight: 900 }}>Progress</span>
                <span style={{ color: "var(--primary)", fontSize: 20, fontWeight: 900 }}>
                  {completion.completed}/{completion.total} countries
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${completion.percent}%` }} />
              </div>
            </div>
          </div>
        </section>

        <Link
          href={`/journey/${journey.id}/${currentCode}`}
          className="primary-button"
          style={{ width: "100%", minHeight: 72 }}
        >
          ▶ Continue Journey
        </Link>

        <div className="action-row">
          <Link href="/quick-play" className="secondary-button">
            ◴ Quick Play
          </Link>
          <Link href="/explore" className="secondary-button">
            ◉ Explore
          </Link>
        </div>

        <section className="fact-strip">
          <div className="fact-icon">!</div>
          <div>
            <h2 style={{ color: "var(--primary)", fontSize: 18, fontWeight: 900 }}>
              Did you know?
            </h2>
            <p className="body-copy" style={{ fontSize: 15 }}>
              {getFunFact(currentCountry?.code ?? "th")}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
