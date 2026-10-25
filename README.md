# QManager Documentation Hub (Wiki)

The unified, instrument-grade documentation portal for **QManager** (RM551E Custom OpenWRT & RM520N On-Modem Linux), deployed on **Vercel Free Tier**.

---

## Architecture & Modem Compatibility

- **Qualcomm Snapdragon Ecosystem**: Engineered exclusively for Qualcomm Snapdragon-based Quectel 5G & LTE modems.
  - **Snapdragon X72 / X75**: Quectel RM551E-GL (runs dedicated on-board custom OpenWRT baseband environment).
  - **Snapdragon X62 / X65**: Quectel RM520N-GL, RM521F-GL (runs native Qualcomm SDXLEMUR Poky Linux).
  - **Snapdragon X55**: Quectel RG501, RM502, RM500Q series (complete cellular toolchain compatibility).
  - **On-Modem Linux Compatibility Bridge**: The `QManager-RM520N` on-modem branch is **not exclusive** to the RM520N. Any Qualcomm Snapdragon X5* or X6* series modem running internal Linux can run this edition. It is battle-tested primarily on **RM520N** and **RG501**; feedback and issue reports on other Qualcomm models are welcomed!
  - **Compatibility Rule**: All Qualcomm-based Quectel modems are supported; non-Qualcomm chipsets (ASR, Unisoc, MediaTek such as RG500U, EC200, EG25) are not supported.

---

## Design & UI Highlights

- **Instrument-Grade Industrial Craft**: Clean, distraction-free layout with authentic SVG brand vectors for PayPal and Wise, cohesive monochromatic icon treatments, and zero AI-template decorative clutter (no arbitrary rainbow squircles or redundant pill badges).
- **Full-Width Fluid Documentation**: Unconstrained reading layout (`w-full` spanning the entire screen width with clean responsive edge padding) replacing cramped container limits.
- **Instrument Typography**: Configured with Next.js `next/font/google` for **Inter** (all UI body, headings, navigation, prose) and **Rethink Sans** (`font-figure` / `tabular-nums` for numeric telemetry, signal values, tables, and versions).
- **Navigation & Search**:
  - Global `⌘K` / `Ctrl+K` instant search modal with arrow key navigation and direct jumping.
  - Sticky collapsible accordion sidebar with platform filters (`All`, `RM551E`, `RM520N`).
  - Active scrollspy Table of Contents with smooth section jumps.
  - Robust callouts (`[!NOTE]`, `[!TIP]`, `[!WARNING]`, `[!CAUTION]`) with clean 1px borders and no AI slop thick side-bars.

---

## Support the Project

QManager is 100% free and open source. If it helped you maximize cellular speeds or save hours of debugging, consider supporting ongoing development:

- **Wise (Lowest international fees in USD)**: [https://wise.com/pay/business/blackcatdev?currency=USD](https://wise.com/pay/business/blackcatdev?currency=USD)
- **PayPal (Quick one-click tip)**: [https://paypal.me/iamrusss](https://paypal.me/iamrusss)
- **GitHub Sponsors (Monthly or one-time sponsor)**: [https://github.com/sponsors/dr-dolomite](https://github.com/sponsors/dr-dolomite)

---

## Local Development

Ensure you have [Bun](https://bun.sh) or Node.js installed:

\`\`\`sh
# Install dependencies
bun install

# Start local dev server
bun run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## Production Build

To verify a production build locally:

\`\`\`sh
bun run build
\`\`\`

---

## Free Vercel Deployment

This project is pre-configured for **Vercel Free Tier** zero-configuration deployment:

1. Push this repository to GitHub:
   \`\`\`sh
   git init
   git add .
   git commit -m "feat: complete QManager documentation website"
   git remote add origin https://github.com/your-org/qmanager-docs.git
   git push -u origin main
   \`\`\`
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Framework Preset will auto-detect as **Next.js**.
4. Click **Deploy**. Vercel will build the static routes and deploy globally in seconds!
