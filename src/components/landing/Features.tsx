"use client";

import { motion } from "framer-motion";
import { Brain, Search, Youtube, Layers } from "lucide-react";

const features = [
    {
        icon: Youtube,
        title: "Media Intelligence",
        description: "Process hours of video content in minutes. Extract key moments, quotes, and insights automatically.",
        gradient: "from-red-500 to-palkia-500",
        iconColor: "text-red-400"
    },
    {
        icon: Brain,
        title: "Concept Extraction",
        description: "Identify core concepts and entities. Map relationships between ideas across your entire knowledge base.",
        gradient: "from-purple-500 to-palkia-500",
        iconColor: "text-purple-400"
    },
    {
        icon: Search,
        title: "Semantic Search",
        description: "Vector embeddings enable meaning-based search across all your extracted knowledge.",
        gradient: "from-space-500 to-cyan-500",
        iconColor: "text-cyan-400"
    },
    {
        icon: Layers,
        title: "Multi-Modal Support",
        description: "Upload videos, audio, PDFs, and text. Palkia unifies them into a single, queryable intelligence layer.",
        gradient: "from-amber-500 to-orange-500",
        iconColor: "text-amber-400"
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-palkia-500/5"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`} />

                            <div className="relative z-10">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-palkia-300 transition-colors">
                                    {feature.title}
                                </h3>

                                <p className="text-white/50 leading-relaxed text-sm">
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
