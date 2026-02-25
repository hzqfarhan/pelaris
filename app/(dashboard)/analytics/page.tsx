"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, Users, ArrowUpRight, Loader2, Sparkles, BrainCircuit } from "lucide-react";

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(false);
    const [insights, setInsights] = useState<string[]>([]);

    async function generateInsights() {
        setLoading(true);
        // Simulate deep analysis
        await new Promise(r => setTimeout(r, 2000));

        setInsights([
            "Your 'Hard Sell' captions are performing 40% better than 'Storytelling' posts this week. Double down on direct CTAs.",
            "TikTok is currently your highest-engagement channel. Focus on generating more scroll-stopping Hooks for that platform.",
            "Visual content with 'Minimalist' prompts is seeing higher save rates. Try using the Image Studio to create more clean product shots."
        ]);
        setLoading(false);
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-green-500" />
                        AI Analytics & Insights
                    </h1>
                    <p className="text-muted-foreground mt-2">Data-driven marketing recommendations powered by your generation history.</p>
                </div>
                <button
                    onClick={generateInsights}
                    disabled={loading}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
                    {loading ? "Analyzing..." : "Refresh Insights"}
                </button>
            </div>

            {/* Mock Charts */}
            <div className="grid md:grid-cols-3 gap-6">
                {[
                    { label: "Content Reach", value: "12,402", growth: "+12%", color: "text-blue-500" },
                    { label: "Engagement Rate", value: "4.8%", growth: "+0.5%", color: "text-green-500" },
                    { label: "Conversion Est.", value: "RM 2,150", growth: "+5%", color: "text-purple-500" },
                ].map((stat, i) => (
                    <div key={i} className="glass-card border border-border p-6 rounded-2xl">
                        <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                        <div className="flex items-end gap-3 mt-2">
                            <h3 className="text-3xl font-bold">{stat.value}</h3>
                            <span className={`text-xs font-bold ${stat.color} mb-1 flex items-center`}>
                                {stat.growth} <ArrowUpRight className="w-3 h-3" />
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 glass-card border border-border p-8 rounded-2xl min-h-[400px]">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        AI Marketing Strategy
                    </h3>

                    {insights.length > 0 ? (
                        <div className="space-y-6">
                            {insights.map((insight, idx) => (
                                <div key={idx} className="flex gap-4 p-4 bg-foreground/[0.03] rounded-xl border border-border/50">
                                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                                        {idx + 1}
                                    </div>
                                    <p className="text-sm leading-relaxed text-foreground/90">{insight}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center py-20 text-center text-muted-foreground space-y-4">
                            <BrainCircuit className="w-12 h-12 opacity-10" />
                            <p className="max-w-xs">Hit <span className="text-primary font-bold">Refresh Insights</span> to let AI analyze your content patterns and performance.</p>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2 glass-card border border-border p-8 rounded-2xl">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-pink-500" />
                        Platform Performance
                    </h3>
                    <div className="space-y-6 mt-8">
                        {[
                            { name: "TikTok", value: 78, color: "bg-pink-500" },
                            { name: "Instagram", value: 62, color: "bg-purple-500" },
                            { name: "Facebook", value: 45, color: "bg-blue-500" },
                            { name: "WhatsApp", value: 92, color: "bg-green-500" },
                        ].map((p, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                    <span>{p.name}</span>
                                    <span>{p.value}%</span>
                                </div>
                                <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${p.color} transition-all duration-1000`}
                                        style={{ width: `${p.value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-[10px] text-muted-foreground mt-12 italic text-center">
                        Analytics are estimated based on AI engagement predictions and recent generation history.
                    </p>
                </div>
            </div>
        </div>
    );
}
