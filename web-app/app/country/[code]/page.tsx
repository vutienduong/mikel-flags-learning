"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import countriesData from "../../../data/countries.json";
import { useProgressStore } from "../../../lib/store";
import { formatArea, formatPopulation } from "../../../lib/formatters";

export default function CountryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const markLearned = useProgressStore((s) => s.markLearned);

  const code = params.code as string;
  const country = useMemo(() => {
    return (countriesData as any[]).find((c) => c.code === code);
  }, [code]);

  useEffect(() => {
    if (code) {
      markLearned(code);
    }
  }, [code, markLearned]);

  if (!country) {
    return (
      <div className="container" style={{ padding: "40px 16px" }}>
        <p>Country not found.</p>
        <button onClick={() => router.back()}>Back</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "40px 16px", maxWidth: "800px" }}>
      <button onClick={() => router.back()} style={styles.backBtn}>
        ← Back to List
      </button>

      <div style={styles.card}>
        <div style={styles.flagWrapper}>
          <img src={country.flagUrl} alt={country.name} style={styles.flag} />
        </div>
        
        <div style={styles.content}>
          <h1 style={styles.title}>{country.name}</h1>
          
          <div style={styles.infoGrid}>
            <InfoRow label="Capital" value={country.capital} />
            <InfoRow label="Population" value={formatPopulation(country.population)} />
            <InfoRow label="Area" value={formatArea(country.area)} />
            <InfoRow label="Region" value={country.region} />
            <InfoRow label="Languages" value={country.languages.join(", ")} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.row}>
      <span style={styles.label}>{label}</span>
      <span style={styles.value}>{value}</span>
    </div>
  );
}

const styles: Record<string, any> = {
  backBtn: {
    padding: "8px 0",
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "24px",
    backgroundColor: "transparent",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  },
  flagWrapper: {
    width: "100%",
    aspectRatio: "16/9",
    backgroundColor: "#f3f4f6",
  },
  flag: {
    width: "100%",
    height: "100%",
    objectFit: "contain" as const,
  },
  content: {
    padding: "40px",
  },
  title: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#111827",
    marginBottom: "32px",
  },
  infoGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "16px 0",
    borderBottom: "1px solid #f3f4f6",
  },
  label: {
    fontSize: "16px",
    color: "#6b7280",
    fontWeight: "500",
  },
  value: {
    fontSize: "16px",
    color: "#111827",
    fontWeight: "700",
  },
};
