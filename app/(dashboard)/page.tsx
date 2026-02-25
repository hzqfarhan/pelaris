import { createClient } from "@/lib/supabase/server";
import { BarChart3, TrendingUp, Users, CalendarDays, PenTool, ImageIcon, Zap, MessageSquare } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardOverviewPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch all generations for this user
    const { data: generations } = await supabase
        .from("ai_generations")
        .select("*")
        .eq("user_id", user?.id || "")
        .order("created_at", { ascending: false });

    // Aggregate counts
    const captionsCount = generations?.filter(g => g.tool_type === 'caption').length || 0;
    const hooksCount = generations?.filter(g => g.tool_type === 'hooks').length || 0;
    const imagesCount = generations?.filter(g => g.tool_type === 'image').length || 0;
    const scriptsCount = generations?.filter(g => g.tool_type === 'script').length || 0;

    const recentGenerations = generations?.slice(0, 5) || [];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
                <p className="text-muted-foreground">Monitor your AI marketing performance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
                {/* Stat Cards */}
                <div className="glass-card rounded-xl p-6 border-l-4 border-l-primary flex flex-col gap-2">
                    <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-sm font-medium">Captions Generated</span>
                        <PenTool className="w-4 h-4" />
                    </div>
                    <div className="text-3xl font-bold">{captionsCount}</div>
                </div>

                <div className="glass-card rounded-xl p-6 border-l-4 border-l-pink-500 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-sm font-medium">Hooks Generated</span>
                        <Zap className="w-4 h-4" />
                    </div>
                    <div className="text-3xl font-bold">{hooksCount}</div>
                </div>

                <div className="glass-card rounded-xl p-6 border-l-4 border-l-blue-500 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-sm font-medium">Images Created</span>
                        <ImageIcon className="w-4 h-4" />
                    </div>
                    <div className="text-3xl font-bold">{imagesCount}</div>
                </div>

                <div className="glass-card rounded-xl p-6 border-l-4 border-l-green-500 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-sm font-medium">Sales Scripts</span>
                        <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="text-3xl font-bold">{scriptsCount}</div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="glass-card rounded-xl border border-border p-6 lg:col-span-4">
                    <h3 className="font-semibold mb-4">Engagement Overview</h3>
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm border border-dashed border-border rounded-lg">
                        No analytics data available yet. Start posting to see trends!
                    </div>
                </div>

                <div className="glass-card rounded-xl border border-border p-6 lg:col-span-3">
                    <h3 className="font-semibold mb-4">Recent AI Generations</h3>
                    <div className="space-y-4">
                        {recentGenerations.length === 0 ? (
                            <div className="text-sm text-center text-muted-foreground py-8">
                                You haven't generated any content yet. <br /><br />
                                <Link href="/dashboard/captions" className="text-primary hover:underline">Go to Caption Studio</Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentGenerations.map((gen) => (
                                    <div key={gen.id} className="border-b border-border pb-3 last:border-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-medium uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                                                {gen.tool_type}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(gen.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-sm line-clamp-2 text-foreground/80 mt-1">
                                            {gen.tool_type === 'image' && gen.output_content ? (
                                                <img src={gen.output_content} alt="Generated Result" className="w-full h-24 object-cover rounded-md mt-2" />
                                            ) : (
                                                gen.output_content || "No output."
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
