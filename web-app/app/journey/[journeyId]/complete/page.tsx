"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { badges, journeys } from "../../../../data/journeys";
import { getCountry, getJourney, getJourneyCompletion } from "../../../../lib/journey";
import { useGameProgressStore } from "../../../../lib/store";

export default function JourneyCompletePage() {
  const params = useParams<{ journeyId: string }>();
  const searchParams = useSearchParams();
  const progress = useGameProgressStore((s) => s.progress);
  const journey = getJourney(params.journeyId);
  const lastCountry = getCountry(searchParams.get("from") ?? "");

  if (!journey) {
    return (
      <div className="page narrow-page">
        <Link href="/journey" className="secondary-button">
          ← Map
        </Link>
        <h1 className="section-title" style={{ marginTop: 24 }}>
          Journey not found
        </h1>
      </div>
    );
  }

  const journeyProgress = progress.journeyProgressById[journey.id];
  const completion = getJourneyCompletion(journey, journeyProgress);
  const rewardBadgeIds = journey.reward?.badges ?? [];
  const rewardBadges = badges.filter((badge) => rewardBadgeIds.includes(badge.id));
  const isPrimaryJourney = journeys[0]?.id === journey.id;

  return (
    <div className="page narrow-page">
      <section className="complete-stage">
        <div className="complete-medal">★</div>
        <p className="kicker">Region Complete</p>
        <h1 className="page-title">{journey.title}</h1>
        <p className="body-copy">
          {isPrimaryJourney
            ? "You finished every Southeast Asia flag checkpoint."
            : "You finished every country in this journey."}
        </p>

        <div className="toy-card complete-score">
          <div>
            <span className="kicker">Countries</span>
            <strong>
              {completion.completed}/{completion.total}
            </strong>
          </div>
          <div>
            <span className="kicker">Stars</span>
            <strong>{journeyProgress?.totalStars ?? 0}</strong>
          </div>
          <div>
            <span className="kicker">Reward</span>
            <strong>+{journey.reward?.xp ?? 0} XP</strong>
          </div>
        </div>

        {lastCountry && (
          <div className="complete-last-flag">
            <img src={lastCountry.flagUrl} alt={lastCountry.name} />
            <span>Final stop: {lastCountry.name}</span>
          </div>
        )}

        <div className="complete-badges">
          {rewardBadges.map((badge) => (
            <div key={badge.id} className="toy-card complete-badge">
              <div>{badge.icon}</div>
              <strong>{badge.title}</strong>
              <span>{badge.description}</span>
            </div>
          ))}
        </div>

        <div className="action-row" style={{ width: "100%" }}>
          <Link href="/progress" className="primary-button">
            View Progress
          </Link>
          <Link href="/journey" className="secondary-button">
            Back to Map
          </Link>
        </div>
      </section>
    </div>
  );
}
