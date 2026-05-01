"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { getFunFact } from "../../../../../data/funFacts";
import { getCountry, getJourney } from "../../../../../lib/journey";
import { useGameProgressStore } from "../../../../../lib/store";

export default function CountryUnlockPage() {
  const params = useParams<{ journeyId: string; countryCode: string }>();
  const searchParams = useSearchParams();
  const progress = useGameProgressStore((s) => s.progress);
  const journey = getJourney(params.journeyId);
  const country = getCountry(params.countryCode);
  const previousCountry = getCountry(searchParams.get("from") ?? "");

  if (!journey || !country) {
    return (
      <div className="page narrow-page">
        <Link href="/journey" className="secondary-button">
          ← Map
        </Link>
        <h1 className="section-title" style={{ marginTop: 24 }}>
          Unlock not found
        </h1>
      </div>
    );
  }

  const starsEarned = previousCountry
    ? progress.journeyProgressById[journey.id]?.bestStarsByCountry[previousCountry.code] ?? 0
    : 0;

  return (
    <div className="page narrow-page">
      <section className="unlock-stage">
        <div className="unlock-burst">★</div>
        <p className="kicker">New Country Unlocked!</p>
        <img src={country.flagUrl} alt={country.name} className="unlock-flag" />
        <h1 className="page-title">{country.name}</h1>
        <div className="stars" aria-label={`${starsEarned} stars earned`}>
          {"★".repeat(starsEarned)}
          {"☆".repeat(3 - starsEarned)}
        </div>

        <section className="fact-strip" style={{ width: "100%", textAlign: "left" }}>
          <div className="fact-icon">!</div>
          <div>
            <h2 style={{ color: "var(--primary)", fontSize: 18, fontWeight: 900 }}>
              Did you know?
            </h2>
            <p className="body-copy" style={{ fontSize: 15 }}>
              {getFunFact(country.code)}
            </p>
          </div>
        </section>

        <Link
          href={`/journey/${journey.id}/${country.code}`}
          className="primary-button"
          style={{ width: "100%", minHeight: 72 }}
        >
          ▶ Continue
        </Link>
      </section>
    </div>
  );
}
