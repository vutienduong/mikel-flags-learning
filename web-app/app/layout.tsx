import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Flags of the World",
  description: "Learn and quiz yourself on world flags",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header style={headerStyles.header}>
          <div className="container" style={headerStyles.container}>
            <Link href="/" style={headerStyles.logo}>
              🚩 Flags World
            </Link>
            <nav style={headerStyles.nav}>
              <Link href="/explore" style={headerStyles.link}>Explore</Link>
              <Link href="/quiz" style={headerStyles.link}>Quiz</Link>
              <Link href="/progress" style={headerStyles.link}>Stats</Link>
            </nav>
          </div>
        </header>
        <main style={{ minHeight: "calc(100vh - 64px)" }}>
          {children}
        </main>
      </body>
    </html>
  );
}

const headerStyles = {
  header: {
    height: "64px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    position: "sticky" as const,
    top: 0,
    zIndex: 100,
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#2563eb",
  },
  nav: {
    display: "flex",
    gap: "24px",
  },
  link: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#4b5563",
  },
};
