import { supabase } from './supabase';

export interface TenderData {
    title: string;
    tender_id: string;
    reference_no?: string;
    authority: string;
    location: string;
    tender_value: string;
    emd_amount?: string;
    tender_fee?: string;
    tender_type: string;
    tender_category: string;
    description?: string;
    published_date: string;
    bid_submission_end: string;
    bid_opening_date?: string;
    period_of_work?: string;
    bid_validity?: string;
    officialLink?: string;
    form_of_contract?: string;
    organisation_chain?: string;
}

// Create a new tender
export async function createTender(tenderData: TenderData, userId?: string) {
    try {
        // Calculate bid_end_ts from bid_submission_end
        const bidEndTs = new Date(tenderData.bid_submission_end).toISOString();

        const dataToInsert = {
            ...tenderData,
            bid_end_ts: bidEndTs,
            status: 'Active',
            created_by: userId,
            created_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from('tenders')
            .insert([dataToInsert])
            .select()
            .single();

        if (error) throw error;

        return { success: true, data, error: null };
    } catch (error: any) {
        console.error('Error creating tender:', error);
        return { success: false, data: null, error: error.message };
    }
}

// Update an existing tender
export async function updateTender(tenderId: string, tenderData: Partial<TenderData>) {
    try {
        const updateData: any = { ...tenderData };

        // Update bid_end_ts if bid_submission_end is changed
        if (tenderData.bid_submission_end) {
            updateData.bid_end_ts = new Date(tenderData.bid_submission_end).toISOString();
        }

        const { data, error } = await supabase
            .from('tenders')
            .update(updateData)
            .eq('id', tenderId)
            .select()
            .single();

        if (error) throw error;

        return { success: true, data, error: null };
    } catch (error: any) {
        console.error('Error updating tender:', error);
        return { success: false, data: null, error: error.message };
    }
}

// Delete a tender
export async function deleteTender(tenderId: string) {
    try {
        const { error } = await supabase
            .from('tenders')
            .delete()
            .eq('id', tenderId);

        if (error) throw error;

        return { success: true, error: null };
    } catch (error: any) {
        console.error('Error deleting tender:', error);
        return { success: false, error: error.message };
    }
}

// Get tenders created by a user
export async function getUserTenders(userId: string) {
    try {
        const { data, error } = await supabase
            .from('tenders')
            .select('*')
            .eq('created_by', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { success: true, data, error: null };
    } catch (error: any) {
        console.error('Error fetching user tenders:', error);
        return { success: false, data: null, error: error.message };
    }
}

// Save tender as draft
export async function saveTenderDraft(tenderData: Partial<TenderData>, userId?: string) {
    try {
        const draftData = {
            ...tenderData,
            status: 'Draft',
            created_by: userId,
            created_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from('tender_drafts')
            .insert([draftData])
            .select()
            .single();

        if (error) {
            // If tender_drafts table doesn't exist, save to tenders with Draft status
            const { data: tenderData, error: tenderError } = await supabase
                .from('tenders')
                .insert([draftData])
                .select()
                .single();

            if (tenderError) throw tenderError;
            return { success: true, data: tenderData, error: null };
        }

        return { success: true, data, error: null };
    } catch (error: any) {
        console.error('Error saving draft:', error);
        return { success: false, data: null, error: error.message };
    }
}

// Get user's draft tenders
export async function getUserDrafts(userId: string) {
    try {
        // Try to get from tender_drafts first
        const { data, error } = await supabase
            .from('tender_drafts')
            .select('*')
            .eq('created_by', userId)
            .order('created_at', { ascending: false });

        if (error) {
            // Fallback to tenders table with Draft status
            const { data: drafts, error: draftError } = await supabase
                .from('tenders')
                .select('*')
                .eq('created_by', userId)
                .eq('status', 'Draft')
                .order('created_at', { ascending: false });

            if (draftError) throw draftError;
            return { success: true, data: drafts, error: null };
        }

        return { success: true, data, error: null };
    } catch (error: any) {
        console.error('Error fetching drafts:', error);
        return { success: false, data: null, error: error.message };
    }
}
// Get metadata for filters (unique categories, locations, authorities, states, and min/max value)
export async function getFilterMetadata() {
    try {
        const [
            { data: categories },
            { data: states },
            { data: authorities },
            { data: types },
            { data: priceStats }
        ] = await Promise.all([
            supabase.from('tenders').select('tender_category').not('tender_category', 'is', null),
            supabase.from('tenders').select('state').not('state', 'is', null),
            supabase.from('tenders').select('authority').not('authority', 'is', null),
            supabase.from('tenders').select('tender_type').not('tender_type', 'is', null),
            supabase.from('tenders').select('tender_value_numeric').not('tender_value_numeric', 'is', null)
        ]);

        const unique = (items: any[], key: string) =>
            Array.from(new Set(items?.map(item => item[key]).filter(Boolean))).sort();

        // Calculate min/max price from all tenders
        const numericValues = (priceStats || []).map(p => Number(p.tender_value_numeric)).filter(v => v > 0);
        const minPrice = numericValues.length > 0 ? Math.min(...numericValues) : 0;
        const maxPrice = numericValues.length > 0 ? Math.max(...numericValues) : 1000000000; // 1000 Cr default max

        return {
            success: true,
            data: {
                categories: unique(categories || [], 'tender_category'),
                states: unique(states || [], 'state'),
                authorities: unique(authorities || [], 'authority'),
                types: unique(types || [], 'tender_type'),
                minPrice,
                maxPrice
            },
            error: null
        };
    } catch (error: any) {
        console.error('Error fetching filter metadata:', error);
        return { success: false, data: null, error: error.message };
    }
}
// Toggle Save Tender
export async function toggleSaveTender(tenderId: string, userId: string) {
    try {
        // Check if already saved
        const { data: existing, error: checkError } = await supabase
            .from('saved_tenders')
            .select('id')
            .eq('user_id', userId)
            .eq('tender_id', tenderId)
            .maybeSingle();

        if (checkError) throw checkError;

        if (existing) {
            // Unsave
            const { error: deleteError } = await supabase
                .from('saved_tenders')
                .delete()
                .eq('id', existing.id);
            if (deleteError) throw deleteError;
            return { success: true, saved: false };
        } else {
            // Save
            const { error: insertError } = await supabase
                .from('saved_tenders')
                .insert([{ user_id: userId, tender_id: tenderId }]);
            if (insertError) throw insertError;
            return { success: true, saved: true };
        }
    } catch (error: any) {
        console.error('Error toggling save tender:', error);
        return { success: false, error: error.message };
    }
}

// Check if tender is saved
export async function isTenderSaved(tenderId: string, userId: string) {
    try {
        const { data, error } = await supabase
            .from('saved_tenders')
            .select('id')
            .eq('user_id', userId)
            .eq('tender_id', tenderId)
            .maybeSingle();

        if (error) return false;
        return !!data;
    } catch (error) {
        return false;
    }
}

// Get user's saved tenders
export async function getSavedTenders(userId: string) {
    try {
        const { data, error } = await supabase
            .from('saved_tenders')
            .select(`
                id,
                tenders (*)
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Flatten the data
        const formattedTenders = (data || []).map((item: any) => item.tenders).filter(Boolean);
        return { success: true, data: formattedTenders, error: null };
    } catch (error: any) {
        console.error('Error fetching saved tenders:', error);
        return { success: false, data: null, error: error.message };
    }
}
