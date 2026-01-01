"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";

function AnimatedNumber({ end, suffix = "" }: { end: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            const duration = 2000;
            const startTime = Date.now();

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // Cubic ease out

                setCount(Math.floor(eased * end));

                if (progress < 1) requestAnimationFrame(animate);
            };

            animate();
        }
    }, [isInView, end]);

    return <span ref={ref}>{count}{suffix}</span>;
}

interface ComparisonCardProps {
    title: string;
    time: string;
    description: string;
    isOld?: boolean;
}

function ComparisonCard({ title, time, description, isOld = false }: ComparisonCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`
                relative p-8 rounded-2xl border transition-all duration-500
                ${isOld
                    ? "bg-white/5 border-white/5"
                    : "bg-gradient-to-br from-palkia-900/20 to-space-900/20 border-palkia-500/30 shadow-[0_0_30px_rgba(242,29,120,0.1)]"
                }
            `}
        >
            <div className={`text-xs font-bold uppercase tracking-wider mb-4 ${isOld ? "text-gray-500" : "text-palkia-400"}`}>
                {title}
            </div>

            <div className={`text-5xl font-black mb-4 ${isOld ? "text-gray-600 line-through decoration-red-500/30" : "text-white"}`}>
                {time}
            </div>

            <p className="text-gray-400 leading-relaxed text-sm">
                {description}
            </p>
        </motion.div>
    )
}

export function TimeComparison() {
    return (
        <section className="relative py-24 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-palkia-500/10 border border-palkia-500/20 text-palkia-400 text-xs font-medium mb-4"
                    >
                        <Clock className="w-3 h-3" />
                        <span>Time Distortion</span>
                    </motion.div>

                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Palkia is exerting its <span className="text-palkia-500">pressure</span>
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Warp the dimension of time required to extract knowledge.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
                    <ComparisonCard
                        title="Traditional Way"
                        time="4h+"
                        description="Watching videos at 1x speed, pausing to take notes, rewinding, manually synthesizing."
                        isOld
                    />
                    <ComparisonCard
                        title="With Palkia"
                        time="5m"
                        description="Instant AI transcription, automated concept extraction, and semantic search queries."
                    />
                </div>

                {/* The Animated Stat Centerpiece */}
                <div className="relative flex justify-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        className="relative z-10 glass-panel px-10 py-6 rounded-full border border-palkia-500/30 flex items-center gap-4 shadow-[0_0_50px_rgba(242,29,120,0.15)]"
                    >
                        <div className="text-4xl md:text-6xl font-black text-gradient-iridescent">
                            <AnimatedNumber end={48} suffix="x" />
                        </div>
                        <div className="text-left">
                            <div className="text-white font-bold text-lg leading-none">Faster</div>
                            <div className="text-white/40 text-sm">Knowledge Extraction</div>
                        </div>
                    </motion.div>
                </div>

            </div>
        </section>
    );
}
