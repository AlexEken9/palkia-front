"use client";

import { Navbar, Sidebar } from "@/components/shared";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      <main className="lg:pl-64 pt-16">
        {children}
      </main>
    </div>
  );
}
