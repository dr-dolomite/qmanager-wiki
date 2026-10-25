"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Copy, Check, Server, Zap, ArrowRight, ShieldCheck, Terminal, Info } from "lucide-react";

type InstallTarget = "rm551e" | "rm520n";

const TARGETS: InstallTarget[] = ["rm551e", "rm520n"];

const COMMANDS: Record<InstallTarget, string> = {
  rm551e: "curl -sL https://raw.githubusercontent.com/dr-dolomite/QManager/main/qmanager-installer.sh | sh",
  rm520n: "curl -fsSL -o /tmp/qmanager-installer.sh https://github.com/dr-dolomite/QManager-RM520N/raw/refs/heads/main/qmanager-installer.sh && bash /tmp/qmanager-installer.sh",
};

const PROMPTS: Record<InstallTarget, string> = {
  rm551e: "root@OpenWrt:~# ",
  rm520n: "root@sdxlemur:~# ",
};

const TROUBLESHOOTING_HREF: Record<InstallTarget, string> = {
  rm551e: "/docs/getting-started/installation-openwrt/#post-install-verification",
  rm520n: "/docs/getting-started/installation-rm520n/#troubleshooting-rm520n",
};

/**
 * Hash aliases that preselect an install tab. Canonical links are
 * `#install-rm551e` and `#install-rm520n` (both have a real anchor element
 * below, so the browser scrolls natively); the rest are convenience aliases.
 */
const HASH_TO_TARGET: Record<string, InstallTarget> = {
  "install-rm551e": "rm551e",
  "install-openwrt": "rm551e",
  "install-rm520n": "rm520n",
  "install-sdxlemur": "rm520n",
};

const TAB_META: Record<InstallTarget, { label: string; icon: React.ReactNode }> = {
  rm551e: { label: "RM551E", icon: <Server className="h-4 w-4 shrink-0" aria-hidden="true" /> },
  rm520n: { label: "RM520N & similar", icon: <Zap className="h-4 w-4 shrink-0" aria-hidden="true" /> },
};

export default function QuickInstall() {
  const [activeTab, setActiveTab] = useState<InstallTarget>("rm551e");
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentCommand = COMMANDS[activeTab];

  const selectTab = useCallback((target: InstallTarget) => {
    setActiveTab(target);
    setCopied(false);
  }, []);

  // Preselect a tab from the URL hash (on load and on in-page navigation).
  useEffect(() => {
    const applyHash = () => {
      const key = window.location.hash.replace(/^#/, "").toLowerCase();
      const target = HASH_TO_TARGET[key];
      if (!target) return;
      selectTab(target);
      // Aliases without their own anchor element still need to land on the card.
      if (!document.getElementById(key)) {
        document.getElementById("install")?.scrollIntoView({ block: "start" });
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [selectTab]);

  useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCommand);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, current: InstallTarget) => {
    const idx = TARGETS.indexOf(current);
    let next: InstallTarget | null = null;
    if (e.key === "ArrowRight") next = TARGETS[(idx + 1) % TARGETS.length];
    else if (e.key === "ArrowLeft") next = TARGETS[(idx - 1 + TARGETS.length) % TARGETS.length];
    else if (e.key === "Home") next = TARGETS[0];
    else if (e.key === "End") next = TARGETS[TARGETS.length - 1];
    if (!next) return;
    e.preventDefault();
    selectTab(next);
    document.getElementById(`install-tab-${next}`)?.focus();
  };

  return (
    <section
      id="install"
      aria-labelledby="install-heading"
      className="relative scroll-mt-20 py-12 sm:py-16 border-t border-border/80"
    >
      {/* Deep-link anchors: /#install-rm551e and /#install-rm520n preselect a tab */}
      <span id="install-rm551e" aria-hidden="true" className="absolute top-0 scroll-mt-20" />
      <span id="install-rm520n" aria-hidden="true" className="absolute top-0 scroll-mt-20" />

      <div className="reveal mb-10">
        <h2 id="install-heading" className="text-2xl font-bold tracking-tight text-foreground text-balance sm:text-3xl">
          Install in one step
        </h2>
        <p className="mt-2 max-w-2xl text-base text-muted-foreground leading-relaxed text-pretty">
          Pick your modem, copy the command, and paste it into your modem&apos;s terminal. The installer handles the rest.
        </p>
      </div>

      <div className="reveal overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border bg-muted/40 px-5 py-3 sm:px-8">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-semibold text-foreground">One-line installer</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeTab === "rm520n" && (
              <span className="swap-in inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Checksum-verified download</span>
              </span>
            )}
            <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-muted-foreground font-figure tabular-nums">
              v0.1.35
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-8">
          {/* Segmented hardware target control */}
          <div
            role="tablist"
            aria-label="Choose your modem"
            className="relative grid grid-cols-2 gap-1 rounded-full border border-border bg-muted/50 p-1 sm:inline-grid"
          >
            {/* One shared selection pill that slides to the active option (columns are equal: 1fr) */}
            <span
              aria-hidden="true"
              className="segment-pill pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.375rem)] rounded-full bg-background shadow-xs"
              style={activeTab === "rm520n" ? { transform: "translateX(calc(100% + 0.25rem))" } : undefined}
            />
            {TARGETS.map((target) => {
              const isActive = activeTab === target;
              return (
                <button
                  key={target}
                  type="button"
                  role="tab"
                  id={`install-tab-${target}`}
                  aria-selected={isActive}
                  aria-controls="install-command-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectTab(target)}
                  onKeyDown={(e) => handleTabKeyDown(e, target)}
                  className={`relative inline-flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-full px-3 text-sm whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background sm:px-5 ${
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground font-medium hover:text-foreground"
                  }`}
                >
                  {TAB_META[target].icon}
                  <span>{TAB_META[target].label}</span>
                </button>
              );
            })}
          </div>

          <div
            id="install-command-panel"
            role="tabpanel"
            aria-labelledby={`install-tab-${activeTab}`}
            className="mt-5"
          >
            {/* Command Box */}
            <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 dark:bg-background/60 p-3 sm:flex-row sm:items-center sm:p-4">
              <code key={activeTab} className="swap-in min-w-0 flex-1 whitespace-pre-wrap break-all font-mono text-sm leading-relaxed text-foreground">
                <span className="text-primary select-none font-semibold">{PROMPTS[activeTab]}</span>
                {currentCommand}
              </code>

              <button
                type="button"
                onClick={handleCopy}
                aria-label={copied ? "Install command copied" : "Copy install command"}
                className={`inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full border px-6 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto ${
                  copied
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="swap-in h-4 w-4" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? "Command copied to clipboard" : ""}
              </span>
            </div>

            {/* Compatibility note for the RM520N installer */}
            {activeTab === "rm520n" && (
              <div className="swap-in mt-3 flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-sm leading-relaxed text-muted-foreground">
                <Info className="mt-0.5 h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                <p>
                  Tested on the RM520N-GL and RG501Q-EU. Other Snapdragon X55 and X6x modems that run Linux on the modem itself should work too.
                </p>
              </div>
            )}

            {/* 3-step setup flow */}
            <ol className="mt-8 grid gap-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border/60">
              <li className="flex items-start gap-3 sm:pr-5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold font-figure tabular-nums" aria-hidden="true">
                  1
                </span>
                <div>
                  <span className="block text-sm font-semibold text-foreground">Run the command</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                    Open a root shell on your modem (SSH or ADB) and paste the command above.
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-3 sm:px-5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold font-figure tabular-nums" aria-hidden="true">
                  2
                </span>
                <div>
                  <span className="block text-sm font-semibold text-foreground">Let it set up</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                    The installer detects your Qualcomm X55, X62, X65 or X75 modem and configures it for you.
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-3 sm:pl-5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold font-figure tabular-nums" aria-hidden="true">
                  3
                </span>
                <div>
                  <span className="block text-sm font-semibold text-foreground">Go online</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                    Open{" "}
                    <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-foreground font-figure tabular-nums">
                      {activeTab === "rm551e" ? "192.168.224.1" : "192.168.225.1"}
                    </code>{" "}
                    in your browser to manage your connection.
                  </span>
                </div>
              </li>
            </ol>

            {/* Help links */}
            <div className="mt-8 flex flex-col gap-3 border-t border-border/80 pt-5 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <p>
                Installing offline?{" "}
                <Link
                  href="/docs/getting-started/manual-installation/"
                  className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
                >
                  Manual installation
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </p>
              <p>
                Something went wrong?{" "}
                <Link
                  href={TROUBLESHOOTING_HREF[activeTab]}
                  className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
                >
                  Troubleshooting
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
