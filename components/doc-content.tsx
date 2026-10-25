"use client";

import React, { useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Element, ElementContent } from "hast";
import { Check, Copy, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { DOC_CATEGORIES, DocArticle } from "@/lib/docs-data";
import { cn } from "@/lib/utils";

interface DocContentProps {
  article: DocArticle;
  prev?: DocArticle;
  next?: DocArticle;
}

const EDITION_BADGES: Record<DocArticle["edition"], { label: string; className: string }> = {
  universal: {
    label: "Universal (RM551E & RM520N)",
    className: "bg-emerald-500/10 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  openwrt: {
    label: "RM551E Series (Custom OpenWRT)",
    className: "bg-sky-500/10 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
  },
  rm520n: {
    label: "RM520N Series (SDXLEMUR Linux)",
    className: "bg-violet-500/10 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300",
  },
};

const LANGUAGE_LABELS: Record<string, string> = {
  at: "AT",
  sh: "Shell",
  shell: "Shell",
  bash: "Bash",
  zsh: "Zsh",
  console: "Console",
  json: "JSON",
  yaml: "YAML",
  yml: "YAML",
  ini: "INI",
  conf: "Config",
  js: "JavaScript",
  javascript: "JavaScript",
  ts: "TypeScript",
  typescript: "TypeScript",
  python: "Python",
  py: "Python",
  html: "HTML",
  css: "CSS",
  text: "Text",
  txt: "Text",
  diff: "Diff",
  lua: "Lua",
  uci: "UCI",
  promql: "PromQL",
};

function languageLabel(lang: string): string {
  return LANGUAGE_LABELS[lang.toLowerCase()] ?? lang.charAt(0).toUpperCase() + lang.slice(1);
}

// ISO "YYYY-MM-DD" -> "Oct 21, 2026". Fixed locale and UTC so server and client render the same string.
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? iso : dateFormatter.format(date);
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function CopyButton({ text, floating }: { text: string; floating?: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy code"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] text-muted-foreground transition-[color,background-color,opacity] hover:bg-foreground/[0.06] hover:text-foreground",
        focusRing,
        floating &&
          "absolute right-2 top-2 bg-background/80 opacity-0 backdrop-blur-sm group-hover:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100 dark:bg-background/60"
      )}
    >
      {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

function CodeBlock({ className, children }: { className?: string; children?: React.ReactNode }) {
  const codeText = getNodeText(children).replace(/\n$/, "");
  const match = /language-([\w+-]+)/.exec(className || "");
  const explicit = match ? languageLabel(match[1]) : null;
  const inferred = !explicit && /^AT([+&^$#%*]|\b)/.test(codeText.trimStart()) ? "AT" : null;
  const label = explicit ?? inferred;

  return (
    <div className="not-prose group relative my-6 overflow-hidden rounded-xl border border-border/50 bg-muted/70 dark:bg-white/[0.04]">
      {label && (
        <div className="flex items-center justify-between border-b border-border/50 py-1 pl-4 pr-2">
          <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
          <CopyButton text={codeText} />
        </div>
      )}
      {!label && <CopyButton text={codeText} floating />}
      <pre className="m-0 overflow-x-auto bg-transparent px-4 py-3.5 text-foreground">
        <code className="font-mono" style={{ fontSize: "13.5px", lineHeight: 1.6 }}>
          {codeText}
        </code>
      </pre>
    </div>
  );
}

function getNodeText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (Array.isArray(node)) return node.map(getNodeText).join("");
  if (React.isValidElement(node) && (node.props as { children?: React.ReactNode })?.children) {
    return getNodeText((node.props as { children?: React.ReactNode }).children);
  }
  return "";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

// Headings in markdown don't always match the hand-written TOC titles exactly, so match loosely
// to keep the TOC scrollspy ids in sync.
function findTocMatch(toc: { id: string; title: string; level: number }[], text: string, level?: number) {
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const wordMatch = (t: string, h: string) => {
    const hWords = h.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter((w) => w.length > 2);
    const tWords = t.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter((w) => w.length > 2);
    if (hWords.length === 0 || tWords.length === 0) return false;
    const hInT = hWords.every((w) => t.toLowerCase().includes(w));
    const tInH = tWords.every((w) => h.toLowerCase().includes(w));
    return hInT || tInH;
  };

  const pool = level ? toc.filter((t) => t.level === level) : toc;

  return pool.find(
    (item) =>
      item.title.trim().toLowerCase() === text.toLowerCase() ||
      slugify(item.title) === slugify(text) ||
      clean(item.title) === clean(text) ||
      clean(item.title).includes(clean(text)) ||
      clean(text).includes(clean(item.title)) ||
      wordMatch(item.title, text)
  );
}

type CalloutType = "note" | "tip" | "warning" | "caution";

const CALLOUTS: Record<CalloutType, { label: string; bg: string; labelColor: string }> = {
  note: { label: "Note", bg: "bg-callout-neutral", labelColor: "text-foreground" },
  tip: { label: "Tip", bg: "bg-callout-neutral", labelColor: "text-callout-tip-label" },
  warning: { label: "Important", bg: "bg-callout-warn-bg", labelColor: "text-callout-warn-label" },
  caution: { label: "Warning", bg: "bg-callout-danger-bg", labelColor: "text-callout-danger-label" },
};

// Detects GitHub-style `> [!NOTE]` and plain `> NOTE:` markers and strips them from the rendered body.
function parseCallout(children: React.ReactNode) {
  let firstText = "";
  function extractFirstText(node: React.ReactNode): boolean {
    if (typeof node === "string") {
      const trimmed = node.trim();
      if (trimmed.length > 0) {
        firstText = trimmed;
        return true;
      }
      return false;
    }
    if (React.isValidElement(node) && node.props && (node.props as { children?: React.ReactNode }).children) {
      const ch = (node.props as { children?: React.ReactNode }).children;
      if (Array.isArray(ch)) {
        for (const child of ch) {
          if (extractFirstText(child)) return true;
        }
      } else {
        return extractFirstText(ch);
      }
    }
    if (Array.isArray(node)) {
      for (const item of node) {
        if (extractFirstText(item)) return true;
      }
    }
    return false;
  }
  extractFirstText(children);

  let type: CalloutType | null = null;
  if (/\[!TIP\]|^\s*TIP:/i.test(firstText)) type = "tip";
  else if (/\[!WARNING\]|^\s*WARNING:/i.test(firstText)) type = "warning";
  else if (/\[!CAUTION\]|^\s*CAUTION:/i.test(firstText)) type = "caution";
  else if (/\[!NOTE\]|^\s*NOTE:/i.test(firstText)) type = "note";

  let stripped = false;
  function stripMarker(node: React.ReactNode): React.ReactNode {
    if (stripped) return node;
    if (typeof node === "string") {
      if (node.trim().length === 0) return node;
      stripped = true;
      return node
        .replace(/\[!(NOTE|TIP|WARNING|CAUTION)\]\s*/i, "")
        .replace(/^(NOTE|TIP|WARNING|CAUTION):\s*/i, "");
    }
    if (React.isValidElement(node) && node.props) {
      const childProps = { ...(node.props as Record<string, unknown>) };
      if (Array.isArray(childProps.children)) {
        const newChildren = React.Children.map(childProps.children, (c) => stripMarker(c))
          ?.filter((c: React.ReactNode) => c !== null && c !== undefined && c !== "");
        if (!newChildren || newChildren.length === 0) return null;
        childProps.children = newChildren;
      } else if (childProps.children) {
        const newChild = stripMarker(childProps.children as React.ReactNode);
        if (newChild === null || newChild === undefined || newChild === "") return null;
        childProps.children = newChild;
      }
      return React.cloneElement(node, childProps);
    }
    if (Array.isArray(node)) {
      return React.Children.map(node, (c) => stripMarker(c))?.filter(
        (c: React.ReactNode) => c !== null && c !== undefined && c !== ""
      );
    }
    return node;
  }

  return { type, cleanedChildren: type ? stripMarker(children) : children };
}

// Theme-aware screenshots: `x-light.webp` (or .png) is paired with a sibling `x-dark.webp`.
function ThemedImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const themed = /-light\.(png|webp)$/i;
  const darkSrc = themed.test(src) ? src.replace(themed, "-dark.$1") : null;
  /* eslint-disable @next/next/no-img-element */
  if (!darkSrc) {
    return <img src={src} alt={alt} className={className} loading="lazy" decoding="async" />;
  }
  return (
    <>
      <img src={src} alt={alt} className={cn(className, "dark:hidden")} loading="lazy" decoding="async" />
      <img src={darkSrc} alt={alt} className={cn(className, "hidden dark:block")} loading="lazy" decoding="async" />
    </>
  );
  /* eslint-enable @next/next/no-img-element */
}

const imageClass = "block h-auto w-full rounded-xl border border-border/60";

function Figure({ src, alt, title }: { src: string; alt: string; title?: string }) {
  return (
    <figure className="not-prose m-0">
      <ThemedImage src={src} alt={alt} className={imageClass} />
      {title && <figcaption className="mt-3 text-center text-[13px] text-muted-foreground">{title}</figcaption>}
    </figure>
  );
}

function imageProps(el: Element) {
  const { src, alt, title } = el.properties ?? {};
  return {
    src: typeof src === "string" ? src : "",
    alt: typeof alt === "string" ? alt : "",
    title: typeof title === "string" && title.trim() ? title : undefined,
  };
}

// A paragraph whose only content is images is rendered as figure(s) instead of <p>.
function imageOnlyChildren(children: ElementContent[] | undefined): Element[] | null {
  if (!children || children.length === 0) return null;
  const images: Element[] = [];
  for (const child of children) {
    if (child.type === "element" && child.tagName === "img") images.push(child);
    else if (child.type === "text" && child.value.trim() === "") continue;
    else return null;
  }
  return images.length > 0 ? images : null;
}

function HeadingAnchor({ id }: { id: string }) {
  return (
    <a
      href={`#${id}`}
      className={cn(
        "ml-2 inline-block rounded-md px-1 font-normal text-muted-foreground no-underline opacity-0 transition-opacity hover:text-primary group-hover:opacity-100 focus-visible:opacity-100",
        focusRing
      )}
      aria-label="Link to this section"
    >
      #
    </a>
  );
}

export default function DocContent({ article, prev, next }: DocContentProps) {
  const categoryTitle = DOC_CATEGORIES.find((c) => c.id === article.category)?.title ?? article.category;
  const edition = EDITION_BADGES[article.edition];

  const renderHeading = (level: 2 | 3, children: React.ReactNode) => {
    const text = getNodeText(children).trim();
    const tocMatch = findTocMatch(article.toc, text, level);
    const id = tocMatch ? tocMatch.id : slugify(text);
    const fallbackId = slugify(text);
    const Tag = level === 2 ? "h2" : "h3";

    return (
      <>
        {tocMatch && fallbackId !== tocMatch.id && (
          <span id={fallbackId} className="relative -top-20 block" aria-hidden="true" />
        )}
        <Tag id={id} className="group">
          {children}
          <HeadingAnchor id={id} />
        </Tag>
      </>
    );
  };

  return (
    <article className="min-w-0 max-w-[46rem] flex-1 pb-16">
      <nav aria-label="Breadcrumb" className="mb-5">
        <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted-foreground">
          <li>
            <Link href="/" className={cn("rounded-md hover:text-foreground transition-colors", focusRing)}>
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-3.5" />
          </li>
          <li>{categoryTitle}</li>
          <li aria-hidden="true">
            <ChevronRight className="size-3.5" />
          </li>
          <li aria-current="page" className="min-w-0 truncate text-foreground">
            {article.title}
          </li>
        </ol>
      </nav>

      <header className="mb-10">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] font-medium",
            edition.className
          )}
        >
          {edition.label}
        </span>

        <h1 className="mt-4 text-balance text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground sm:text-[40px]">
          {article.title}
        </h1>
        <p className="mt-3 max-w-[60ch] text-[17px] leading-[1.5] text-muted-foreground sm:text-[19px]">
          {article.description}
        </p>

        <p className="mt-4 text-[13px] text-muted-foreground">
          {article.readTime} · Updated <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
        </p>
      </header>

      <div className="prose max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-headings:font-semibold prose-headings:tracking-[-0.015em] prose-headings:text-foreground prose-h1:hidden prose-h2:mb-4 prose-h2:mt-14 prose-h2:text-[26px] prose-h2:leading-[1.25] prose-h3:mb-2 prose-h3:mt-8 prose-h3:text-[20px] prose-h3:leading-[1.3] prose-p:text-[16px] prose-p:leading-[1.65] prose-p:text-foreground lg:prose-p:text-[17px] prose-li:text-[16px] prose-li:leading-[1.65] prose-li:text-foreground lg:prose-li:text-[17px] prose-strong:font-semibold prose-strong:text-foreground prose-a:text-primary prose-a:underline-offset-4 prose-code:before:content-none prose-code:after:content-none prose-blockquote:not-italic prose-blockquote:quotes-none prose-hr:hidden">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            pre({ children }) {
              const child = React.Children.toArray(children)[0];
              const props = React.isValidElement(child)
                ? (child.props as { className?: string; children?: React.ReactNode })
                : {};
              return <CodeBlock className={props.className}>{props.children}</CodeBlock>;
            },
            code({ className, children }) {
              return (
                <code
                  className={cn(
                    "rounded-md bg-foreground/[0.06] px-[0.35em] py-[0.1em] font-mono text-[0.875em] font-normal text-foreground dark:bg-white/[0.09]",
                    className
                  )}
                >
                  {children}
                </code>
              );
            },
            h2({ children }) {
              return renderHeading(2, children);
            },
            h3({ children }) {
              return renderHeading(3, children);
            },
            p({ node, children }) {
              const images = imageOnlyChildren(node?.children);
              if (images) {
                if (images.length === 1) {
                  return (
                    <div className="not-prose my-8">
                      <Figure {...imageProps(images[0])} />
                    </div>
                  );
                }
                return (
                  <div className="not-prose my-8 grid gap-6 sm:grid-cols-2">
                    {images.map((img, i) => (
                      <Figure key={i} {...imageProps(img)} />
                    ))}
                  </div>
                );
              }
              return <p>{children}</p>;
            },
            // Images inline with text or inside table cells; spans keep the markup valid inside <p>.
            img({ src, alt, title }) {
              const source = typeof src === "string" ? src : "";
              return (
                <span className="not-prose my-2 block">
                  <ThemedImage src={source} alt={alt ?? ""} className={imageClass} />
                  {title && (
                    <span className="mt-2 block text-center text-[13px] text-muted-foreground">{title}</span>
                  )}
                </span>
              );
            },
            hr() {
              return null;
            },
            table({ children }) {
              return (
                <div className="not-prose my-8 overflow-x-auto rounded-xl border border-border/60">
                  <table className="w-full border-collapse text-left text-[14px] leading-[1.5]">{children}</table>
                </div>
              );
            },
            thead({ children }) {
              return <thead className="border-b border-border">{children}</thead>;
            },
            th({ children }) {
              return (
                <th className="px-4 py-3 align-top text-[13px] font-semibold text-muted-foreground">{children}</th>
              );
            },
            tr({ children }) {
              return <tr className="border-b border-border/60 last:border-b-0">{children}</tr>;
            },
            td({ children }) {
              return <td className="px-4 py-3 align-top tabular-nums text-foreground">{children}</td>;
            },
            blockquote({ children }) {
              const { type, cleanedChildren } = parseCallout(children);

              if (!type) {
                return (
                  <blockquote className="my-6 border-l border-border pl-4 not-italic text-muted-foreground [&_p]:text-muted-foreground">
                    {children}
                  </blockquote>
                );
              }

              const callout = CALLOUTS[type];
              return (
                <aside
                  role="note"
                  aria-label={callout.label}
                  className={cn("not-prose my-7 rounded-xl px-5 py-4 sm:px-6 sm:py-5", callout.bg)}
                >
                  <p
                    className={cn(
                      "mb-1 flex items-center gap-1.5 text-[15px] font-semibold tracking-[-0.01em]",
                      callout.labelColor
                    )}
                  >
                    {type === "caution" && <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />}
                    {callout.label}
                  </p>
                  <div className="text-[15px] leading-[1.6] text-foreground/85 sm:text-base [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_li]:ml-5 [&_ol]:list-decimal [&_p+p]:mt-2 [&_p:empty]:hidden [&_p]:m-0 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:mt-2 [&_ul]:list-disc">
                    {cleanedChildren}
                  </div>
                </aside>
              );
            },
          }}
        >
          {article.content}
        </ReactMarkdown>
      </div>

      {(prev || next) && (
        <nav aria-label="Previous and next articles" className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {prev && (
            <Link
              href={`/docs/${prev.category}/${prev.slug}/`}
              className={cn(
                "group flex flex-col rounded-2xl border border-border/60 px-5 py-4 transition-colors hover:border-border hover:bg-muted/50",
                focusRing
              )}
            >
              <span className="flex items-center gap-1 text-[13px] text-muted-foreground">
                <ChevronLeft className="size-3.5" aria-hidden="true" />
                Previous
              </span>
              <span className="mt-1 text-[15px] font-semibold leading-snug text-foreground sm:text-base">
                {prev.title}
              </span>
            </Link>
          )}

          {next && (
            <Link
              href={`/docs/${next.category}/${next.slug}/`}
              className={cn(
                "group flex flex-col items-end rounded-2xl border border-border/60 px-5 py-4 text-right transition-colors hover:border-border hover:bg-muted/50",
                focusRing,
                !prev && "sm:col-start-2"
              )}
            >
              <span className="flex items-center gap-1 text-[13px] text-muted-foreground">
                Next
                <ChevronRight className="size-3.5" aria-hidden="true" />
              </span>
              <span className="mt-1 text-[15px] font-semibold leading-snug text-foreground sm:text-base">
                {next.title}
              </span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
