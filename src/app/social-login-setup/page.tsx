'use client';

import Link from 'next/link';
import { AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

export default function SocialLoginSetupPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-4">
                        <div className="text-3xl font-bold text-gray-800">
                            <span className="text-primary text-4xl">Tender</span>Saarthi
                        </div>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Social Login Setup Guide</h1>
                    <p className="text-gray-600">Configure Google & Facebook authentication for your application</p>
                </div>

                {/* Warning Note */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8 flex items-start gap-4">
                    <AlertCircle size={24} className="text-yellow-600 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-bold text-yellow-800 mb-2">Social Login Not Working?</h3>
                        <p className="text-yellow-700 text-sm">
                            Social login requires OAuth provider configuration in your Supabase dashboard.
                            Follow the steps below to enable Google and Facebook authentication.
                        </p>
                    </div>
                </div>

                {/* Google OAuth Setup */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google OAuth Setup
                    </h2>

                    <div className="space-y-4 text-sm text-gray-700">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                            <div>
                                <p className="font-semibold mb-1">Go to Google Cloud Console</p>
                                <a
                                    href="https://console.cloud.google.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline flex items-center gap-1"
                                >
                                    console.cloud.google.com <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                            <div>
                                <p className="font-semibold mb-1">Create OAuth 2.0 Client ID</p>
                                <p className="text-gray-600">APIs & Services → Credentials → Create Credentials → OAuth client ID</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                            <div>
                                <p className="font-semibold mb-1">Configure Authorized Redirect URIs</p>
                                <code className="bg-gray-100 px-2 py-1 rounded text-xs block mt-1 break-all">
                                    https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
                                </code>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                            <div>
                                <p className="font-semibold mb-1">Copy Client ID and Client Secret</p>
                                <p className="text-gray-600">You'll need these for Supabase configuration</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">5</div>
                            <div>
                                <p className="font-semibold mb-1">Enable in Supabase</p>
                                <p className="text-gray-600">Go to: Authentication → Providers → Google → Enable and paste credentials</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Facebook OAuth Setup */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6" fill="#1877F2" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Facebook OAuth Setup
                    </h2>

                    <div className="space-y-4 text-sm text-gray-700">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                            <div>
                                <p className="font-semibold mb-1">Go to Facebook Developers</p>
                                <a
                                    href="https://developers.facebook.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline flex items-center gap-1"
                                >
                                    developers.facebook.com <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                            <div>
                                <p className="font-semibold mb-1">Create an App</p>
                                <p className="text-gray-600">My Apps → Create App → Consumer</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                            <div>
                                <p className="font-semibold mb-1">Add Facebook Login Product</p>
                                <p className="text-gray-600">Dashboard → Add Product → Facebook Login</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                            <div>
                                <p className="font-semibold mb-1">Configure OAuth Redirect URI</p>
                                <code className="bg-gray-100 px-2 py-1 rounded text-xs block mt-1 break-all">
                                    https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
                                </code>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">5</div>
                            <div>
                                <p className="font-semibold mb-1">Copy App ID and App Secret</p>
                                <p className="text-gray-600">Settings → Basic → App ID & App Secret</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">6</div>
                            <div>
                                <p className="font-semibold mb-1">Enable in Supabase</p>
                                <p className="text-gray-600">Go to: Authentication → Providers → Facebook → Enable and paste credentials</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                    <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                        <CheckCircle size={20} />
                        Quick Access Links
                    </h3>
                    <div className="space-y-2">
                        <a
                            href="https://supabase.com/dashboard/project/_/auth/providers"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-2"
                        >
                            <ExternalLink size={14} />
                            Supabase Authentication Providers
                        </a>
                        <a
                            href="https://supabase.com/docs/guides/auth/social-login/auth-google"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-2"
                        >
                            <ExternalLink size={14} />
                            Supabase Google Auth Documentation
                        </a>
                        <a
                            href="https://supabase.com/docs/guides/auth/social-login/auth-facebook"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-blue-700 hover:text-blue-900 hover:underline flex items-center gap-2"
                        >
                            <ExternalLink size={14} />
                            Supabase Facebook Auth Documentation
                        </a>
                    </div>
                </div>

                {/* Testing Note */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                    <h3 className="font-bold text-green-800 mb-2">After Setup</h3>
                    <p className="text-green-700 text-sm">
                        Once you've configured both providers in Supabase, the Google and Facebook login buttons
                        on the Login and Register pages will work automatically. No code changes needed!
                    </p>
                </div>

                {/* Back Button */}
                <div className="text-center">
                    <Link
                        href="/login"
                        className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
