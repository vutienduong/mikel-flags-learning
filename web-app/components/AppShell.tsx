"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGameProgressStore } from "../lib/store";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/journey", label: "Journey", icon: "▤" },
  { href: "/progress", label: "Progress", icon: "▥" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const streak = useGameProgressStore((s) => s.progress.streak.current);
  const isGame = pathname.startsWith("/play");

  return (
    <div className={`app-shell ${isGame ? "is-game" : ""}`}>
      {!isGame && (
        <header className="top-bar">
          <Link href="/" className="brand" aria-label="Flag Quest home">
            <span className="brand-mark">FQ</span>
            <span className="brand-text">Flag Quest</span>
          </Link>
          <div className="top-actions">
            <span className="streak-pill">Day {Math.max(1, streak || 1)}</span>
            <span className="profile-dot">◎</span>
          </div>
        </header>
      )}

      <main className={isGame ? "game-content" : "main-content"}>{children}</main>

      {!isGame && (
        <nav className="bottom-nav" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${active ? "is-active" : ""}`}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
