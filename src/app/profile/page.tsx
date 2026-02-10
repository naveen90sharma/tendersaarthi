'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/services/auth';
import { supabase } from '@/services/supabase';

export default function ProfilePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        checkAuthAndLoadProfile();
    }, []);

    const checkAuthAndLoadProfile = async () => {
        const { user } = await getCurrentUser();
        if (!user) {
            router.push('/login');
            return;
        }
        setCurrentUser(user);
        setFormData({
            fullName: user.user_metadata?.full_name || '',
            email: user.email || '',
            phone: user.user_metadata?.phone || '',
        });
        setIsLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: formData.fullName,
                    phone: formData.phone,
                }
            });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Profile updated successfully!' });

            // Refresh user data
            const { user } = await getCurrentUser();
            setCurrentUser(user);
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 size={40} className="animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 font-sans">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile Settings</h1>
                    <p className="text-gray-600">Manage your account information</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="text-center mb-6">
                                <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                                    {currentUser?.email?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <h3 className="font-bold text-gray-800 text-lg">
                                    {currentUser?.user_metadata?.full_name || 'User'}
                                </h3>
                                <p className="text-sm text-gray-600">{currentUser?.email}</p>
                            </div>

                            <div className="space-y-2 text-sm">
                                <Link
                                    href="/profile"
                                    className="block px-4 py-2 bg-blue-50 text-primary rounded font-semibold"
                                >
                                    Profile Information
                                </Link>
                                <Link
                                    href="/my-tenders"
                                    className="block px-4 py-2 hover:bg-gray-50 text-gray-700 rounded"
                                >
                                    My Tenders
                                </Link>
                                <Link
                                    href="/my-drafts"
                                    className="block px-4 py-2 hover:bg-gray-50 text-gray-700 rounded"
                                >
                                    My Drafts
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Account Information</h2>

                            {/* Message Display */}
                            {message && (
                                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success'
                                        ? 'bg-green-50 text-green-800 border border-green-200'
                                        : 'bg-red-50 text-red-800 border border-red-200'
                                    }`}>
                                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                    <p className="text-sm font-medium">{message.text}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            disabled={isSaving}
                                            placeholder="Enter your full name"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition disabled:bg-gray-100"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Email (Read-only) */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            disabled
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                                            value={formData.email}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="tel"
                                            disabled={isSaving}
                                            placeholder="+91 XXXXXXXXXX"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition disabled:bg-gray-100"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Save Button */}
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-red-700 transition shadow-md flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Password Reset Section */}
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Lock size={20} className="text-primary" />
                                    Password & Security
                                </h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Want to change your password? We'll send you a password reset link.
                                </p>
                                <Link
                                    href="/reset-password"
                                    className="inline-block text-primary hover:underline font-semibold text-sm"
                                >
                                    Request Password Reset →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
