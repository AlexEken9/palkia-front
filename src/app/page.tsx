"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Sparkles, Zap, Layers } from "lucide-react";
import { PalkiaSvg } from "@/components/shared/palkia-svg";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-palkia-400/20 blur-[100px] animate-glow" />
        <div className="absolute top-[40%] -left-[10%] h-[500px] w-[500px] rounded-full bg-space-500/20 blur-[100px] animate-glow" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-[10%] right-[20%] h-[400px] w-[400px] rounded-full bg-pearl-400/20 blur-[100px] animate-glow" style={{ animationDelay: "4s" }} />
      </div>

      <main className="flex-1">
        <section className="container relative z-10 flex flex-col items-center justify-center gap-6 py-24 text-center md:py-32 lg:py-40">
          
          <div className="animate-float mb-6 relative">
            <div className="absolute inset-0 bg-palkia-500 blur-2xl opacity-30 rounded-full scale-110"></div>
            <PalkiaSvg className="h-32 w-32 md:h-48 md:w-48 drop-shadow-2xl relative z-10" />
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl">
            <span className="block text-foreground">Control Space &</span>
            <span className="palkia-gradient-text">Knowledge</span>
          </h1>
          
          <p className="max-w-[42rem] leading-normal text-silver-600 sm:text-xl sm:leading-8 dark:text-silver-300">
            Ingest multimedia content from across the digital universe. Extract insights, patterns, and concepts with the power of Palkia.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/knowledge-bases">
              <Button size="lg" className="text-lg px-8 py-6 rounded-xl shadow-palkia-lg">
                Enter the Rift <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="https://github.com/code-yeongyu/palkia" target="_blank">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-xl border-2">
                View Source
              </Button>
            </Link>
          </div>
        </section>

        <section className="container pb-24">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-palkia-500" />}
              title="Media Ingestion"
              description="Seamlessly absorb content from YouTube and other dimensions. Supports playlists and channels."
            />
            <FeatureCard
              icon={<Brain className="h-8 w-8 text-space-500" />}
              title="Spatial Extraction"
              description="Identify entities, concepts, and mental models using advanced spatial intelligence algorithms."
            />
            <FeatureCard
              icon={<Layers className="h-8 w-8 text-pearl-500" />}
              title="Knowledge Graph"
              description="Visualize the connections between ideas. Build a structured repository of wisdom."
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass-card p-8 flex flex-col items-start gap-4 hover:scale-105 transition-transform duration-300 group">
      <div className="rounded-xl bg-white/50 p-3 shadow-sm ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10 group-hover:bg-palkia-50 dark:group-hover:bg-palkia-900/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-silver-500 dark:text-silver-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
