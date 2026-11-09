"use client";

import React, { type CSSProperties } from "react";
import { useLatestReleases } from "@/hooks/use-latest-releases";

interface HeroBadgeProps {
  style?: CSSProperties;
}

export function HeroBadge({ style }: HeroBadgeProps) {
  return (
    <div
      className="hero-rise inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3.5 py-1.5 shadow-xs"
      style={style}
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="led-ping absolute inset-0 rounded-full bg-emerald-500 opacity-0" />
        <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="text-xs font-semibold text-foreground">
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
