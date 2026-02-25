import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, PenTool, Calendar, Image as ImageIcon, MessageSquare, BarChart3, Settings, LogOut, Zap } from "lucide-react";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Ensure they have a profile
    const { data: profiles, error } = await supabase
        .from("business_profile")
        .select("*")
        .eq("user_id", user.id)
        .limit(1);

    if (error) {
        redirect("/onboarding?error=" + encodeURIComponent("DB Error: " + error.message));
    }

    const profile = profiles?.[0];

    if (!profile) {
        redirect("/onboarding?error=" + encodeURIComponent("Profile saved, but could not be read. Please disable RLS for the business_profile table in Supabase."));
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">

            {/* Sidebar */}
            <aside className="w-64 border-r border-border glass-panel flex flex-col">
                <div className="p-6 border-b border-border flex items-center justify-center">
                    <img src="/logo.png" alt="Pelaris Digital" className="h-10 w-auto object-contain" />
                </div>

                <div className="p-4 flex-1 overflow-y-auto space-y-6">
                    <div className="space-y-1">
                        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-foreground/5 transition-colors text-foreground">
                            <LayoutDashboard className="w-4 h-4" /> Overview
                        </Link>
                    </div>

                    <div>
                        <h4 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI Tools</h4>
                        <div className="space-y-1">
                            <Link href="/dashboard/captions" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-foreground/5 transition-colors text-muted-foreground hover:text-foreground">
                                <PenTool className="w-4 h-4" /> Caption Generator
                            </Link>
                            <Link href="/dashboard/hooks" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-foreground/5 transition-colors text-muted-foreground hover:text-foreground">
                                <Zap className="w-4 h-4" /> Hook Generator
                            </Link>
                            <Link href="/dashboard/image-studio" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-foreground/5 transition-colors text-muted-foreground hover:text-foreground">
                                <ImageIcon className="w-4 h-4" /> Image Studio
                            </Link>
                            <Link href="/dashboard/scripts" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-foreground/5 transition-colors text-muted-foreground hover:text-foreground">
                                <MessageSquare className="w-4 h-4" /> Sales Scripts
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Management</h4>
                        <div className="space-y-1">
                            <Link href="/dashboard/planner" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-foreground/5 transition-colors text-muted-foreground hover:text-foreground">
                                <Calendar className="w-4 h-4" /> Content Planner
                            </Link>
                            <Link href="/dashboard/analytics" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-foreground/5 transition-colors text-muted-foreground hover:text-foreground">
                                <BarChart3 className="w-4 h-4" /> Analytics
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-foreground/5 border border-border">
                        <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold uppercase text-xs">
                            {profile.business_name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{profile.business_name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-foreground/5 transition-colors text-muted-foreground hover:text-foreground">
                            <Settings className="w-4 h-4" /> Settings
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[150px] -z-10 pointer-events-none" />

                <header className="h-16 border-b border-border flex items-center px-8 justify-between z-10">
                    <h2 className="text-lg font-semibold">Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <div className="text-xs font-mono bg-foreground/10 px-2 py-1 rounded text-muted-foreground flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span> Pro limits active
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 z-10 w-full max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

        </div>
    );
}
