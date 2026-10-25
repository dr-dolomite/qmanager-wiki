# QManager Documentation Screenshot Assets & Endpoint Report

This directory contains high-fidelity GUI screenshots captured directly from active Quectel cellular modems running QManager, along with authenticated dashboard showcase captures for the documentation website.

---

## 1. Hardware Endpoint Audit & Live Status

| Property | RM551E-GL Endpoint | RM520N-GL Endpoint |
| :--- | :--- | :--- |
| **IP Address** | `192.168.224.1` | `192.168.225.1` |
| **Module Hardware** | Quectel RM551E-GL | Quectel RM520N-GL |
| **Host System** | OpenWRT (`Russel`) | Qualcomm SDX62 Native Linux (`sdxlemur`) |
| **Local Interface** | Ethernet (`192.168.227.79`) | Wi-Fi (`192.168.8.157`) |
| **Network Reachability** | **Active & Responding** (HTTP 200, HTTPS 200, SSH 22 open) | **Active & Responding** (HTTP 200, HTTPS 200, SSH 22 open) |
| **Web Server** | Lighttpd / Next.js static export | Lighttpd / Next.js static export |
| **Active Carrier** | TNT | SMART |
| **Radio Technology** | LTE (FDD) | 5G-NSA (Dual Carrier: LTE B1 + 5G NR n41) |
| **Serving Bands** | Band 28 (20 MHz, PCI 135) | Band 1 (20 MHz, PCI 295) + n41 (60 MHz, PCI 262) |
| **Signal Metrics** | RSRP: -120 dBm, SINR: 1 dB | RSRP: -75 dBm (n41) / -81 dBm (B1), SINR: 18.9 dB |
| **Thermal Reading** | 37°C | 44°C |
| **Device Uptime** | ~1.3 hours | ~58.3 hours (210,000 s) |

> [!NOTE] **Status Note for RM520N (`192.168.225.1`)**:  
> In prior test cycles, `192.168.225.1` was flagged as unreachable/timed out. Live network probes confirmed that `192.168.225.1` is reachable via the Wi-Fi route (`192.168.8.157`), answering on ports 80, 443, and 22. Both hardware targets are healthy and serving live baseband telemetry.

---

## 2. Screenshot Asset Manifest

All images are stored in `public/screenshots/` and accessible from Next.js via `/screenshots/<filename>`.

### A. Live Hardware Captures (RM551E-GL — OpenWRT Edition)

| Asset File | Resolution / Mode | Theme | Description & Usage |
| :--- | :--- | :--- | :--- |
| [`rm551e-overview-dark.png`](/screenshots/rm551e-overview-dark.png) | 1920x1080 @2x | Dark | Full desktop overview showing active LTE on TNT (B28, -120 dBm, 37°C) with LuCI shortcut link. |
| [`rm551e-overview-light.png`](/screenshots/rm551e-overview-light.png) | 1920x1080 @2x | Light | Full desktop overview in light theme for print/PDF doc rendering. |
| [`rm551e-overview-card.png`](/screenshots/rm551e-overview-card.png) | Focused Card Crop @2x (1168x1146) | Dark | Perfectly centered card crop ideal for inline doc callouts and feature badges. |
| [`rm551e-overview-card-light.png`](/screenshots/rm551e-overview-card-light.png) | Focused Card Crop @2x (1168x1146) | Light | Light theme card crop for light-mode documentation articles. |
| [`rm551e-overview-mobile.png`](/screenshots/rm551e-overview-mobile.png) | 390x844 @3x (1170x2532) | Dark | Mobile viewport showing vertical stack responsiveness on phone screens. |
| [`rm551e-overview-mobile-light.png`](/screenshots/rm551e-overview-mobile-light.png) | 390x844 @3x (1170x2532) | Light | Mobile viewport in light mode. |
| [`rm551e-login-dark.png`](/screenshots/rm551e-login-dark.png) | 1920x1080 @2x | Dark | Sign-in portal for OpenWRT device (`Russel`), with password reset accordion. |
| [`rm551e-login-light.png`](/screenshots/rm551e-login-light.png) | 1920x1080 @2x | Light | Sign-in portal in light theme. |
| [`rm551e-login-card.png`](/screenshots/rm551e-login-card.png) | Focused Card Crop @2x (888x854) | Dark | Cropped login card for authentication guides and credential tutorials. |
| [`rm551e-login-card-light.png`](/screenshots/rm551e-login-card-light.png) | Focused Card Crop @2x (888x854) | Light | Cropped login card in light theme. |

### B. Live Hardware Captures (RM520N-GL — Native Linux Edition)

| Asset File | Resolution / Mode | Theme | Description & Usage |
| :--- | :--- | :--- | :--- |
| [`rm520n-overview-dark.png`](/screenshots/rm520n-overview-dark.png) | 1920x1080 @2x | Dark | Full desktop overview showing active 5G-NSA on SMART (B1 + n41, 80 MHz aggregated, 44°C). |
| [`rm520n-overview-light.png`](/screenshots/rm520n-overview-light.png) | 1920x1080 @2x | Light | Full desktop overview in light theme for RM520N native edition. |
| [`rm520n-overview-card.png`](/screenshots/rm520n-overview-card.png) | Focused Card Crop @2x (1168x1128) | Dark | Centered 5G dual-band signal meter widget crop for inline documentation. |
| [`rm520n-overview-card-light.png`](/screenshots/rm520n-overview-card-light.png) | Focused Card Crop @2x (1168x1128) | Light | Centered 5G signal meter widget in light theme. |
| [`rm520n-overview-mobile.png`](/screenshots/rm520n-overview-mobile.png) | 390x844 @3x (1170x2532) | Dark | High-density mobile viewport showing stacked 5G-NSA signal gauges. |
| [`rm520n-overview-mobile-light.png`](/screenshots/rm520n-overview-mobile-light.png) | 390x844 @3x (1170x2532) | Light | High-density mobile viewport in light mode. |
| [`rm520n-login-dark.png`](/screenshots/rm520n-login-dark.png) | 1920x1080 @2x | Dark | Sign-in portal for native SDX62 device (`sdxlemur`). |
| [`rm520n-login-light.png`](/screenshots/rm520n-login-light.png) | 1920x1080 @2x | Light | Sign-in portal for native SDX62 device in light theme. |
| [`rm520n-login-card.png`](/screenshots/rm520n-login-card.png) | Focused Card Crop @2x (888x854) | Dark | Cropped sign-in card for native setup docs. |
| [`rm520n-login-card-light.png`](/screenshots/rm520n-login-card-light.png) | Focused Card Crop @2x (888x854) | Light | Cropped sign-in card in light theme. |

### C. Authenticated Dashboard Showcase Captures (Existing Wiki Assets)

| Asset File | Dimension | Route | Description & Usage |
| :--- | :--- | :--- | :--- |
| [`dashboard-overview.png`](/screenshots/dashboard-overview.png) | 1920x1080 | `/dashboard/` | Full cockpit dashboard with 4G/5G primary status, signal graphs, and device info. Used in `ScreenshotShowcase` Overview tab. |
| [`dashboard-activity.png`](/screenshots/dashboard-activity.png) | 1920x1080 | `/dashboard/` | Carrier aggregation bar, ICMP latency chart, device metrics, and network event audit log. Used in `ScreenshotShowcase` Activity tab. |
| [`cellular-radio-info.png`](/screenshots/cellular-radio-info.png) | 1920x1080 | `/cellular/` | Granular per-antenna baseband metrics (PCC B3 + SCC1 B1 + ANCHOR n41). Used in `ScreenshotShowcase` Cellular tab. |
| [`about-device.png`](/screenshots/about-device.png) | 1920x1080 | `/about-device/` | Hardware identity, 3GPP release badges, IMEI, and revision numbers. Used in `ScreenshotShowcase` About tab. |

---

## 3. How to Reference in Markdown Documentation

### Standard Markdown Image Embedding
```markdown
![QManager RM551E-GL Overview](/screenshots/rm551e-overview-card.png)
```

### With Next.js Image Component
```tsx
import Image from "next/image";

<Image
  src="/screenshots/rm520n-overview-card.png"
  alt="RM520N 5G NSA Live Overview"
  width={584}
  height={564}
  className="rounded-xl border border-[var(--border)] shadow-md"
/>
```

### Side-by-Side Hardware Comparison (OpenWRT vs Native RM520N)
```markdown
| RM551E-GL on OpenWRT (`192.168.224.1`) | RM520N on Native SDX62 (`192.168.225.1`) |
| :---: | :---: |
| ![](/screenshots/rm551e-overview-card.png) | ![](/screenshots/rm520n-overview-card.png) |
```

---

## 4. Automation Scripts

The screenshot capture pipeline is fully automated and reproducible using Node.js and native Chrome DevTools Protocol (CDP):
- [`scripts/capture-screenshots.mjs`](file:///d:/Projects/QM%20PROJECT/qmanager-wiki/scripts/capture-screenshots.mjs): Captures 1080p desktop screenshots in dark and light themes across both endpoints with automatic hydration verification and input focus blur.
- [`scripts/capture-variants.mjs`](file:///d:/Projects/QM%20PROJECT/qmanager-wiki/scripts/capture-variants.mjs): Captures mobile viewports (390x844 @3x) and focused card crops across both dark and light modes using accurate container selectors (`section.rounded-hero`, `div.rounded-hero`).
- [`public/screenshots/manifest.json`](file:///d:/Projects/QM%20PROJECT/qmanager-wiki/public/screenshots/manifest.json): Machine-readable JSON manifest containing full metadata, live telemetry, and viewport details for all assets.

---

## 5. Feature Screenshots for the Docs (`features/`)

`public/screenshots/features/` holds one screenshot per QManager feature, in both themes, for both editions. Each one is embedded in its matching Docs article.

- **Naming:** `<edition>-<feature>-<light|dark>.webp`. The edition is `rm551e` or `rm520n`. Example: `rm551e-band-locking-light.webp`.
- **Size:** captured at a 1440x900 viewport @2x, then saved as WebP at 1600x1000, quality 82, about 60 KB each. The `*-dashboard-full-*` files are full-page captures.
- **Data:** every screen is filled with dummy values from a mock CGI server, not from a live modem. All identifiers are fake: IMEI 350000000000006, ICCID 8900000000000000000, IMSI 001010000000000, phone numbers +1 555 01xx.
- **Embedding:** in markdown, write `![alt](/screenshots/features/<name>-light.webp "Caption")`. The Docs renderer swaps in the `-dark.webp` file automatically in dark mode. The text in quotes becomes the visible caption. Two image lines in a single paragraph render side by side.
