import { supabase } from './supabase';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
}

// Sign up new user
export async function signUp(data: RegisterData) {
    try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    full_name: data.fullName,
                    phone: data.phone,
                }
            }
        });

        if (authError) throw authError;

        return { success: true, user: authData.user, error: null };
    } catch (error: any) {
        return { success: false, user: null, error: error.message };
    }
}

// Sign in existing user
export async function signIn(credentials: LoginCredentials) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
        });

        if (error) throw error;

        return { success: true, user: data.user, session: data.session, error: null };
    } catch (error: any) {
        return { success: false, user: null, session: null, error: error.message };
    }
}

// Sign out
export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { success: true, error: null };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Get current user
export async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return { user, error: null };
    } catch (error: any) {
        return { user: null, error: error.message };
    }
}

// Check if user is logged in
export async function isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
}

// Reset password
export async function resetPassword(email: string) {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        return { success: true, error: null };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Update password
export async function updatePassword(newPassword: string) {
    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });
        if (error) throw error;
        return { success: true, error: null };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Sign in with Google
export async function signInWithGoogle() {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });
        if (error) throw error;
        return { success: true, data, error: null };
    } catch (error: any) {
        return { success: false, data: null, error: error.message };
    }
}

// Sign in with Facebook
export async function signInWithFacebook() {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'facebook',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });
        if (error) throw error;
        return { success: true, data, error: null };
    } catch (error: any) {
        return { success: false, data: null, error: error.message };
    }
}
