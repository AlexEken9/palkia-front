"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui";
import { useUIStore } from "@/lib/stores";
import { siteConfig } from "@/config/site";
import { PalkiaSvg } from "./palkia-svg";

export function Navbar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-silver-200 bg-white/80 backdrop-blur-md dark:border-silver-800 dark:bg-silver-950/80">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex items-center gap-2">
            <PalkiaSvg size={36} className="drop-shadow-md" />
            <span className="palkia-gradient-text text-xl font-bold tracking-tight">
              {siteConfig.name}
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
