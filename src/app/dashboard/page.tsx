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
            <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]">
                <div className="text-xl font-bold animate-pulse text-[#111111]">LOADING REALITY...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            {/* Header */}
            <header className="h-20 bg-white border-b border-[#E5E5E5] px-6">
                <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="h-10 w-10 bg-[#111111] flex items-center justify-center">
                            <span className="text-white font-bold text-lg">SD</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/dashboard" className="text-sm font-bold text-[#111111] uppercase tracking-wider">Dashboard</Link>
                            <Link href="/post-sale" className="text-sm font-medium text-[#6B6B6B] hover:text-[#111111] uppercase tracking-wider transition-colors">Post-Sale</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-[#FAFAFA] border border-[#E5E5E5] flex items-center justify-center text-[#6B6B6B]">
                            <UserIcon size={20} />
                        </div>
                        <button onClick={handleSignOut} className="text-[#6B6B6B] hover:text-[#7A1E1E] transition-colors">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
                <ScrollReveal>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold text-[#111111]">
                            Welcome, {profile?.full_name || user?.user_metadata?.full_name || "Founder"}
                        </h1>
                        <p className="text-[#6B6B6B] text-lg">
                            {profile?.company_name || user?.user_metadata?.company_name || "Your Startup"} Diagnostic Dashboard
                        </p>
                    </div>
                </ScrollReveal>

                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-[#111111] uppercase tracking-tight">Diagnostics</h2>
                        <Link href="/diagnostic">
                            <Button size="sm" className="gap-2">
                                <Plus size={16} /> New Diagnostic
                            </Button>
                        </Link>
                    </div>

                    {reports.length > 0 ? (
                        <div className="grid gap-4">
                            {reports.map((report) => (
                                <ScrollReveal key={report.id}>
                                    <Link href={`/report/${report.id}`}>
                                        <div className="bg-white border border-[#E5E5E5] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#111111] transition-all group">
                                            <div className="flex items-center gap-6">
                                                <div className="h-12 w-12 bg-[#FAFAFA] flex items-center justify-center text-[#111111]">
                                                    <FileText size={24} />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="font-bold text-[#111111]">{report.company_name}</h3>
                                                    <p className="text-sm text-[#6B6B6B]">
                                                        {new Date(report.created_at).toLocaleDateString("en-US", {
                                                            month: "long",
                                                            day: "numeric",
                                                            year: "numeric"
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-8">
                                                <StatusIndicator status={report.status} />
                                                <VerdictBadge verdict={report.verdict} />
                                                <div className="text-[#6B6B6B] group-hover:text-[#111111] transition-colors">
                                                    <Plus size={20} className="rotate-45" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </ScrollReveal>
                            ))}
                        </div>
                    ) : (
                        <ScrollReveal delay={0.2}>
                            <div className="border-2 border-dashed border-[#E5E5E5] bg-[#FAFAFA] p-20 flex flex-col items-center text-center space-y-6">
                                <div className="h-16 w-16 bg-white border border-[#E5E5E5] flex items-center justify-center text-[#6B6B6B]">
                                    <FileText size={32} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-[#111111]">No diagnostics yet</h3>
                                    <p className="text-[#6B6B6B] max-w-xs mx-auto">
                                        You haven't run a diagnostic yet. Start one to get your verdict.
                                    </p>
                                </div>
                                <Link href="/diagnostic">
                                    <Button size="lg" className="px-12">
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
