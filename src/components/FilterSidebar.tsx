'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, Filter, Calendar } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        category: true,
        location: true,
        authority: true,
        value: true,
        publishDate: true,
        submissionDate: true
    });

    const [filters, setFilters] = useState<{
        category: string[];
        location: string[];
        authority: string[];
        value: string[];
    }>({
        category: [],
        location: [],
        authority: [],
        value: []
    });

    const [dateRanges, setDateRanges] = useState<{
        publishDateFrom: string;
        publishDateTo: string;
        submissionDateFrom: string;
        submissionDateTo: string;
    }>({
        publishDateFrom: '',
        publishDateTo: '',
        submissionDateFrom: '',
        submissionDateTo: ''
    });

    // Initialize from URL
    useEffect(() => {
        const cat = searchParams.get('category')?.split(',').filter(Boolean) || [];
        const loc = searchParams.get('location')?.split(',').filter(Boolean) || [];
        const auth = searchParams.get('authority')?.split(',').filter(Boolean) || [];
        const val = searchParams.get('value')?.split(',').filter(Boolean) || [];

        const pubFrom = searchParams.get('publishDateFrom') || '';
        const pubTo = searchParams.get('publishDateTo') || '';
        const subFrom = searchParams.get('submissionDateFrom') || '';
        const subTo = searchParams.get('submissionDateTo') || '';

        setFilters({
            category: cat,
            location: loc,
            authority: auth,
            value: val
        });

        setDateRanges({
            publishDateFrom: pubFrom,
            publishDateTo: pubTo,
            submissionDateFrom: subFrom,
            submissionDateTo: subTo
        });
    }, [searchParams]);

    // Auto-apply filters whenever filters or dateRanges change
    useEffect(() => {
        const timer = setTimeout(() => {
            applyFilters();
        }, 500); // Debounce to avoid too many updates

        return () => clearTimeout(timer);
    }, [filters, dateRanges]);

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleCheck = (section: keyof typeof filters, item: string) => {
        setFilters(prev => {
            const current = prev[section];
            const exists = current.includes(item);
            let updated;
            if (exists) {
                updated = current.filter(i => i !== item);
            } else {
                updated = [...current, item];
            }
            return { ...prev, [section]: updated };
        });
    };

    const handleDateChange = (field: keyof typeof dateRanges, value: string) => {
        setDateRanges(prev => ({ ...prev, [field]: value }));
    };

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        // Update params. Reset page to 1 on filter change
        params.set('page', '1');

        // Checkbox filters
        if (filters.category.length > 0) params.set('category', filters.category.join(','));
        else params.delete('category');

        if (filters.location.length > 0) params.set('location', filters.location.join(','));
        else params.delete('location');

        if (filters.authority.length > 0) params.set('authority', filters.authority.join(','));
        else params.delete('authority');

        if (filters.value.length > 0) params.set('value', filters.value.join(','));
        else params.delete('value');

        // Date range filters
        if (dateRanges.publishDateFrom) params.set('publishDateFrom', dateRanges.publishDateFrom);
        else params.delete('publishDateFrom');

        if (dateRanges.publishDateTo) params.set('publishDateTo', dateRanges.publishDateTo);
        else params.delete('publishDateTo');

        if (dateRanges.submissionDateFrom) params.set('submissionDateFrom', dateRanges.submissionDateFrom);
        else params.delete('submissionDateFrom');

        if (dateRanges.submissionDateTo) params.set('submissionDateTo', dateRanges.submissionDateTo);
        else params.delete('submissionDateTo');

        router.push(`?${params.toString()}`);
    };

    const clearAll = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('category');
        params.delete('location');
        params.delete('authority');
        params.delete('value');
        params.delete('publishDateFrom');
        params.delete('publishDateTo');
        params.delete('submissionDateFrom');
        params.delete('submissionDateTo');
        params.set('page', '1');
        router.push(`?${params.toString()}`);
        setFilters({ category: [], location: [], authority: [], value: [] });
        setDateRanges({
            publishDateFrom: '',
            publishDateTo: '',
            submissionDateFrom: '',
            submissionDateTo: ''
        });
    };

    const renderCheckbox = (section: keyof typeof filters, item: string) => (
        <label key={item} className="flex items-center gap-2 cursor-pointer group">
            <input
                type="checkbox"
                className="w-3.5 h-3.5 rounded border-gray-300 text-primary focus:ring-primary"
                checked={filters[section].includes(item)}
                onChange={() => handleCheck(section, item)}
            />
            <span className={`text-sm ${filters[section].includes(item) ? 'text-primary font-medium' : 'text-gray-600'} group-hover:text-primary`}>
                {item}
            </span>
        </label>
    );

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-24">
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
            `}</style>

            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Filter size={18} />
                    Filters
                </h3>
                <button onClick={clearAll} className="text-xs text-primary font-medium hover:underline">Clear All</button>
            </div>

            <div className="border-b border-gray-100 pb-4 mb-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search filters... (Coming Soon)"
                        disabled
                        className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 pl-8 text-xs focus:ring-1 focus:ring-primary outline-none cursor-not-allowed opacity-60"
                    />
                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* Filter Group: Category */}
            <div className="mb-6">
                <div
                    className="flex justify-between items-center cursor-pointer mb-2"
                    onClick={() => toggleSection('category')}
                >
                    <h4 className="font-semibold text-sm text-gray-700">Category</h4>
                    {openSections['category'] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
                {openSections['category'] && (
                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                        {['Construction', 'IT Software', 'Electrical', 'Transport', 'Medical', 'Consultancy'].map((item) => renderCheckbox('category', item))}
                    </div>
                )}
            </div>

            {/* Filter Group: Location */}
            <div className="mb-6">
                <div
                    className="flex justify-between items-center cursor-pointer mb-2"
                    onClick={() => toggleSection('location')}
                >
                    <h4 className="font-semibold text-sm text-gray-700">Location</h4>
                    {openSections['location'] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
                {openSections['location'] && (
                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                        {['Maharashtra', 'Delhi', 'Karnataka', 'Uttar Pradesh', 'Gujarat', 'Tamil Nadu'].map((item) => renderCheckbox('location', item))}
                    </div>
                )}
            </div>

            {/* Filter Group: Value */}
            <div className="mb-6">
                <div
                    className="flex justify-between items-center cursor-pointer mb-2"
                    onClick={() => toggleSection('value')}
                >
                    <h4 className="font-semibold text-sm text-gray-700">Tender Value</h4>
                    {openSections['value'] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
                {openSections['value'] && (
                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                        {['< 10 Lakhs', '10 Lakhs - 50 Lakhs', '50 Lakhs - 1 Cr', '1 Cr - 10 Cr', '10 Cr+'].map((item) => renderCheckbox('value', item))}
                    </div>
                )}
            </div>

            {/* Filter Group: Authority */}
            <div className="mb-6">
                <div
                    className="flex justify-between items-center cursor-pointer mb-2"
                    onClick={() => toggleSection('authority')}
                >
                    <h4 className="font-semibold text-sm text-gray-700">Authority</h4>
                    {openSections['authority'] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
                {openSections['authority'] && (
                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                        {['PWD', 'Railways', 'Municipal Corp', 'Defense', 'NHAI', 'CPWD'].map((item) => renderCheckbox('authority', item))}
                    </div>
                )}
            </div>

            {/* Filter Group: Bid Publish Date */}
            <div className="mb-6">
                <div
                    className="flex justify-between items-center cursor-pointer mb-2"
                    onClick={() => toggleSection('publishDate')}
                >
                    <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-1">
                        <Calendar size={14} />
                        Bid Publish Date
                    </h4>
                    {openSections['publishDate'] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
                {openSections['publishDate'] && (
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-gray-600 mb-1 block">From</label>
                            <input
                                type="date"
                                value={dateRanges.publishDateFrom}
                                onChange={(e) => handleDateChange('publishDateFrom', e.target.value)}
                                className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600 mb-1 block">To</label>
                            <input
                                type="date"
                                value={dateRanges.publishDateTo}
                                onChange={(e) => handleDateChange('publishDateTo', e.target.value)}
                                className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-primary outline-none"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Filter Group: Bid Submission Date */}
            <div className="mb-6">
                <div
                    className="flex justify-between items-center cursor-pointer mb-2"
                    onClick={() => toggleSection('submissionDate')}
                >
                    <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-1">
                        <Calendar size={14} />
                        Bid Submission Date
                    </h4>
                    {openSections['submissionDate'] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
                {openSections['submissionDate'] && (
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-gray-600 mb-1 block">From</label>
                            <input
                                type="date"
                                value={dateRanges.submissionDateFrom}
                                onChange={(e) => handleDateChange('submissionDateFrom', e.target.value)}
                                className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-600 mb-1 block">To</label>
                            <input
                                type="date"
                                value={dateRanges.submissionDateTo}
                                onChange={(e) => handleDateChange('submissionDateTo', e.target.value)}
                                className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-primary outline-none"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
