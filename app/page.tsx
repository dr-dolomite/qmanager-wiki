import React, { type CSSProperties } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Terminal, ExternalLink } from "lucide-react";
import GithubIcon from "@/components/github-icon";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import QuickTasks from "@/components/quick-tasks";
import QuickInstall from "@/components/quick-install";
import FeatureGrid from "@/components/feature-grid";
import HardwareMatrix from "@/components/hardware-matrix";
import ScreenshotShowcase from "@/components/screenshot-showcase";
import SupportSection from "@/components/support-section";
import ContactSection from "@/components/contact-section";
import GetStarted from "@/components/get-started";
import { DOC_CATEGORIES } from "@/lib/docs-data";

const CATEGORY_COUNT = DOC_CATEGORIES.length;
const GUIDE_COUNT = DOC_CATEGORIES.reduce((sum, category) => sum + category.articles.length, 0);

/* Load-sequence delay for a hero element, in ms (motion lives in globals.css: hero-*). */
const delay = (ms: number) => ({ "--d": ms }) as CSSProperties;

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HERO SECTION: oversized promise on the left, the real modem UI on the right (stacks below lg) */}
        <section className="grid items-center gap-12 pt-10 pb-6 sm:pt-14 sm:pb-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14 lg:pt-20 lg:pb-12">
          <div>
            {/* Version Badge */}
            <div
              className="hero-rise inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3.5 py-1.5 shadow-xs"
              style={delay(0)}
            >
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="led-ping absolute inset-0 rounded-full bg-emerald-500 opacity-0" />
                <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-semibold text-foreground font-figure tabular-nums">
                v0.1.35
              </span>
              <span className="text-border">•</span>
              <span className="text-xs text-muted-foreground font-medium">
                Built for Qualcomm 5G Modems
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-7 text-[2.75rem] leading-[1.02] sm:text-6xl xl:text-[5.25rem] font-bold tracking-[-0.035em] text-foreground">
              <span className="hero-rise block" style={delay(80)}>High-speed 5G</span>{" "}
              <span className="hero-rise block text-primary" style={delay(180)}>made simple.</span>
            </h1>

            {/* Subtitle */}
            <p className="hero-rise mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed text-pretty" style={delay(300)}>
              Manage and optimize your Quectel modem with a clean, friendly dashboard. Easy setup for home routers, powerful tools when you want them.
            </p>

            {/* Action CTAs */}
            <div className="hero-rise mt-9 flex flex-wrap items-center gap-3" style={delay(400)}>
              <a
                href="#install"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Terminal className="h-4 w-4" />
                <span>Get Started in 2 Minutes</span>
              </a>

              <Link
                href="/docs/getting-started/introduction/"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-card px-6 text-base font-medium text-foreground transition-all hover:bg-muted hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>Browse Guides</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="https://github.com/dr-dolomite/QManager"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full px-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <GithubIcon className="h-4 w-4" />
                <span>GitHub</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>

            {/* Spec rail: the key numbers, kept quiet so the headline and product lead */}
            <dl className="hero-rise mt-12 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border/70 pt-7 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4" style={delay(520)}>
              <div>
                <dt className="text-xs text-muted-foreground">Peak 5G-A downlink</dt>
                <dd className="mt-1 text-xl font-bold tracking-tight text-foreground font-figure tabular-nums">
                  7.5 <span className="text-sm font-semibold text-muted-foreground">Gbps</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Guides in {CATEGORY_COUNT} categories</dt>
                <dd className="mt-1 text-xl font-bold tracking-tight text-foreground font-figure tabular-nums">
                  {GUIDE_COUNT}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">One-line setup</dt>
                <dd className="mt-1 text-xl font-bold tracking-tight text-foreground font-figure tabular-nums">
                  &lt; 2 <span className="text-sm font-semibold text-muted-foreground">min</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Qualcomm families</dt>
                <dd className="mt-1 text-xl font-bold tracking-tight text-foreground font-figure tabular-nums">
                  3 <span className="text-sm font-semibold text-muted-foreground">Gens</span>
                </dd>
              </div>
            </dl>
          </div>

          {/* Product stage: real RM520N capture on a primary-blue plate. The plate lifts in on load
              while the capture counter-zooms into focus, then the stage recedes as you scroll on. */}
          <div className="hero-recede mx-auto w-full max-w-md sm:max-w-lg lg:max-w-none">
            <div className="hero-plate rounded-[2rem] bg-primary p-6 sm:p-12">
              {/* Crop the capture's outer margin so only the card itself shows */}
              <div className="relative aspect-[1088/1048] overflow-hidden rounded-[1.4rem] shadow-[0_24px_60px_-20px_rgb(0_0_0/0.55)] ring-1 ring-black/10">
                <div className="hero-shot absolute inset-0">
                  <Image
                    src="/screenshots/rm520n-overview-card-light.png"
                    alt="QManager modem overview on an RM520N-GL: connected on 5G-NSA, bands B1 and N41, 80 MHz bandwidth"
                    width={1168}
                    height={1128}
                    className="absolute top-[-3.82%] left-[-3.68%] w-[107.35%] max-w-none dark:hidden"
                    sizes="(min-width: 1024px) 560px, 90vw"
                    priority
                  />
                  <Image
                    src="/screenshots/rm520n-overview-card.png"
                    alt="QManager modem overview on an RM520N-GL: connected on 5G-NSA, bands B1 and N41, 80 MHz bandwidth"
                    width={1168}
                    height={1128}
                    className="absolute top-[-3.82%] left-[-3.68%] hidden w-[107.35%] max-w-none dark:block"
                    sizes="(min-width: 1024px) 560px, 90vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 PROMINENT QUICK JUMP TASK CARDS (Consumer benefits) */}
        <QuickTasks />

        {/* HARDWARE COMPATIBILITY MATRIX (#hardware) — check your modem before installing */}
        <HardwareMatrix />

        {/* CLEAN 2-TAB QUICK INSTALL CARD (#install, preselect via #install-rm551e / #install-rm520n) */}
        <QuickInstall />

        {/* SCANNABLE FEATURE GRID WITH TOPIC CHIPS (#features) */}
        <FeatureGrid />

        {/* REAL MODEM SCREENSHOT SHOWCASE */}
        <ScreenshotShowcase />

        {/* SUPPORT THE PROJECT SECTION */}
        <SupportSection />

        {/* CONTACT: bug reports, Discord (with QR), maintainer email (#contact) */}
        <ContactSection />

        {/* CALL TO ACTION: a modem acquiring signal, then the two install paths */}
        <GetStarted />
      </main>

      <Footer />
    </div>
  );
}
