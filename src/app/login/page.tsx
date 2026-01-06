"use client";

import * as React from "react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Mail, Lock, Building2, User } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toaster";

export default function LoginPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(true); // Default to Sign Up as per request
    const { showToast } = useToast();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSignUp && !acceptedTerms) {
            showToast("You must acknowledge the terms to continue", "error");
            return;
        }
        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                        data: {
                            full_name: fullName,
                            company_name: companyName,
                        }
                    },
                });
                if (error) throw error;
                showToast("Check your email for the confirmation link.", "success");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                window.location.href = "/dashboard";
            }
        } catch (error: any) {
            showToast(error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-20 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-secondary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-[480px] glass p-12 space-y-12 border-glow relative z-10">
                <ScrollReveal>
                    <div className="space-y-4">
                        <div className="h-14 w-14 bg-accent flex items-center justify-center shadow-[0_0_30px_rgba(0,242,255,0.3)]">
                            <span className="text-background font-black text-2xl">SD</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-white text-glow uppercase">
                            {isSignUp ? "Create Account" : "Sign In"}
                        </h1>
                        <p className="text-muted text-sm tracking-wide">
                            {isSignUp
                                ? "This is not a free trial. You will pay before accessing."
                                : "Welcome back to the diagnostic dashboard."}
                        </p>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                    <form onSubmit={handleAuth} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Email Address</label>
                                <Input
                                    type="email"
                                    placeholder="founder@company.com"
                                    icon={<Mail size={20} className="text-accent" />}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {isSignUp && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Full Name</label>
                                    <Input
                                        type="text"
                                        placeholder="John Doe"
                                        icon={<User size={20} className="text-accent" />}
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            {isSignUp && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Company Name</label>
                                    <Input
                                        type="text"
                                        placeholder="Your Company"
                                        icon={<Building2 size={20} className="text-accent" />}
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        required
                                    />
                                    <p className="text-[10px] text-muted tracking-wide">This will appear in your reports</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Password</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    icon={<Lock size={20} className="text-accent" />}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {isSignUp && (
                            <Checkbox
                                label="I understand this diagnostic may recommend significant changes or stopping my idea entirely. I want honest judgment, not validation."
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                            />
                        )}

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full"
                            disabled={loading || (isSignUp && !acceptedTerms)}
                        >
                            {loading ? "Processing..." : isSignUp ? "Continue to Payment →" : "Sign In →"}
                        </Button>
                    </form>
                </ScrollReveal>

                <ScrollReveal delay={0.2}>
                    <div className="text-center">
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-[10px] font-black text-muted hover:text-accent transition-colors uppercase tracking-[0.2em]"
                        >
                            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Create one"}
                        </button>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
}
