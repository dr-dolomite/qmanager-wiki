"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, X, CornerDownLeft } from "lucide-react";
import { DOC_CATEGORIES, getAllArticles, DocArticle } from "@/lib/docs-data";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_RESULTS = 8;

const POPULAR: [string, string][] = [
  ["getting-started", "introduction"],
  ["getting-started", "first-time-setup"],
  ["cellular", "band-locking"],
  ["cellular", "live-signal"],
  ["resilience", "connection-watchdog"],
  ["profiles", "apn-management"],
];

const CATEGORY_TITLES: Record<string, string> = Object.fromEntries(
  DOC_CATEGORIES.map((c) => [c.id, c.title])
);

const EDITION_LABELS: Record<DocArticle["edition"], string | null> = {
  universal: null,
  openwrt: "RM551E",
  rm520n: "RM520N",
};

interface IndexedArticle {
  article: DocArticle;
  title: string;
  description: string;
  /** Markdown stripped to plain prose, original casing. */
  text: string;
  textLower: string;
}

function toPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^#\s.*$/gm, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^>\s?\[![A-Z]+\]/gm, " ")
    .replace(/^\s*(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")
    .replace(/^\|?[\s:|-]+\|?$/gm, " ")
    .replace(/[|*_`]/g, " ")
    .replace(/&#42;/g, "*")
    .replace(/&[a-z]+;/g, " ")
    .replace(/-{3,}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Matches a term at the start of a word, so "band" finds "band locking" but not "baseband". */
function wordStart(term: string, flags = "") {
  return new RegExp(`(?<![a-z0-9])${escapeRegExp(term)}`, flags);
}

function findWord(haystack: string, term: string): number {
  return haystack.search(wordStart(term));
}

function hasWord(haystack: string, term: string): boolean {
  return findWord(haystack, term) !== -1;
}

let indexCache: IndexedArticle[] | null = null;
function getIndex(): IndexedArticle[] {
  if (!indexCache) {
    indexCache = getAllArticles().map((article) => {
      const text = toPlainText(article.content);
      return {
        article,
        title: article.title.toLowerCase(),
        description: article.description.toLowerCase(),
        text,
        textLower: text.toLowerCase(),
      };
    });
  }
  return indexCache;
}

interface Result {
  article: DocArticle;
  snippet: string | null;
}

function makeSnippet(source: string, sourceLower: string, terms: string[]): string | null {
  let at = -1;
  for (const t of terms) {
    const i = findWord(sourceLower, t);
    if (i !== -1 && (at === -1 || i < at)) at = i;
  }
  if (at === -1) return null;
  const start = Math.max(0, at - 36);
  const end = Math.min(source.length, at + 110);
  let s = source.slice(start, end).trim();
  if (start > 0) s = "…" + s.replace(/^\S*\s/, "");
  if (end < source.length) s = s + "…";
  return s;
}

function search(query: string): Result[] {
  const q = query.trim().toLowerCase();
  const terms = q.split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const scored: { score: number; result: Result }[] = [];
  for (const entry of getIndex()) {
    const haystack = `${entry.title} ${entry.description} ${entry.textLower}`;
    if (!terms.every((t) => hasWord(haystack, t))) continue;

    let score = 0;
    if (hasWord(entry.title, q)) score += entry.title.startsWith(q) ? 120 : 100;
    score += terms.filter((t) => hasWord(entry.title, t)).length * 20;
    if (hasWord(entry.description, q)) score += 30;
    score += terms.filter((t) => hasWord(entry.description, t)).length * 6;
    if (hasWord(entry.textLower, q)) score += 10;
    // Light frequency signal for body matches, capped so long articles don't dominate.
    score += Math.min(entry.textLower.match(wordStart(terms[0], "g"))?.length ?? 0, 10);

    const snippet =
      makeSnippet(entry.article.description, entry.description, terms) ??
      makeSnippet(entry.text, entry.textLower, terms);

    scored.push({ score, result: { article: entry.article, snippet } });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS)
    .map((s) => s.result);
}

function getPopular(): Result[] {
  const all = getAllArticles();
  return POPULAR.map(([cat, slug]) =>
    all.find((a) => a.slug === slug && a.category === cat)
  )
    .filter((a): a is DocArticle => Boolean(a))
    .map((article) => ({ article, snippet: null }));
}

function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (terms.length === 0) return <>{text}</>;
  const re = new RegExp(
    `((?<![a-z0-9])(?:${terms.map(escapeRegExp).join("|")}))`,
    "gi"
  );
  const parts = text.split(re);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded-sm bg-primary/15 text-foreground">
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

const kbdClass =
  "inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-border/60 bg-muted/60 px-1.5 font-sans text-xs text-muted-foreground";

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const listId = useId();
  const optionId = (i: number) => `${listId}-opt-${i}`;

  const trimmed = query.trim();
  const terms = useMemo(
    () => trimmed.toLowerCase().split(/\s+/).filter(Boolean),
    [trimmed]
  );
  const results = useMemo(
    () => (trimmed === "" ? getPopular() : search(trimmed)),
    [trimmed]
  );

  useEffect(() => {
    itemRefs.current[selectedIndex]?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const navigateTo = (article: DocArticle) => {
    onClose();
    router.push(`/docs/${article.category}/${article.slug}/`);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const n = results.length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (n) setSelectedIndex((prev) => (prev + 1) % n);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (n) setSelectedIndex((prev) => (prev - 1 + n) % n);
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      navigateTo(results[selectedIndex].article);
    }
  };

  const hasResults = results.length > 0;
  const activeId = hasResults ? optionId(selectedIndex) : undefined;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" />
        <Dialog.Content
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            inputRef.current?.focus();
          }}
          className="fixed inset-x-4 top-[max(1rem,env(safe-area-inset-top))] z-50 mx-auto flex max-h-[calc(100dvh-2rem)] max-w-2xl flex-col overflow-hidden rounded-2xl border border-border/60 bg-popover text-popover-foreground shadow-2xl outline-none sm:top-[12vh] sm:max-h-[76vh]"
        >
          <Dialog.Title className="sr-only">Search documentation</Dialog.Title>

          <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border/60 px-4">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <label htmlFor={`${listId}-input`} className="sr-only">
              Search documentation
            </label>
            <input
              id={`${listId}-input`}
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded={hasResults}
              aria-controls={listId}
              aria-activedescendant={activeId}
              aria-autocomplete="list"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleInputKeyDown}
              placeholder="Search documentation"
              className="h-14 min-w-0 flex-1 bg-transparent text-[17px] text-foreground outline-none placeholder:text-muted-foreground"
            />
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : (
              <Dialog.Close
                aria-label="Close search"
                className={`${kbdClass} shrink-0 cursor-pointer transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
              >
                esc
              </Dialog.Close>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
            {hasResults ? (
              <>
                <p
                  id={`${listId}-label`}
                  className="px-3 pb-1 pt-2 text-[13px] font-semibold text-muted-foreground"
                >
                  {trimmed === "" ? "Popular" : "Results"}
                </p>
                <ul id={listId} role="listbox" aria-labelledby={`${listId}-label`}>
                  {results.map(({ article, snippet }, idx) => {
                    const isSelected = idx === selectedIndex;
                    const edition = EDITION_LABELS[article.edition];
                    const category = CATEGORY_TITLES[article.category] ?? article.category;
                    return (
                      <li
                        key={`${article.category}-${article.slug}`}
                        id={optionId(idx)}
                        ref={(el) => {
                          itemRefs.current[idx] = el;
                        }}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => navigateTo(article)}
                        onMouseMove={() => !isSelected && setSelectedIndex(idx)}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 ${
                          isSelected ? "bg-muted" : ""
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[15px] font-medium text-foreground">
                            <Highlight text={article.title} terms={terms} />
                          </p>
                          <p className="mt-0.5 truncate text-[13px] text-muted-foreground">
                            {category}
                            {edition && <> · {edition}</>}
                          </p>
                          {snippet && (
                            <p className="mt-1 truncate text-[13px] text-muted-foreground">
                              <Highlight text={snippet} terms={terms} />
                            </p>
                          )}
                        </div>
                        <CornerDownLeft
                          aria-hidden="true"
                          className={`h-4 w-4 shrink-0 text-muted-foreground ${
                            isSelected ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <div className="px-6 py-12 text-center" role="status">
                <p className="text-[15px] text-foreground">
                  No results for &ldquo;{trimmed}&rdquo;
                </p>
                <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
                  Try a broader term, like band lock, TTL, RM520N, install or watchdog.
                </p>
              </div>
            )}
          </div>

          <div className="hidden shrink-0 items-center gap-5 border-t border-border/60 px-4 py-2.5 text-xs text-muted-foreground sm:flex">
            <span className="flex items-center gap-1.5">
              <kbd className={kbdClass}>↑</kbd>
              <kbd className={kbdClass}>↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className={kbdClass}>
                <CornerDownLeft className="h-3 w-3" aria-hidden="true" />
              </kbd>
              to open
            </span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
