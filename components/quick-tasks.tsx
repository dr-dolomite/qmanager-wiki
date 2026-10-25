"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import {
  BroadcastIcon,
  GlobeHemisphereWestIcon,
  HeartbeatIcon,
  LockKeyIcon,
} from "@phosphor-icons/react/ssr";

interface QuickTask {
  title: string;
  description: string;
  href: string;
  icon: PhosphorIcon;
}

const QUICK_TASKS: QuickTask[] = [
  {
    title: "Boost Signal & Aim Antennas",
    description: "Live signal meter to help you point and position directional antennas for peak RSRP and SINR.",
    href: "/docs/cellular/antenna-alignment/",
    icon: BroadcastIcon,
  },
  {
    title: "Lock Fast Bands & Towers",
    description: "Pin your connection to the fastest 5G & LTE frequency bands or lock onto specific cell towers.",
    href: "/docs/cellular/band-locking/",
    icon: LockKeyIcon,
  },
  {
    title: "Automated Watchdog",
    description: "Self-healing recovery daemon that monitors latency and automatically restores dropped links.",
    href: "/docs/resilience/connection-watchdog/",
    icon: HeartbeatIcon,
  },
  {
    title: "Remote Mesh Access",
    description: "Securely monitor and configure your modem from anywhere over Tailscale or Netbird VPN.",
    href: "/docs/management/tailscale-vpn/",
    icon: GlobeHemisphereWestIcon,
  },
];

export default function QuickTasks() {
  return (
    <section className="py-12 sm:py-16">
      <div className="reveal mb-10">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Popular tasks &amp; guides
        </h2>
        <p className="mt-2 max-w-xl text-base text-muted-foreground leading-relaxed text-pretty">
          Direct, practical tutorials for the most widely used modem optimization workflows.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_TASKS.map((task, i) => {
          const Icon = task.icon;
          return (
            <Link
              key={task.title}
              href={task.href}
              style={{ "--i": i } as React.CSSProperties}
              className="reveal group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 sm:p-6 transition-[border-color,box-shadow] duration-150 hover:border-primary/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div>
                <Icon weight="fill" className="mb-5 size-7 text-primary" aria-hidden="true" />
                <h3 className="text-base font-semibold text-foreground tracking-tight transition-colors group-hover:text-primary">
                  {task.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed text-pretty">
                  {task.description}
                </p>
              </div>

              <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                <span>Read guide</span>
                <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
