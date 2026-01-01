"use client";

import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { CTA } from "@/components/landing/CTA";
import { TimeComparison } from "@/components/landing/TimeComparison";

export default function LandingPage() {
  return (
    <main className="dark min-h-screen relative overflow-hidden bg-[#05040a]">
      <div className="noise-bg" />
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(59,102,245,0.1),transparent_70%)]" />
      </div>

      <div className="relative z-10">
        <Hero />

        <div className="relative h-px w-full max-w-4xl mx-auto bg-gradient-to-r from-transparent via-white/5 to-transparent my-12" />

        <TimeComparison />
        <Features />

        <div className="h-32 w-full bg-gradient-to-b from-transparent to-[#05040a]" />
        <CTA />

        <footer className="py-8 text-center text-white/20 text-sm border-t border-white/5">
          <p>© {new Date().getFullYear()} Palkia. Transform your knowledge workflow.</p>
        </footer>
      </div>

    </main>
  );
}
