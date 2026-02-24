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
        <div className="min-h-screen flex bg-white font-sans">
            {/* Left Side - Brand & Features (Hidden on Mobile) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0a2742] via-[#103e68] to-[#1a62a3] relative overflow-hidden flex-col justify-between p-16">
                {/* Background Decor */}
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute top-1/3 right-10 w-32 h-32 bg-tj-yellow/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Content */}
                <div className="relative z-10 w-full flex-1 flex flex-col">
                    <Link href="/" className="inline-block hover:opacity-90 transition self-start p-2 -ml-2 rounded-xl hover:bg-white/5">
                        <div className="text-3xl font-black flex items-center tracking-tighter">
                            <span className="text-tj-yellow">Tender</span>
                            <span className="text-white">Saarthi</span>
                        </div>
                    </Link>

                    <div className="mt-auto mb-auto max-w-md">
                        <div className="inline-block bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full mb-6 border border-white/10">
                            <span className="text-tj-yellow text-[10px] font-black uppercase tracking-widest pl-1">Sign in to platform</span>
                        </div>
                        <h1 className="text-4xl lg:text-[40px] font-black text-white leading-[1.15] tracking-tight mb-6">
                            Unlock India's Biggest <br /><span className="text-tj-yellow">Opportunities</span>
                        </h1>
                        <p className="text-blue-100 font-medium leading-relaxed text-[15px] opacity-90 max-w-sm">
                            Join thousands of contractors and businesses discovering, managing, and winning tenders effortlessly.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-4 text-blue-200 text-sm font-bold">
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={`w-10 h-10 rounded-full border-[3px] border-[#103e68] flex items-center justify-center text-xs text-white font-bold shadow-md relative ${i === 1 ? 'bg-amber-500 z-30' : i === 2 ? 'bg-blue-500 z-20' : 'bg-emerald-500 z-10'}`}>
                                {i === 1 ? 'K' : i === 2 ? 'R' : 'S'}
                            </div>
                        ))}
                    </div>
                    <div>
                        <div className="flex text-tj-yellow mb-0.5">
                            {[1, 2, 3, 4, 5].map((s) => <span key={s} className="text-[10px]">★</span>)}
                        </div>
                        <p className="text-[11px] font-bold text-white/80">Trusted by <span className="text-white">10,000+</span> businesses</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col p-6 sm:p-12 lg:p-20 relative bg-[#F8FAFC]">
                {/* Mobile/Tablet Logo Only */}
                <div className="lg:hidden flex items-center justify-center mb-8 mt-2">
                    <Link href="/" className="inline-block hover:opacity-90 transition">
                        <div className="text-[28px] font-black flex items-center tracking-tighter shadow-sm bg-white p-3 rounded-2xl border border-slate-100">
                            <span className="text-tj-yellow drop-shadow-sm">Tender</span>
                            <span className="text-[#103e68]">Saarthi</span>
                        </div>
                    </Link>
                </div>

                <Link href="/" className="absolute top-6 lg:top-8 right-6 lg:right-10 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-[#103e68] transition-colors p-2 hover:bg-slate-100 rounded-lg">
                    Back to Home <ArrowLeft size={14} className="rotate-180" />
                </Link>

                <div className="flex-1 flex justify-center mt-6 lg:mt-10 lg:items-center">
                    <div className="w-full max-w-[400px]">
                        <div className="mb-8 text-center lg:text-left">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-3">Welcome Back</h2>
                            <p className="text-slate-500 font-medium text-sm">Please enter your details to sign in.</p>
                        </div>

                        {message && (
                            <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 border shadow-sm ${message.type === 'success'
                                ? 'bg-emerald-50/50 text-emerald-700 border-emerald-200/50'
                                : 'bg-red-50/50 text-red-700 border-red-200/50'
                                }`}>
                                <div className={`p-1.5 rounded-full shrink-0 ${message.type === 'success' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                                    {message.type === 'success' ? <CheckCircle size={16} strokeWidth={2.5} /> : <AlertCircle size={16} strokeWidth={2.5} />}
                                </div>
                                <p className="text-[13px] font-bold tracking-tight">{message.text}</p>
                            </div>
                        )}

                        {/* Social Logins */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                className="flex items-center justify-center gap-2.5 py-3 px-4 bg-white border border-slate-200 rounded-[14px] hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm active:scale-[0.98] transition-all font-bold text-[13px] text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
                            >
                                <svg className="w-[18px] h-[18px] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
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
                                className="flex items-center justify-center gap-2.5 py-3 px-4 bg-white border border-slate-200 rounded-[14px] hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm active:scale-[0.98] transition-all font-bold text-[13px] text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
                            >
                                <svg className="w-[18px] h-[18px] group-hover:scale-110 transition-transform duration-300" fill="#1877F2" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Facebook
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-4 bg-[#F8FAFC] text-slate-400 font-bold uppercase tracking-widest">Or continue with email</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email Field */}
                            <div>
                                <label className="block text-[13px] font-black text-slate-700 mb-1.5">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-focus-within:text-[#103e68] group-focus-within:bg-blue-50 transition-colors">
                                        <Mail size={16} strokeWidth={2.5} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        disabled={isLoading}
                                        placeholder="name@company.com"
                                        className="w-full pl-13 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#103e68]/20 focus:border-[#103e68] outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400 font-medium text-[14px] shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        style={{ paddingLeft: '3.25rem' }}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-[13px] font-black text-slate-700">
                                        Password
                                    </label>
                                    <Link href="/forgot-password" className="text-[12px] font-bold text-[#103e68] hover:text-[#1a62a3] transition-colors outline-none">
                                        Forgot?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-focus-within:text-[#103e68] group-focus-within:bg-blue-50 transition-colors">
                                        <Lock size={16} strokeWidth={2.5} />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        disabled={isLoading}
                                        placeholder="••••••••"
                                        className="w-full pl-13 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#103e68]/20 focus:border-[#103e68] outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400 font-medium text-[14px] shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        style={{ paddingLeft: '3.25rem' }}
                                    />
                                    <button
                                        type="button"
                                        disabled={isLoading}
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors outline-none"
                                    >
                                        {showPassword ? <EyeOff size={16} strokeWidth={2.5} /> : <Eye size={16} strokeWidth={2.5} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#103e68] text-white py-3.5 rounded-xl font-black text-[14px] tracking-wide hover:bg-[#0a2742] active:scale-[0.98] transition-all shadow-[0_5px_20px_rgba(16,62,104,0.3)] flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Signing In...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In Securely</span>
                                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                            <ArrowLeft size={12} className="rotate-180" strokeWidth={3} />
                                        </div>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Sign Up Link */}
                        <p className="text-center mt-8 text-[13px] font-medium text-slate-500">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-[#103e68] font-black hover:text-[#1a62a3] transition-colors outline-none">
                                Create one for free
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
