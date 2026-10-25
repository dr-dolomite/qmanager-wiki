// 404: a night camp for the lost adventurer. The card is always night in both
// themes (it is an illustration, not chrome), so its ink and the amber button
// read from CAMPFIRE_PALETTE via CSS variables. Next emits this as `404.html`.

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpenIcon, TentIcon } from "lucide-react";
import { CAMPFIRE_PALETTE as P, CampfireScene } from "@/components/not-found/campfire-scene";
import "@/components/not-found/campfire.css";

export const metadata: Metadata = {
  title: "Page not found",
};

const CAMPFIRE_VARS = {
  "--campfire-ground": P.ground,
  "--campfire-text": P.text,
  "--campfire-text-muted": P.textMuted,
  "--campfire-amber": P.amber,
  "--campfire-amber-hover": P.amberHover,
  "--campfire-amber-light": P.amberLight,
  "--campfire-amber-edge": P.amberEdge,
  "--campfire-amber-ink": P.amberInk,
} as React.CSSProperties;

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-4 md:p-10">
      <main className="campfire-enter w-full max-w-md">
        <div
          style={CAMPFIRE_VARS}
          className="overflow-hidden rounded-3xl bg-(--campfire-ground) text-center ring-1 ring-white/6"
        >
          <CampfireScene
            label="A campfire crackling under a starry night sky"
            className="block h-auto w-full"
          />

          <div className="flex flex-col items-center gap-6 px-6 pt-1 pb-8 sm:px-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-balance text-xl leading-tight font-semibold tracking-tight text-(--campfire-text)">
                You seem to be lost, adventurer
              </h1>
              <p className="text-sm leading-relaxed text-balance text-(--campfire-text-muted)">
                That page doesn&apos;t exist. Head back to the docs and find the guide you need.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
              <span className="campfire-button-frame">
                <Link href="/docs/" className="campfire-button">
                  <BookOpenIcon className="size-4" aria-hidden />
                  Browse the docs
                </Link>
              </span>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-sm text-sm font-medium text-(--campfire-text-muted) transition-colors hover:text-(--campfire-text) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--campfire-amber-light)"
              >
                <TentIcon className="size-4" aria-hidden />
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <div className="flex items-center gap-2">
        <Image
          src="/qmanager-mark.svg"
          alt=""
          aria-hidden
          width={16}
          height={16}
          className="size-4 opacity-70"
        />
        <p className="text-xs text-muted-foreground">QManager Docs</p>
      </div>
    </div>
  );
}
