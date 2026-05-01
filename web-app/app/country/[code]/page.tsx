"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { getFunFact } from "../../../data/funFacts";
import countriesData from "../../../data/countries.json";
import { formatArea, formatPopulation } from "../../../lib/formatters";
import { useGameProgressStore } from "../../../lib/store";
import type { Country } from "../../../lib/types";

const countries = countriesData as Country[];

export default function CountryDetailPage() {
  const params = useParams<{ code: string }>();
  const country = countries.find((item) => item.code === params.code);
  const markLearned = useGameProgressStore((s) => s.markLearned);

  useEffect(() => {
    if (country) markLearned(country.code);
  }, [country, markLearned]);

  if (!country) {
    return (
      <div className="page narrow-page">
        <Link href="/explore" className="secondary-button">
          ← Explore
        </Link>
        <h1 className="section-title" style={{ marginTop: 24 }}>
          Country not found
        </h1>
      </div>
    );
  }

  return (
    <div className="page narrow-page">
      <div className="intro-layout">
        <Link href="/explore" className="secondary-button" style={{ justifySelf: "start" }}>
          ← Explore
        </Link>

        <img src={country.flagUrl} alt={country.name} className="flag-img intro-flag" />

        <div>
          <p className="kicker">{country.region}</p>
          <h1 className="page-title">{country.name}</h1>
        </div>

        <section className="toy-card" style={{ padding: 24, width: "100%", textAlign: "left" }}>
          <p className="body-copy" style={{ color: "var(--ink)", fontSize: 20, marginBottom: 20 }}>
            {getFunFact(country.code)}
          </p>
          <div style={{ display: "grid", gap: 12 }}>
            <Info label="Capital" value={country.capital} />
            <Info label="Population" value={formatPopulation(country.population)} />
            <Info label="Area" value={formatArea(country.area)} />
            <Info label="Languages" value={country.languages.join(", ")} />
          </div>
        </section>

        <Link
          href={`/play/spot-odd/quick/${country.code}`}
          className="primary-button"
          style={{ width: "100%", minHeight: 72 }}
        >
          ▶ Tap to Play
        </Link>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 18,
        padding: "12px 0",
        borderTop: "2px solid #edf2f7",
      }}
    >
      <span style={{ color: "var(--muted)", fontWeight: 800 }}>{label}</span>
      <span style={{ textAlign: "right", fontWeight: 900 }}>{value}</span>
    </div>
  );
}
