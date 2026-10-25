"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<"light" | "dark">("dark");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // The inline script in app/layout.tsx has already applied the right class.
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    const root = document.documentElement;
    root.classList.toggle("dark", nextTheme === "dark");
    root.style.colorScheme = nextTheme;
    try {
      localStorage.setItem("theme", nextTheme);
    } catch {
      // Storage unavailable (private mode); the choice lasts for this page only.
    }
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full text-muted-foreground hover:text-foreground"
        aria-label="Toggle theme"
      >
        <span className="size-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full text-muted-foreground hover:text-foreground"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  );
}
