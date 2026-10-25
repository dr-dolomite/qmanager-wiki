import React from "react";
import Image from "next/image";
import { ArrowUpRight, Bug, FileText, Mail, MessagesSquare } from "lucide-react";
import CopyButton from "@/components/copy-button";
import DiscordIcon from "@/components/icons/discord-icon";

// Same destinations as the Support page inside QManager itself.
const DISCORD_INVITE = "https://discord.iamromulan.dev/";
const DISCORD_SERVER = "Cellular Modem Talk/Development";
const EMAIL = "russel.yasol@gmail.com";

interface ContactRoute {
  label: string;
  /** When to pick this route, so the visitor chooses without trial and error. */
  when: string;
  dest: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  /** A mailto: opens a mail client rather than a tab, and gets a copy button instead. */
  copy?: string;
}

const CONTACT_ROUTES: ContactRoute[] = [
  {
    label: "Report a bug",
    when: "Something broken or behaving oddly? Open an issue with your modem model and QManager version.",
    dest: "github.com/dr-dolomite/QManager/issues",
    href: "https://github.com/dr-dolomite/QManager/issues",
    icon: Bug,
  },
  {
    label: "Ask the community",
    when: "Setup help, band choices, and antenna advice from other QManager users.",
    dest: `Discord · ${DISCORD_SERVER}`,
    href: DISCORD_INVITE,
    icon: MessagesSquare,
  },
  {
    label: "Email the maintainer",
    when: "For private questions and commercial licensing.",
    dest: EMAIL,
    href: `mailto:${EMAIL}`,
    icon: Mail,
    copy: EMAIL,
  },
  {
    label: "Read the release notes",
    when: "See what changed in each version before you update.",
    dest: "github.com/dr-dolomite/QManager/releases",
    href: "https://github.com/dr-dolomite/QManager/releases",
    icon: FileText,
  },
];

export default function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-20 py-12 sm:py-16 border-t border-border/80"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
        <div className="reveal">
          <h2
            id="contact-heading"
            className="text-2xl font-bold tracking-tight text-foreground text-balance sm:text-3xl"
          >
            Need a hand?
          </h2>
          <p className="mt-2 max-w-xl text-base text-muted-foreground leading-relaxed text-pretty">
            Bugs go to GitHub, questions go to the Discord community, and anything private goes
            straight to the maintainer.
          </p>

          {/* Routes in the order most people need them; each whole row is the link */}
          <ul className="mt-8 -mx-3 flex flex-col gap-1">
            {CONTACT_ROUTES.map((route) => {
              const Icon = route.icon;
              const external = !route.copy;
              return (
                <li key={route.label} className="flex items-start gap-2">
                  <a
                    href={route.href}
                    {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="group flex min-w-0 flex-1 items-start gap-4 rounded-2xl px-3 py-4 transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="text-base font-semibold text-foreground tracking-tight transition-colors group-hover:text-primary">
                        {route.label}
                      </span>
                      <span className="mt-1 text-sm text-muted-foreground leading-relaxed text-pretty">
                        {route.when}
                      </span>
                      <span className="mt-1.5 truncate text-sm font-medium text-primary" title={route.dest}>
                        {route.dest}
                      </span>
                    </span>
                    {external && (
                      <>
                        <ArrowUpRight
                          className="mt-0.5 size-5 shrink-0 text-muted-foreground transition-[color,transform] duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
                          aria-hidden="true"
                        />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </>
                    )}
                  </a>
                  {route.copy && (
                    <span className="mr-3 shrink-0 pt-3">
                      <CopyButton value={route.copy} label="Copy email address" />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* The Discord invite, staged like the product shots: a white card on a soft plate */}
        <aside
          aria-labelledby="contact-discord-heading"
          className="reveal self-start rounded-3xl bg-surface-container p-6 sm:p-8"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#5865F2] text-white">
              <DiscordIcon className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3
                id="contact-discord-heading"
                className="text-base font-semibold text-foreground tracking-tight"
              >
                Join the Discord
              </h3>
              <p className="truncate text-sm text-muted-foreground" title={DISCORD_SERVER}>
                {DISCORD_SERVER}
              </p>
            </div>
          </div>

          {/* A QR only helps when the page is on a different screen than the phone */}
          <div className="mt-6 hidden sm:block">
            <div className="mx-auto w-fit rounded-2xl bg-white p-4 shadow-[0_18px_40px_-18px_rgb(0_0_0/0.35)] ring-1 ring-black/5">
              <Image
                src="/discord-qr.svg"
                alt="QR code for the Cellular Modem Talk/Development Discord invite"
                width={176}
                height={176}
                className="size-44"
              />
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground text-pretty">
              Scan with your phone&apos;s camera to join from mobile.
            </p>
          </div>

          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container"
          >
            <span>Open the invite</span>
            <ArrowUpRight className="size-4" aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </aside>
      </div>
    </section>
  );
}
