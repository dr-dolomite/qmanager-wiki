import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";

/* The last section is where the visitor finally plugs in, so it behaves like a modem
 * acquiring a connection: signal bars rise, "Searching" settles into "Connected", and
 * choosing a modem re-acquires the signal. Motion lives in globals.css (cta-*, signal-bar).
 * Staged on the same soft plate as the Contact section's Discord invite, so the closing
 * sections read as one family and only the actions carry the primary blue. */

const BAR_HEIGHTS = [30, 55, 78, 100];
const RING_RADII = [64, 112, 160, 208, 256];

const INSTALL_PATHS = [
  {
    title: "Install on RM551E",
    detail: "Runs on the modem's own OpenWRT.",
    href: "/docs/getting-started/installation-openwrt/",
  },
  {
    title: "Install on RM520N and similar",
    detail: "Runs on the modem's built-in Linux.",
    href: "/docs/getting-started/installation-rm520n/",
  },
];

export default function GetStarted() {
  return (
    <section
      aria-labelledby="get-started-heading"
      className="border-t border-border/80 py-12 sm:py-16"
    >
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
        <div>
          <h2
            id="get-started-heading"
            className="text-2xl font-bold tracking-tight text-foreground text-balance sm:text-3xl"
          >
            Ready to get started?
          </h2>
          <p className="mt-2 max-w-xl text-base text-muted-foreground leading-relaxed text-pretty">
            Set up QManager in under 2 minutes, right on your RM551E, RM520N, or a similar
            Qualcomm modem.
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            Not sure which one you have?{" "}
            <a
              href="#hardware"
              className="rounded-sm font-medium text-primary underline underline-offset-4 decoration-primary/40 transition-colors hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Check the compatibility list
            </a>
          </p>
        </div>

        {/* The modem's own status screen on a soft plate; radio waves spread from its corner */}
        <div className="relative isolate overflow-hidden rounded-3xl bg-surface-container p-6 sm:p-8">
          <svg
            aria-hidden="true"
            viewBox="0 0 520 520"
            className="pointer-events-none absolute -right-56 -bottom-56 -z-10 size-[32rem] text-primary"
          >
            {RING_RADII.map((r, i) => (
              <circle
                key={r}
                cx="260"
                cy="260"
                r={r}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeOpacity={0.22 - i * 0.035}
                className="cta-ring"
                style={{ "--i": i } as CSSProperties}
              />
            ))}
          </svg>

          <div className="cta-screen overflow-hidden rounded-2xl bg-card text-card-foreground shadow-[0_18px_40px_-18px_rgb(0_0_0/0.35)] ring-1 ring-black/5 dark:ring-white/5">
            <div
              aria-hidden="true"
              className="flex items-center gap-3 border-b border-border/80 px-5 py-4"
            >
              <span className="inline-flex h-6 shrink-0 items-end gap-[3px]">
                {BAR_HEIGHTS.map((height, i) => (
                  <span
                    key={height}
                    className="signal-bar block w-[5px] rounded-[2px] bg-emerald-600 dark:bg-emerald-400"
                    style={{ height: `${height}%`, "--i": i } as CSSProperties}
                  />
                ))}
              </span>
              <span className="font-figure relative grid text-sm font-semibold">
                <span className="cta-searching col-start-1 row-start-1 text-muted-foreground">
                  Searching for signal
                </span>
                <span className="cta-connected col-start-1 row-start-1 inline-flex items-center gap-2 text-foreground">
                  <span className="size-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  Connected
                </span>
              </span>
            </div>

            <h3 className="px-5 pt-4 text-sm font-medium text-muted-foreground">Pick your modem</h3>
            <ul className="mt-1 pb-2">
              {INSTALL_PATHS.map((path) => (
                <li key={path.href} className="px-2">
                  <Link
                    href={path.href}
                    className="cta-row group flex items-center justify-between gap-4 rounded-xl px-3 py-3.5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="min-w-0">
                      <span className="block text-base font-semibold text-foreground tracking-tight transition-colors group-hover:text-primary">
                        {path.title}
                      </span>
                      <span className="mt-0.5 block text-sm text-pretty text-muted-foreground">
                        {path.detail}
                      </span>
                    </span>
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
