import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RestCountry {
  cca2: string;
  name: { common: string };
  capital?: string[];
  population: number;
  area: number;
  languages?: Record<string, string>;
  region: string;
}

async function fetchCountries() {
  const res = await fetch(
    "https://restcountries.com/v3.1/all?fields=cca2,name,capital,population,area,languages,region"
  );
  const data: RestCountry[] = await res.json();

  const countries = data
    .filter((c) => c.cca2 && c.name?.common)
    .map((c) => ({
      code: c.cca2.toLowerCase(),
      name: c.name.common,
      capital: c.capital?.[0] ?? "N/A",
      population: c.population,
      area: Math.round(c.area ?? 0),
      languages: Object.values(c.languages ?? {}),
      region: c.region,
      flagUrl: `https://flagcdn.com/w320/${c.cca2.toLowerCase()}.png`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const outPath = path.join(__dirname, "../assets/data/countries.json");
  fs.writeFileSync(outPath, JSON.stringify(countries, null, 2));
  console.log(`Wrote ${countries.length} countries to assets/data/countries.json`);
}

fetchCountries();
