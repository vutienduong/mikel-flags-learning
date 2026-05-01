"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getFunFact } from "../../../../data/funFacts";
import { getCountry, getJourney } from "../../../../lib/journey";
import { useGameProgressStore } from "../../../../lib/store";

export default function CountryIntroPage() {
  const params = useParams<{ journeyId: string; countryCode: string }>();
  const progress = useGameProgressStore((s) => s.progress);
  const journey = getJourney(params.journeyId);
  const country = getCountry(params.countryCode);

  if (!journey || !country) {
    return (
      <div className="page narrow-page">
        <Link href="/journey" className="secondary-button">
          ← Map
        </Link>
        <h1 className="section-title" style={{ marginTop: 24 }}>
          Quest not found
        </h1>
      </div>
    );
  }

  const isUnlocked = progress.unlockedCountryCodes.includes(country.code);

  return (
    <div className="page narrow-page">
      <div className="intro-layout">
        <Link href="/journey" className="secondary-button" style={{ justifySelf: "start" }}>
          ← Map
        </Link>

        <img src={country.flagUrl} alt={country.name} className="flag-img intro-flag" />

        <div>
          <p className="kicker">{journey.title}</p>
          <h1 className="page-title">{country.name}</h1>
        </div>

        <section className="toy-card" style={{ padding: 24, width: "100%" }}>
          <p className="body-copy" style={{ color: "var(--ink)", fontSize: 20 }}>
            {getFunFact(country.code)}
          </p>
        </section>

        {isUnlocked ? (
          <Link
            href={`/play/spot-odd/${journey.id}/${country.code}`}
            className="primary-button"
            style={{ width: "100%", minHeight: 72 }}
          >
            ▶ Start Challenge
          </Link>
        ) : (
          <Link href="/journey" className="secondary-button" style={{ width: "100%" }}>
            Back to Map
          </Link>
        )}
      </div>
    </div>
  );
}
