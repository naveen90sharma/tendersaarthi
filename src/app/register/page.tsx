'use client';

import { useState } from 'react';
import { User, Lock, Mail, Eye, EyeOff, Phone, Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp, signInWithGoogle } from '@/services/auth';

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


    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a2742] font-sans selection:bg-tj-yellow/30">
            {/* Animated Background Mesh/Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-tj-yellow/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-white/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="relative z-10 w-full max-w-[1200px] flex flex-col items-center px-4 py-8">
                {/* Main Glass Card */}
                <div className="w-full grid lg:grid-cols-5 bg-white/[0.04] backdrop-blur-[50px] border border-white/10 rounded-[40px] overflow-hidden shadow-[0_32px_80px_-16px_rgba(0,0,0,0.6)]">
                    {/* Left Info Panel (2/5 width) */}
                    <div className="hidden lg:flex lg:col-span-2 flex-col justify-between p-12 bg-gradient-to-br from-white/[0.08] to-transparent border-r border-white/5">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-8 self-start">
                                <span className="text-tj-yellow text-[10px] font-black uppercase tracking-[0.2em]">Growth Partner</span>
                            </div>
                            <h1 className="text-[38px] leading-[1.1] font-black text-white tracking-tight mb-8">
                                Start Winning <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-tj-yellow to-amber-200">Bigger Tenders</span>
                            </h1>

                            <div className="space-y-6">
                                {[
                                    { title: 'Personalized Alerts', desc: 'Get relevant tender notifications.' },
                                    { title: 'AI Briefing', desc: 'Summary of complex tender docs.' },
                                    { title: 'Direct Bidding', desc: 'Manage your entire bid lifecycle.' }
                                ].map((feat, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                                            <CheckCircle size={18} className="text-tj-yellow" />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-[15px] mb-0.5">{feat.title}</p>
                                            <p className="text-white/40 text-[13px] leading-snug">{feat.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/10">
                            <div className="flex -space-x-3 mb-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-9 h-9 rounded-full border-2 border-[#103e68] bg-slate-800 flex items-center justify-center text-[10px] text-white font-bold">
                                        U{i}
                                    </div>
                                ))}
                                <div className="w-9 h-9 rounded-full border-2 border-[#103e68] bg-tj-yellow flex items-center justify-center text-[10px] text-[#0a2742] font-black">
                                    +
                                </div>
                            </div>
                            <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest">Joined by 500+ this week</p>
                        </div>
                    </div>

                    {/* Right Form Panel (3/5 width) */}
                    <div className="lg:col-span-3 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white/5">
                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-white tracking-tight mb-2">Create Account</h2>
                            <p className="text-white/40 font-medium text-sm">Join the community of elite contractors.</p>
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

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="group">
                                    <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-tj-yellow transition-colors">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-tj-yellow transition-all duration-300">
                                            <User size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            disabled={isLoading}
                                            placeholder="Business Name"
                                            className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/[0.08] focus:border-tj-yellow/50 focus:ring-4 focus:ring-tj-yellow/5 outline-none transition-all duration-300 text-white font-medium placeholder:text-white/20"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-tj-yellow transition-colors">
                                        Phone No.
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-tj-yellow transition-all duration-300">
                                            <Phone size={18} />
                                        </div>
                                        <input
                                            type="tel"
                                            disabled={isLoading}
                                            placeholder="+91"
                                            className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/[0.08] focus:border-tj-yellow/50 focus:ring-4 focus:ring-tj-yellow/5 outline-none transition-all duration-300 text-white font-medium placeholder:text-white/20"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-tj-yellow transition-colors">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-tj-yellow transition-all duration-300">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        disabled={isLoading}
                                        placeholder="corporate@company.com"
                                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/[0.08] focus:border-tj-yellow/50 focus:ring-4 focus:ring-tj-yellow/5 outline-none transition-all duration-300 text-white font-medium placeholder:text-white/20"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="group">
                                    <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-tj-yellow transition-colors">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-tj-yellow transition-all duration-300">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            disabled={isLoading}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/[0.08] focus:border-tj-yellow/50 focus:ring-4 focus:ring-tj-yellow/5 outline-none transition-all duration-300 text-white font-medium placeholder:text-white/20"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20">
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-black text-white/40 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-tj-yellow transition-colors">
                                        Confirm
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-tj-yellow transition-all duration-300">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            required
                                            disabled={isLoading}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:bg-white/[0.08] focus:border-tj-yellow/50 focus:ring-4 focus:ring-tj-yellow/5 outline-none transition-all duration-300 text-white font-medium placeholder:text-white/20"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20">
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 pt-2">
                                <div className="relative flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        required
                                        checked={formData.agreeToTerms}
                                        onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                                        className="w-5 h-5 bg-white/5 border border-white/10 rounded cursor-pointer checked:bg-tj-yellow"
                                    />
                                </div>
                                <label className="text-[13px] text-white/40 leading-tight">
                                    I agree to TenderSaarthi's{' '}
                                    <Link href="/terms" className="text-white font-bold hover:text-tj-yellow">Terms & Conditions</Link>
                                    {' '}and{' '}
                                    <Link href="/privacy" className="text-white font-bold hover:text-tj-yellow">Privacy Policy</Link>.
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-4 bg-gradient-to-r from-tj-yellow to-amber-400 text-[#0a2742] py-4 rounded-[20px] font-black text-base tracking-tight hover:shadow-[0_20px_40px_-10px_rgba(255,183,0,0.4)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-500 flex items-center justify-center gap-3 group disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        <span>Designing Profile...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Create Exclusive Account</span>
                                        <div className="w-6 h-6 rounded-full bg-[#0a2742]/10 flex items-center justify-center group-hover:translate-x-1.5 transition-transform duration-300">
                                            <ArrowLeft size={14} className="rotate-180" strokeWidth={3} />
                                        </div>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 pt-8 border-t border-white/5 text-center">
                            <p className="text-white/30 text-[13px] font-medium tracking-wide">
                                Already a community member?{' '}
                                <Link href="/login" className="text-white hover:text-tj-yellow font-black transition-colors ml-1">
                                    Sign In here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
