'use client';

import { useState, useEffect } from 'react';
import { FileText, MapPin, Calendar, IndianRupee, Upload, User, Building2, Clock, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createTender, saveTenderDraft } from '@/services/tenderService';
import { getCurrentUser } from '@/services/auth';

export default function PostTenderPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        tender_id: '',
        reference_no: '',
        authority: '',
        location: '',
        tender_value: '',
        emd_amount: '',
        tender_fee: '',
        tender_type: 'Open Tender',
        tender_category: 'Construction',
        description: '',
        published_date: '',
        bid_submission_end: '',
        bid_opening_date: '',
        period_of_work: '',
        bid_validity: '',
        officialLink: '',
        contact_person: '',
        contact_email: '',
        contact_phone: ''
    });

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const { user } = await getCurrentUser();
        if (!user) {
            setMessage({ type: 'error', text: 'Please login to post tenders' });
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } else {
            setCurrentUser(user);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            setMessage({ type: 'error', text: 'Please login to post tenders' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        const result = await createTender(formData, currentUser.id);

        if (result.success) {
            setMessage({ type: 'success', text: 'Tender published successfully! Redirecting...' });
            setTimeout(() => {
                router.push(`/tender/${result.data.id}`);
            }, 2000);
        } else {
            setMessage({ type: 'error', text: result.error || 'Failed to publish tender. Please try again.' });
            setIsLoading(false);
        }
    };

    const handleSaveDraft = async () => {
        if (!currentUser) {
            setMessage({ type: 'error', text: 'Please login to save drafts' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        const result = await saveTenderDraft(formData, currentUser.id);

        if (result.success) {
            setMessage({ type: 'success', text: 'Draft saved successfully!' });
            setIsLoading(false);
        } else {
            setMessage({ type: 'error', text: result.error || 'Failed to save draft.' });
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 font-sans">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Post New Tender</h1>
                    <p className="text-gray-600">Fill in the details below to publish your tender</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
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
                            {/* Basic Information */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FileText size={20} className="text-primary" />
                                    Basic Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Tender Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            required
                                            disabled={isLoading}
                                            placeholder="Enter tender title"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            value={formData.title}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Tender ID *
                                        </label>
                                        <input
                                            type="text"
                                            name="tender_id"
                                            required
                                            placeholder="e.g., TDR/2025/001"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            value={formData.tender_id}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Reference Number
                                        </label>
                                        <input
                                            type="text"
                                            name="reference_no"
                                            placeholder="Reference No."
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            value={formData.reference_no}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Tender Type *
                                        </label>
                                        <select
                                            name="tender_type"
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            value={formData.tender_type}
                                            onChange={handleChange}
                                        >
                                            <option>Open Tender</option>
                                            <option>Limited Tender</option>
                                            <option>EOI</option>
                                            <option>RFP</option>
                                            <option>RFQ</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Category *
                                        </label>
                                        <select
                                            name="tender_category"
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            value={formData.tender_category}
                                            onChange={handleChange}
                                        >
                                            <option>Construction</option>
                                            <option>IT & Software</option>
                                            <option>Electrical</option>
                                            <option>Transport</option>
                                            <option>Healthcare</option>
                                            <option>Education</option>
                                            <option>Agriculture</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Authority & Location */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Building2 size={20} className="text-primary" />
                                    Authority & Location
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Issuing Authority *
                                        </label>
                                        <input
                                            type="text"
                                            name="authority"
                                            required
                                            placeholder="Enter authority name"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            value={formData.authority}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Location *
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            required
                                            placeholder="City, State"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            value={formData.location}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Financial Details */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <IndianRupee size={20} className="text-primary" />
                                    Financial Details
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Tender Value *
                                        </label>
                                        <input
                                            type="text"
                                            name="tender_value"
                                            required
                                            placeholder="e.g., ₹10,00,000"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            value={formData.tender_value}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            EMD Amount
                                        </label>
                                        <input
                                            type="text"
                                            name="emd_amount"
                                            placeholder="e.g., ₹50,000"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            value={formData.emd_amount}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Document Fee
                                        </label>
                                        <input
                                            type="text"
                                            name="tender_fee"
                                            placeholder="e.g., ₹1,000"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            value={formData.tender_fee}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Important Dates */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Calendar size={20} className="text-primary" />
                                    Important Dates
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Publish Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="published_date"
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            value={formData.published_date}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Bid Submission End *
                                        </label>
                                        <input
                                            type="date"
                                            name="bid_submission_end"
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            value={formData.bid_submission_end}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Bid Opening Date
                                        </label>
                                        <input
                                            type="date"
                                            name="bid_opening_date"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            value={formData.bid_opening_date}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Period of Work
                                        </label>
                                        <input
                                            type="text"
                                            name="period_of_work"
                                            placeholder="e.g., 6 months"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            value={formData.period_of_work}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Bid Validity
                                        </label>
                                        <input
                                            type="text"
                                            name="bid_validity"
                                            placeholder="e.g., 90 days"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            value={formData.bid_validity}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">
                                    Project Description
                                </h2>

                                <textarea
                                    name="description"
                                    rows={6}
                                    placeholder="Provide detailed description of the tender..."
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Links & Contact */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-4">
                                    Official Link & Contact
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Official Tender Link
                                        </label>
                                        <input
                                            type="url"
                                            name="officialLink"
                                            placeholder="https://..."
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            value={formData.officialLink}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Contact Person
                                        </label>
                                        <input
                                            type="text"
                                            name="contact_person"
                                            placeholder="Name"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            value={formData.contact_person}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Contact Email
                                        </label>
                                        <input
                                            type="email"
                                            name="contact_email"
                                            placeholder="email@example.com"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            value={formData.contact_email}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Contact Phone
                                        </label>
                                        <input
                                            type="tel"
                                            name="contact_phone"
                                            placeholder="+91 XXXXXXXXXX"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            value={formData.contact_phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 bg-primary text-white py-3.5 rounded-lg font-bold hover:bg-red-700 transition shadow-md flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Publishing...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            Publish Tender
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveDraft}
                                    disabled={isLoading}
                                    className="flex-1 bg-gray-200 text-gray-700 py-3.5 rounded-lg font-bold hover:bg-gray-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    Save as Draft
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
                            <h3 className="font-bold text-gray-800 mb-4">Guidelines</h3>

                            <div className="space-y-4 text-sm text-gray-600">
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs">1</div>
                                    <p>Provide accurate and complete tender information</p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs">2</div>
                                    <p>Include all important dates and financial details</p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs">3</div>
                                    <p>Add official tender document link if available</p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs">4</div>
                                    <p>Review all details before publishing</p>
                                </div>
                            </div>

                            <hr className="my-6" />

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-xs text-blue-800 font-semibold mb-2">Need Help?</p>
                                <p className="text-xs text-blue-700 mb-3">Our team is here to assist you with tender posting</p>
                                <Link href="/support" className="text-xs text-primary hover:underline font-bold">
                                    Contact Support →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
