import { saveOnboarding } from "@/app/actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function OnboardingPage({
    searchParams,
}: {
    searchParams: { error?: string }
}) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check if user already completed onboarding
    const { data: profile } = await supabase
        .from("business_profile")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (profile) {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-lg p-8 glass-card rounded-2xl relative z-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight mb-2">Almost there!</h1>
                    <p className="text-muted-foreground text-sm">Let us customize your AI experience by telling us a bit about your business.</p>
                </div>

                {searchParams?.error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-3 rounded-md mb-6 text-center">
                        {searchParams.error}
                    </div>
                )}

                <form action={saveOnboarding} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="businessName">Business or Brand Name</label>
                        <input
                            id="businessName"
                            name="businessName"
                            type="text"
                            placeholder="e.g. Sambal Nyet by Khairulaming"
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none" htmlFor="niche">Business Niche / Industry</label>
                        <select
                            id="niche"
                            name="niche"
                            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                            defaultValue=""
                        >
                            <option value="" disabled hidden>Select your industry...</option>
                            <option value="Food & Beverage (F&B)">Food & Beverage (F&B)</option>
                            <option value="Fashion & Apparel">Fashion & Apparel</option>
                            <option value="Health & Beauty">Health & Beauty</option>
                            <option value="Dropship / Affiliate">Dropship / Affiliate</option>
                            <option value="Retail & E-commerce">Retail & E-commerce</option>
                            <option value="Services & Agency">Services & Agency</option>
                            <option value="Education & Coaching">Education & Coaching</option>
                            <option value="Tech & Electronics">Tech & Electronics</option>
                            <option value="Home & Living">Home & Living</option>
                            <option value="Automotive">Automotive</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium leading-none">Primary Goal for using Pelaris Digital</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <label className="border border-border rounded-xl p-4 cursor-pointer hover:border-primary transition-colors flex flex-col items-center text-center gap-2">
                                <input type="radio" name="primaryGoal" value="Sales" className="sr-only peer" required />
                                <div className="text-2xl">💰</div>
                                <div className="font-medium text-sm peer-checked:text-primary">Drive Sales</div>
                            </label>

                            <label className="border border-border rounded-xl p-4 cursor-pointer hover:border-primary transition-colors flex flex-col items-center text-center gap-2">
                                <input type="radio" name="primaryGoal" value="Brand Awareness" className="sr-only peer" />
                                <div className="text-2xl">📣</div>
                                <div className="font-medium text-sm peer-checked:text-primary">Brand Awareness</div>
                            </label>

                            <label className="border border-border rounded-xl p-4 cursor-pointer hover:border-primary transition-colors flex flex-col items-center text-center gap-2">
                                <input type="radio" name="primaryGoal" value="Follower Growth" className="sr-only peer" />
                                <div className="text-2xl">📈</div>
                                <div className="font-medium text-sm peer-checked:text-primary">Follower Growth</div>
                            </label>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                        >
                            Complete Setup
                        </button>
                    </div>
                </form>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
        </div>
    );
}
