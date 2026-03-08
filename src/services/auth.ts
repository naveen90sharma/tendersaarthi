import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { auth } from './firebase';
import { supabase } from './supabase'; // This is now our shim hitting Cloud SQL

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
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;

        // Add to profiles table in Cloud SQL via our shim
        await supabase.from('profiles').insert([{
            id: user.uid,
            full_name: data.fullName,
            email: data.email,
            phone: data.phone,
            role: 'user'
        }]);

        await updateProfile(user, { displayName: data.fullName });

        return { success: true, user, error: null };
    } catch (error: any) {
        return { success: false, user: null, error: error.message };
    }
}

// Sign in existing user
export async function signIn(credentials: LoginCredentials) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
        const user = userCredential.user;
        return { success: true, user, session: { user }, error: null };
    } catch (error: any) {
        return { success: false, user: null, session: null, error: error.message };
    }
}

// Sign out
export async function signOut() {
    try {
        await firebaseSignOut(auth);
        return { success: true, error: null };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Get current user
export async function getCurrentUser() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            resolve({ user, error: null });
        });
    });
}

// Check if user is logged in
export async function isAuthenticated() {
    return !!auth.currentUser;
}

// Sign in with Google
export async function signInWithGoogle() {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check/Upsert profile in Cloud SQL
        await supabase.from('profiles').insert([{
            id: user.uid,
            full_name: user.displayName,
            email: user.email,
            role: 'user'
        }]);

        return { success: true, user, error: null };
    } catch (error: any) {
        return { success: false, user: null, error: error.message };
    }
}
