import type { LucideIcon } from "lucide-react";
import { CircleCheck, Cpu, EthernetPort, RadioTower, RefreshCw, Router, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "risk" | "ok";

interface Node {
  icon: LucideIcon;
  name: string;
  detail: string;
  // Marks the box that owns the cellular data call: the whole point of the comparison.
  manager?: string;
}

interface Lane {
  title: string;
  mode: string;
  config: string;
  tone: Tone;
  nodes: Node[];
  links: { label: string; dashed?: boolean }[];
  outcome: string;
}

const LANES: Lane[] = [
  {
    title: "Router-driven",
    mode: "Default · TE mode",
    config: "usbnet 0 or 2 · pcie/mode 0",
    tone: "risk",
    nodes: [
      { icon: RadioTower, name: "Cell tower", detail: "5G / LTE" },
      { icon: Cpu, name: "Modem", detail: "Waits for the host to dial it" },
      {
        icon: Router,
        name: "Router",
        detail: "Needs modem drivers plus QMI/MBIM scripts",
        manager: "Dials, keeps alive and re-dials the call",
      },
    ],
    links: [{ label: "Radio" }, { label: "USB or PCIe endpoint · QMI / MBIM control", dashed: true }],
    outcome: "Router reboots or a driver hiccups: the data call drops until the router dials again.",
  },
  {
    title: "Standalone Ethernet",
    mode: "Required for QManager · AP mode",
    config: "usbnet 1 · pcie/mode 1",
    tone: "ok",
    nodes: [
      { icon: RadioTower, name: "Cell tower", detail: "5G / LTE" },
      {
        icon: Cpu,
        name: "Modem",
        detail: "Runs its own Linux, DHCP server and QManager",
        manager: "Dials, keeps alive and re-dials the call",
      },
      { icon: EthernetPort, name: "Ethernet PHY", detail: "RTL8125 on the M.2-to-Ethernet board" },
      { icon: Router, name: "Router WAN port", detail: "Just asks for an IP, like any ISP uplink" },
    ],
    links: [{ label: "Radio" }, { label: "PCIe Root Complex" }, { label: "Ethernet cable · DHCP" }],
    outcome: "Router reboots: the modem stays online and the WAN link is back as soon as the port comes up.",
  },
];

const toneStyles: Record<Tone, { chip: string; icon: string; outcomeIcon: LucideIcon }> = {
  risk: {
    chip: "border-destructive/35 bg-destructive/[0.07]",
    icon: "text-destructive",
    outcomeIcon: TriangleAlert,
  },
  ok: {
    chip: "border-success/40 bg-success/[0.08]",
    icon: "text-success",
    outcomeIcon: CircleCheck,
  },
};

function Connector({ label, dashed }: { label: string; dashed?: boolean }) {
  return (
    <div className="flex items-center gap-3 py-1 pl-[29px]" aria-hidden="true">
      <span className={cn("h-7 shrink-0 border-l-2", dashed ? "border-dashed border-border-hover" : "border-border-hover")} />
      <span className="pl-2 text-[13px] leading-[1.35] text-muted-foreground">{label}</span>
    </div>
  );
}

function LaneColumn({ lane }: { lane: Lane }) {
  const tone = toneStyles[lane.tone];
  const OutcomeIcon = tone.outcomeIcon;

  return (
    <section aria-label={`${lane.title} setup`} className="flex flex-col rounded-2xl bg-surface-container p-4 sm:p-5">
      <h4 className="text-[16px] font-semibold tracking-[-0.01em] text-foreground">{lane.title}</h4>
      <p className="mt-0.5 text-[13px] leading-[1.4] text-muted-foreground">{lane.mode}</p>
      <p className="mt-0.5 font-mono text-[12.5px] leading-[1.4] text-muted-foreground">{lane.config}</p>

      <ol className="mt-4 flex flex-col">
        {lane.nodes.map((node, i) => {
          const Icon = node.icon;
          return (
            <li key={node.name}>
              {i > 0 && <Connector {...lane.links[i - 1]} />}
              <div className="rounded-xl border border-border bg-card px-3.5 py-3 shadow-[0_1px_2px_oklch(0_0_0/0.04)]">
                <div className="flex items-start gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                    <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 pt-px">
                    <p className="text-[14px] font-medium leading-[1.3] text-foreground">{node.name}</p>
                    <p className="mt-0.5 text-[13px] leading-[1.4] text-muted-foreground">{node.detail}</p>
                  </div>
                </div>
                {node.manager && (
                  <p
                    className={cn(
                      "mt-3 flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[13px] font-medium leading-[1.35] text-foreground",
                      tone.chip
                    )}
                  >
                    <RefreshCw className={cn("size-3.5 shrink-0", tone.icon)} strokeWidth={2} aria-hidden="true" />
                    <span>
                      <span className="sr-only">Connection manager: </span>
                      {node.manager}
                    </span>
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-auto flex items-start gap-2 pt-5 text-[13px] leading-[1.45] text-foreground/85">
        <OutcomeIcon className={cn("mt-px size-4 shrink-0", tone.icon)} strokeWidth={2} aria-hidden="true" />
        <span>{lane.outcome}</span>
      </p>
    </section>
  );
}

export function ModemModesDiagram() {
  return (
    <figure className="not-prose my-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {LANES.map((lane) => (
          <LaneColumn key={lane.title} lane={lane} />
        ))}
      </div>
      <figcaption className="mt-3 text-center text-[13px] text-muted-foreground">
        The difference is where the data call lives. Standalone mode moves it out of the router and onto the modem.
      </figcaption>
    </figure>
  );
}
