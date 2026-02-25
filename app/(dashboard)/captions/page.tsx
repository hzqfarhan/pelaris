"use client";

import { useState } from "react";
import { createCaptionAction } from "@/app/actions";
import { PenTool, Copy, Loader2, Sparkles, CheckCircle2 } from "lucide-react";

export default function CaptionsStudio() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    async function onSubmit(formData: FormData) {
        setLoading(true);
        setResult("");
        setError("");

        const res = await createCaptionAction(formData);
        if (res.success && res.caption) {
            setResult(res.caption);
        } else {
            setError(res.error || "Failed to generate caption.");
        }
        setLoading(false);
    }

    const copyToClipboard = () => {
        if (!result) return;
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <PenTool className="w-8 h-8 text-primary" />
                    Caption Generator
                </h1>
                <p className="text-muted-foreground mt-2">Write high-converting, localized social media captions in seconds.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className="glass-card rounded-2xl p-6 border border-border">
                    <form action={onSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Product / Service Name</label>
                            <input
                                name="productName"
                                required
                                placeholder="e.g. Sambal Nyet Khairulaming"
                                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Unique Selling Proposition (USP)</label>
                            <textarea
                                name="usp"
                                required
                                rows={3}
                                placeholder="What makes it special? (e.g. Extra spicy, suitable for all dishes, travel-friendly packaging)"
                                className="flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Platform</label>
                                <select
                                    name="platform"
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                >
                                    <option value="TikTok">TikTok</option>
                                    <option value="Instagram Reels">Instagram Reels</option>
                                    <option value="Facebook Post">Facebook Post</option>
                                    <option value="Twitter / X">Twitter / X</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tone of Voice</label>
                                <select
                                    name="tone"
                                    required
                                    className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                >
                                    <option value="Hard Sell">Hard Sell 🔥</option>
                                    <option value="Storytelling">Storytelling 📖</option>
                                    <option value="Educational">Educational 💡</option>
                                    <option value="Humorous / Funny">Funny 😂</option>
                                    <option value="Professional">Professional 👔</option>
                                </select>
                            </div>
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
                            className="w-full h-11 bg-primary text-primary-foreground font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            {loading ? "Generating..." : "Generate Caption"}
                        </button>

                        {error && <p className="text-sm text-red-500 text-center mt-2">{error}</p>}
                    </form>
                </div>

                {/* Output Area */}
                <div className="glass-card rounded-2xl p-6 border border-border flex flex-col min-h-[400px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Generated Caption</h3>
                        <button
                            onClick={copyToClipboard}
                            disabled={!result || loading}
                            className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors flex items-center gap-2 text-sm"
                        >
                            {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            {copied ? "Copied!" : "Copy text"}
                        </button>
                    </div>

                    <div className="flex-1 bg-background/50 rounded-xl border border-input p-4 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-3">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <p>Brewing some creative magic...</p>
                            </div>
                        ) : result ? (
                            result
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground italic text-center">
                                Your generated caption will appear here.<br />Fill in the details and hit generate!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
