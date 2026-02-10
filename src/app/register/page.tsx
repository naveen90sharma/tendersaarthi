'use client';

import { useState } from 'react';
import { User, Lock, Mail, Eye, EyeOff, Phone, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
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
            setMessage({ type: 'success', text: 'Account created successfully! Please check your email to verify your account.' });
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <div className="text-3xl font-bold text-gray-800">
                            <span className="text-primary text-4xl">Tender</span>Saarthi
                        </div>
                    </Link>
                    <p className="text-gray-600 mt-2 text-sm">Create your account</p>
                </div>

                {/* Register Form Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
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

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    disabled={isLoading}
                                    placeholder="Enter your full name"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address *
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    disabled={isLoading}
                                    placeholder="Enter your email"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="tel"
                                    disabled={isLoading}
                                    placeholder="+91 XXXXXXXXXX"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password *
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    disabled={isLoading}
                                    placeholder="Create a password"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    disabled={isLoading}
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirm Password *
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    disabled={isLoading}
                                    placeholder="Confirm your password"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                                <button
                                    type="button"
                                    disabled={isLoading}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Terms & Conditions */}
                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                disabled={isLoading}
                                checked={formData.agreeToTerms}
                                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                                className="w-4 h-4 mt-1 text-primary border-gray-300 rounded focus:ring-primary disabled:cursor-not-allowed"
                            />
                            <label className="text-sm text-gray-600">
                                I agree to the{' '}
                                <Link href="/terms" className="text-primary hover:underline font-semibold">
                                    Terms and Conditions
                                </Link>
                                {' '}and{' '}
                                <Link href="/privacy" className="text-primary hover:underline font-semibold">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-red-700 transition shadow-md flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <User size={18} />
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or sign up with</span>
                        </div>
                    </div>

                    {/* Social Signup Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={handleGoogleSignup}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                            onClick={handleFacebookSignup}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                        </button>
                    </div>

                    {/* Social Login Setup Note */}
                    <p className="text-center mt-3 text-xs text-gray-500">
                        Social sign-up not working?{' '}
                        <Link href="/social-login-setup" className="text-primary hover:underline font-semibold">
                            View setup guide
                        </Link>
                    </p>

                    {/* Sign In Link */}
                    <p className="text-center mt-6 text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary font-semibold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link href="/" className="text-gray-600 hover:text-primary text-sm font-medium">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
