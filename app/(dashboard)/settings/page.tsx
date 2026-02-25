"use client";

import { useState, useEffect } from "react";
import { updateSettingsAction } from "@/app/actions";
import { Settings, Save, Loader2, CheckCircle2, Building2, Target, Briefcase } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        async function loadProfile() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from("business_profile")
                    .select("*")
                    .eq("user_id", user.id)
                    .single();
                setProfile(data);
            }
        }
        loadProfile();
    }, []);

    async function onSubmit(formData: FormData) {
        setLoading(true);
        setSaved(false);
        setError("");

        const res = await updateSettingsAction(formData);
        if (res.success) {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } else {
            setError(res.error || "Failed to update settings.");
        }
        setLoading(false);
    }

    if (!profile) return (
        <div className="h-96 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <Settings className="w-8 h-8 text-slate-500" />
                    Settings
                </h1>
                <p className="text-muted-foreground mt-2">Manage your business profile and preferences.</p>
            </div>

            <div className="glass-card border border-border rounded-2xl p-8">
                <form action={onSubmit} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <Building2 className="w-4 h-4" /> Business Name
                            </label>
                            <input
                                name="businessName"
                                required
                                defaultValue={profile.business_name}
                                className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> Niche / Industry
                            </label>
                            <select
                                name="niche"
                                required
                                defaultValue={profile.niche}
                                className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                <option value="F&B">Food & Beverage (F&B)</option>
                                <option value="Fashion">Fashion & Apparel</option>
                                <option value="Beauty">Beauty & Personal Care</option>
                                <option value="Services">Professional Services</option>
                                <option value="Tech">Technology & Digital</option>
                                <option value="Retail">General Retail</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold flex items-center gap-2">
                            <Target className="w-4 h-4" /> Primary Marketing Goal
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { id: "sales", label: "Increase Sales", desc: "Focus on conversion and direct selling." },
                                { id: "awareness", label: "Brand Awareness", desc: "Build recognition and trust in the market." },
                                { id: "loyalty", label: "Customer Loyalty", desc: "Keep existing customers coming back." },
                                { id: "leads", label: "Lead Generation", desc: "Get more inquiries and signups." },
                            ].map((goal) => (
                                <label key={goal.id} className="relative flex p-4 cursor-pointer rounded-xl border border-border hover:bg-foreground/5 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                    <input
                                        type="radio"
                                        name="primaryGoal"
                                        value={goal.label}
                                        defaultChecked={profile.primary_goal === goal.label}
                                        className="sr-only"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold">{goal.label}</span>
                                        <span className="text-xs text-muted-foreground">{goal.desc}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border flex justify-between items-center">
                        <p className="text-xs text-muted-foreground">
                            Last profile update: {new Date(profile.created_at).toLocaleDateString()}
                        </p>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-primary-foreground px-6 h-11 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {loading ? "Saving Changes..." : "Save Settings"}
                        </button>
                    </div>

                    {saved && (
                        <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg flex items-center gap-3 text-green-500 text-sm">
                            <CheckCircle2 className="w-5 h-5" />
                            Your business settings have been updated successfully!
                        </div>
                    )}
                    {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
                </form>
            </div>
        </div>
    );
}
