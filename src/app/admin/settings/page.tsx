"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toaster";
import { useBranding } from "@/components/providers/BrandingProvider";
import { updateOrganization } from "@/lib/db/organizations";
import { motion } from "framer-motion";
import { Settings, Palette, Image as ImageIcon, Save } from "lucide-react";

export default function AdminSettingsPage() {
    const { organization, isLoading } = useBranding();
    const { showToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        primary_color: "#00F2FF",
        accent_color: "#7000FF",
        logo_url: "",
    });

    useEffect(() => {
        if (organization) {
            setFormData({
                name: organization.name,
                primary_color: organization.primary_color,
                accent_color: organization.accent_color,
                logo_url: organization.logo_url || "",
            });
        }
    }, [organization]);

    const handleSave = async () => {
        if (!organization) return;
        setIsSaving(true);
        try {
            await updateOrganization(organization.id, formData);
            showToast("Branding updated successfully", "success");
            // Refresh page to apply new CSS variables via BrandingProvider
            window.location.reload();
        } catch (error) {
            showToast("Failed to update branding", "error");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    if (!organization) return <div className="min-h-screen flex items-center justify-center text-white">No organization found.</div>;

    return (
        <div className="min-h-screen bg-background py-20 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-3xl mx-auto px-6 relative z-10">
                <div className="mb-16 space-y-4">
                    <h1 className="text-4xl font-black text-white tracking-tighter text-glow uppercase flex items-center gap-4">
                        <Settings className="text-accent" size={36} /> Organization Settings
                    </h1>
                    <p className="text-muted text-sm tracking-widest uppercase">Manage your white-label branding</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-12 border-glow space-y-12"
                >
                    {/* General Settings */}
                    <div className="space-y-8">
                        <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                            <Settings size={20} className="text-accent" /> General
                        </h2>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Organization Name</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Acme Corp"
                            />
                        </div>
                    </div>

                    {/* Branding Settings */}
                    <div className="space-y-8">
                        <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                            <Palette size={20} className="text-accent" /> Visual Branding
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Primary Color (Accent)</label>
                                <div className="flex gap-4">
                                    <Input
                                        type="color"
                                        value={formData.primary_color}
                                        onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                                        className="w-12 h-12 p-1 bg-transparent border-white/10"
                                    />
                                    <Input
                                        value={formData.primary_color}
                                        onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                                        placeholder="#00F2FF"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Secondary Color</label>
                                <div className="flex gap-4">
                                    <Input
                                        type="color"
                                        value={formData.accent_color}
                                        onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                                        className="w-12 h-12 p-1 bg-transparent border-white/10"
                                    />
                                    <Input
                                        value={formData.accent_color}
                                        onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                                        placeholder="#7000FF"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Logo URL</label>
                            <div className="flex gap-4 items-center">
                                <Input
                                    value={formData.logo_url}
                                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                                    placeholder="https://..."
                                />
                                {formData.logo_url && (
                                    <div className="h-12 w-12 glass flex items-center justify-center p-2">
                                        <img src={formData.logo_url} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-white/10">
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full gap-2"
                            size="lg"
                        >
                            <Save size={20} /> {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
