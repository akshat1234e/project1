import { supabase } from "@/lib/supabase";

export interface Organization {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    primary_color: string;
    accent_color: string;
    created_at: string;
    updated_at: string;
}

export async function getOrganization(orgId: string) {
    const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", orgId)
        .single();

    if (error) {
        console.error("Error fetching organization:", error);
        return null;
    }

    return data as Organization;
}

export async function updateOrganization(orgId: string, updates: Partial<Organization>) {
    const { data, error } = await supabase
        .from("organizations")
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
        })
        .eq("id", orgId)
        .select()
        .single();

    if (error) {
        console.error("Error updating organization:", error);
        throw error;
    }

    return data as Organization;
}
