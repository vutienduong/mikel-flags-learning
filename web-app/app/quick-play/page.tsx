import Link from "next/link";
import countriesData from "../../data/countries.json";
import type { Country } from "../../lib/types";

const countries = countriesData as Country[];
const quickCountries = ["vn", "th", "my", "sg", "id", "ph", "kh", "la", "mm", "bn"]
  .map((code) => countries.find((country) => country.code === code))
  .filter(Boolean) as Country[];

export default function QuickPlayPage() {
  return (
    <div className="page">
      <div style={{ marginBottom: 30 }}>
        <p className="kicker">Quick Play</p>
        <h1 className="page-title">Pick a fast quest</h1>
      </div>

      <div className="explore-grid">
        {quickCountries.map((country) => (
          <Link
            key={country.code}
            href={`/play/spot-odd/quick/${country.code}`}
            className="toy-card explore-card"
          >
            <img src={country.flagUrl} alt={country.name} className="flag-img" />
            <div style={{ padding: 20, display: "grid", gap: 14 }}>
              <h2 style={{ fontSize: 24, fontWeight: 900 }}>{country.name}</h2>
              <span className="primary-button" style={{ minHeight: 52 }}>
                Spot the Odd Flag
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
