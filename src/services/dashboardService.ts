import { supabase } from './supabase';

export const dashboardService = {
    // --- Profile Operations ---
    async getProfile(userId: string) {
        try {
            const { data, error } = await supabase
                .from('contractor_profiles')
                .select(`
                  *,
                  contractor_projects (*)
                `)
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return { success: true, data, error: null };
        } catch (error: any) {
            console.error('Error fetching profile:', error);
            return { success: false, data: null, error: error.message };
        }
    },

    async updateProfile(userId: string, profileData: any) {
        try {
            const { data, error } = await supabase
                .from('contractor_profiles')
                .upsert({ user_id: userId, ...profileData, updated_at: new Date() })
                .select()
                .single();

            if (error) throw error;
            return { success: true, data, error: null };
        } catch (error: any) {
            console.error('Error updating profile:', error);
            return { success: false, data: null, error: error.message };
        }
    },

    // --- Project Operations ---
    async addProject(profileId: string, projectData: any) {
        try {
            const { data, error } = await supabase
                .from('contractor_projects')
                .insert({ profile_id: profileId, ...projectData })
                .select()
                .single();

            if (error) throw error;
            return { success: true, data, error: null };
        } catch (error: any) {
            console.error('Error adding project:', error);
            return { success: false, data: null, error: error.message };
        }
    },

    async deleteProject(projectId: string) {
        try {
            const { error } = await supabase
                .from('contractor_projects')
                .delete()
                .eq('id', projectId);

            if (error) throw error;
            return { success: true, error: null };
        } catch (error: any) {
            console.error('Error deleting project:', error);
            return { success: false, error: error.message };
        }
    },

    // --- Document Operations ---
    async getDocuments(userId: string) {
        try {
            const { data, error } = await supabase
                .from('contractor_documents')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { success: true, data: data || [], error: null };
        } catch (error: any) {
            console.error('Error fetching documents:', error);
            return { success: false, data: null, error: error.message };
        }
    },

    async uploadDocument(userId: string, file: File, category: string, title: string) {
        try {
            // 1. Upload to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}/${Date.now()}.${fileExt}`;
            const filePath = `documents/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('contractor-docs')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('contractor-docs')
                .getPublicUrl(filePath);

            // 3. Save Metadata to DB
            const { data, error: dbError } = await supabase
                .from('contractor_documents')
                .insert([{
                    user_id: userId,
                    title: title || file.name,
                    category,
                    file_url: publicUrl,
                    file_path: filePath,
                    file_type: file.type,
                    file_size: file.size
                }])
                .select()
                .single();

            if (dbError) throw dbError;
            return { success: true, data, error: null };
        } catch (error: any) {
            console.error('Upload error:', error);
            return { success: false, data: null, error: error.message };
        }
    },

    async deleteDocument(docId: string, filePath: string) {
        try {
            // Delete from storage
            if (filePath) {
                await supabase.storage.from('contractor-docs').remove([filePath]);
            }

            // Delete from DB
            const { error } = await supabase
                .from('contractor_documents')
                .delete()
                .eq('id', docId);

            if (error) throw error;
            return { success: true, error: null };
        } catch (error: any) {
            console.error('Error deleting document:', error);
            return { success: false, error: error.message };
        }
    },

    // --- WhatsApp Settings ---
    async getWhatsAppSettings(userId: string) {
        try {
            const { data, error } = await supabase
                .from('whatsapp_alerts')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return { success: true, data, error: null };
        } catch (error: any) {
            console.error('Error fetching WhatsApp settings:', error);
            return { success: false, data: null, error: error.message };
        }
    },

    async updateWhatsAppSettings(userId: string, settings: any) {
        try {
            const { data, error } = await supabase
                .from('whatsapp_alerts')
                .upsert({ user_id: userId, ...settings, updated_at: new Date() })
                .select()
                .single();

            if (error) throw error;
            return { success: true, data, error: null };
        } catch (error: any) {
            console.error('Error updating WhatsApp settings:', error);
            return { success: false, data: null, error: error.message };
        }
    }
};
