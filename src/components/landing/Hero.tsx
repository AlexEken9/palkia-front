"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const PALKIA_GIF = "https://oyster.ignimgs.com/mediawiki/apis.ign.com/pokemon-black-and-white/5/50/Pokemans_484.gif?width=325&dpr=2";
const PALKIA_CRY = "https://play.pokemonshowdown.com/audio/cries/palkia.mp3";

const GRID_PATTERN = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.2)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`;

export function Hero() {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    const cryAudioRef = useRef<HTMLAudioElement | null>(null);

    const playPalkiaCry = () => {
        if (!cryAudioRef.current) {
            cryAudioRef.current = new Audio(PALKIA_CRY);
            cryAudioRef.current.volume = 0.4;
        }
        cryAudioRef.current.currentTime = 0;
        cryAudioRef.current.play().catch(() => {});
    };

    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-4 pt-20">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-palkia-900/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-space-900/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow delay-1000" />
            </div>

            <motion.div
                style={{ y, opacity }}
                className="relative z-10 text-center max-w-5xl mx-auto space-y-8 flex flex-col items-center"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="mb-6 relative group cursor-pointer"
                    onClick={playPalkiaCry}
                >
                    <div className="absolute inset-0 bg-palkia-500/20 blur-[60px] rounded-full opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                    <div className="relative z-10 p-4 transition-transform duration-300 group-hover:scale-110">
                        <Image
                            src={PALKIA_GIF}
                            alt="Palkia"
                            width={160}
                            height={160}
                            className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-[0_0_15px_rgba(242,29,120,0.5)]"
                            unoptimized
                        />
                    </div>
                    <span className="sr-only">Click to play Palkia cry</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/5 text-palkia-300 text-sm font-medium"
                >
                    <Sparkles className="w-4 h-4 text-palkia-400" />
                    <span>Next Generation Knowledge Extraction</span>
                </motion.div>

                <motion.h1
                    className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9]"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                    <span className="block sm:inline text-white">SPACIAL</span>
                    <span className="block sm:inline text-gradient-iridescent sm:ml-4">REND</span>
                </motion.h1>

                <motion.p
                    className="text-lg md:text-2xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    Bend time and space to extract intelligence from any content.
                    <br className="hidden md:block" />
                    The ultimate knowledge engine for the modern age.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center pt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    <Link href="/app/knowledge-bases">
                        <Button
                            size="lg"
                            className="group relative h-16 px-10 rounded-full bg-white text-black font-bold text-lg overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all duration-500"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-palkia-200/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <span className="relative flex items-center gap-2">
                                <Zap className="h-5 w-5" />
                                Launch App
                            </span>
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>

            <div 
                className="absolute inset-0 z-0 opacity-[0.15]"
                style={{ backgroundImage: GRID_PATTERN }}
            />
        </section>
    );
}
