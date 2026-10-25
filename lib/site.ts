// Single source for the canonical origin. Set NEXT_PUBLIC_SITE_URL when a custom
// domain is attached; sitemap, robots, canonicals and social cards all follow it.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://qmanager.pages.dev").replace(/\/$/, "");

export const SITE_NAME = "QManager";

export const SITE_DESCRIPTION =
  "QManager is a free web GUI for Quectel 5G and LTE modems. Install guides for RM551E and RM520N, band locking, live signal, SMS, APN profiles and watchdog.";

export const SITE_OG_IMAGE = {
  url: "/screenshots/dashboard-overview.png",
  width: 1920,
  height: 1080,
  alt: "QManager dashboard showing live signal and cellular status for a Quectel modem",
};
