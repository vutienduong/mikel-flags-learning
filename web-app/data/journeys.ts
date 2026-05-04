import countriesData from "./countries.json";
import type { Journey } from "../lib/types";

const southeastAsiaCodes = ["vn", "th", "my", "sg", "id", "ph", "kh", "la", "mm", "bn"];
const allCountryCodes = (countriesData as Array<{ code: string }>).map((country) => country.code);
const worldJourneyCodes = [
  ...southeastAsiaCodes,
  ...allCountryCodes.filter((code) => !southeastAsiaCodes.includes(code)),
];

export const journeys: Journey[] = [
  {
    id: "southeast-asia",
    title: "World Journey",
    description: "Travel from Southeast Asia to every flag in the world.",
    heroImage:
      "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80",
    countryCodes: worldJourneyCodes,
    reward: {
      xp: 500,
      badges: ["world-hero"],
    },
  },
];

export const badges = [
  {
    id: "first-quest",
    title: "First Quest",
    description: "Complete your first country challenge.",
    icon: "◇",
  },
  {
    id: "southeast-asia-explorer",
    title: "Asia Explorer",
    description: "Complete the Southeast Asia journey.",
    icon: "⚑",
  },
  {
    id: "flag-master",
    title: "Flag Master",
    description: "Earn 20 stars.",
    icon: "☆",
  },
  {
    id: "world-hero",
    title: "World Hero",
    description: "Complete every country in the World Journey.",
    icon: "◎",
  },
];

export const southeastAsiaMilestone = {
  id: "southeast-asia",
  title: "Southeast Asia Complete",
  countryCodes: southeastAsiaCodes,
  finalCountryCode: "bn",
  reward: {
    xp: 100,
    badges: ["southeast-asia-explorer"],
  },
};
