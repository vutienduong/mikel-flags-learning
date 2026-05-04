export const funFactsByCode: Record<string, string[]> = {
  vn: [
    "Vietnam's flag has a golden star for unity on a bright red field.",
    "Vietnam has more than 3,000 kilometers of coastline.",
  ],
  th: [
    "Thailand's flag has five stripes in red, white, and blue.",
    "Thailand is sometimes called the Land of Smiles.",
  ],
  my: [
    "Malaysia's flag has 14 stripes for its states and federal territories.",
    "Malaysia is home to rainforests that are millions of years old.",
  ],
  sg: [
    "Singapore's crescent moon and stars stand for a young nation and ideals.",
    "Singapore is both a city and a country.",
  ],
  id: [
    "Indonesia's red and white flag is simple, bold, and easy to spot.",
    "Indonesia is made of thousands of islands.",
  ],
  ph: [
    "The Philippines flag can be flown upside down during wartime.",
    "The Philippines has more than 7,000 islands.",
  ],
  kh: [
    "Cambodia's flag shows Angkor Wat in the center.",
    "Cambodia is one of the few countries with a building on its flag.",
  ],
  la: [
    "Laos has a white circle on blue between two red stripes.",
    "Laos is the only landlocked country in Southeast Asia.",
  ],
  mm: [
    "Myanmar's flag has yellow, green, and red stripes with a white star.",
    "Myanmar has many golden pagodas and temples.",
  ],
  bn: [
    "Brunei's flag uses yellow, white, black, and red.",
    "Brunei is on the island of Borneo.",
  ],
};

export function getFunFact(code: string, index = 0) {
  const facts = funFactsByCode[code];
  if (!facts?.length) return "Every flag hides a pattern. Look for colors, shapes, and symbols.";
  return facts[index % facts.length];
}
