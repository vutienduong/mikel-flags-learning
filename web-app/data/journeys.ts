import type { Journey } from "../lib/types";

export const journeys: Journey[] = [
  {
    id: "southeast-asia",
    title: "Southeast Asia",
    description: "Start your flag adventure near home.",
    region: "Asia",
    heroImage:
      "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=80",
    countryCodes: ["vn", "th", "my", "sg", "id", "ph", "kh", "la", "mm", "bn"],
    reward: {
      xp: 100,
      badges: ["southeast-asia-explorer"],
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
];
