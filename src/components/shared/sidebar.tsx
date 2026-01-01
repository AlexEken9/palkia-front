"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Database,
  Settings,
  ChevronLeft,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { useUIStore } from "@/lib/stores";

const navItems = [
  {
    title: "Knowledge Bases",
    href: "/knowledge-bases",
    icon: Database,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card/70 backdrop-blur-xl pt-16 transition-transform duration-300 lg:translate-x-0 shadow-lg shadow-palkia-500/5",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300",
                isActive
                  ? "bg-palkia-50 text-palkia-700 shadow-sm shadow-palkia-200 dark:bg-palkia-900/20 dark:text-palkia-300 dark:shadow-none ring-1 ring-palkia-200 dark:ring-palkia-800"
                  : "text-muted-foreground hover:bg-muted hover:text-palkia-600 hover:translate-x-1"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  isActive ? "text-palkia-500 scale-110" : "group-hover:scale-110"
                )}
              />
              {item.title}
            </Link>
          );
        })}
      </div>

      <div className="border-t border-border p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="w-full justify-start gap-2 lg:hidden text-muted-foreground hover:text-palkia-600"
        >
          <ChevronLeft className="h-4 w-4" />
          Collapse
        </Button>
      </div>
    </aside>
  );
}
