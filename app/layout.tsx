import type { Metadata } from "next";
import { Inter, Rethink_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const rethinkSans = Rethink_Sans({
  subsets: ["latin"],
  variable: "--font-rethink-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "QManager",
    template: "%s | QManager",
  },
  description: "Official documentation and installation guide for QManager & QManager-RM520N. Advanced modem control, band locking, live signal, SMS, and watchdog resilience.",
  icons: {
    icon: "/qmanager-mark.svg",
  },
};

// Runs before first paint: stored choice wins, otherwise follow the OS setting.
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){document.documentElement.classList.add("dark");}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${rethinkSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased font-sans">
        {children}
      </body>
    </html>
  );
}

