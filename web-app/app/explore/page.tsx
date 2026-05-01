"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import countriesData from "../../data/countries.json";
import { useGameProgressStore } from "../../lib/store";
import type { Country } from "../../lib/types";

const REGIONS = ["All", "Asia", "Europe", "Africa", "Americas", "Oceania", "Antarctic"];
const countries = countriesData as Country[];

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");
  const [languageFilter, setLanguageFilter] = useState("");
  const learnedCodes = useGameProgressStore((s) => s.progress.learnedCountryCodes);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextLanguage = params.get("language") ?? "";
    const nextRegion = params.get("region") ?? "";
    if (nextLanguage) setLanguageFilter(nextLanguage);
    if (REGIONS.includes(nextRegion)) setRegion(nextRegion);
  }, []);

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const normalizedLanguage = languageFilter.toLowerCase();

    return countries
      .filter((country) => {
        const matchesSearch =
          country.name.toLowerCase().includes(normalizedSearch) ||
          country.capital.toLowerCase().includes(normalizedSearch);
        const matchesRegion = region === "All" || country.region === region;
        const matchesLanguage =
          !normalizedLanguage ||
          country.languages.some((language) => language.toLowerCase() === normalizedLanguage);
        return matchesSearch && matchesRegion && matchesLanguage;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [languageFilter, region, search]);

  return (
    <div className="page">
      <div style={{ display: "grid", gap: 22, marginBottom: 30 }}>
        <div>
          <p className="kicker">Study Facts</p>
          <h1 className="page-title">Flags, capitals, area, population</h1>
        </div>

        <input
          className="field"
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search flags..."
        />

        <div className="chip-row">
          {REGIONS.map((item) => (
            <button
              key={item}
              type="button"
              className={`chip ${region === item ? "is-active" : ""}`}
              onClick={() => setRegion(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {languageFilter && (
          <div className="fact-strip" style={{ padding: 14 }}>
            <div className="fact-icon" style={{ width: 44, height: 44, fontSize: 18 }}>
              i
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
              <strong>Language: {languageFilter}</strong>
              <Link href="/explore" onClick={() => setLanguageFilter("")}>
                Clear
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="explore-grid">
        {filtered.map((country) => (
          <article key={country.code} className="toy-card explore-card">
            <div style={{ position: "relative" }}>
              <img src={country.flagUrl} alt={country.name} className="flag-img" />
              {learnedCodes.includes(country.code) && (
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    padding: "7px 10px",
                    borderRadius: 999,
                    background: "var(--success)",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 900,
                  }}
                >
                  Learned
                </span>
              )}
            </div>
            <div style={{ padding: 20, display: "grid", gap: 12 }}>
              <h2 style={{ fontSize: 24, fontWeight: 900 }}>{country.name}</h2>
              <p className="body-copy" style={{ fontSize: 14 }}>
                Capital: {country.capital}
              </p>
              <div className="action-row">
                <Link href={`/country/${country.code}`} className="primary-button" style={{ minHeight: 52 }}>
                  Study Facts
                </Link>
                <Link
                  href={`/play/spot-odd/quick/${country.code}`}
                  className="secondary-button"
                  style={{ minHeight: 52 }}
                >
                  Play
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
