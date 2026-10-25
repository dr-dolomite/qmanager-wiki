"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { CircleCheck, Cpu, EthernetPort, Power, RadioTower, RefreshCw, Router, TriangleAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Tone = "risk" | "ok";
type PhaseKey = "up" | "reboot" | "redial";
type Signal = "ok" | "risk" | "warn";

interface Node {
  icon: LucideIcon;
  name: string;
  detail: string;
  // Which of the four shared columns the node sits in. Both lanes use the same four,
  // so the router lands directly under the router and the eye can read straight down.
  col: 1 | 2 | 3 | 4;
  // Marks the box that owns the cellular data call: the whole point of the comparison.
  manager?: string;
}

interface Link {
  id: string;
  label: string;
  from: number;
  to: number;
}

// What the lane looks like in one phase of the "reboot the router" demo.
interface PhaseView {
  status: string;
  signal: Signal;
  cut?: string[];
  // Link is up but carries nothing: the modem is registered, there is just no data session.
  idle?: string[];
  off?: string;
  badge?: { node: string; text: string; signal: Signal };
  chip?: "down" | "busy";
}

interface Lane {
  title: string;
  mode: string;
  config: string;
  tone: Tone;
  nodes: Node[];
  links: Link[];
  outcome: string;
  phases: Partial<Record<PhaseKey, PhaseView>> & { up: PhaseView; reboot: PhaseView };
}

const LANES: Lane[] = [
  {
    title: "Router-driven",
    mode: "Default · TE mode",
    config: "usbnet 0 or 2 · pcie/mode 0",
    tone: "risk",
    nodes: [
      { icon: RadioTower, name: "Cell tower", detail: "5G / LTE", col: 1 },
      { icon: Cpu, name: "Modem", detail: "Waits for the host to dial it", col: 2 },
      {
        icon: Router,
        name: "Router",
        detail: "Needs modem drivers plus QMI/MBIM scripts",
        col: 4,
        manager: "Owns the data call",
      },
    ],
    links: [
      { id: "radio", label: "Radio", from: 1, to: 2 },
      { id: "usb", label: "USB or PCIe endpoint · QMI / MBIM control", from: 2, to: 4 },
    ],
    outcome: "Router reboots or a driver hiccups: the data call drops until the router dials again.",
    phases: {
      up: { status: "Data call up", signal: "ok" },
      reboot: {
        status: "Call dropped",
        signal: "risk",
        cut: ["usb"],
        idle: ["radio"],
        off: "Router",
        badge: { node: "Router", text: "Rebooting…", signal: "risk" },
        chip: "down",
      },
      redial: {
        status: "Re-dialing…",
        signal: "warn",
        idle: ["radio", "usb"],
        badge: { node: "Router", text: "Re-dialing…", signal: "warn" },
        chip: "busy",
      },
    },
  },
  {
    title: "Standalone Ethernet",
    mode: "Required for QManager · AP mode",
    config: "usbnet 1 · pcie/mode 1",
    tone: "ok",
    nodes: [
      { icon: RadioTower, name: "Cell tower", detail: "5G / LTE", col: 1 },
      {
        icon: Cpu,
        name: "Modem",
        detail: "Runs its own Linux, DHCP server and QManager",
        col: 2,
        manager: "Owns the data call",
      },
      { icon: EthernetPort, name: "Ethernet PHY", detail: "RTL8125 on the M.2-to-Ethernet board", col: 3 },
      { icon: Router, name: "Router WAN port", detail: "Just asks for an IP, like any ISP uplink", col: 4 },
    ],
    links: [
      { id: "radio", label: "Radio", from: 1, to: 2 },
      { id: "pcie", label: "PCIe Root Complex", from: 2, to: 3 },
      { id: "cable", label: "Ethernet cable · DHCP", from: 3, to: 4 },
    ],
    outcome: "Router reboots: the modem stays online and the WAN link is back as soon as the port comes up.",
    phases: {
      up: { status: "Data call up", signal: "ok" },
      reboot: {
        status: "Call stays up",
        signal: "ok",
        cut: ["cable"],
        off: "Router WAN port",
        badge: { node: "Router WAN port", text: "Rebooting…", signal: "risk" },
      },
    },
  },
];

// One reboot, both lanes at once. The router comes back at the same moment in both; what differs is that
// the router-driven call then has to be re-dialed, while the standalone one never dropped. Times are for
// the demo, not measurements.
const SEQUENCE: { at: number; phases: [PhaseKey, PhaseKey] }[] = [
  { at: 0, phases: ["reboot", "reboot"] },
  { at: 1400, phases: ["redial", "up"] },
  { at: 3400, phases: ["up", "up"] },
];

const SIGNAL_TEXT: Record<Signal, string> = {
  ok: "text-success",
  risk: "text-destructive",
  warn: "text-warning",
};

const BADGE_STYLES: Record<Signal, string> = {
  ok: "border-success/40 bg-card text-foreground",
  risk: "border-destructive/40 bg-card text-foreground",
  warn: "border-warning/50 bg-card text-foreground",
};

// The card that owns the data call is tinted from its lane's tone, so the eye lands on it before
// reading a word. `card` is the resting tint, `busy` the same card while it re-dials, `rule` the
// hairline above its ownership footer.
const toneStyles: Record<Tone, { card: string; busy: string; rule: string; icon: string; outcomeIcon: LucideIcon }> = {
  risk: {
    card: "border-warning/45 bg-[color-mix(in_oklab,var(--warning)_7%,var(--card))]",
    busy: "border-warning/60 bg-[color-mix(in_oklab,var(--warning)_12%,var(--card))]",
    rule: "border-warning/30",
    icon: "text-warning",
    outcomeIcon: TriangleAlert,
  },
  ok: {
    card: "border-success/40 bg-[color-mix(in_oklab,var(--success)_6%,var(--card))]",
    busy: "border-success/40 bg-[color-mix(in_oklab,var(--success)_6%,var(--card))]",
    rule: "border-success/30",
    icon: "text-success",
    outcomeIcon: CircleCheck,
  },
};

function CutMarker({ cut, className }: { cut: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "absolute flex size-5 items-center justify-center rounded-full border border-destructive/50 bg-surface-container text-destructive transition-transform duration-200 motion-reduce:transition-none",
        cut ? "scale-100" : "scale-0",
        className
      )}
    >
      <X className="size-3" strokeWidth={2.5} aria-hidden="true" />
    </span>
  );
}

// Narrow layout: the wire runs down between the stacked nodes.
function Connector({ link, cut, idle }: { link: Link; cut: boolean; idle: boolean }) {
  return (
    <div className="flex items-center gap-3 py-1 pl-[30px] @min-[620px]:hidden" aria-hidden="true">
      <span
        className="wire wire-y relative h-9 w-0.5 shrink-0"
        data-cut={cut || undefined}
        data-idle={idle || undefined}
      >
        <CutMarker cut={cut} className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      </span>
      <span className="pl-3 text-[13px] leading-[1.35] text-muted-foreground">{link.label}</span>
    </div>
  );
}

// Wide layout: the wire runs along the top of the node row, centre to centre, with its label on it.
function WireSegment({ link, cut, idle }: { link: Link; cut: boolean; idle: boolean }) {
  return (
    <div className="relative h-12 col-(--c)" style={{ "--c": `${link.from * 2} / ${link.to * 2}` } as CSSProperties}>
      <span className="absolute inset-x-1 bottom-[26px] text-center text-[12.5px] leading-[1.3] text-muted-foreground">
        {link.label}
      </span>
      <span
        className="wire wire-x absolute inset-x-0 bottom-3 h-0.5"
        data-cut={cut || undefined}
        data-idle={idle || undefined}
      />
      <CutMarker cut={cut} className="bottom-[3px] left-1/2 -translate-x-1/2" />
    </div>
  );
}

function StatusPill({ status, signal }: { status: string; signal: Signal }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[13px] font-medium leading-[1.4] text-foreground">
      <span className={cn("relative flex size-2", SIGNAL_TEXT[signal])} aria-hidden="true">
        <span key={status} className="status-ping absolute inset-0 rounded-full bg-current" />
        <span className="relative size-2 rounded-full bg-current" />
      </span>
      <span>
        <span className="sr-only">Data call status: </span>
        {status}
      </span>
    </p>
  );
}

function LaneRow({ lane, phase }: { lane: Lane; phase: PhaseKey }) {
  const tone = toneStyles[lane.tone];
  const OutcomeIcon = tone.outcomeIcon;
  const view = lane.phases[phase] ?? lane.phases.up;
  const cut = new Set(view.cut);
  const idle = new Set(view.idle);

  return (
    <section aria-label={`${lane.title} setup`} className="rounded-2xl bg-surface-container p-4 sm:p-5">
      <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div>
          <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-foreground">{lane.title}</h3>
          <p className="mt-0.5 text-[13px] leading-[1.4] text-muted-foreground">{lane.mode}</p>
          <p className="mt-0.5 font-mono text-[12.5px] leading-[1.4] text-muted-foreground">{lane.config}</p>
        </div>
        <StatusPill status={view.status} signal={view.signal} />
      </header>

      <div className="mt-4 @min-[620px]:mt-3">
        <div aria-hidden="true" className="-mx-2 hidden grid-cols-8 @min-[620px]:grid">
          {lane.links.map((link) => (
            <WireSegment key={link.id} link={link} cut={cut.has(link.id)} idle={idle.has(link.id)} />
          ))}
        </div>

        <ol className="flex flex-col @min-[620px]:-mx-2 @min-[620px]:grid @min-[620px]:grid-cols-8">
          {lane.nodes.map((node, i) => {
            const Icon = node.icon;
            const via = lane.links.find((l) => l.to === node.col);
            const off = view.off === node.name;
            const badge = view.badge?.node === node.name ? view.badge : undefined;
            const chipState = node.manager ? view.chip : undefined;

            return (
              <li
                key={node.name}
                className="relative @min-[620px]:col-(--c) @min-[620px]:px-2"
                style={{ "--c": `${node.col * 2 - 1} / span 2` } as CSSProperties}
              >
                {i > 0 && via && <Connector link={via} cut={cut.has(via.id)} idle={idle.has(via.id)} />}

                {/* Wide layout: the stub that drops from the wire into the card. */}
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 -top-[13px] hidden h-[13px] w-0.5 -translate-x-1/2 bg-border-hover @min-[620px]:block"
                >
                  <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-border-hover bg-surface-container" />
                </span>

                <div
                  data-off={off || undefined}
                  className={cn(
                    "group/node relative flex h-full flex-col rounded-xl border px-4 py-4 shadow-[0_1px_2px_oklch(0_0_0/0.04)] transition-colors duration-300 motion-reduce:transition-none",
                    node.manager ? (chipState === "busy" ? tone.busy : tone.card) : "border-border bg-card"
                  )}
                >
                  {badge && (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "swap-in absolute -top-3 right-3 z-10 rounded-full border px-2.5 py-0.5 text-xs font-medium leading-[1.4]",
                        BADGE_STYLES[badge.signal]
                      )}
                    >
                      {badge.text}
                    </span>
                  )}

                  <div className="flex flex-1 flex-col gap-4 transition-opacity duration-300 group-data-[off]/node:opacity-40 motion-reduce:transition-none">
                    <div className="flex items-start gap-3 @min-[620px]:flex-col @min-[620px]:gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                        <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <div className="min-w-0 pt-px @min-[620px]:pt-0">
                        <p className="text-[14px] font-medium leading-[1.3] text-foreground">{node.name}</p>
                        <p className="mt-1 text-[13px] leading-[1.45] text-muted-foreground">{node.detail}</p>
                      </div>
                    </div>
                    {/* Ownership is a footer of the card, not a box inside it: a ruled line of its own
                        that can wrap onto two lines without ever looking cramped. */}
                    {node.manager && (
                      <p
                        className={cn(
                          "flex items-center justify-center gap-2.5 border-t pt-3.5 text-center text-[13px] font-medium leading-[1.4] text-foreground @min-[620px]:mt-auto",
                          tone.rule
                        )}
                      >
                        <RefreshCw
                          className={cn(
                            "size-4 shrink-0",
                            chipState === "busy" ? "text-warning" : tone.icon,
                            chipState === "busy" ? "redial-spin" : chipState === "down" ? "" : "keepalive-beat"
                          )}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                        <span className="text-balance">
                          <span className="sr-only">Connection manager: </span>
                          {node.manager}
                        </span>
                      </p>
                    )}
                  </div>
                  {via && <span className="sr-only">Connected through {via.label}.</span>}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="mt-5 flex items-start gap-2 border-t border-border/70 pt-4 text-[13px] leading-[1.45] text-foreground/85">
        <OutcomeIcon className={cn("mt-px size-4 shrink-0", tone.icon)} strokeWidth={2} aria-hidden="true" />
        <span>{lane.outcome}</span>
      </p>
    </section>
  );
}

export function ModemModesDiagram() {
  const figureRef = useRef<HTMLElement>(null);
  const timers = useRef<number[]>([]);
  const [phases, setPhases] = useState<PhaseKey[]>(["up", "up"]);
  const [running, setRunning] = useState(false);
  const [live, setLive] = useState(true);
  // The wires carry data for a few seconds after the diagram arrives and while the demo runs, then rest.
  const [settled, setSettled] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  // Wires and keep-alive beats only move while the diagram is on screen.
  useEffect(() => {
    const el = figureRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setLive(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!live || running) return;
    setSettled(false);
    const t = window.setTimeout(() => setSettled(true), 4000);
    return () => window.clearTimeout(t);
  }, [live, running]);

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    },
    []
  );

  const reboot = useCallback(() => {
    if (running) return;
    setRunning(true);
    setAnnouncement(
      "Router rebooting. Router-driven: the data call dropped. Standalone Ethernet: the data call stays up."
    );
    SEQUENCE.forEach((step, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setPhases(step.phases);
          if (i === SEQUENCE.length - 1) {
            setRunning(false);
            timers.current = [];
            setAnnouncement(
              "Router is back. Router-driven: the router had to re-dial the call. Standalone Ethernet: the call never dropped."
            );
          }
        }, step.at)
      );
    });
  }, [running]);

  return (
    <figure ref={figureRef} data-live={live} data-flow={live && (running || !settled)} className="not-prose @container my-8">
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Button
          type="button"
          variant="outline"
          onClick={reboot}
          aria-disabled={running}
          className={cn("h-11", running && "cursor-progress opacity-70 hover:bg-background")}
        >
          <Power aria-hidden="true" />
          {running ? (phases[0] === "redial" ? "Router back, re-dialing…" : "Router rebooting…") : "Reboot the router"}
        </Button>
        <p className="text-[13px] text-muted-foreground">Watch what happens to the data call in each setup.</p>
        {/* Narrow screens: the lanes are stacked tall, so mirror both verdicts beside the button. */}
        <ul aria-hidden="true" className="flex w-full flex-col gap-1 text-[13px] text-foreground @min-[620px]:hidden">
          {LANES.map((lane, i) => {
            const view = lane.phases[phases[i]] ?? lane.phases.up;
            return (
              <li key={lane.title} className="flex items-center gap-2">
                <span className={cn("size-2 shrink-0 rounded-full bg-current", SIGNAL_TEXT[view.signal])} />
                <span className="font-medium">{lane.title}</span>
                <span className="text-muted-foreground">{view.status}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col gap-4">
        {LANES.map((lane, i) => (
          <LaneRow key={lane.title} lane={lane} phase={phases[i]} />
        ))}
      </div>

      <p role="status" className="sr-only">
        {announcement}
      </p>

      <figcaption className="mt-3 text-center text-[13px] text-muted-foreground">
        The difference is where the data call lives. Standalone mode moves it out of the router and onto the modem.
      </figcaption>
    </figure>
  );
}
