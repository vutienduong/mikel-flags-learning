"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import countriesData from "../../data/countries.json";
import { useProgressStore } from "../../lib/store";

const REGIONS = ["All", "Asia", "Europe", "Africa", "Americas", "Oceania"];

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");
  const learnedCodes = useProgressStore((s) => s.learnedCodes);

  const filtered = useMemo(() => {
    return countriesData.filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.capital.toLowerCase().includes(search.toLowerCase());
      const matchRegion = region === "All" || c.region === region;
      return matchSearch && matchRegion;
    });
  }, [search, region]);

  return (
    <div className="container" style={{ padding: "32px 16px" }}>
      <header style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "16px" }}>Explore Countries</h1>
        
        <div style={styles.filterRow}>
          <input
            type="text"
            placeholder="Search by name or capital..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchBox}
          />
          
          <div style={styles.regionScroll}>
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                style={{
                  ...styles.chip,
                  ...(region === r ? styles.chipActive : {}),
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div style={styles.grid}>
        {filtered.map((c) => (
          <Link key={c.code} href={`/country/${c.code}`} style={styles.card}>
            <div style={styles.flagWrapper}>
              <img src={c.flagUrl} alt={c.name} style={styles.flag} />
              {learnedCodes.includes(c.code) && (
                <div style={styles.learnedBadge}>✓ Learned</div>
              )}
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.countryName}>{c.name}</h3>
              <p style={styles.capital}>{c.capital}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, any> = {
  filterRow: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  searchBox: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    fontSize: "16px",
    outline: "none",
  },
  regionScroll: {
    display: "flex",
    gap: "8px",
    overflowX: "auto",
    paddingBottom: "8px",
  },
  chip: {
    padding: "8px 16px",
    borderRadius: "20px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
    fontWeight: "600",
    color: "#4b5563",
    whiteSpace: "nowrap",
  },
  chipActive: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    borderColor: "#2563eb",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s",
  },
  flagWrapper: {
    position: "relative",
    aspectRatio: "3/2",
    backgroundColor: "#f3f4f6",
  },
  flag: {
    width: "100%",
    height: "100%",
    objectFit: "contain" as const,
  },
  learnedBadge: {
    position: "absolute",
    top: "8px",
    right: "8px",
    backgroundColor: "#10b981",
    color: "#ffffff",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "10px",
    fontWeight: "bold",
  },
  cardContent: {
    padding: "12px",
  },
  countryName: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#111827",
  },
  capital: {
    fontSize: "14px",
    color: "#6b7280",
    marginTop: "2px",
  },
};
