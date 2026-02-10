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
