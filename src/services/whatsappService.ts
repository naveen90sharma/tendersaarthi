import { supabase } from './supabase';

export interface WhatsAppPreference {
    phone_number: string;
    categories: string[];
    states: string[];
    is_active: boolean;
}

export async function getWhatsAppPreference(userId: string) {
    try {
        const { data, error } = await supabase
            .from('whatsapp_alerts')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) throw error;
        return { success: true, data, error: null };
    } catch (error: any) {
        console.error('Error fetching whatsapp preferences:', error);
        return { success: false, data: null, error: error.message };
    }
}

export async function updateWhatsAppPreference(userId: string, prefs: WhatsAppPreference) {
    try {
        const { data, error } = await supabase
            .from('whatsapp_alerts')
            .upsert({
                user_id: userId,
                ...prefs,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;
        return { success: true, data, error: null };
    } catch (error: any) {
        console.error('Error updating whatsapp preferences:', error);
        return { success: false, data: null, error: error.message };
    }
}

export async function toggleWhatsAppAlertStatus(userId: string, isActive: boolean) {
    try {
        const { error } = await supabase
            .from('whatsapp_alerts')
            .update({ is_active: isActive })
            .eq('user_id', userId);

        if (error) throw error;
        return { success: true, error: null };
    } catch (error: any) {
        console.error('Error toggling alert status:', error);
        return { success: false, error: error.message };
    }
}
