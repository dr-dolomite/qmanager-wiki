import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Shield, Heart } from "lucide-react";
import GithubIcon from "@/components/github-icon";
import QfenixAscii from "@/components/qfenix-ascii";

const linkClass = "transition-colors hover:text-foreground";

const docLinks = [
  { href: "/docs/getting-started/introduction/", label: "Overview & Architecture" },
  { href: "/docs/getting-started/installation-openwrt/", label: "RM551E Installation" },
  { href: "/docs/getting-started/installation-rm520n/", label: "RM520N & X5*/X6* Setup" },
  { href: "/docs/cellular/band-locking/", label: "Band Locking" },
];

const toolLinks = [
  { href: "/docs/resilience/connection-watchdog/", label: "Connection Watchdog" },
  { href: "/docs/resilience/sim-failover/", label: "Dual-SIM Failover" },
  { href: "/docs/management/tailscale-vpn/", label: "Tailscale VPN" },
  { href: "/docs/developer/api-reference/", label: "REST API Reference" },
];

const repoLinks = [
  { href: "https://github.com/dr-dolomite/QManager", label: "QManager (RM551E)" },
  { href: "https://github.com/dr-dolomite/QManager-RM520N", label: "QManager (RM520N)" },
  { href: "https://github.com/dr-dolomite/QManager/releases", label: "Releases & Tarballs" },
  { href: "https://github.com/dr-dolomite/QManager/issues", label: "Report an Issue" },
];

const credits: { name: string; role: string; links?: { href: string; label: string }[] }[] = [
  {
    name: "iamromulan",
    role: "research & tooling",
    links: [
      { href: "https://github.com/iamromulan/cellular-modem-wiki", label: "Cellular Modem Wiki" },
      { href: "https://github.com/iamromulan/quectel-rgmii-toolkit", label: "RGMII Toolkit" },
    ],
  },
  { name: "SimpleAdmin", role: "the project this succeeds" },
  { name: "Wu-Tang Clan", role: "founding group, still with us" },
];

function LinkColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">{title}</h4>
      <ul className="mt-4 space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/20 text-muted-foreground">
      <div className="w-full px-4 pb-8 pt-12 sm:px-6 lg:px-8 lg:pt-14 xl:px-10 2xl:px-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] lg:gap-x-10">
          {/* Brand: wordmark + description on the left, QFenix art at its side */}
          <div className="col-span-2 flex items-start gap-6 sm:col-span-3 lg:col-span-1">
            <div className="max-w-[16rem]">
              <Link href="/" className="inline-flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-full border border-border bg-card p-1.5">
                  <Image
                    src="/qmanager-mark.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="h-full w-full object-contain"
                  />
                </span>
                <span className="text-base font-semibold text-foreground">QManager</span>
              </Link>
              <p className="mt-3 text-sm leading-relaxed">
                Management suite and web GUI for Quectel 5G &amp; LTE cellular modems.
              </p>
            </div>
            <QfenixAscii className="shrink-0" />
          </div>

          <LinkColumn title="Documentation">
            {docLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </LinkColumn>

          <LinkColumn title="Resilience & Tools">
            {toolLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </LinkColumn>

          <LinkColumn title="Community">
            {repoLinks.map((l, i) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-2 ${linkClass}`}
                >
                  {i < 2 && <GithubIcon className="size-3.5" />}
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-1">
              <a
                href="/#support"
                className="inline-flex items-center gap-2 font-medium text-foreground transition-colors hover:text-primary"
              >
                <Heart className="size-3.5 fill-current text-rose-500" aria-hidden="true" />
                Support the Project
              </a>
            </li>
            <li>
              <a href="/#contact" className={linkClass}>
                Contact
              </a>
            </li>
          </LinkColumn>
        </div>

        {/* Credits */}
        <div className="mt-12 grid gap-x-10 gap-y-4 border-t border-border pt-6 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Credits</h4>
          <div className="lg:col-span-3">
            <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
              {credits.map((c) => (
                <li key={c.name} className="text-sm">
                  <span className="font-medium text-foreground">{c.name}</span>
                  <span className="block text-xs">
                    {c.role}
                    {c.links && (
                      <>
                        {" — "}
                        {c.links.map((l, i) => (
                          <React.Fragment key={l.href}>
                            {i > 0 && ", "}
                            <a
                              href={l.href}
                              target="_blank"
                              rel="noreferrer"
                              className="underline underline-offset-2 transition-colors hover:text-foreground"
                            >
                              {l.label}
                            </a>
                          </React.Fragment>
                        ))}
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            {/* Supporters: the closing line of the credits and the loudest thing in them */}
            <p className="mt-10 max-w-2xl font-figure text-2xl font-semibold leading-snug tracking-tight text-balance text-foreground sm:text-3xl">
              And to all who supported the project.
              <span className="block text-primary">
                Thank you so much <span aria-hidden="true">💙</span>
              </span>
            </p>
          </div>
        </div>

        {/* Base line: copyright and license */}
        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} QManager Project. Built for Qualcomm-based Quectel modem users.
          </p>
          <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-border bg-muted/50 px-2.5 py-1 font-medium sm:self-auto">
            <Shield className="size-3.5 text-primary" aria-hidden="true" />
            GPL-3.0 / Commons Clause
          </span>
        </div>
      </div>
    </footer>
  );
}
