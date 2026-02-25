"use client";

import { useState } from "react";
import { createHooksAction } from "@/app/actions";
import { Zap, Copy, Loader2, Sparkles, CheckCircle2 } from "lucide-react";

export default function HookGenerator() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any[]>([]);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [error, setError] = useState("");

    async function onSubmit(formData: FormData) {
        setLoading(true);
        setResult([]);
        setError("");

        const res = await createHooksAction(formData);
        if (res.success && res.hooks) {
            setResult(res.hooks);
        } else {
            setError(res.error || "Failed to generate hooks.");
        }
        setLoading(false);
    }

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <Zap className="w-8 h-8 text-pink-500" />
                    Hook Generator
                </h1>
                <p className="text-muted-foreground mt-2">Stop the scroll instantly. Get 5 different viral video hooks tailored to your topic.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className="glass-card rounded-2xl p-6 border border-border">
                    <form action={onSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Video Topic / Content Idea</label>
                            <textarea
                                name="topic"
                                required
                                rows={4}
                                placeholder="What is this video about? (e.g. 3 reasons why your skincare routine isn't working, or behind the scenes of packing orders)"
                                className="flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                            />
                        </div>

                        <div className="space-y-2 mt-2">
                            <label className="text-sm font-medium">Language</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="language" value="ms" defaultChecked className="accent-primary" />
                                    <span className="text-sm">Bahasa Melayu (Slang)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="language" value="en" className="accent-primary" />
                                    <span className="text-sm">English</span>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-pink-600 text-white font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-pink-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            {loading ? "Brainstorming Hooks..." : "Generate Hooks"}
                        </button>

                        {error && <p className="text-sm text-red-500 text-center mt-2">{error}</p>}
                    </form>
                </div>

                {/* Output Area */}
                <div className="glass-card rounded-2xl p-6 border border-border flex flex-col min-h-[400px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Generated Hooks</h3>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto pr-2 pb-2">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-3 py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
                                <p>Analyzing viral patterns...</p>
                            </div>
                        ) : result.length > 0 ? (
                            result.map((hook, idx) => (
                                <div key={idx} className="bg-background/50 border border-input rounded-xl p-4 mt-2 relative group hover:border-pink-500/50 transition-colors">
                                    <span className="absolute -top-3 left-4 bg-background px-2 text-xs font-semibold text-pink-500 border border-input rounded-full">
                                        {hook.category}
                                    </span>
                                    <p className="text-sm font-medium mt-1 pr-8 text-foreground/90">{hook.hookText}</p>
                                    <button
                                        onClick={() => copyToClipboard(hook.hookText, idx)}
                                        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {copiedIndex === idx ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground italic text-center py-12 border border-dashed border-border rounded-xl">
                                5 scroll-stopping hooks will appear here.<br />Give me a topic to start!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
