# Mikel Flags Learning

World flags learning project with an Expo mobile app and a Next.js web app.

## What is included

- Expo app for flag browsing, quizzes, and progress tracking
- Next.js web app in `web-app/`
- Shared country data and quiz-generation logic
- Jest setup for the React Native app

## Run the mobile app

```bash
npm install
npm start
```

Run tests:

```bash
npm test
```

## Run the web app

```bash
cd web-app
npm install
npm run dev
```

Then visit `http://localhost:3000`.

## Next Steps / Future Work

- Share data-generation scripts between mobile and web more explicitly.
- Add sync support so progress can move between devices.
- Expand quiz types with map, region, and currency questions.
- Add accessibility QA for screen readers and keyboard navigation on web.
