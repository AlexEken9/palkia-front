"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

const springTransition = {
    type: "spring",
    stiffness: 100,
    damping: 20,
} as const;

export function CTA() {
    return (
        <section className="relative py-32 px-4 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[800px] h-[800px] bg-gradient-to-r from-palkia-900/10 via-purple-900/10 to-space-900/10 rounded-full blur-[100px] animate-pulse-slow" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                <motion.h2
                    initial="hidden"
                    whileInView="visible"
                    variants={{
                        hidden: { opacity: 0, scale: 0.9 },
                        visible: { opacity: 1, scale: 1, transition: { ...springTransition } }
                    }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight opacity-0"
                >
                    Ready to break the <br />
                    <span className="text-gradient-iridescent">knowledge barrier?</span>
                </motion.h2>

                <motion.p
                    initial="hidden"
                    whileInView="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { ...springTransition, delay: 0.1 } }
                    }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto opacity-0"
                >
                    Join thousands of researchers, students, and professionals who are extracting insights 10x faster.
                </motion.p>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { ...springTransition, delay: 0.2 } }
                    }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="opacity-0"
                >
                    <Link href="/knowledge-bases">
                        <Button
                            size="lg"
                            className="group relative h-16 px-10 rounded-full bg-white text-black font-bold text-xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all duration-500"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-palkia-200/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <span className="relative flex items-center gap-2">
                                <Zap className="h-6 w-6" />
                                Start Now
                                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
