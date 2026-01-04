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
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFA] px-6 py-20">
            <div className="w-full max-w-[480px] bg-white border-2 border-[#E5E5E5] p-12 space-y-12">
                <ScrollReveal>
                    <div className="space-y-4">
                        <div className="h-12 w-12 bg-[#111111] flex items-center justify-center">
                            <span className="text-white font-bold text-xl">SD</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-[#111111]">
                            {isSignUp ? "Create Account" : "Sign In"}
                        </h1>
                        <p className="text-[#6B6B6B]">
                            {isSignUp
                                ? "This is not a free trial. You will pay before accessing."
                                : "Welcome back to the diagnostic dashboard."}
                        </p>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                    <form onSubmit={handleAuth} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#111111]">Email Address</label>
                                <Input
                                    type="email"
                                    placeholder="founder@company.com"
                                    icon={<Mail size={20} />}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {isSignUp && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#111111]">Full Name</label>
                                    <Input
                                        type="text"
                                        placeholder="John Doe"
                                        icon={<User size={20} />}
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            {isSignUp && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#111111]">Company Name</label>
                                    <Input
                                        type="text"
                                        placeholder="Your Company"
                                        icon={<Building2 size={20} />}
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        required
                                    />
                                    <p className="text-[12px] text-[#6B6B6B]">This will appear in your reports</p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[#111111]">Password</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    icon={<Lock size={20} />}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {isSignUp && (
                            <Checkbox
                                label="I understand this diagnostic may recommend significant changes or stopping my idea entirely. I want honest judgment, not validation."
                                variant="warning"
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
                            className="text-sm font-medium text-[#6B6B6B] hover:text-[#111111] transition-colors"
                        >
                            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Create one"}
                        </button>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
}
