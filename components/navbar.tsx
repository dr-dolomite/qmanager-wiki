"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Menu, X, ExternalLink } from "lucide-react";
import SearchModal from "@/components/search-modal";
import GithubIcon from "@/components/github-icon";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    const handleCustomOpen = () => setSearchOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-qmanager-search", handleCustomOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-qmanager-search", handleCustomOpen);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="flex h-14 w-full items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="group flex items-center gap-2.5 transition-opacity hover:opacity-90">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card p-1 transition-colors group-hover:border-primary">
                <Image
                  src="/qmanager-mark.svg"
                  alt="QManager Mark"
                  width={20}
                  height={20}
                  className="h-full w-full object-contain"
                  priority
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold tracking-tight text-foreground text-sm sm:text-base">QManager</span>
                <span className="hidden rounded-full border border-border bg-muted/70 px-2 py-0.5 text-xs sm:inline-flex font-medium text-muted-foreground font-figure tabular-nums">
                  v0.1.35
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (GitBook Minimalist Style) */}
            <nav className="hidden items-center gap-0.5 lg:flex text-xs">
              <Link
                href="/docs/getting-started/introduction/"
                className="whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              >
                Docs
              </Link>
              <Link
                href="/#install"
                className="whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              >
                Install
              </Link>
              <Link
                href="/#features"
                className="whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              >
                Features
              </Link>
              <Link
                href="/#hardware"
                className="whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              >
                Hardware
              </Link>
              <Link
                href="/docs/developer/api-reference/"
                className="whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              >
                API Spec
              </Link>
              <Link
                href="/#support"
                className="whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              >
                Support
              </Link>
              <Link
                href="/#contact"
                className="whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Search Trigger & Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted/40 text-xs text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground sm:w-56 sm:justify-between sm:pl-3.5 sm:pr-2 lg:w-44 xl:w-60"
              aria-label="Search documentation"
            >
              <span className="flex items-center gap-2">
                <Search className="size-4 sm:size-3.5" />
                <span className="hidden sm:inline">Search docs...</span>
              </span>
              <kbd className="hidden rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline-block font-figure tabular-nums">
                ⌘K
              </kbd>
            </button>

            {/* Repositories Link */}
            <a
              href="https://github.com/dr-dolomite/QManager"
              target="_blank"
              rel="noreferrer"
              className="hidden h-9 items-center gap-1.5 rounded-full border border-border bg-background px-3.5 text-xs font-medium text-foreground transition-colors hover:bg-muted sm:inline-flex lg:hidden xl:inline-flex"
              title="GitHub Repository"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground hover:bg-muted lg:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div id="mobile-navigation-drawer" className="border-b border-border bg-background px-4 py-3 lg:hidden">
            <div className="flex flex-col gap-1 text-sm">
              <Link
                href="/docs/getting-started/introduction/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-full px-3.5 py-2 font-medium text-foreground hover:bg-muted"
              >
                <span>Documentation Hub</span>
              </Link>
              <Link
                href="/#install"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-full px-3.5 py-2 font-medium text-foreground hover:bg-muted"
              >
                <span>Quick Install</span>
              </Link>
              <Link
                href="/#features"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-full px-3.5 py-2 font-medium text-foreground hover:bg-muted"
              >
                <span>Feature Breakdown</span>
              </Link>
              <Link
                href="/#hardware"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-full px-3.5 py-2 font-medium text-foreground hover:bg-muted"
              >
                <span>Hardware Compatibility</span>
              </Link>
              <Link
                href="/docs/developer/api-reference/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-full px-3.5 py-2 font-medium text-foreground hover:bg-muted"
              >
                <span>API Reference Spec</span>
              </Link>

              <Link
                href="/#support"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-full px-3.5 py-2 font-medium text-foreground hover:bg-muted"
              >
                <span>Support the Project</span>
              </Link>
              <Link
                href="/#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-full px-3.5 py-2 font-medium text-foreground hover:bg-muted"
              >
                <span>Contact</span>
              </Link>

              <div className="my-2 border-t border-border pt-2">
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <a
                    href="https://github.com/dr-dolomite/QManager"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-full px-3.5 py-1.5 hover:bg-muted hover:text-foreground"
                  >
                    <span>QManager (RM551E)</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href="https://github.com/dr-dolomite/QManager-RM520N"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-full px-3.5 py-1.5 hover:bg-muted hover:text-foreground"
                  >
                    <span>QManager (RM520N & X5*/X6*)</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
