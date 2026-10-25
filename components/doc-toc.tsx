"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp, ExternalLink } from "lucide-react";
import GithubIcon from "@/components/github-icon";

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface DocTocProps {
  toc: TocItem[];
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

// Offset matching the sticky navbar height plus breathing room.
const SCROLL_OFFSET = 80;

export default function DocToc({ toc }: DocTocProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!toc || toc.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + SCROLL_OFFSET + 40;
      let currentActive = toc[0].id;

      for (const item of toc) {
        const el = document.getElementById(item.id);
        if (el && scrollPosition >= el.getBoundingClientRect().top + window.scrollY) {
          currentActive = item.id;
        }
      }

      setActiveId(currentActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [toc]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!toc || toc.length === 0) return null;

  return (
    <aside className="hidden w-56 shrink-0 xl:block">
      <div className="sticky top-20 flex max-h-[calc(100vh-6rem)] flex-col gap-3 overflow-y-auto pb-10 pl-1 pt-1">
        <h2 className="text-[13px] font-semibold text-foreground">On This Page</h2>

        <nav aria-label="On This Page">
          <ul>
            {toc.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "location" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveId(item.id);
                      const el = document.getElementById(item.id);
                      if (el) {
                        const y = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
                        window.scrollTo({ top: y, behavior: "smooth" });
                        history.pushState(null, "", `#${item.id}`);
                      }
                    }}
                    className={`block border-l py-1 pr-1 text-[13px] leading-snug transition-colors ${FOCUS_RING} ${
                      item.level === 3 ? "pl-6" : "pl-3"
                    } ${
                      isActive
                        ? "border-primary font-medium text-primary"
                        : "border-border/60 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-3 space-y-2 border-t border-border/60 pt-3 text-[13px] text-muted-foreground">
          <button
            type="button"
            onClick={scrollToTop}
            className={`flex items-center gap-1.5 rounded-md transition-colors hover:text-foreground ${FOCUS_RING}`}
          >
            <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
            <span>Back to top</span>
          </button>

          <a
            href="https://github.com/dr-dolomite/QManager"
            target="_blank"
            rel="noreferrer"
            className={`flex items-center gap-1.5 rounded-md transition-colors hover:text-foreground ${FOCUS_RING}`}
          >
            <GithubIcon className="h-3.5 w-3.5" />
            <span>View source on GitHub</span>
            <ExternalLink aria-hidden="true" className="h-3 w-3 opacity-60" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
