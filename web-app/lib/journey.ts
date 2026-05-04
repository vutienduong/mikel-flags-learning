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

export function shuffleCountryCodes(countryCodes: string[]) {
  const shuffled = [...countryCodes];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function hasSameCodes(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  const codes = new Set(a);
  return b.every((code) => codes.has(code));
}

export function createJourneyCountryOrder(journey: Journey, progress?: JourneyProgress) {
  const completedCodes = new Set(progress?.completedCountryCodes ?? []);
  if (completedCodes.size === 0) return shuffleCountryCodes(journey.countryCodes);

  const baseOrder = hasSameCodes(progress?.countryCodes ?? [], journey.countryCodes)
    ? progress?.countryCodes ?? journey.countryCodes
    : journey.countryCodes;
  const completedPrefix = baseOrder.filter((code) => completedCodes.has(code));
  const firstCurrent = baseOrder.find((code) => !completedCodes.has(code));
  const remaining = baseOrder.filter((code) => !completedCodes.has(code) && code !== firstCurrent);

  return [
    ...completedPrefix,
    ...(firstCurrent ? [firstCurrent] : []),
    ...shuffleCountryCodes(remaining),
  ];
}

export function getJourneyCountryCodes(journey: Journey, progress?: JourneyProgress) {
  if (progress?.countryCodes && hasSameCodes(progress.countryCodes, journey.countryCodes)) {
    return progress.countryCodes;
  }
  return journey.countryCodes;
}

export function getJourneyCountries(journey: Journey, progress?: JourneyProgress) {
  return getJourneyCountryCodes(journey, progress)
    .map((code) => getCountry(code))
    .filter(Boolean) as Country[];
}

export function getInitialJourneyProgress(journey: Journey): JourneyProgress {
  return {
    journeyId: journey.id,
    status: "in_progress",
    currentIndex: 0,
    countryCodes: createJourneyCountryOrder(journey),
    completedCountryCodes: [],
    totalStars: 0,
    bestStarsByCountry: {},
  };
}

export function getCurrentCountryCode(journey: Journey, progress?: JourneyProgress) {
  const index = getCurrentCountryIndex(journey, progress);
  return getJourneyCountryCodes(journey, progress)[index];
}

export function getNextCountryCode(journey: Journey, countryCode: string, progress?: JourneyProgress) {
  const countryCodes = getJourneyCountryCodes(journey, progress);
  const index = countryCodes.indexOf(countryCode);
  if (index < 0) return null;
  return countryCodes[index + 1] ?? null;
}

export function getJourneyCompletion(journey: Journey, progress?: JourneyProgress) {
  const completed = progress?.completedCountryCodes.length ?? 0;
  const total = getJourneyCountryCodes(journey, progress).length;
  return {
    completed,
    total,
    percent: total ? Math.round((completed / total) * 100) : 0,
  };
}

export function getCurrentCountryIndex(journey: Journey, progress?: JourneyProgress) {
  if (!progress) return 0;

  const completedCodes = new Set(progress.completedCountryCodes);
  const countryCodes = getJourneyCountryCodes(journey, progress);
  const firstIncompleteIndex = countryCodes.findIndex(
    (code) => !completedCodes.has(code)
  );

  if (firstIncompleteIndex >= 0) return firstIncompleteIndex;
  return Math.max(0, countryCodes.length - 1);
}

export function shuffleRemainingCountryCodes(journey: Journey, progress?: JourneyProgress) {
  const countryCodes = getJourneyCountryCodes(journey, progress);
  const currentIndex = getCurrentCountryIndex(journey, progress);
  return [
    ...countryCodes.slice(0, currentIndex + 1),
    ...shuffleCountryCodes(countryCodes.slice(currentIndex + 1)),
  ];
}
