"use client";

import React, { type CSSProperties } from "react";
import { useLatestReleases } from "@/hooks/use-latest-releases";

interface HeroVersionBadgeProps {
  style?: CSSProperties;
}

export function HeroVersionBadge({ style }: HeroVersionBadgeProps) {
  const { releases } = useLatestReleases();

  return (
    <div
      className="hero-rise inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3.5 py-1.5 shadow-xs"
      style={style}
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="led-ping absolute inset-0 rounded-full bg-emerald-500 opacity-0" />
        <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="text-xs font-semibold text-foreground font-figure tabular-nums">
        {releases.rm551e} (RM551E) • {releases.rm520n} (RM520N)
      </span>
      <span className="text-border">•</span>
      <span className="text-xs text-muted-foreground font-medium">
        Built for Qualcomm 5G Modems
      </span>
    </div>
  );
}

export function NavbarVersionBadge() {
  const { releases } = useLatestReleases();

  return (
    <span className="hidden rounded-full border border-border bg-muted/70 px-2 py-0.5 text-xs sm:inline-flex font-medium text-muted-foreground font-figure tabular-nums">
      {releases.rm551e} • {releases.rm520n}
    </span>
  );
}
