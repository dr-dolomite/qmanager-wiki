"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

/** A round icon button that copies `value` and confirms for two seconds. */
export default function CopyButton({ value, label }: { value: string; label: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copied = status === "copied";

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const handleCopy = async () => {
    let next: "copied" | "failed" = "copied";
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard can be blocked by the browser; say so instead of failing silently.
      next = "failed";
    }
    setStatus(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), next === "copied" ? 2000 : 4000);
  };

  const message =
    status === "copied" ? "Copied to clipboard" : status === "failed" ? "Couldn't copy. Select the address instead." : "";

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label}
      title={message || label}
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-border-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {copied ? (
        <Check className="size-4 text-success" aria-hidden="true" />
      ) : (
        <Copy className="size-4" aria-hidden="true" />
      )}
      <span className="sr-only" aria-live="polite">
        {message}
      </span>
    </button>
  );
}
