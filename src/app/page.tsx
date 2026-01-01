"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Brain, 
  Sparkles, 
  Zap, 
  Layers, 
  ChevronDown,
  Youtube,
  FileText,
  Search,
  Network,
} from "lucide-react";

const PALKIA_GIF = "https://oyster.ignimgs.com/mediawiki/apis.ign.com/pokemon-black-and-white/5/50/Pokemans_484.gif?width=325&dpr=2";
const PALKIA_CRY = "https://play.pokemonshowdown.com/audio/cries/palkia.mp3";

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    hue: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particleCount = 100;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      hue: Math.random() * 60 + 300,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, i) => {
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 200) {
          const force = (200 - dist) / 200 * 0.02;
          particle.vx += dx * force * 0.01;
          particle.vy += dy * force * 0.01;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        particle.vx *= 0.99;
        particle.vy *= 0.99;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 80%, 70%, ${particle.opacity})`;
        ctx.fill();

        particlesRef.current.slice(i + 1).forEach((other) => {
          const dx2 = particle.x - other.x;
          const dy2 = particle.y - other.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          
          if (dist2 < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `hsla(320, 70%, 60%, ${0.15 * (1 - dist2 / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}

function AnimatedNumber({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          animate();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function GlowingOrb({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <div 
      className={`absolute rounded-full blur-3xl animate-pulse-slow ${className}`}
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [stars, setStars] = useState<Array<{id: number; width: number; top: number; left: number; delay: number; duration: number}>>([]);
  const cryAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsLoaded(true);
    cryAudioRef.current = new Audio(PALKIA_CRY);
    cryAudioRef.current.volume = 0.4;
    
    setStars(Array.from({ length: 80 }, (_, i) => ({
      id: i,
      width: Math.random() * 3 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
    })));
  }, []);

  const playPalkiaCry = () => {
    if (cryAudioRef.current) {
      cryAudioRef.current.currentTime = 0;
      cryAudioRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#030108]">
      <ParticleField />
      
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(226,77,138,0.12)_0%,_transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(91,82,252,0.08)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(168,85,247,0.06)_0%,_transparent_50%)]" />
        
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              width: star.width + "px",
              height: star.width + "px",
              top: star.top + "%",
              left: star.left + "%",
              animationDelay: star.delay + "s",
              animationDuration: star.duration + "s",
            }}
          />
        ))}

        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(226,77,138,0.5)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <section className="relative min-h-screen flex flex-col items-center justify-center px-4">
        <GlowingOrb className="w-[500px] h-[500px] bg-palkia-500/20 top-1/4 left-1/4 -translate-x-1/2" delay={0} />
        <GlowingOrb className="w-[400px] h-[400px] bg-space-500/15 bottom-1/4 right-1/4 translate-x-1/2" delay={1.5} />
        <GlowingOrb className="w-[300px] h-[300px] bg-purple-500/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" delay={3} />

        <div className={`relative z-10 text-center max-w-5xl mx-auto transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="relative mb-8 inline-block group cursor-pointer" onClick={playPalkiaCry}>
            <div className="absolute inset-0 bg-palkia-500 blur-[80px] opacity-25 animate-pulse-slow scale-[2] group-hover:opacity-50 group-hover:scale-[2.5] transition-all duration-500" />
            <div className="absolute inset-0 bg-space-500 blur-[60px] opacity-10 animate-pulse-slow scale-150 group-hover:opacity-30 group-hover:scale-[2] transition-all duration-500" style={{ animationDelay: "1.5s" }} />
            
            <div className="relative animate-float group-hover:animate-none group-hover:scale-110 transition-transform duration-300">
              <div className="absolute -inset-6 bg-gradient-to-r from-palkia-500 via-purple-500 to-space-500 rounded-full opacity-10 blur-2xl animate-spin-slow group-hover:opacity-40 group-hover:-inset-10 transition-all duration-500" />
              <img 
                src={PALKIA_GIF}
                alt="Palkia" 
                className="h-36 w-36 md:h-48 md:w-48 drop-shadow-[0_0_30px_rgba(226,77,138,0.5)] relative z-10 object-contain group-hover:drop-shadow-[0_0_60px_rgba(226,77,138,0.8)] transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-palkia-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full blur-xl" />
            </div>
          </div>

          <div className="mb-4">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight animate-slide-up leading-none">
              <span className="text-white">SPACIAL </span>
              <span className="bg-gradient-to-r from-palkia-400 via-purple-400 to-space-400 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]">
                REND
              </span>
            </h1>
          </div>

          <div className="mb-8">
            <p className="text-base md:text-xl text-silver-400 max-w-2xl mx-auto leading-relaxed animate-slide-up font-light" style={{ animationDelay: "0.15s" }}>
              Extract intelligence from hours of content in seconds.
              <br className="hidden sm:block" />
              Concepts, entities, knowledge — instantly.
            </p>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link href="/knowledge-bases">
              <Button 
                size="lg" 
                className="group relative text-base px-8 py-6 rounded-xl bg-gradient-to-r from-palkia-500 to-palkia-600 hover:from-palkia-400 hover:to-palkia-500 shadow-[0_0_40px_rgba(226,77,138,0.35)] hover:shadow-[0_0_60px_rgba(226,77,138,0.5)] transition-all duration-500 overflow-hidden border border-palkia-400/20"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Launch App
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-silver-600" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030108] to-transparent pointer-events-none" />
      </section>

      <section className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-palkia-500/[0.02] to-transparent" />
        
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-palkia-500/10 border border-palkia-500/20 text-palkia-400 text-xs mb-4">
              <Zap className="h-3 w-3" />
              Performance
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              <span className="text-palkia-400">Palkia</span> is exerting its pressure!
            </h2>
            <p className="text-base text-silver-400 max-w-xl mx-auto">
              Warp the dimension of time required to extract knowledge from any content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <TimeComparisonCard 
              title="Traditional approach"
              time="4+ hours"
              description="Watch videos, pause, take notes, organize manually, cross-reference"
              isOld
            />
            <TimeComparisonCard 
              title="With Palkia"
              time="~5 min"
              description="Automatic ingestion, AI transcription, intelligent extraction, semantic search"
            />
          </div>
          
          <div className="relative flex items-center justify-center py-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-palkia-500/30 to-transparent" />
            </div>
            <div className="relative bg-[#030108] px-8 py-4 rounded-full border border-palkia-500/25 shadow-[0_0_30px_rgba(226,77,138,0.1)]">
              <span className="text-3xl md:text-4xl font-black bg-gradient-to-r from-palkia-400 via-purple-400 to-space-400 bg-clip-text text-transparent">
                <AnimatedNumber end={48} suffix="x" /> faster
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-space-500/10 border border-space-500/20 text-space-400 text-xs mb-4">
              <Layers className="h-3 w-3" />
              Core Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              <span className="text-space-400">Complete</span> Pipeline
            </h2>
            <p className="text-base text-silver-400 max-w-xl mx-auto">
              From raw media to structured intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <FeatureCard
              icon={<Youtube className="h-7 w-7" />}
              title="Media Ingestion"
              description="YouTube videos, entire channels, or playlists. Drop a URL and let Palkia handle the rest."
              gradient="from-red-500 to-palkia-500"
            />
            <FeatureCard
              icon={<FileText className="h-7 w-7" />}
              title="AI Transcription"
              description="Whisper-powered transcription with speaker detection and timestamp mapping."
              gradient="from-palkia-500 to-purple-500"
            />
            <FeatureCard
              icon={<Brain className="h-7 w-7" />}
              title="Concept Extraction"
              description="Gemini identifies concepts, entities, methodologies, and frameworks automatically."
              gradient="from-purple-500 to-space-500"
            />
            <FeatureCard
              icon={<Search className="h-7 w-7" />}
              title="Semantic Search"
              description="Vector embeddings enable meaning-based search across all your extracted knowledge."
              gradient="from-space-500 to-cyan-500"
            />
          </div>
        </div>
      </section>

      <section className="relative py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-space-500/[0.015] to-transparent" />
        
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs mb-4">
              <Network className="h-3 w-3" />
              Workflow
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              How It <span className="text-purple-400">Works</span>
            </h2>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/25 to-transparent hidden lg:block" />
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <StepCard 
                number={1}
                title="Add Source"
                description="Paste a YouTube URL, channel, or playlist"
              />
              <StepCard 
                number={2}
                title="Transcribe"
                description="AI extracts audio and generates transcription"
              />
              <StepCard 
                number={3}
                title="Extract"
                description="LLM identifies concepts and entities"
              />
              <StepCard 
                number={4}
                title="Search"
                description="Query your knowledge base semantically"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 px-4 overflow-hidden">
        <GlowingOrb className="w-[500px] h-[500px] bg-palkia-500/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-palkia-500/10 border border-palkia-500/20 text-palkia-400 text-xs mb-6">
            <Sparkles className="h-3 w-3" />
            Ready to transform your workflow
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Bend space and time
            <br />
            <span className="bg-gradient-to-r from-palkia-400 via-purple-400 to-space-400 bg-clip-text text-transparent">
              to your will
            </span>
          </h2>
          
          <p className="text-lg text-silver-400 max-w-xl mx-auto mb-8">
            Stop wasting hours watching and re-watching content.
            Extract the knowledge you need in minutes.
          </p>

          <Link href="/knowledge-bases">
            <Button 
              size="lg" 
              className="group relative text-lg px-10 py-7 rounded-2xl bg-gradient-to-r from-palkia-500 via-purple-500 to-space-500 hover:from-palkia-400 hover:via-purple-400 hover:to-space-400 shadow-[0_0_50px_rgba(226,77,138,0.25)] hover:shadow-[0_0_70px_rgba(226,77,138,0.4)] transition-all duration-500"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 animate-shimmer" />
              <span className="relative flex items-center gap-3">
                <Zap className="h-5 w-5" />
                Get Started
                <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Button>
          </Link>
        </div>
      </section>

      <footer className="relative py-8 px-4 border-t border-silver-800/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img 
              src={PALKIA_GIF}
              alt="Palkia" 
              className="h-8 w-8 object-contain"
            />
            <span className="text-silver-500 font-medium text-sm">Palkia</span>
          </div>
          <p className="text-silver-700 text-xs">
            Dimensional knowledge extraction
          </p>
        </div>
      </footer>
    </div>
  );
}

function TimeComparisonCard({ 
  title, 
  time, 
  description, 
  isOld = false 
}: { 
  title: string; 
  time: string; 
  description: string; 
  isOld?: boolean;
}) {
  return (
    <div className={`
      relative p-6 rounded-2xl border transition-all duration-500 group
      ${isOld 
        ? "bg-silver-900/10 border-silver-800/25 hover:border-silver-700/40" 
        : "bg-gradient-to-br from-palkia-500/10 via-purple-500/5 to-space-500/10 border-palkia-500/25 hover:border-palkia-500/40 hover:shadow-[0_0_40px_rgba(226,77,138,0.1)]"
      }
    `}>
      {!isOld && (
        <div className="absolute -top-2.5 -right-2.5">
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-palkia-500 to-space-500 text-white text-[10px] font-bold shadow-lg">
            RECOMMENDED
          </div>
        </div>
      )}
      
      <div className="mb-2">
        <span className={`text-xs font-medium uppercase tracking-wider ${isOld ? "text-silver-500" : "text-palkia-400"}`}>
          {title}
        </span>
      </div>
      
      <div className="mb-3">
        <span className={`
          text-4xl md:text-5xl font-black
          ${isOld 
            ? "text-silver-700 line-through decoration-red-500/50 decoration-[3px]" 
            : "bg-gradient-to-r from-palkia-400 to-space-400 bg-clip-text text-transparent"
          }
        `}>
          {time}
        </span>
      </div>
      
      <p className={`text-sm leading-relaxed ${isOld ? "text-silver-600" : "text-silver-300"}`}>
        {description}
      </p>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  gradient 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  gradient: string;
}) {
  return (
    <div className="group relative p-5 rounded-xl bg-silver-900/15 border border-silver-800/25 hover:border-palkia-500/25 transition-all duration-500 hover:transform hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.25)]">
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-palkia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className={`
        relative inline-flex p-2.5 rounded-lg mb-4
        bg-gradient-to-br ${gradient}
      `}>
        <div className="text-white">
          {icon}
        </div>
      </div>
      
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-palkia-400 transition-colors">
        {title}
      </h3>
      
      <p className="text-silver-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function StepCard({ 
  number, 
  title, 
  description 
}: { 
  number: number; 
  title: string; 
  description: string;
}) {
  return (
    <div className="relative text-center group">
      <div className="relative mx-auto mb-4 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/15 to-space-500/15 border border-purple-500/25 flex items-center justify-center group-hover:scale-110 group-hover:border-purple-400/40 transition-all duration-300">
        <span className="text-xl font-bold text-purple-400">{number}</span>
        <div className="absolute inset-0 rounded-full bg-purple-500/15 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <h3 className="text-base font-bold text-white mb-1">{title}</h3>
      <p className="text-silver-400 text-sm">{description}</p>
    </div>
  );
}
