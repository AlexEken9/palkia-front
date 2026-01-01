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
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/60 backdrop-blur-xl dark:border-white/10 dark:bg-black/40 supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden text-silver-500 hover:text-palkia-500"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-palkia-400 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
              <img 
                src="https://oyster.ignimgs.com/mediawiki/apis.ign.com/pokemon-black-and-white/5/50/Pokemans_484.gif?width=325&dpr=2" 
                alt="Palkia Logo" 
                width={42} 
                height={42} 
                className="drop-shadow-md object-contain -my-2 relative z-10 transition-transform group-hover:scale-110 duration-300"
              />
            </div>
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
              className="rounded-full hover:bg-palkia-50 dark:hover:bg-palkia-900/30 text-silver-500 dark:text-silver-400 hover:text-palkia-500 dark:hover:text-palkia-300 transition-colors"
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
