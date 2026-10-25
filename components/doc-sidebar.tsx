"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { DOC_CATEGORIES, type DocArticle } from "@/lib/docs-data";

type EditionFilter = "all" | "openwrt" | "rm520n";

const EDITION_STORAGE_KEY = "qm-docs-edition";

const EDITION_OPTIONS: { value: EditionFilter; label: string; title?: string }[] = [
  { value: "all", label: "All" },
  {
    value: "openwrt",
    label: "RM551E",
    title: "Quectel RM551E Series (Custom On-Modem OpenWRT)",
  },
  {
    value: "rm520n",
    label: "RM520N",
    title: "Quectel RM520N & Qualcomm X5*/X6* Modems (Native Linux)",
  },
];

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function isEditionFilter(value: unknown): value is EditionFilter {
  return value === "all" || value === "openwrt" || value === "rm520n";
}

function matchesEdition(article: DocArticle, filter: EditionFilter) {
  return filter === "all" || article.edition === "universal" || article.edition === filter;
}

export default function DocSidebar() {
  const pathname = usePathname();
  const [editionFilter, setEditionFilter] = useState<EditionFilter>("all");
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Read the saved filter after mount so server and client render the same first frame.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(EDITION_STORAGE_KEY);
      if (isEditionFilter(saved)) setEditionFilter(saved);
    } catch {
      // Storage unavailable (private mode, blocked site data): keep the default.
    }
  }, []);

  const changeEdition = (value: EditionFilter) => {
    setEditionFilter(value);
    try {
      window.localStorage.setItem(EDITION_STORAGE_KEY, value);
    } catch {
      // Ignore: the choice still applies for this visit.
    }
  };

  const closeDrawer = useCallback(() => {
    setMobileDrawerOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!mobileDrawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileDrawerOpen, closeDrawer]);

  const toggleCategory = (catId: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const isArticleActive = (article: DocArticle) => {
    const articlePath = `/docs/${article.category}/${article.slug}/`;
    return pathname === articlePath || pathname === articlePath.slice(0, -1);
  };

  const activeCategory = DOC_CATEGORIES.find((category) =>
    category.articles.some(isArticleActive),
  );

  const visibleArticleCount = DOC_CATEGORIES.reduce(
    (total, category) =>
      total + category.articles.filter((article) => matchesEdition(article, editionFilter)).length,
    0,
  );

  const renderContent = (idPrefix: string, onLinkClick?: () => void) => (
    <>
      <div role="group" aria-label="Show docs for" className="space-y-2">
        <p className="px-0.5 text-[13px] text-muted-foreground">Show docs for</p>
        <div className="grid grid-cols-3 gap-0.5 rounded-lg bg-muted p-0.5">
          {EDITION_OPTIONS.map((option) => {
            const isSelected = editionFilter === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => changeEdition(option.value)}
                aria-pressed={isSelected}
                title={option.title}
                className={`rounded-md py-1.5 text-center text-[13px] transition-colors ${FOCUS_RING} ${
                  isSelected
                    ? "bg-background font-medium text-foreground shadow-sm dark:bg-surface-container-high"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <nav aria-label="Documentation" className="space-y-5">
        {DOC_CATEGORIES.map((category) => {
          const isCollapsed = collapsedCategories[category.id] || false;
          const filteredArticles = category.articles.filter((article) =>
            matchesEdition(article, editionFilter),
          );

          if (filteredArticles.length === 0) return null;

          const listId = `${idPrefix}-cat-${category.id}`;

          return (
            <div key={category.id}>
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                aria-expanded={!isCollapsed}
                aria-controls={listId}
                className={`flex w-full items-start justify-between gap-2 rounded-lg px-2.5 py-1 text-left text-[13px] font-semibold leading-snug text-foreground ${FOCUS_RING}`}
              >
                <span>{category.title}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={`mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/70 transition-transform motion-reduce:transition-none ${
                    isCollapsed ? "-rotate-90" : ""
                  }`}
                />
              </button>

              <ul id={listId} hidden={isCollapsed} className="mt-1 space-y-px">
                {filteredArticles.map((article) => {
                  const isActive = isArticleActive(article);
                  return (
                    <li key={article.slug}>
                      <Link
                        href={`/docs/${article.category}/${article.slug}/`}
                        onClick={onLinkClick}
                        aria-current={isActive ? "page" : undefined}
                        className={`block rounded-lg px-2.5 py-1.5 text-[14px] leading-snug transition-colors ${FOCUS_RING} ${
                          isActive
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        }`}
                      >
                        {article.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile: one compact trigger row opening the docs drawer (< lg) */}
      <div className="w-full lg:hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={mobileDrawerOpen}
            className={`-ml-2 flex min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[14px] transition-colors hover:bg-muted/60 ${FOCUS_RING}`}
          >
            <Menu aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="shrink-0 font-medium text-foreground">Browse docs</span>
            {activeCategory && (
              <span className="truncate text-muted-foreground">{activeCategory.title}</span>
            )}
          </button>

          <span className="shrink-0 text-[13px] tabular-nums text-muted-foreground">
            {visibleArticleCount} {visibleArticleCount === 1 ? "article" : "articles"}
          </span>
        </div>

        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-16 backdrop-blur-xs">
            <div className="fixed inset-0" aria-hidden="true" onClick={closeDrawer} />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Documentation"
              className="relative max-h-[82vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border/60 bg-card p-5 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[17px] font-semibold text-foreground">Documentation</h2>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={closeDrawer}
                  className={`rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground ${FOCUS_RING}`}
                  aria-label="Close documentation menu"
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-col gap-5">{renderContent("mobile", closeDrawer)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop: sticky left sidebar (>= lg) */}
      <aside className="hidden shrink-0 lg:block lg:w-68 xl:w-72">
        <div className="sticky top-20 -ml-1.5 flex max-h-[calc(100vh-6rem)] flex-col gap-6 overflow-y-auto pb-10 pl-1.5 pr-2 pt-1">
          {renderContent("desktop")}
        </div>
      </aside>
    </>
  );
}
