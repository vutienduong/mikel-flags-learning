"use client";

import Link from "next/link";
import { journeys } from "../../data/journeys";
import { getCurrentCountryIndex, getJourneyCompletion, getJourneyCountries } from "../../lib/journey";
import { useGameProgressStore } from "../../lib/store";

export default function JourneyMapPage() {
  const progress = useGameProgressStore((s) => s.progress);
  const shuffleRemainingJourney = useGameProgressStore((s) => s.shuffleRemainingJourney);
  const journey = journeys[0];
  const journeyProgress = progress.journeyProgressById[journey.id];
  const countries = getJourneyCountries(journey, journeyProgress);
  const completion = getJourneyCompletion(journey, journeyProgress);
  const currentIndex = getCurrentCountryIndex(journey, journeyProgress);
  const remainingCount = Math.max(0, completion.total - completion.completed - 1);

  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 18,
          alignItems: "flex-end",
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <div>
          <p className="kicker">Journey Map</p>
          <h1 className="section-title">{journey.title}</h1>
        </div>
        <button
          type="button"
          className="secondary-button"
          onClick={() => shuffleRemainingJourney(journey.id)}
          disabled={remainingCount < 2}
          style={{
            minHeight: 54,
            opacity: remainingCount < 2 ? 0.55 : 1,
            cursor: remainingCount < 2 ? "not-allowed" : "pointer",
          }}
        >
          Shuffle Remaining
        </button>
      </div>

      <div className="map-path">
        {countries.map((country, index) => {
          const isComplete = journeyProgress?.completedCountryCodes.includes(country.code);
          const isUnlocked = Boolean(isComplete) || index <= currentIndex;
          const isCurrent = isUnlocked && currentIndex === index && !isComplete;
          const nodeClass = isComplete
            ? "is-complete"
            : isCurrent
              ? "is-current"
              : isUnlocked
                ? ""
                : "is-locked";

          return (
            <div key={country.code} className={`country-node ${nodeClass}`}>
              <div className="node-orb">
                <img src={country.flagUrl} alt={country.name} />
              </div>
              <div className="node-label">{country.name}</div>
              {isComplete && <div style={{ color: "var(--success)", fontWeight: 900 }}>★ Done</div>}
              {isUnlocked && !isComplete && (
                <Link href={`/journey/${journey.id}/${country.code}`} className="node-play pressable">
                  Play now
                </Link>
              )}
              {!isUnlocked && <div style={{ color: "#9aa6b2", fontWeight: 900 }}>Locked</div>}
            </div>
          );
        })}
      </div>

      <section
        className="toy-card"
        style={{
          position: "fixed",
          left: "50%",
          bottom: "calc(var(--nav-height) + 18px)",
          width: "min(560px, calc(100% - 36px))",
          padding: 22,
          transform: "translateX(-50%)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <strong>
            {completion.completed} / {completion.total} countries
          </strong>
          <strong style={{ color: "var(--secondary-edge)" }}>{completion.percent}%</strong>
        </div>
        <div className="progress-track">
          <div className="progress-fill green-fill" style={{ width: `${completion.percent}%` }} />
        </div>
      </section>
    </div>
  );
}
