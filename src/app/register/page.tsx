'use client';

import { useState } from 'react';
import { User, Lock, Mail, Eye, EyeOff, Phone, Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp, signInWithGoogle, signInWithFacebook } from '@/services/auth';

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        if (formData.password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
            return;
        }

        if (!formData.agreeToTerms) {
            setMessage({ type: 'error', text: 'Please agree to Terms and Conditions' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        const result = await signUp({
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            phone: formData.phone
        });

        if (result.success) {
            setMessage({ type: 'success', text: 'Account created successfully! Redirecting...' });
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } else {
            setMessage({ type: 'error', text: result.error || 'Registration failed. Please try again.' });
            setIsLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setIsLoading(true);
        const result = await signInWithGoogle();
        if (!result.success) {
            setMessage({ type: 'error', text: result.error || 'Google sign up failed' });
            setIsLoading(false);
        }
    };

    const handleFacebookSignup = async () => {
        setIsLoading(true);
        const result = await signInWithFacebook();
        if (!result.success) {
            setMessage({ type: 'error', text: result.error || 'Facebook sign up failed' });
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* Left Side - Brand & Features (Hidden on Mobile) */}
            <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-[#0a2742] via-[#103e68] to-[#1a62a3] relative overflow-hidden flex-col justify-between p-16 sticky top-0 h-screen">
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
                            <span className="text-tj-yellow text-[10px] font-black uppercase tracking-widest pl-1">Join the community</span>
                        </div>
                        <h1 className="text-4xl lg:text-[40px] font-black text-white leading-[1.15] tracking-tight mb-6">
                            Start Winning <br />More <span className="text-tj-yellow">Tenders</span>
                        </h1>
                        <p className="text-blue-100 font-medium leading-relaxed text-[15px] opacity-90 max-w-sm mb-10">
                            Create a free account to get personalized tender alerts, manage bids, and grow your business today.
                        </p>

                        {/* Features List */}
                        <div className="space-y-4">
                            {[
                                { title: 'Personalized Alerts', desc: 'Get notified for tenders that match your exact criteria.' },
                                { title: 'Seamless Bidding', desc: 'Manage checklists and documents in one place.' },
                                { title: 'Expert Support', desc: 'Consulting, JV match-making and 24/7 help.' }
                            ].map((feat, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <div className="w-5 h-5 rounded-full bg-tj-yellow/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <CheckCircle size={12} strokeWidth={3} className="text-tj-yellow" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-[14px] leading-tight mb-1">{feat.title}</p>
                                        <p className="text-blue-200/80 text-[12px] leading-snug">{feat.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-7/12 flex flex-col p-6 sm:p-12 lg:p-16 xl:p-20 relative bg-[#F8FAFC]">
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

                <div className="flex-1 flex justify-center mt-6 lg:mt-0">
                    <div className="w-full max-w-lg">
                        <div className="mb-8 text-center lg:text-left">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-3">Create an Account</h2>
                            <p className="text-slate-500 font-medium text-sm">Join TenderSaarthi securely in a few seconds.</p>
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
                                onClick={handleGoogleSignup}
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
                                onClick={handleFacebookSignup}
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
                                <span className="px-4 bg-[#F8FAFC] text-slate-400 font-bold uppercase tracking-widest">Or register via email</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Full Name Field */}
                                <div>
                                    <label className="block text-[13px] font-black text-slate-700 mb-1.5">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-focus-within:text-[#103e68] group-focus-within:bg-blue-50 transition-colors">
                                            <User size={16} strokeWidth={2.5} />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            disabled={isLoading}
                                            placeholder="John Doe"
                                            className="w-full pl-13 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#103e68]/20 focus:border-[#103e68] outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400 font-medium text-[14px] shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            style={{ paddingLeft: '3.25rem' }}
                                        />
                                    </div>
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label className="block text-[13px] font-black text-slate-700 mb-1.5">
                                        Phone No.
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-focus-within:text-[#103e68] group-focus-within:bg-blue-50 transition-colors">
                                            <Phone size={16} strokeWidth={2.5} />
                                        </div>
                                        <input
                                            type="tel"
                                            disabled={isLoading}
                                            placeholder="+91"
                                            className="w-full pl-13 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#103e68]/20 focus:border-[#103e68] outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400 font-medium text-[14px] shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            style={{ paddingLeft: '3.25rem' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-[13px] font-black text-slate-700 mb-1.5">
                                    Email Address <span className="text-red-500">*</span>
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
                                        className="w-full pl-13 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#103e68]/20 focus:border-[#103e68] outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400 font-medium text-[14px] shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        style={{ paddingLeft: '3.25rem' }}
                                    />
                                </div>
                            </div>

                            {/* Passwords - Grid Layout on Desktop */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[13px] font-black text-slate-700 mb-1.5">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-focus-within:text-[#103e68] group-focus-within:bg-blue-50 transition-colors">
                                            <Lock size={16} strokeWidth={2.5} />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            disabled={isLoading}
                                            placeholder="••••••••"
                                            className="w-full pl-13 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#103e68]/20 focus:border-[#103e68] outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400 font-medium text-[14px] shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
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

                                <div>
                                    <label className="block text-[13px] font-black text-slate-700 mb-1.5">
                                        Confirm <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-focus-within:text-[#103e68] group-focus-within:bg-blue-50 transition-colors">
                                            <Lock size={16} strokeWidth={2.5} />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            required
                                            disabled={isLoading}
                                            placeholder="••••••••"
                                            className="w-full pl-13 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#103e68]/20 focus:border-[#103e68] outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400 font-medium text-[14px] shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            style={{ paddingLeft: '3.25rem' }}
                                        />
                                        <button
                                            type="button"
                                            disabled={isLoading}
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors outline-none"
                                        >
                                            {showConfirmPassword ? <EyeOff size={16} strokeWidth={2.5} /> : <Eye size={16} strokeWidth={2.5} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Terms & Conditions */}
                            <div className="flex items-start gap-3 mt-4 pt-2">
                                <input
                                    type="checkbox"
                                    disabled={isLoading}
                                    checked={formData.agreeToTerms}
                                    onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                                    className="peer w-5 h-5 mt-0.5 border-slate-300 rounded focus:ring-[#103e68]/30 text-[#103e68] cursor-pointer"
                                />
                                <label className="text-[13px] text-slate-600 leading-tight peer-disabled:opacity-50 cursor-pointer" onClick={() => !isLoading && setFormData({ ...formData, agreeToTerms: !formData.agreeToTerms })}>
                                    I agree to TenderSaarthi's{' '}
                                    <Link href="/terms" className="text-[#103e68] hover:text-[#1a62a3] font-bold underline decoration-[#103e68]/20 underline-offset-2" onClick={e => e.stopPropagation()}>
                                        Terms & Conditions
                                    </Link>
                                    {' '}and{' '}
                                    <Link href="/privacy" className="text-[#103e68] hover:text-[#1a62a3] font-bold underline decoration-[#103e68]/20 underline-offset-2" onClick={e => e.stopPropagation()}>
                                        Privacy Policy
                                    </Link>.
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-tj-yellow text-[#0a2742] py-3.5 rounded-xl font-black text-[14px] tracking-wide hover:bg-[#ffcf33] active:scale-[0.98] transition-all shadow-[0_5px_20px_rgba(255,183,0,0.3)] flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Create Free Account</span>
                                        <div className="w-5 h-5 rounded-full bg-[#0a2742]/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                            <ArrowLeft size={12} className="rotate-180" strokeWidth={3} />
                                        </div>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Sign In Link */}
                        <p className="text-center mt-6 mb-10 text-[13px] font-medium text-slate-500">
                            Already have an account?{' '}
                            <Link href="/login" className="text-[#103e68] font-black hover:text-[#1a62a3] transition-colors outline-none">
                                Sign In here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
