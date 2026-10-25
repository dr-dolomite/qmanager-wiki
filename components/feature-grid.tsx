import React from "react";
import Link from "next/link";
import {
  Radio,
  SlidersHorizontal,
  Network,
  CreditCard,
  ShieldCheck,
  Wrench,
  ArrowRight,
} from "lucide-react";
import { DOC_CATEGORIES } from "@/lib/docs-data";

const CATEGORY_COUNT = DOC_CATEGORIES.length;
const GUIDE_COUNT = DOC_CATEGORIES.reduce((total, category) => total + category.articles.length, 0);

interface FeatureTopic {
  label: string;
  href: string;
}

interface FeatureCard {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  summary: string;
  categoryHref: string;
  topics: FeatureTopic[];
}

const FEATURES: FeatureCard[] = [
  {
    title: "Signal & Cellular Operations",
    icon: Radio,
    summary: "Real-time 4x4 MIMO per-port telemetry, acoustic antenna alignment, and Carrier Aggregation breakdown.",
    categoryHref: "/docs/cellular/live-signal/",
    topics: [
      { label: "Live Signal", href: "/docs/cellular/live-signal/" },
      { label: "Band Locking", href: "/docs/cellular/band-locking/" },
      { label: "Tower Lock", href: "/docs/cellular/tower-lock-failover/" },
      { label: "Antenna Alignment", href: "/docs/cellular/antenna-alignment/" },
      { label: "Carrier Aggregation", href: "/docs/cellular/carrier-aggregation/" },
    ],
  },
  {
    title: "Network & Hotspot Settings",
    icon: Network,
    summary: "Bypass carrier hotspot (tethering) limits with TTL adjustment, IP Passthrough bridge mode, and DPI optimization.",
    categoryHref: "/docs/networking/ttl-mtu-engine/",
    topics: [
      { label: "TTL / MTU Engine", href: "/docs/networking/ttl-mtu-engine/" },
      { label: "IP Passthrough", href: "/docs/networking/ip-passthrough/" },
      { label: "Custom DNS", href: "/docs/networking/custom-dns/" },
      { label: "DPI Traffic Engine", href: "/docs/networking/dpi-settings/" },
    ],
  },
  {
    title: "SIM & APN Provisioning",
    icon: CreditCard,
    summary: "Instant ICCID detection, multi-profile APN mapping, dual-SIM binding, and automatic PDP context management.",
    categoryHref: "/docs/profiles/apn-management/",
    topics: [
      { label: "APN Contexts", href: "/docs/profiles/apn-management/" },
      { label: "Custom SIM Profiles", href: "/docs/profiles/custom-sim-profiles/" },
      { label: "Known SIMs", href: "/docs/profiles/known-sims/" },
      { label: "Scenario Binding", href: "/docs/profiles/scenario-profile-binding/" },
    ],
  },
  {
    title: "Watchdog & Self-Healing",
    icon: ShieldCheck,
    summary: "4-tier auto-recovery pipeline: interface reset → radio power toggle → SIM failover → system reboot.",
    categoryHref: "/docs/resilience/connection-watchdog/",
    topics: [
      { label: "Watchdog Engine", href: "/docs/resilience/connection-watchdog/" },
      { label: "SIM Failover", href: "/docs/resilience/sim-failover/" },
      { label: "Adaptive Polling", href: "/docs/resilience/adaptive-polling/" },
    ],
  },
  {
    title: "Remote Access & Diagnostics",
    icon: Wrench,
    summary: "Built-in Tailscale and Netbird mesh VPNs, interactive AT console, and Prometheus metrics scraping.",
    categoryHref: "/docs/management/tailscale-vpn/",
    topics: [
      { label: "Tailscale VPN", href: "/docs/management/tailscale-vpn/" },
      { label: "AT Broker", href: "/docs/management/at-broker/" },
      { label: "Prometheus Metrics", href: "/docs/management/prometheus-metrics/" },
      { label: "Backup & Restore", href: "/docs/management/config-backup-restore/" },
    ],
  },
  {
    title: "For Developers",
    icon: SlidersHorizontal,
    summary: "Complete JSON REST API endpoint specifications, baseband serial multiplexing, and a lightweight, zero-overhead backend.",
    categoryHref: "/docs/developer/api-reference/",
    topics: [
      { label: "REST API Spec", href: "/docs/developer/api-reference/" },
      { label: "System Architecture", href: "/docs/developer/system-architecture/" },
      { label: "RM520N Port Ledger", href: "/docs/developer/rm520n-port-ledger/" },
    ],
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="py-12 sm:py-16 scroll-mt-20 border-t border-border/80">
      <div className="reveal mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Core feature documentation
          </h2>
          <p className="mt-2 max-w-xl text-base text-muted-foreground leading-relaxed text-pretty">
            Highlights from {GUIDE_COUNT} step-by-step guides across {CATEGORY_COUNT} categories, covering every part of your Quectel modem.
          </p>
        </div>
        <Link
          href="/docs/getting-started/introduction/"
          className="inline-flex items-center gap-1.5 rounded-full text-sm font-semibold text-primary underline-offset-4 hover:underline self-start sm:self-auto shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span>Browse all {GUIDE_COUNT} guides</span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              style={{ "--i": i % 3 } as React.CSSProperties}
              className="reveal flex flex-col justify-between rounded-2xl border border-border bg-card p-5 sm:p-6"
            >
              <div>
                {/* Header */}
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <Link
                    href={feature.categoryHref}
                    aria-label={`${feature.title} overview`}
                    className="inline-flex items-center gap-1 rounded-full border border-transparent px-3 py-1 text-sm font-medium text-primary transition-[border-color,box-shadow,background-color] duration-150 hover:border-primary/30 hover:bg-primary/5 hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span>Overview</span>
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>

                {/* Title & Summary */}
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed text-pretty">
                  {feature.summary}
                </p>
              </div>

              {/* Clickable Topic Chips */}
              <div className="mt-5 border-t border-border/80 pt-4">
                <h4 className="mb-2.5 text-sm font-semibold text-foreground">Guides</h4>
                <div className="flex flex-wrap gap-1.5">
                  {feature.topics.map((topic) => (
                    <Link
                      key={topic.label}
                      href={topic.href}
                      className="inline-flex items-center rounded-full border border-border/80 bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground transition-[border-color,box-shadow,color,background-color] duration-150 hover:border-primary/40 hover:bg-muted hover:text-foreground hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {topic.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
