import type { Metadata } from "next";
import { Inter, Rethink_Sans } from "next/font/google";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_OG_IMAGE, SITE_URL } from "@/lib/site";

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
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: "QManager",
    template: "%s | QManager",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "QManager",
    "Quectel modem web GUI",
    "RM551E",
    "RM520N",
    "RG501",
    "5G modem manager",
    "band locking",
    "OpenWrt modem",
    "Qualcomm Snapdragon modem",
    "APN profiles",
    "cellular signal monitor",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "QManager: web GUI for Quectel 5G and LTE modems",
    description: SITE_DESCRIPTION,
    url: "/",
    locale: "en_US",
    images: [SITE_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "QManager: web GUI for Quectel 5G and LTE modems",
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE.url],
  },
  icons: {
    icon: "/qmanager-mark.svg",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: SITE_NAME,
      applicationCategory: "NetworkingApplication",
      operatingSystem: "OpenWrt, Linux",
      description: SITE_DESCRIPTION,
      url: `${SITE_URL}/`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@type": "Person", name: "dr-dolomite", url: "https://github.com/dr-dolomite" },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased font-sans">
        {children}
      </body>
    </html>
  );
}

