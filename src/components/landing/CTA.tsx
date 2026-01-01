"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export function CTA() {
    return (
        <section className="relative py-32 px-4 overflow-hidden">
            {/* Portal Effect Background - Subtle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[800px] h-[800px] bg-gradient-to-r from-palkia-900/10 via-purple-900/10 to-space-900/10 rounded-full blur-[100px] animate-pulse-slow" />
                {/* Removed the black hole shadow for cleaner look */}
            </div>

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
                >
                    Ready to break the <br />
                    <span className="text-gradient-iridescent">knowledge barrier?</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
                >
                    Join thousands of researchers, students, and professionals who are extracting insights 10x faster.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Link href="/knowledge-bases">
                        <Button
                            size="lg"
                            className="group h-16 px-10 rounded-full bg-white text-black hover:bg-palkia-50 font-bold text-xl shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] transition-all duration-300"
                        >
                            <Zap className="mr-2 h-6 w-6 group-hover:fill-current" />
                            Start Now
                            <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
