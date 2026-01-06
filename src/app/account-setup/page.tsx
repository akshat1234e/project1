import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Check, ChevronDown, Building2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toaster";
import { supabase } from "@/lib/supabase";
import { updateProfile, getProfile } from "@/lib/db/profiles";
import { useRouter } from "next/navigation";

export default function AccountSetupPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [role, setRole] = useState("");
    const [stage, setStage] = useState("");
    const [context, setContext] = useState("");
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const { showToast } = useToast();

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                const profile = await getProfile(user.id);
                if (profile) {
                    setFullName(profile.full_name || "");
                    setCompanyName(profile.company_name || "");
                    setRole(profile.role || "");
                    setStage(profile.stage || "");
                    setContext(profile.context || "");
                }
            } else {
                router.push("/login");
            }
        }
        loadProfile();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        setLoading(true);
        try {
            await updateProfile(userId, {
                full_name: fullName,
                company_name: companyName,
                role,
                stage,
                context,
            });
            showToast("Profile updated successfully", "success");
            router.push("/dashboard");
        } catch (error) {
            console.error("Failed to update profile:", error);
            showToast("Failed to update profile. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const stages = [
        "Idea stage",
        "Building MVP",
        "Pre-PMF (have customers, no fit yet)",
        "Post-PMF (product-market fit achieved)",
        "Scaling"
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-secondary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-[600px] relative z-10">
                <ScrollReveal>
                    <div className="flex flex-col items-center text-center space-y-6 mb-12">
                        <div className="h-20 w-20 bg-accent/20 border border-accent/50 rounded-none flex items-center justify-center shadow-[0_0_30px_rgba(0,242,255,0.2)]">
                            <Check size={40} className="text-accent" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black text-white tracking-tighter text-glow uppercase">Payment Successful</h1>
                            <p className="text-accent text-[10px] font-black uppercase tracking-[0.3em]">Complete your profile to begin your diagnostic</p>
                        </div>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                    <form onSubmit={handleSubmit} className="glass p-12 border-glow space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Full Name</label>
                                <Input
                                    placeholder="Enter your name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Company Name</label>
                                <Input
                                    placeholder="e.g. Acme Corp"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Role/Title</label>
                                <Input
                                    placeholder="e.g. Founder, CEO"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Company Stage</label>
                                <div className="relative">
                                    <select
                                        className="flex h-[48px] w-full appearance-none border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition-all focus:border-accent focus:outline-none rounded-none cursor-pointer backdrop-blur-md"
                                        value={stage}
                                        onChange={(e) => setStage(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled className="bg-background">Select stage...</option>
                                        {stages.map((s) => (
                                            <option key={s} value={s} className="bg-background">{s}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={16} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Brief Context</label>
                            <Textarea
                                placeholder="Tell us a bit about what you're building..."
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                                className="min-h-[120px]"
                            />
                        </div>

                        <div className="space-y-6 pt-4">
                            <Button size="lg" className="w-full gap-2" disabled={loading}>
                                {loading ? "Initializing..." : "Continue to Diagnostic"}
                            </Button>
                            <div className="text-center">
                                <Link href="/dashboard" className="text-[10px] font-black text-muted hover:text-white uppercase tracking-[0.3em] transition-colors">
                                    Skip for now
                                </Link>
                            </div>
                        </div>
                    </form>
                </ScrollReveal>
            </div>
        </div>
    );
}
