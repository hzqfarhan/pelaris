"use client";

import { useState } from "react";
import { createCalendarAction } from "@/app/actions";
import { Calendar, Copy, Loader2, Sparkles, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";

export default function ContentPlanner() {
    const [loading, setLoading] = useState(false);
    const [calendar, setCalendar] = useState<any[]>([]);
    const [error, setError] = useState("");

    async function onSubmit(formData: FormData) {
        setLoading(true);
        setCalendar([]);
        setError("");

        const res = await createCalendarAction(formData);
        if (res.success && res.calendar) {
            try {
                const parsed = JSON.parse(res.calendar);
                setCalendar(parsed);
            } catch (e) {
                setError("Failed to parse calendar data.");
            }
        } else {
            setError(res.error || "Failed to generate content calendar.");
        }
        setLoading(false);
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-orange-500" />
                    30-Day Content Planner
                </h1>
                <p className="text-muted-foreground mt-2">Generate a full month of localized marketing content tailored to your business niche and goals.</p>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-border shadow-sm">
                <form action={onSubmit} className="grid md:grid-cols-4 gap-6 items-end">
                    <div className="md:col-span-1 space-y-2">
                        <label className="text-sm font-medium">Business Niche</label>
                        <input
                            name="niche"
                            required
                            placeholder="e.g. Kedai Tomyam, Coffee Shop"
                            className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        />
                    </div>

                    <div className="md:col-span-1 space-y-2">
                        <label className="text-sm font-medium">Primary Goal</label>
                        <select
                            name="goal"
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            <option value="Increase Sales">Increase Sales 💰</option>
                            <option value="Brand Awareness">Brand Awareness 📢</option>
                            <option value="Customer Loyalty">Customer Loyalty ❤️</option>
                            <option value="Educational Content">Educational Content 💡</option>
                        </select>
                    </div>

                    <div className="md:col-span-1 space-y-2 pb-1">
                        <label className="text-sm font-medium block mb-2">Language</label>
                        <div className="flex gap-4 h-8 items-center">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="language" value="ms" defaultChecked className="accent-primary" />
                                <span className="text-sm">BM Slang</span>
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
                        className="w-full h-11 bg-orange-600 text-white font-medium rounded-lg flex items-center justify-center gap-2 hover:bg-orange-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                        {loading ? "Planning..." : "Generate 30-Day Plan"}
                    </button>
                </form>
                {error && <p className="text-sm text-red-500 text-center mt-4">{error}</p>}
            </div>

            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center text-muted-foreground space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
                    <div className="text-center">
                        <p className="font-semibold text-foreground">Strategizing your victory...</p>
                        <p className="text-sm">Creating 30 days of high-converting content ideas.</p>
                    </div>
                </div>
            ) : calendar.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {calendar.map((item, idx) => (
                        <div key={idx} className="glass-card border border-border rounded-xl p-4 flex flex-col gap-3 hover:border-orange-500/50 transition-colors bg-background/40">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Day {item.day}</span>
                                <span className="text-[10px] bg-foreground/10 px-1.5 py-0.5 rounded font-medium">{item.contentType}</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold leading-tight line-clamp-2 mb-1">{item.hook}</h4>
                                <p className="text-xs text-muted-foreground line-clamp-3">{item.captionIdea}</p>
                            </div>
                            <div className="mt-auto pt-2 border-t border-border flex items-center justify-between">
                                <span className="text-[10px] text-muted-foreground">{item.platform}</span>
                                <button className="text-[10px] text-primary hover:underline flex items-center gap-1">
                                    Details <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-64 flex flex-col items-center justify-center text-muted-foreground italic border border-dashed border-border rounded-2xl bg-foreground/[0.02]">
                    <Calendar className="w-12 h-12 mb-3 opacity-10" />
                    <p>Your strategic content calendar will appear here.</p>
                </div>
            )}
        </div>
    );
}
