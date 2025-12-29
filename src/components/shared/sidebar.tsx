"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  FileText,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { useUIStore } from "@/lib/stores";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Knowledge Bases",
    href: "/knowledge-bases",
    icon: Database,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
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
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-silver-200 bg-white pt-16 transition-transform duration-300 dark:border-silver-800 dark:bg-silver-950 lg:translate-x-0",
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
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-palkia-100 text-palkia-700 dark:bg-palkia-900/30 dark:text-palkia-400"
                  : "text-silver-600 hover:bg-silver-100 hover:text-silver-900 dark:text-silver-400 dark:hover:bg-silver-800 dark:hover:text-silver-100"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-palkia-600 dark:text-palkia-400" : ""
                )}
              />
              {item.title}
            </Link>
          );
        })}
      </div>

      <div className="border-t border-silver-200 p-4 dark:border-silver-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="w-full justify-start gap-2 lg:hidden"
        >
          <ChevronLeft className="h-4 w-4" />
          Collapse
        </Button>
      </div>
    </aside>
  );
}
