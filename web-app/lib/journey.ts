import countriesData from "../data/countries.json";
import { journeys } from "../data/journeys";
import type { Country, Journey, JourneyProgress } from "./types";

export const countries = countriesData as Country[];

export function getCountry(code: string) {
  return countries.find((country) => country.code === code);
}

export function getJourney(id: string) {
  return journeys.find((journey) => journey.id === id);
}

export function getJourneyCountries(journey: Journey) {
  return journey.countryCodes
    .map((code) => getCountry(code))
    .filter(Boolean) as Country[];
}

export function getInitialJourneyProgress(journey: Journey): JourneyProgress {
  return {
    journeyId: journey.id,
    status: "in_progress",
    currentIndex: 0,
    completedCountryCodes: [],
    totalStars: 0,
    bestStarsByCountry: {},
  };
}

export function getCurrentCountryCode(journey: Journey, progress?: JourneyProgress) {
  const index = getCurrentCountryIndex(journey, progress);
  return journey.countryCodes[index];
}

export function getNextCountryCode(journey: Journey, countryCode: string) {
  const index = journey.countryCodes.indexOf(countryCode);
  if (index < 0) return null;
  return journey.countryCodes[index + 1] ?? null;
}

export function getJourneyCompletion(journey: Journey, progress?: JourneyProgress) {
  const completed = progress?.completedCountryCodes.length ?? 0;
  const total = journey.countryCodes.length;
  return {
    completed,
    total,
    percent: total ? Math.round((completed / total) * 100) : 0,
  };
}

export function getCurrentCountryIndex(journey: Journey, progress?: JourneyProgress) {
  if (!progress) return 0;

  const completedCodes = new Set(progress.completedCountryCodes);
  const firstIncompleteIndex = journey.countryCodes.findIndex(
    (code) => !completedCodes.has(code)
  );

  if (firstIncompleteIndex >= 0) return firstIncompleteIndex;
  return Math.max(0, journey.countryCodes.length - 1);
}
