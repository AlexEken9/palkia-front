"use client";

import { motion } from "framer-motion";
import { Brain, Search, Youtube, FileText, Layers } from "lucide-react";
import { useState } from "react";

const features = [
    {
        icon: Youtube,
        title: "Video Intelligence",
        description: "Process hours of video content in minutes. Extract key moments, quotes, and summaries automatically."
    },
    {
        icon: Brain,
        title: "Concept Extraction",
        description: "Identify core concepts and entities. Map relationships between ideas across your entire knowledge base."
    },
    {
        icon: Search,
        title: "Semantic Search",
        description: "Stop keyword hunting. Ask natural language questions and get answers cited directly from your content."
    },
    {
        icon: FileText,
        title: "Auto-Summarization",
        description: "Get concise, accurate summaries of complex technical documents, lectures, and meetings instantly."
    },
    {
        icon: Layers,
        title: "Multi-Modal Support",
        description: "Upload videos, audio, PDFs, and text. Palkia unifies them into a single, queryable intelligence layer."
    }
];

export function Features() {

    return (
        <section className="relative py-24 px-4 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Beyond simple transcription
                    </h2>
                    <p className="text-white/40 max-w-2xl mx-auto text-lg">
                        Palkia doesn't just read your content. It understands it, connects it, and makes it usable.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-palkia-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10">
                                    <feature.icon className="w-6 h-6 text-palkia-400" />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-palkia-300 transition-colors">
                                    {feature.title}
                                </h3>

                                <p className="text-white/40 leading-relaxed text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
