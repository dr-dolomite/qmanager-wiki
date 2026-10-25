import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Cpu,
  Cable,
  EthernetPort,
  FlaskConical,
  MonitorCog,
  Network,
  RadioTower,
  Router,
  Satellite,
  Server,
  Users,
  Wifi,
} from "lucide-react";
import GithubIcon from "@/components/github-icon";

/* ---------------------------------------------------------------------------
 * Support levels (facts only: official reference, developer-probed, community)
 * ------------------------------------------------------------------------- */

interface SupportLevel {
  title: string;
  description: string;
  models: string[];
  /** Signal bars lit out of 4: the more independent evidence, the stronger the signal. */
  bars: number;
  lit: string;
  chip: string;
}

const SUPPORT_LEVELS: SupportLevel[] = [
  {
    title: "Officially supported",
    description: "The reference hardware QManager is built on.",
    models: ["RM551E-GL", "RM520N-GL"],
    bars: 4,
    lit: "bg-emerald-600 dark:bg-emerald-400",
    chip: "border-emerald-600/40 bg-emerald-500/10",
  },
  {
    title: "Tested by the developer",
    description: "Checked on real hardware, not a reference platform.",
    models: ["RG501Q-EU"],
    bars: 3,
    lit: "bg-violet-600 dark:bg-violet-400",
    chip: "border-violet-600/35 bg-violet-500/[0.07]",
  },
  {
    title: "Community-reported",
    description: "Same Qualcomm platform, not validated by the developer.",
    models: ["RM521F", "RM502Q", "RM500Q"],
    bars: 2,
    lit: "bg-sky-600 dark:bg-sky-400",
    // Dashed edge, no fill: reported by others, not confirmed here.
    chip: "border-dashed border-sky-600/50 bg-transparent",
  },
];

/* A signal-strength glyph: the product is a modem, so confidence reads like reception.
 * Tier hues stay in the positive range (green, violet, blue); no amber or red. */
const BAR_HEIGHTS = [30, 55, 78, 100];

function SignalBars({
  level,
  lit,
  size = "lg",
}: {
  level: number;
  lit?: string;
  size?: "lg" | "sm";
}) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex shrink-0 items-end ${
        size === "lg" ? "h-8 gap-[3px]" : "h-4 gap-[2px]"
      }`}
    >
      {BAR_HEIGHTS.map((height, i) => (
        <span
          key={height}
          className={`signal-bar block rounded-[2px] ${size === "lg" ? "w-[5px]" : "w-[3px]"} ${
            i < level && lit ? lit : "bg-foreground/15"
          }`}
          style={{ height: `${height}%`, "--i": i } as CSSProperties}
        />
      ))}
      {level === 0 && (
        <span className="absolute top-1/2 -left-[2px] h-px w-[calc(100%+4px)] -rotate-[40deg] bg-muted-foreground" />
      )}
    </span>
  );
}

/* ---------------------------------------------------------------------------
 * Architecture cards
 * ------------------------------------------------------------------------- */

type SupportTone = "official" | "tested" | "community";

const TONES: Record<SupportTone, { icon: LucideIcon; pill: string; text: string }> = {
  official: {
    icon: BadgeCheck,
    pill: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  tested: {
    icon: FlaskConical,
    pill: "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
    text: "text-violet-700 dark:text-violet-300",
  },
  community: {
    icon: Users,
    pill: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
    text: "text-sky-700 dark:text-sky-300",
  },
};

interface SupportedModel {
  name: string;
  status: string;
  tone: SupportTone;
}

interface ArchitectureCard {
  icon: LucideIcon;
  platform: string;
  model: SupportedModel;
  others: SupportedModel[];
  subline: string;
  install: string;
  installHref: string;
}

const ARCHITECTURES: ArchitectureCard[] = [
  {
    icon: Satellite,
    platform: "Snapdragon X75",
    model: { name: "RM551E-GL", status: "Officially supported", tone: "official" },
    others: [],
    subline: "The newest Quectel 5G modem. QManager runs on the modem's own OpenWRT.",
    install: "Install for RM551E",
    installHref: "#install-rm551e",
  },
  {
    icon: RadioTower,
    platform: "Snapdragon X62 / X65",
    model: { name: "RM520N-GL", status: "Officially supported", tone: "official" },
    others: [{ name: "RM521F", status: "Experimental", tone: "community" }],
    subline: "QManager's main development modem. Runs on its built-in Linux.",
    install: "Install for RM520N",
    installHref: "#install-rm520n",
  },
  {
    icon: Cpu,
    platform: "Snapdragon X55",
    model: { name: "RG501Q-EU", status: "Tested by the developer", tone: "tested" },
    others: [
      { name: "RM502Q", status: "Community-reported", tone: "community" },
      { name: "RM500Q", status: "Community-reported", tone: "community" },
    ],
    subline: "Earlier 5G modems. Uses the RM520N build.",
    install: "Install for RM520N",
    installHref: "#install-rm520n",
  },
];

/* ---------------------------------------------------------------------------
 * Router pairing (standalone 5G-to-Ethernet board -> router WAN port)
 * ------------------------------------------------------------------------- */

const ROUTER_PAIRINGS: { icon: LucideIcon; name: string; detail: string }[] = [
  { icon: Wifi, name: "GL.iNet routers", detail: "Beryl AX, Spitz AX, Flint 2 and the rest of the lineup" },
  { icon: Router, name: "OpenWrt routers", detail: "Any OpenWrt device with an Ethernet WAN port" },
  { icon: MonitorCog, name: "Firewalls & gateways", detail: "OPNsense, pfSense, MikroTik and similar" },
  { icon: Network, name: "Any other router", detail: "Consumer, ISP and mesh routers with a WAN port" },
];

const CONNECTION_STEPS: { icon: LucideIcon; label: string }[] = [
  { icon: Server, label: "5G board" },
  { icon: Cable, label: "Ethernet" },
  { icon: EthernetPort, label: "Router WAN port" },
];

function Model({ children }: { children: ReactNode }) {
  return <span className="font-medium whitespace-nowrap text-foreground">{children}</span>;
}

export default function HardwareMatrix() {
  return (
    <section id="hardware" className="scroll-mt-20 border-t border-border/80 py-12 sm:py-16">
      <div className="mb-10">
        <h2 className="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl">
          Modem &amp; hardware compatibility
        </h2>
        <p className="mt-2 max-w-2xl text-base text-muted-foreground leading-relaxed text-pretty">
          Built for Quectel 5G modems with Qualcomm Snapdragon chips. Here is what has been tested,
          and how thoroughly.
        </p>
      </div>

      {/* Support levels */}
      <div className="grid gap-4 sm:grid-cols-3">
        {SUPPORT_LEVELS.map((level) => (
          <div key={level.title} className="rounded-2xl bg-muted/40 p-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-sm font-semibold text-foreground">{level.title}</h3>
              <SignalBars level={level.bars} lit={level.lit} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{level.description}</p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${level.title} models`}>
              {level.models.map((model) => (
                <li
                  key={model}
                  className={`font-figure rounded-full border px-3 py-1 text-sm font-semibold text-foreground transition-transform duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${level.chip}`}
                >
                  {model}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
        <span className="mt-0.5 flex h-5 items-center">
          <SignalBars level={0} size="sm" />
        </span>
        <span>
          Not supported: Quectel modems on ASR, Unisoc or MediaTek chips (such as RG500U, EC200,
          EG25). Older Qualcomm LTE modems (X20/X24, such as EM120K/EM160R) are untested.
        </span>
      </p>

      <details className="group mt-3 text-sm">
        <summary className="-ml-3 inline-flex min-h-10 cursor-pointer list-none items-center gap-1.5 rounded-full px-3 font-medium text-primary outline-none transition-colors hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
          How we test hardware
          <ChevronDown
            className="size-4 transition-transform motion-reduce:transition-none group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="mt-2 max-w-2xl rounded-2xl bg-muted/40 p-5">
          <p className="leading-relaxed text-pretty text-muted-foreground">
            The on-modem build (<Model>QManager-RM520N</Model>) is developed on the{" "}
            <Model>RM520N-GL</Model> reference platform and has been tested on an{" "}
            <Model>RG501Q-EU</Model>. Modems on the same Qualcomm SDX55/SDX6X platform (
            <Model>RM521F</Model>, <Model>RM502Q</Model>, <Model>RM500Q</Model>) share the same
            Linux and AT command set, but the developer has not validated them. Older Qualcomm
            X20/X24 modems are untested.
          </p>

          <div className="mt-4 flex flex-col gap-3 border-t border-border/80 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <p className="text-pretty text-muted-foreground">
              Running QManager on one of these? Community reports help everyone.
            </p>
            <a
              href="https://github.com/dr-dolomite/QManager-RM520N"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-full border border-border bg-background px-4 font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:self-auto"
            >
              <span aria-hidden="true" className="flex">
                <GithubIcon className="size-4" />
              </span>
              Share hardware feedback
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </details>

      {/* Architecture cards */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {ARCHITECTURES.map((arch) => {
          const Icon = arch.icon;
          const tone = TONES[arch.model.tone];
          const StatusIcon = tone.icon;
          return (
            <article
              key={arch.model.name}
              className="row-span-5 grid grid-rows-subgrid gap-y-0 rounded-2xl border border-border bg-card p-6 sm:p-7"
            >
              <p className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {arch.platform}
              </p>

              {/* The model name is what visitors scan for; the status answers "will it work?" */}
              <div className="mt-7">
                <h3 className="font-figure text-[2rem] leading-none font-bold tracking-tight text-foreground">
                  {arch.model.name}
                </h3>
                <p
                  className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${tone.pill}`}
                >
                  <StatusIcon className="size-4" aria-hidden="true" />
                  {arch.model.status}
                </p>
              </div>

              <p className="mt-4 text-sm text-muted-foreground text-pretty">{arch.subline}</p>

              {/* Subgrid rows keep this list and the button aligned across cards */}
              {arch.others.length > 0 ? (
                <div className="mt-6 border-t border-border/80 pt-5">
                  <h4 className="text-xs font-medium text-muted-foreground">
                    Other models on this build
                  </h4>
                  <ul className="mt-3 space-y-2.5">
                    {arch.others.map((other) => {
                      const OtherIcon = TONES[other.tone].icon;
                      return (
                        <li
                          key={other.name}
                          className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5"
                        >
                          <span className="font-figure text-base font-semibold text-foreground">
                            {other.name}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-medium ${TONES[other.tone].text}`}
                          >
                            <OtherIcon className="size-3.5" aria-hidden="true" />
                            {other.status}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div />
              )}

              <a
                href={arch.installHref}
                className="mt-8 inline-flex h-11 w-full items-center justify-center gap-2 self-end rounded-full border border-border bg-background text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {arch.install}
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </article>
          );
        })}
      </div>

      {/* Router pairing */}
      <div className="mt-6 grid gap-8 rounded-2xl border border-border bg-card p-6 sm:p-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-12">
        {/* Left: the one thing to know, and how it physically connects */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold tracking-tight text-balance text-foreground sm:text-xl">
            Standalone 5G-to-Ethernet boards work with any router that has a WAN port
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-pretty text-muted-foreground">
            Put the modem in an Ethernet carrier board and plug the board into your router&apos;s WAN
            port. The board shows up as ordinary Ethernet, so no router-side drivers are needed.
          </p>

          <ol
            className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm font-medium text-foreground"
            aria-label="How the board connects"
          >
            {CONNECTION_STEPS.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <li key={step.label} className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5">
                    <StepIcon className="size-4 text-primary" aria-hidden="true" />
                    {step.label}
                  </span>
                  {/* Arrow trails its step so a wrapped line never starts with one */}
                  {i < CONNECTION_STEPS.length - 1 && (
                    <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
                  )}
                </li>
              );
            })}
          </ol>

          <Link
            href="/docs/getting-started/hardware-compatibility/"
            className="mt-6 inline-flex items-center gap-1 self-start rounded-full text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:mt-auto lg:pt-6"
          >
            Full compatibility guide
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Right: reassurance that the visitor's own router is covered */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground">Works with</h4>
          <ul className="mt-3 grid sm:grid-cols-2 sm:gap-x-8">
            {ROUTER_PAIRINGS.map((host) => {
              const HostIcon = host.icon;
              return (
                <li
                  key={host.name}
                  className="flex items-start gap-3 border-t border-border/80 py-4"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <HostIcon className="size-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{host.name}</p>
                    <p className="mt-0.5 text-sm text-pretty text-muted-foreground">
                      {host.detail}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
