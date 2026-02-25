"use client";

import { useState } from "react";
import { createSalesScriptAction } from "@/app/actions";
import { MessageSquare, Copy, Loader2, Sparkles, CheckCircle2 } from "lucide-react";

export default function SalesScripts() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    async function onSubmit(formData: FormData) {
        setLoading(true);
        setResult("");
        setError("");

        const res = await createSalesScriptAction(formData);
        if (res.success && res.script) {
            setResult(res.script);
        } else {
            setError(res.error || "Failed to generate script.");
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
                    <MessageSquare className="w-8 h-8 text-indigo-500" />
                    Sales Scripts
                </h1>
                <p className="text-muted-foreground mt-2">Close more deals on WhatsApp. Generate empathetic and persuasive responses to handle tough customer objections.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className="glass-card rounded-2xl p-6 border border-border">
                    <form action={onSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Customer Objection / Question</label>
                            <textarea
                                name="objection"
                                required
                                rows={5}
                                placeholder="What did the customer say? (e.g. 'Harga mahal sangat lah, boleh kurang lagi tak?' or 'I need to ask my husband first')"
                                className="flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
                            />
                        </div>

                        <div className="space-y-2 mt-2">
                            <label className="text-sm font-medium">Response Language</label>
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
                            className="w-full h-11 bg-indigo-600 text-white font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                            {loading ? "Generating Response..." : "Generate Script"}
                        </button>

                        {error && <p className="text-sm text-red-500 text-center mt-2">{error}</p>}
                    </form>
                </div>

                {/* Output Area */}
                <div className="glass-card rounded-2xl p-6 border border-border flex flex-col min-h-[400px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Suggested WhatsApp Script</h3>
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
                                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                                <p>Finding the perfect words...</p>
                            </div>
                        ) : result ? (
                            result
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground italic text-center">
                                Your sales script will appear here.<br />Paste the customer's objection to start!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
