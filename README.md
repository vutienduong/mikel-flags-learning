# Mikel Flags Learning

A flags learning project for kids and beginners, with the existing Expo app kept at the repository root and the active Next.js web app in `web-app/`.

Current V2 expansion work targets **only** the Next.js app under `web-app/`. The Expo files remain in place for now, but they are not part of the new implementation path.

## Apps

- Expo mobile app at the repository root.
- Next.js web app in `web-app/`.
- Shared country data in JSON, including flag URL, capital, population, area, region, and languages.

## Web V2 MVP

- Home dashboard with current journey, streak, continue CTA, quick play, and a fun fact.
- Southeast Asia journey map with completed, current, and locked country nodes.
- Country intro screens with real flags and short storytelling facts.
- Spot the Odd Flag mini-game with fast feedback and star rewards.
- Progress screen with countries learned, streak, XP level, badges, and journey completion.
- Explore screen for the full 250-country data set.

## Run the Web App

```bash
cd web-app
npm install
npm run dev
```

Then visit `http://localhost:3000`.

Useful web commands:

```bash
npm run build
npm run start
```

## Data

Country codes are lowercase and the app keeps the full 250-country data set. Game progress is local-first for the MVP; a backend can be added later for accounts, sync, AI-generated odd flag variants, leaderboards, and content management.
