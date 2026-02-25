"use client";

import { useState } from "react";
import { createImageAction } from "@/app/actions";
import { ImageIcon, Copy, Loader2, Sparkles, Download, ExternalLink } from "lucide-react";

export default function ImageStudio() {
    const [loading, setLoading] = useState(false);
    const [resultUrl, setResultUrl] = useState("");
    const [error, setError] = useState("");

    async function onSubmit(formData: FormData) {
        setLoading(true);
        setResultUrl("");
        setError("");

        const res = await createImageAction(formData);
        if (res.success && res.imageUrl) {
            setResultUrl(res.imageUrl);
        } else {
            setError(res.error || "Failed to generate image.");
        }
        setLoading(false);
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <ImageIcon className="w-8 h-8 text-blue-500" />
                    Image Studio
                </h1>
                <p className="text-muted-foreground mt-2">Generate high-quality marketing visuals using DALL-E 3. Perfect for ads and social media.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className="glass-card rounded-2xl p-6 border border-border">
                    <form action={onSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Image Description / Prompt</label>
                            <textarea
                                name="prompt"
                                required
                                rows={6}
                                placeholder="Describe the image you want. Be specific! (e.g. A high-end minimalist skincare bottle on a marble surface with soft morning sunlight, professional photography style, 4k)"
                                className="flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-blue-600 text-white font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            {loading ? "Generating Image..." : "Generate Image"}
                        </button>

                        <p className="text-xs text-muted-foreground text-center">
                            Note: Image generation may take up to 20 seconds.
                        </p>

                        {error && <p className="text-sm text-red-500 text-center mt-2">{error}</p>}
                    </form>
                </div>

                {/* Output Area */}
                <div className="glass-card rounded-2xl p-6 border border-border flex flex-col min-h-[400px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Generated Visual</h3>
                        {resultUrl && (
                            <div className="flex gap-2">
                                <a
                                    href={resultUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 hover:bg-foreground/5 rounded-full transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 bg-background/50 rounded-xl border border-input overflow-hidden relative group">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-3 py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                <p>AI is painting your vision...</p>
                            </div>
                        ) : resultUrl ? (
                            <img
                                src={resultUrl}
                                alt="AI Generated"
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground italic text-center py-12 px-6">
                                <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
                                <p>Your masterpiece will appear here.<br />Describe what you want to see!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
