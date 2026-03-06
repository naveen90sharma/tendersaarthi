'use client';

import { useState } from 'react';
import { User, Lock, Mail, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, signInWithGoogle, signInWithFacebook } from '@/services/auth';

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        const result = await signIn(formData);

        if (result.success) {
            setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
            setTimeout(() => {
                router.push('/');
            }, 1000);
        } else {
            setMessage({ type: 'error', text: result.error || 'Login failed. Please check your credentials.' });
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        const result = await signInWithGoogle();
        if (!result.success) {
            setMessage({ type: 'error', text: result.error || 'Google login failed' });
            setIsLoading(false);
        }
    };

    const handleFacebookLogin = async () => {
        setIsLoading(true);
        const result = await signInWithFacebook();
        if (!result.success) {
            setMessage({ type: 'error', text: result.error || 'Facebook login failed' });
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a2742] font-sans selection:bg-tj-yellow/30">
            {/* Animated Background Mesh/Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-tj-yellow/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-white/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="relative z-10 w-full max-w-[1100px] flex flex-col items-center px-4 py-8">
                {/* Main Glass Card */}
                <div className="w-full grid lg:grid-cols-2 bg-white/[0.04] backdrop-blur-[50px] border border-white/10 rounded-[40px] overflow-hidden shadow-[0_32px_80px_-16px_rgba(0,0,0,0.6)]">
                    {/* Left Info Panel */}
                    <div className="hidden lg:flex flex-col justify-center p-16 bg-gradient-to-br from-white/[0.08] to-transparent border-r border-white/5">
                        <div className="inline-flex items-center gap-2 bg-tj-yellow/10 border border-tj-yellow/20 px-4 py-1.5 rounded-full mb-8 self-start">
                            <div className="w-1.5 h-1.5 bg-tj-yellow rounded-full animate-ping"></div>
                            <span className="text-tj-yellow text-[10px] font-black uppercase tracking-[0.2em]">Secure Gateway</span>
                        </div>
                        <h1 className="text-[44px] leading-[1.1] font-black text-white tracking-tight mb-8">
                            Welcome back to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-tj-yellow to-amber-200">Hub of Opportunities</span>
                        </h1>
                        <p className="text-slate-400 font-medium text-lg leading-relaxed mb-10 max-w-sm">
                            Access real-time tender data, AI-powered analysis, and direct bid support in one place.
                        </p>

                        <div className="grid grid-cols-2 gap-6 pt-6 mt-6 border-t border-white/10">
                            <div>
                                <div className="text-white font-black text-2xl">10K+</div>
                                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Users</div>
                            </div>
                            <div>
                                <div className="text-white font-black text-2xl">98%</div>
                                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Success Rate</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Form Panel */}
                    <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white/5">
                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-white tracking-tight mb-2">Member Login</h2>
                            <p className="text-white/40 font-medium text-sm">Elevate your business bidding journey.</p>
                        </div>

                        {message && (
                            <div className={`mb-8 p-5 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 border backdrop-blur-md ${message.type === 'success'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}>
                                <div className={`p-2 rounded-2xl shrink-0 ${message.type === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                </div>
                                <p className="text-[14px] font-bold leading-tight">{message.text}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email */}
                            <div className="group">
                                <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-tj-yellow transition-colors">
                                    Corporate Email
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-tj-yellow transition-all duration-300">
                                        <Mail size={18} strokeWidth={2.5} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        disabled={isLoading}
                                        placeholder="Enter your email"
                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-[20px] focus:bg-white/[0.08] focus:border-tj-yellow/50 focus:ring-4 focus:ring-tj-yellow/5 outline-none transition-all duration-300 text-white font-medium placeholder:text-white/20"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="group">
                                <div className="flex items-center justify-between mb-2 ml-1">
                                    <label className="block text-xs font-black text-white/40 uppercase tracking-widest group-focus-within:text-tj-yellow transition-colors">
                                        Access Key
                                    </label>
                                    <Link href="/forgot-password" size="sm" className="text-[11px] font-black text-white/30 hover:text-tj-yellow transition-colors tracking-wider uppercase">
                                        Forgot?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-tj-yellow transition-all duration-300">
                                        <Lock size={18} strokeWidth={2.5} />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        disabled={isLoading}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-14 py-4 bg-white/5 border border-white/10 rounded-[20px] focus:bg-white/[0.08] focus:border-tj-yellow/50 focus:ring-4 focus:ring-tj-yellow/5 outline-none transition-all duration-300 text-white font-medium placeholder:text-white/20"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        disabled={isLoading}
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Sign In Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-4 bg-gradient-to-r from-tj-yellow to-amber-400 text-[#0a2742] py-4 rounded-[20px] font-black text-base tracking-tight hover:shadow-[0_20px_40px_-10px_rgba(255,183,0,0.4)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-500 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        <span>Authenticating...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Login Activity</span>
                                        <div className="w-6 h-6 rounded-full bg-[#0a2742]/10 flex items-center justify-center group-hover:translate-x-1.5 transition-transform duration-300">
                                            <ArrowLeft size={14} className="rotate-180" strokeWidth={3} />
                                        </div>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Social Auth */}
                        <div className="mt-10">
                            <div className="relative flex items-center justify-center mb-8">
                                <div className="border-t border-white/10 flex-grow"></div>
                                <span className="mx-4 text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">External Auth</span>
                                <div className="border-t border-white/10 flex-grow"></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={isLoading}
                                    className="flex items-center justify-center gap-3 py-3.5 px-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all font-bold text-sm text-white/80 active:scale-95 disabled:opacity-50"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Google
                                </button>
                                <button
                                    type="button"
                                    onClick={handleFacebookLogin}
                                    disabled={isLoading}
                                    className="flex items-center justify-center gap-3 py-3.5 px-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all font-bold text-sm text-white/80 active:scale-95 disabled:opacity-50"
                                >
                                    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    Facebook
                                </button>
                            </div>
                        </div>

                        {/* Redirect to Register */}
                        <div className="mt-12 pt-8 border-t border-white/5 text-center">
                            <p className="text-white/30 text-[13px] font-medium tracking-wide">
                                Don't have a corporate account?{' '}
                                <Link href="/register" className="text-white hover:text-tj-yellow font-black transition-colors ml-1">
                                    Create one for free
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="mt-8 flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                    <Link href="/support" className="hover:text-white transition-colors">Support</Link>
                </div>
            </div>
        </div>
    );
}
