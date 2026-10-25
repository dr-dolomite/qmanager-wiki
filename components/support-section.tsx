import React from "react";
import { ExternalLink } from "lucide-react";
import GithubIcon from "@/components/github-icon";
import PaypalIcon from "@/components/icons/paypal-icon";
import WiseIcon from "@/components/icons/wise-icon";

interface TipOption {
  title: string;
  description: string;
  href: string;
  badge: string;
  icon: React.ReactNode;
  buttonText: string;
}

const TIP_OPTIONS: TipOption[] = [
  {
    title: "Wise",
    description: "Lowest fees for global transfers in USD. Recommended for international supporters.",
    href: "https://wise.com/pay/business/blackcatdev?currency=USD",
    badge: "Direct Transfer",
    icon: <WiseIcon className="h-5 w-5 text-emerald-700 dark:text-[#9FE870]" />,
    buttonText: "Send via Wise",
  },
  {
    title: "PayPal",
    description: "Fast, secure one-click tip via credit card, debit, or your PayPal balance.",
    href: "https://paypal.me/iamrusss",
    badge: "Instant Tip",
    icon: <PaypalIcon className="h-5 w-5 text-[#0070BA] dark:text-[#38a3ff]" />,
    buttonText: "Tip with PayPal",
  },
  {
    title: "GitHub Sponsors",
    description: "Sponsor monthly or send a one-time contribution directly on GitHub.",
    href: "https://github.com/sponsors/dr-dolomite",
    badge: "Open Source",
    icon: <GithubIcon className="h-5 w-5 text-foreground" />,
    buttonText: "Sponsor on GitHub",
  },
];

export default function SupportSection() {
  return (
    <section id="support" className="scroll-mt-20 py-12 sm:py-16 border-t border-border/80">
      <div className="reveal mx-auto mb-10 max-w-xl text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground text-balance sm:text-3xl">
          Support the project
        </h2>
        <p className="mt-2 text-base text-muted-foreground leading-relaxed text-pretty">
          QManager is 100% free and open source. If it helped you maximize cellular speeds, simplify your setup, or save time, sending a small tip directly supports hardware testing and continuous releases.
        </p>
      </div>

      <div className="reveal mx-auto max-w-4xl rounded-2xl border border-border/60 bg-muted/30">
        <ul className="grid divide-y divide-border/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {TIP_OPTIONS.map((option) => (
            <li key={option.title} className="flex flex-col gap-3 p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background">
                  {option.icon}
                </div>
                <div className="flex min-w-0 flex-col items-start gap-1">
                  <h3 className="text-sm font-semibold text-foreground tracking-tight">{option.title}</h3>
                  <span className="rounded-full border border-border/70 bg-background/60 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {option.badge}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                {option.description}
              </p>
              <a
                href={option.href}
                target="_blank"
                rel="noreferrer"
                className="mt-auto inline-flex h-9 items-center justify-center gap-1.5 self-start rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground transition-[border-color,box-shadow,background-color] duration-150 hover:border-primary/40 hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span>{option.buttonText}</span>
                <span className="sr-only"> (opens in a new tab)</span>
                <ExternalLink className="size-4 text-muted-foreground" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
