"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Monitor, Activity, Radio, Info, Check } from "lucide-react";

// Theme-paired captures: `<base>-light.webp` / `<base>-dark.webp` follow the site theme.
const SHOT_DIR = "/screenshots/features";

interface ShowcaseCrop {
  /** Natural size of the capture, in px */
  width: number;
  height: number;
  /** Region to frame: left/top edge and visible width, in capture px */
  x: number;
  y: number;
  visibleWidth: number;
}

interface ShowcaseTab {
  id: string;
  label: string;
  icon: React.ReactNode;
  imageBase: string;
  crop?: ShowcaseCrop;
  title: string;
  description: string;
  highlights: string[];
}

export default function ScreenshotShowcase() {
  const [activeTab, setActiveTab] = useState("overview");
  const tabListRef = useRef<HTMLDivElement>(null);
  // Which edges of the tab strip have hidden overflow (drives the edge-fade hint).
  const [overflow, setOverflow] = useState({ start: false, end: false });

  const updateOverflow = useCallback(() => {
    const el = tabListRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const next = { start: el.scrollLeft > 1, end: max - el.scrollLeft > 1 };
    setOverflow((prev) => (prev.start === next.start && prev.end === next.end ? prev : next));
  }, []);

  useEffect(() => {
    const el = tabListRef.current;
    if (!el) return;
    updateOverflow();
    const ro = new ResizeObserver(updateOverflow);
    ro.observe(el);
    el.addEventListener("scroll", updateOverflow, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", updateOverflow);
    };
  }, [updateOverflow]);

  const tabs: ShowcaseTab[] = [
    {
      id: "overview",
      label: "Dashboard",
      icon: <Monitor className="h-3.5 w-3.5" aria-hidden="true" />,
      imageBase: "rm551e-dashboard",
      title: "Live Dashboard",
      description: "Live 5G/LTE signal strength, serving cell PCI, active band list, and IP allocation.",
      highlights: [
        "RSRP / RSRQ / SINR gauges",
        "Cellular WAN & Gateway state",
        "Band lock status indicator",
        "Instant connection health",
      ],
    },
    {
      id: "activity",
      label: "Carrier Aggregation",
      icon: <Activity className="h-3.5 w-3.5" aria-hidden="true" />,
      imageBase: "rm551e-dashboard-full",
      // The full-page capture, framed on the Carrier Aggregation band
      crop: { width: 1600, height: 2697, x: 330, y: 1250, visibleWidth: 1230 },
      title: "Multi-Carrier Aggregation & Telemetry",
      description: "Inspect PCC (Primary Carrier) and SCC1–SCC3 channels with aggregated bandwidth.",
      highlights: [
        "PCC + SCC bandwidth strip",
        "Live ICMP latency monitoring",
        "Cell handover event audit log",
        "Daily/monthly data traffic counters",
      ],
    },
    {
      id: "cellular",
      label: "4x4 MIMO Signal",
      icon: <Radio className="h-3.5 w-3.5" aria-hidden="true" />,
      imageBase: "rm551e-antenna-statistics",
      title: "Per-Port RF Signal Metrics",
      description: "Signal for every receive chain on each antenna port, so a weak or idle antenna stands out.",
      highlights: [
        "Per-antenna port RSRP & SINR",
        "Main, Diversity & MIMO chains",
        "LTE and 5G NR side by side",
        "Active MIMO layer readout",
      ],
    },
    {
      id: "about",
      label: "About & Firmware",
      icon: <Info className="h-3.5 w-3.5" aria-hidden="true" />,
      imageBase: "rm551e-about-device",
      title: "Device Identity & Addresses",
      description: "Modem model, firmware build, and IMEI, plus where the device sits on the LAN and carrier network.",
      highlights: [
        "Modem firmware version readout",
        "IMEI & 3GPP release per radio",
        "LAN, WWAN & public IPs",
        "Linux host & internet status",
      ],
    },
  ];

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  const selectTab = (id: string) => {
    setActiveTab(id);
    document.getElementById(`showcase-tab-${id}`)?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    let nextIdx: number | null = null;
    if (e.key === "ArrowRight") nextIdx = (idx + 1) % tabs.length;
    else if (e.key === "ArrowLeft") nextIdx = (idx - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = tabs.length - 1;
    if (nextIdx === null) return;
    e.preventDefault();
    const id = tabs[nextIdx].id;
    selectTab(id);
    document.getElementById(`showcase-tab-${id}`)?.focus();
  };

  const fadeMask = (() => {
    const fade = "2.5rem";
    if (overflow.start && overflow.end)
      return `linear-gradient(to right, transparent, #000 ${fade}, #000 calc(100% - ${fade}), transparent)`;
    if (overflow.end) return `linear-gradient(to right, #000 calc(100% - ${fade}), transparent)`;
    if (overflow.start) return `linear-gradient(to right, transparent, #000 ${fade})`;
    return undefined;
  })();

  return (
    <section id="screenshots" className="scroll-mt-20 py-12 sm:py-16 border-t border-border/80">
      <div className="reveal mb-10">
        <h2 className="text-2xl font-bold tracking-tight text-foreground text-balance sm:text-3xl">
          Live web interface preview
        </h2>
        <p className="mt-2 max-w-2xl text-base text-muted-foreground leading-relaxed text-pretty">
          Real screenshots captured from running RM520N and RM551E modem dashboards.
        </p>
      </div>

      {/* Tabs (horizontally scrollable on narrow screens, with an edge-fade hint) */}
      <div className="mb-5 border-b border-border/80 pb-3">
        <div
          ref={tabListRef}
          role="tablist"
          aria-label="Modem web interface preview views"
          className="-mx-1 flex gap-2 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={fadeMask ? { maskImage: fadeMask, WebkitMaskImage: fadeMask } : undefined}
        >
          {tabs.map((tab, idx) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`showcase-tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`showcase-panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => selectTab(tab.id)}
                onKeyDown={(e) => handleTabKeyDown(e, idx)}
                className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "border-border bg-card text-muted-foreground font-medium hover:text-foreground hover:bg-muted"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Screenshot Frame (Clean Flat, Apple-Style Minimalist Window) */}
      <div
        id={`showcase-panel-${currentTab.id}`}
        role="tabpanel"
        aria-labelledby={`showcase-tab-${currentTab.id}`}
        className="reveal-stage overflow-hidden rounded-2xl border border-border bg-card shadow-xs"
      >
        {/* Frame Browser Bar */}
        <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-5 py-2.5 sm:px-6">
          <div className="flex shrink-0 gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <span className="min-w-0 truncate rounded-full border border-border/80 bg-background px-3 py-0.5 font-mono text-xs text-muted-foreground font-figure tabular-nums">
            http://192.168.224.1/{currentTab.id === "overview" ? "" : currentTab.id}
          </span>
        </div>

        {/* Image Content: 4:3 crop from the top-left on phones, the full 16:10 capture from sm */}
        <div className="bg-muted/20 p-2 sm:p-3">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border/60 bg-background sm:aspect-[16/10]">
            {/* Keyed per tab so each switch remounts and the new capture settles in */}
            <div key={currentTab.id} className="swap-in-image absolute inset-0">
              {(["light", "dark"] as const).map((theme) => (
                <ShowcaseImage key={theme} tab={currentTab} theme={theme} />
              ))}
            </div>
          </div>
        </div>

        {/* Caption & Highlights: what the view is (left), what it shows (right) */}
        <div className="grid gap-5 border-t border-border bg-card p-5 sm:p-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] lg:gap-12">
          <div key={`${currentTab.id}-caption`} className="swap-in">
            <h3 className="text-lg font-semibold tracking-tight text-balance text-foreground">
              {currentTab.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">
              {currentTab.description}
            </p>
          </div>

          <ul key={`${currentTab.id}-highlights`} className="swap-in grid sm:grid-cols-2 sm:gap-x-6" aria-label={`${currentTab.title} highlights`}>
            {currentTab.highlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 border-t border-border/80 py-2.5 text-sm leading-snug text-foreground last:pb-0 sm:nth-last-[-n+2]:pb-0 lg:nth-[-n+2]:border-t-0 lg:nth-[-n+2]:pt-0"
              >
                <Check className="mt-px size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ShowcaseImage({ tab, theme }: { tab: ShowcaseTab; theme: "light" | "dark" }) {
  const src = `${SHOT_DIR}/${tab.imageBase}-${theme}.webp`;
  const alt = `${tab.title} screenshot`;
  const themeClass = theme === "light" ? "dark:hidden" : "hidden dark:block";
  const priority = tab.id === "overview";
  const { crop } = tab;

  if (!crop) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover object-left-top ${themeClass}`}
        sizes="(max-width: 1280px) 100vw, 1216px"
        priority={priority}
      />
    );
  }

  // Scale the capture so `visibleWidth` fills the frame, then shift its region to the corner.
  // Translate percentages resolve against the image's own box, so this holds at any frame aspect.
  return (
    <Image
      src={src}
      alt={alt}
      width={crop.width}
      height={crop.height}
      className={`absolute left-0 top-0 h-auto max-w-none ${themeClass}`}
      style={{
        width: `${(crop.width / crop.visibleWidth) * 100}%`,
        transform: `translate(-${(crop.x / crop.width) * 100}%, -${(crop.y / crop.height) * 100}%)`,
      }}
      sizes="(max-width: 1280px) 130vw, 1600px"
      priority={priority}
    />
  );
}
