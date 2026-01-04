import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toaster";
import { supabase } from "@/lib/supabase";
import { updateProfile, getProfile } from "@/lib/db/profiles";
import { useRouter } from "next/navigation";

export default function AccountSetupPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
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
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-6 py-20">
            <div className="w-full max-w-[560px] bg-white border-2 border-[#E5E5E5] p-12 space-y-12">
                <ScrollReveal>
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="h-16 w-16 bg-[#0F5132] rounded-full flex items-center justify-center">
                            <Check size={36} className="text-white" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-[#111111]">Payment Successful</h1>
                            <p className="text-[#6B6B6B]">Complete your profile to begin your diagnostic</p>
                        </div>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#111111]">Full Name (Optional)</label>
                                <Input
                                    placeholder="Enter your name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#111111]">Role/Title (Optional)</label>
                                <Input
                                    placeholder="e.g. Founder, CEO"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#111111]">Company Stage</label>
                                <div className="relative">
                                    <select
                                        className="flex h-[48px] w-full appearance-none border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-2 text-base transition-all focus:border-[#111111] focus:outline-none rounded-none cursor-pointer"
                                        value={stage}
                                        onChange={(e) => setStage(e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Select stage...</option>
                                        {stages.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B6B6B] pointer-events-none" size={20} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#111111]">Brief Context (Optional)</label>
                                <Textarea
                                    placeholder="Tell us a bit about what you're building..."
                                    value={context}
                                    onChange={(e) => setContext(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-6 pt-4">
                            <Button size="lg" className="w-full" disabled={loading}>
                                {loading ? "Saving..." : "Continue to Diagnostic"}
                            </Button>
                            <div className="text-center">
                                <Link href="/dashboard" className="text-sm font-medium text-[#6B6B6B] hover:text-[#111111] underline underline-offset-4">
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
