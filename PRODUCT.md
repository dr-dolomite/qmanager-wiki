# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Next.js 16 (App Router), React 19, Tailwind CSS v4, shadcn/ui, TypeScript, Lucide Icons

## Users
- **General Consumers & Home Router Beginners**: Users seeking straightforward one-line setup, setup wizards, and quick-start guides to get their Quectel cellular modem working without needing RF engineering expertise.
- **Network Engineers, WISP Operators & Homelabbers**: Advanced users and technicians optimizing 5G/LTE band locking, cell tower targeting (PCI/ARFCN), multi-carrier failover, automated watchdog recovery, and low-level AT command diagnostics.

## Product Purpose
Deliver an approachable yet instrument-grade, zero-footprint web documentation hub and reference portal for QManager (RM551E Custom OpenWRT) and QManager-RM520N (Native Linux), enabling users of all skill levels to deploy, configure, troubleshoot, and maximize performance on Qualcomm Snapdragon-based Quectel cellular modems.

## Positioning
The unified, hardware-aware management portal and knowledge base that bridges high-end cellular diagnostic tooling (traditionally restricted to proprietary software like Qualcomm QXDM) with an Apple-inspired, consumer-friendly documentation experience.

## Operating Context
- Web browsers accessing local router/modem gateways (`http://192.168.224.1` for RM551E or `http://192.168.225.1` for RM520N) or the hosted hub on Vercel.
- Physical hardware environments: Qualcomm Snapdragon modems (RM551E-GL, RM520N-GL, RM521F, RG501, RM502, RM500Q) operating with on-modem custom OpenWRT (RM551E), standalone on-modem Linux (SDXLEMUR on RM520N/RM521F). Standalone 5G-to-Ethernet boards plug into the WAN port of any router (GL.iNet, OpenWrt, etc.); installing QManager on a host router is not a supported setup.
- Dual-scenario access: Field troubleshooting during intermittent cellular outages (requiring offline-ready speed and scannability) vs. desktop setup and planning.

## Capabilities and Constraints
- Comprehensive coverage of 35+ modem management features organized across 8 core categories.
- Dual-edition hardware architecture segmentation: RM551E Series (Custom OpenWRT) vs. RM520N Series (Native Linux / SDXLEMUR).
- Fast client-side global instant search (Cmd+K / Ctrl+K), responsive sticky sidebar, and active scrollspy TOC.
- Progressive disclosure navigation with difficulty badges (`Beginner`, `Advanced`, `Expert RF`) and expandable technical deep-dives.
- Dual-theme system: Native Light and Dark mode support with instant toggle and system preference sync.
- Technical constraint: Static pre-rendering with Next.js App Router for zero-cost deployment on Vercel Free Tier; zero heavy external runtime services.

## Brand Commitments
- **Name**: QManager Documentation Hub (Wiki)
- **Voice**: Approachable, crystal clear, authoritative, and respectful of both beginners and senior engineers.
- **Visual Direction**: Consumer-Friendly Hardware Portal (inspired by UniFi / Apple Support) with rounded geometry, soft card elevation, high-contrast legibility, and illustrated step-by-step guidance.
- **Component System**: shadcn/ui built on Tailwind CSS v4 and Radix primitives.
- **Theme Foundation**: Full Dual-Theme (Light & Dark) with daylight-clean whites and polished dark slate modes.

## Evidence on Hand
- Next.js 16 + React 19 + Tailwind CSS v4 codebase with working routes.
- Real content dataset with 8 categories and 35+ features in [`lib/docs-data.ts`](file:///d:/Projects/QM%20PROJECT/qmanager-wiki/lib/docs-data.ts).
- Working hardware matrix and install command configurations.

## Product Principles
1. **Progressive Disclosure**: Welcome beginners with friendly, illustrated setup cards while keeping deep RF diagnostics one click away via difficulty-badged deep-dives.
2. **Speed & Clarity**: Code snippets, terminal commands, and hardware matrices must be instantly copyable, syntax-clean, and scannable.
3. **Dual-Theme Discipline**: Flawless contrast and visual comfort in both daylight and dark operational environments.
4. **Hardware Authenticity**: Distinguish unequivocally between RM551E on-board OpenWRT commands and RM520N on-modem Linux environments to prevent user configuration errors.

## Accessibility & Inclusion
- Strict WCAG 2.1 AA conformance: Keyboard navigability for all interactive components (search modal, difficulty filters, code blocks), high-contrast text and badge colors, semantic HTML5 structure, and screen-reader labeled callouts.
