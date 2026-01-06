"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { Organization, getOrganization } from "@/lib/db/organizations";
import { getProfile } from "@/lib/db/profiles";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface BrandingContextType {
    organization: Organization | null;
    isLoading: boolean;
}

const BrandingContext = createContext<BrandingContextType>({
    organization: null,
    isLoading: true,
});

export function BrandingProvider({ children }: { children: React.ReactNode }) {
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadBranding() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const profile = await getProfile(user.id);
                    if (profile?.organization_id) {
                        const org = await getOrganization(profile.organization_id);
                        if (org) {
                            setOrganization(org);
                            // Apply CSS variables
                            document.documentElement.style.setProperty("--accent", org.primary_color);
                            document.documentElement.style.setProperty("--accent-secondary", org.accent_color);
                        }
                    } else {
                        // Fallback to default futuristic theme
                        document.documentElement.style.setProperty("--accent", "#00F2FF");
                        document.documentElement.style.setProperty("--accent-secondary", "#7000FF");
                    }
                }
            } catch (error) {
                console.error("Error loading branding:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadBranding();
    }, []);

    return (
        <BrandingContext.Provider value={{ organization, isLoading }}>
            {children}
        </BrandingContext.Provider>
    );
}

export const useBranding = () => useContext(BrandingContext);
