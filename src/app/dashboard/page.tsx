"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { VerdictBadge } from "@/components/ui/VerdictBadge";
import { FileText, Plus, User as UserIcon, LogOut } from "lucide-react";
import Link from "next/link";
import { getProfile, Profile } from "@/lib/db/profiles";
import { useBranding } from "@/components/providers/BrandingProvider";

interface ReportSummary {
    id: string;
    created_at: string;
    verdict: "PROCEED" | "FIX" | "KILL";
    status: "SUBMITTED" | "PROCESSING" | "COMPLETED" | "FAILED";
    company_name: string;
}

export default function DashboardPage() {
    const [reports, setReports] = useState<ReportSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const { organization } = useBranding();

    useEffect(() => {
        async function fetchDashboardData() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const profileData = await getProfile(user.id);
                setProfile(profileData);

                // Fetch reports from Supabase
                const { data: reportsData, error } = await supabase
                    .from("reports")
                    .select("*, submission:submissions(formData)")
                    .eq("userId", user.id)
                    .order("createdAt", { ascending: false });

                if (!error && reportsData) {
                    const formattedReports = reportsData.map((r: any) => ({
                        id: r.id,
                        created_at: r.createdAt,
                        verdict: r.verdict,
                        status: "COMPLETED" as const,
                        company_name: r.submission?.formData?.company_name || profileData?.company_name || "Unknown Company"
                    }));
                    setReports(formattedReports);
                }
            }
            setLoading(false);
        }

        fetchDashboardData();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-xl font-black animate-pulse text-accent tracking-[0.5em] text-glow uppercase">LOADING REALITY...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-secondary/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <header className="h-20 glass border-b border-white/10 px-6 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="h-10 w-10 bg-accent flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.3)]">
                            <span className="text-background font-black text-lg">SD</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-8">
                            <Link href="/dashboard" className="text-[10px] font-black text-white uppercase tracking-[0.2em] hover:text-accent transition-colors">Dashboard</Link>
                            <Link href="/post-sale" className="text-[10px] font-black text-muted hover:text-accent uppercase tracking-[0.2em] transition-colors">Post-Sale</Link>
                            <Link href="/admin/settings" className="text-[10px] font-black text-muted hover:text-accent uppercase tracking-[0.2em] transition-colors">Settings</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-none bg-white/5 border border-white/10 flex items-center justify-center text-accent">
                            <UserIcon size={20} />
                        </div>
                        <button onClick={handleSignOut} className="text-muted hover:text-verdict-kill transition-colors">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-16 space-y-16 relative z-10">
                <ScrollReveal>
                    <div className="space-y-4">
                        <h1 className="text-5xl font-black text-white tracking-tighter text-glow uppercase">
                            Welcome, {profile?.full_name || user?.user_metadata?.full_name || "Founder"}
                        </h1>
                        <p className="text-accent text-xs font-black uppercase tracking-[0.3em]">
                            {organization?.name || profile?.company_name || user?.user_metadata?.company_name || "Your Startup"} Diagnostic Dashboard
                        </p>
                    </div>
                </ScrollReveal>

                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">Diagnostics</h2>
                        <Link href="/diagnostic">
                            <Button size="sm" className="gap-2">
                                <Plus size={16} /> New Diagnostic
                            </Button>
                        </Link>
                    </div>

                    {reports.length > 0 ? (
                        <div className="grid gap-6">
                            {reports.map((report) => (
                                <ScrollReveal key={report.id}>
                                    <Link href={`/report/${report.id}`}>
                                        <div className="glass p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:border-accent transition-all group border-glow">
                                            <div className="flex items-center gap-8">
                                                <div className="h-14 w-14 bg-white/5 flex items-center justify-center text-accent border border-white/10">
                                                    <FileText size={28} />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-xl font-black text-white uppercase tracking-tight">{report.company_name}</h3>
                                                    <p className="text-[10px] font-black text-muted uppercase tracking-widest">
                                                        {new Date(report.created_at).toLocaleDateString("en-US", {
                                                            month: "long",
                                                            day: "numeric",
                                                            year: "numeric"
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-12">
                                                <StatusIndicator status={report.status} />
                                                <VerdictBadge verdict={report.verdict} />
                                                <div className="text-muted group-hover:text-accent transition-colors">
                                                    <Plus size={24} className="rotate-45" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </ScrollReveal>
                            ))}
                        </div>
                    ) : (
                        <ScrollReveal delay={0.2}>
                            <div className="glass p-24 flex flex-col items-center text-center space-y-8 border-glow">
                                <div className="h-20 w-20 bg-white/5 border border-white/10 flex items-center justify-center text-accent">
                                    <FileText size={40} />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">No diagnostics yet</h3>
                                    <p className="text-muted text-sm max-w-xs mx-auto tracking-wide">
                                        You haven't run a diagnostic yet. Start one to get your verdict.
                                    </p>
                                </div>
                                <Link href="/diagnostic">
                                    <Button size="lg" className="px-16">
                                        Start Diagnostic
                                    </Button>
                                </Link>
                            </div>
                        </ScrollReveal>
                    )}
                </div>
            </main>
        </div>
    );
}
