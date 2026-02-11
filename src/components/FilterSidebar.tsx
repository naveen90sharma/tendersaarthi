'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, Filter, Calendar, X, Check } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getFilterMetadata } from '@/services/tenderService';

export default function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [metadata, setMetadata] = useState<{
        categories: string[];
        states: string[];
        authorities: string[];
        types: string[];
        minPrice: number;
        maxPrice: number;
    }>({
        categories: [],
        states: [],
        authorities: [],
        types: [],
        minPrice: 0,
        maxPrice: 10000000000 // 1000 Cr default
    });

    const [searchQueries, setSearchQueries] = useState<Record<string, string>>({
        category: '',
        location: '',
        authority: '',
        state: '',
        tender_type: ''
    });

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        category: true,
        state: true,
        location: true,
        authority: true,
        value: true,
        tender_type: false,
        publishDate: false,
        submissionDate: false
    });

    const [filters, setFilters] = useState<{
        category: string[];
        state: string[];
        location: string[];
        authority: string[];
        value: string[];
        tender_type: string[];
    }>({
        category: [],
        state: [],
        location: [],
        authority: [],
        value: [],
        tender_type: []
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

    // Fetch metadata
    useEffect(() => {
        const fetchMeta = async () => {
            const res = await getFilterMetadata();
            if (res.success && res.data) {
                setMetadata(res.data);
            }
        };
        fetchMeta();
    }, []);

    // Initialize from URL
    useEffect(() => {
        const cat = searchParams.get('category')?.split(',').filter(Boolean) || [];
        const st = searchParams.get('state')?.split(',').filter(Boolean) || [];
        const loc = searchParams.get('location')?.split(',').filter(Boolean) || [];
        const auth = searchParams.get('authority')?.split(',').filter(Boolean) || [];
        const val = searchParams.get('value')?.split(',').filter(Boolean) || [];
        const typ = searchParams.get('tender_type')?.split(',').filter(Boolean) || [];

        const pubFrom = searchParams.get('publishDateFrom') || '';
        const pubTo = searchParams.get('publishDateTo') || '';
        const subFrom = searchParams.get('submissionDateFrom') || '';
        const subTo = searchParams.get('submissionDateTo') || '';

        // Only update if actually different to prevent infinite loop
        const newFilters = {
            category: cat,
            state: st,
            location: loc,
            authority: auth,
            value: val,
            tender_type: typ
        };

        if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
            setFilters(newFilters);
        }

        const newDates = {
            publishDateFrom: pubFrom,
            publishDateTo: pubTo,
            submissionDateFrom: subFrom,
            submissionDateTo: subTo
        };

        if (JSON.stringify(newDates) !== JSON.stringify(dateRanges)) {
            setDateRanges(newDates);
        }
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

    // For the slider, we use a 0-1000 scale and map it to minPrice-maxPrice
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

    useEffect(() => {
        if (metadata.maxPrice > 0) {
            const urlMin = Number(searchParams.get('minPrice')) || 0;
            const urlMax = Number(searchParams.get('maxPrice')) || metadata.maxPrice;

            // Map actual values to 0-1000 slider range (prevent division by zero)
            const sliderMin = Math.round((urlMin / metadata.maxPrice) * 1000);
            const sliderMax = Math.round((urlMax / metadata.maxPrice) * 1000);

            // Validate numbers to prevent NaN
            if (!isNaN(sliderMin) && !isNaN(sliderMax)) {
                setPriceRange({ min: sliderMin, max: sliderMax });
            }
        }
    }, [searchParams, metadata.maxPrice]);

    // A more advanced logarithmic-style mapping for better control
    // Slider 0-1000:
    // 0-333: 0 to 10 Cr (33% of slider for the first 10 Cr)
    // 333-666: 10 Cr to 500 Cr (33% for mid range)
    // 666-1000: 500 Cr to Max (33% for top range)
    const getActualValue = (sliderVal: number) => {
        const maxValue = metadata.maxPrice || 10000000000;
        if (sliderVal <= 333) {
            // 0 to 10 Cr
            return Math.round((sliderVal / 333) * 100000000);
        } else if (sliderVal <= 666) {
            // 10 Cr to 500 Cr
            const ratio = (sliderVal - 333) / 333;
            return Math.round(100000000 + ratio * (5000000000 - 100000000));
        } else {
            // 500 Cr to Max
            const ratio = (sliderVal - 666) / 334;
            return Math.round(5000000000 + ratio * (maxValue - 5000000000));
        }
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
        const value = parseInt(e.target.value);
        if (type === 'min') {
            const newMin = Math.min(value, priceRange.max - 1);
            setPriceRange(prev => ({ ...prev, min: newMin }));
        } else {
            const newMax = Math.max(value, priceRange.min + 1);
            setPriceRange(prev => ({ ...prev, max: newMax }));
        }
    };

    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('minPrice', getActualValue(priceRange.min).toString());
        params.set('maxPrice', getActualValue(priceRange.max).toString());
        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    const handleDateChange = (field: keyof typeof dateRanges, value: string) => {
        setDateRanges(prev => ({ ...prev, [field]: value }));
    };

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        // Update params. Reset page to 1 on filter change
        params.set('page', '1');

        if (filters.category.length > 0) params.set('category', filters.category.join(','));
        else params.delete('category');

        if (filters.state.length > 0) params.set('state', filters.state.join(','));
        else params.delete('state');

        if (filters.location.length > 0) params.set('location', filters.location.join(','));
        else params.delete('location');

        if (filters.authority.length > 0) params.set('authority', filters.authority.join(','));
        else params.delete('authority');

        if (filters.value.length > 0) params.set('value', filters.value.join(','));
        else params.delete('value');

        if (filters.tender_type.length > 0) params.set('tender_type', filters.tender_type.join(','));
        else params.delete('tender_type');

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
        const toDelete = ['category', 'state', 'location', 'authority', 'value', 'tender_type', 'publishDateFrom', 'publishDateTo', 'submissionDateFrom', 'submissionDateTo', 'minPrice', 'maxPrice'];
        toDelete.forEach(p => params.delete(p));
        params.set('page', '1');
        router.push(`?${params.toString()}`);
        setFilters({
            category: [],
            state: [],
            location: [],
            authority: [],
            value: [],
            tender_type: []
        });
        setDateRanges({
            publishDateFrom: '',
            publishDateTo: '',
            submissionDateFrom: '',
            submissionDateTo: ''
        });
        setPriceRange({ min: 0, max: 1000 });
    };

    const formatPrice = (num: number) => {
        if (num === 0) return '0L';
        if (num >= 10000000) {
            const cr = num / 10000000;
            return cr >= 100 ? `${Math.round(cr)}Cr+` : `${cr.toFixed(0)}Cr+`;
        }
        return `${Math.round(num / 100000)}L`;
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
        <div className="space-y-6 sticky top-24">
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
                
                input[type='range'] {
                    -webkit-appearance: none;
                    appearance: none;
                    pointer-events: auto;
                    position: absolute;
                    height: 24px; /* Slightly larger than thumb for better hit area */
                    width: 100%;
                    outline: none;
                    background: none;
                    cursor: pointer;
                    top: 50%;
                    transform: translateY(-50%);
                    margin: 0;
                }
                
                input[type='range']::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #ffffff;
                    border: 2px solid #103e68 !important; /* Force the brand color */
                    cursor: pointer;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
                    transition: all 0.2s;
                    box-sizing: border-box;
                }
                input[type='range']::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #ffffff;
                    border: 2px solid #103e68 !important;
                    cursor: pointer;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.15);
                    transition: all 0.2s;
                    box-sizing: border-box;
                }
                input[type='range']::-webkit-slider-thumb:hover, 
                input[type='range']::-moz-range-thumb:hover {
                    transform: scale(1.1);
                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                }
            `}</style>

            {/* Filter Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        <Filter size={16} />
                    </div>
                    <h2 className="text-lg font-black uppercase tracking-tight text-gray-800">Filters</h2>
                </div>
                <button
                    onClick={clearAll}
                    className="text-xs font-bold text-[#b4bccc] hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-1"
                >
                    <X size={12} />
                    Clear All
                </button>
            </div>

            {/* Tender Amount (Clean Redesign based on Screenshot) */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm leading-none">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2.5">
                        <div className="flex items-center justify-center text-gray-400">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-[17px] text-[#1e293b]">Tender Value (INR)</h3>
                    </div>
                </div>

                <div className="relative h-[20px] mb-6 flex items-center px-1">
                    {/* Background Track */}
                    <div className="absolute left-0 right-0 h-[6px] bg-[#eef2f6] rounded-full top-1/2 -translate-y-1/2"></div>

                    {/* Red Progress Fill */}
                    <div
                        className="absolute h-[6px] bg-[#103e68] rounded-full top-1/2 -translate-y-1/2 transition-all duration-150"
                        style={{
                            left: `${(priceRange.min / 1000) * 100}%`,
                            right: `${100 - (priceRange.max / 1000) * 100}%`
                        }}
                    ></div>

                    {/* Actual Sliders */}
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        step="1"
                        value={priceRange.min}
                        onChange={(e) => handlePriceChange(e, 'min')}
                        className="z-[2] w-full"
                    />
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        step="1"
                        value={priceRange.max}
                        onChange={(e) => handlePriceChange(e, 'max')}
                        className="z-[3] w-full"
                    />
                </div>

                <div className="flex items-center justify-between mt-8">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider">Min</span>
                        <span className="text-[#103e68] text-sm font-black tracking-tight">{formatPrice(getActualValue(priceRange.min))}</span>
                    </div>

                    <button
                        onClick={applyPriceFilter}
                        className="px-5 py-2 bg-[#0f172a] text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-black transition-all shadow-md active:scale-95"
                    >
                        Apply
                    </button>

                    <div className="flex flex-col gap-1 text-right">
                        <span className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider">Max</span>
                        <span className="text-[#103e68] text-sm font-black tracking-tight">{formatPrice(getActualValue(priceRange.max))}</span>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
                <div
                    className="flex items-center gap-2.5 mb-6 cursor-pointer"
                    onClick={() => toggleSection('category')}
                >
                    <Search size={18} className="text-gray-400" />
                    <h3 className="font-bold text-[17px] text-[#1e293b] flex-1">Industry</h3>
                    <ChevronDown size={18} className={`text-gray-400 transition-transform ${openSections.category ? 'rotate-180' : ''}`} />
                </div>

                {openSections.category && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                        {metadata.categories.length > 5 && (
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search Industry..."
                                    className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl pl-9 pr-3 py-2 text-xs font-bold outline-none focus:border-primary/30 transition-all"
                                    value={searchQueries.category}
                                    onChange={(e) => setSearchQueries(prev => ({ ...prev, category: e.target.value }))}
                                />
                            </div>
                        )}
                        <div className="space-y-3">
                            {(metadata.categories.length > 0 ? metadata.categories : ['Construction', 'IT & Services', 'Healthcare', 'Power & Energy'])
                                .filter(item => item.toLowerCase().includes(searchQueries.category.toLowerCase()))
                                .slice(0, 10)
                                .map((item) => (
                                    <label key={item} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                className="peer appearance-none w-[18px] h-[18px] rounded border border-gray-300 checked:bg-primary checked:border-primary transition-all cursor-pointer"
                                                checked={filters.category.includes(item)}
                                                onChange={() => handleCheck('category', item)}
                                            />
                                            <Check size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 scale-90 peer-checked:scale-100 transition-all pointer-events-none" />
                                        </div>
                                        <span className={`text-[15px] font-medium transition-colors ${filters.category.includes(item) ? 'text-[#1e293b]' : 'text-[#64748b] group-hover:text-[#1e293b]'}`}>
                                            {item}
                                        </span>
                                    </label>
                                ))}
                        </div>
                    </div>
                )}
            </div>

            {/* State Filter */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
                <div
                    className="flex items-center gap-2.5 mb-6 cursor-pointer"
                    onClick={() => toggleSection('state')}
                >
                    <div className="text-gray-400">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    </div>
                    <h3 className="font-bold text-[17px] text-[#1e293b] flex-1">Location</h3>
                    <ChevronDown size={18} className={`text-gray-400 transition-transform ${openSections.state ? 'rotate-180' : ''}`} />
                </div>

                {openSections.state && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                        {metadata.states.length > 5 && (
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search State..."
                                    className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl pl-9 pr-3 py-2 text-xs font-bold outline-none focus:border-primary/30 transition-all"
                                    value={searchQueries.state}
                                    onChange={(e) => setSearchQueries(prev => ({ ...prev, state: e.target.value }))}
                                />
                            </div>
                        )}
                        <div className="space-y-3">
                            {(metadata.states.length > 0 ? metadata.states : ['New Delhi', 'Maharashtra', 'Karnataka', 'Telangana', 'Tamil Nadu'])
                                .filter(item => item.toLowerCase().includes(searchQueries.state.toLowerCase()))
                                .slice(0, 10)
                                .map((item) => (
                                    <label key={item} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                className="peer appearance-none w-[18px] h-[18px] rounded border border-gray-300 checked:bg-primary checked:border-primary transition-all cursor-pointer"
                                                checked={filters.state.includes(item)}
                                                onChange={() => handleCheck('state', item)}
                                            />
                                            <Check size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 scale-90 peer-checked:scale-100 transition-all pointer-events-none" />
                                        </div>
                                        <span className={`text-[15px] font-medium transition-colors ${filters.state.includes(item) ? 'text-[#1e293b]' : 'text-[#64748b] group-hover:text-[#1e293b]'}`}>
                                            {item}
                                        </span>
                                    </label>
                                ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Authority Filter */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
                <div
                    className="flex items-center gap-2.5 mb-6 cursor-pointer"
                    onClick={() => toggleSection('authority')}
                >
                    <div className="text-gray-400">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    </div>
                    <h3 className="font-bold text-[17px] text-[#1e293b] flex-1">Authority</h3>
                    <ChevronDown size={18} className={`text-gray-400 transition-transform ${openSections.authority ? 'rotate-180' : ''}`} />
                </div>

                {openSections.authority && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                        {metadata.authorities.length > 5 && (
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search Authority..."
                                    className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl pl-9 pr-3 py-2 text-xs font-bold outline-none focus:border-primary/30 transition-all"
                                    value={searchQueries.authority}
                                    onChange={(e) => setSearchQueries(prev => ({ ...prev, authority: e.target.value }))}
                                />
                            </div>
                        )}
                        <div className="space-y-3">
                            {(metadata.authorities.length > 0 ? metadata.authorities : ['PWD', 'Railways', 'Municipal Corp', 'NHAI'])
                                .filter(item => item.toLowerCase().includes(searchQueries.authority.toLowerCase()))
                                .slice(0, 10)
                                .map((item) => (
                                    <label key={item} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                className="peer appearance-none w-[18px] h-[18px] rounded border border-gray-300 checked:bg-primary checked:border-primary transition-all cursor-pointer"
                                                checked={filters.authority.includes(item)}
                                                onChange={() => handleCheck('authority', item)}
                                            />
                                            <Check size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 scale-90 peer-checked:scale-100 transition-all pointer-events-none" />
                                        </div>
                                        <span className={`text-[15px] font-medium transition-colors ${filters.authority.includes(item) ? 'text-[#1e293b]' : 'text-[#64748b] group-hover:text-[#1e293b]'}`}>
                                            {item}
                                        </span>
                                    </label>
                                ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Procurement Type */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div
                    className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50/50 transition-colors"
                    onClick={() => toggleSection('tender_type')}
                >
                    <h3 className="font-black text-xs text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Filter size={14} className="text-primary" />
                        Tender Type
                    </h3>
                    <div className={`transition-transform duration-300 ${openSections.tender_type ? 'rotate-180' : ''}`}>
                        <ChevronDown size={14} className="text-gray-300" />
                    </div>
                </div>

                {openSections.tender_type && (
                    <div className="px-5 pb-5 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                        {(metadata.types.length > 0 ? metadata.types : ['Open Tender', 'Limited Tender', 'RFP', 'RFQ', 'EOI'])
                            .map((item) => (
                                <label key={item} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            className="peer appearance-none w-5 h-5 rounded-lg border-2 border-gray-100 checked:bg-primary checked:border-primary transition-all cursor-pointer"
                                            checked={filters.tender_type.includes(item)}
                                            onChange={() => handleCheck('tender_type', item)}
                                        />
                                        <X size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 rotate-45 scale-75 peer-checked:scale-100 transition-all pointer-events-none" />
                                    </div>
                                    <span className={`text-sm font-bold tracking-tight transition-colors ${filters.tender_type.includes(item) ? 'text-primary' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                        {item}
                                    </span>
                                </label>
                            ))}
                    </div>
                )}
            </div>

            {/* Timeline Filter */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
                <div className="flex items-center gap-2.5 mb-6">
                    <Calendar size={18} className="text-gray-400" />
                    <h3 className="font-bold text-[17px] text-[#1e293b]">Timeline</h3>
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[12px] font-bold text-[#64748b] uppercase tracking-wider pl-1">Publish Date</label>
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="date"
                                value={dateRanges.publishDateFrom}
                                onChange={(e) => handleDateChange('publishDateFrom', e.target.value)}
                                className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl px-3 py-2.5 text-[12px] font-bold outline-none focus:border-primary transition-all"
                            />
                            <input
                                type="date"
                                value={dateRanges.publishDateTo}
                                onChange={(e) => handleDateChange('publishDateTo', e.target.value)}
                                className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl px-3 py-2.5 text-[12px] font-bold outline-none focus:border-primary transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[12px] font-bold text-[#64748b] uppercase tracking-wider pl-1">Submission Deadline</label>
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="date"
                                value={dateRanges.submissionDateFrom}
                                onChange={(e) => handleDateChange('submissionDateFrom', e.target.value)}
                                className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl px-3 py-2.5 text-[12px] font-bold outline-none focus:border-primary transition-all"
                            />
                            <input
                                type="date"
                                value={dateRanges.submissionDateTo}
                                onChange={(e) => handleDateChange('submissionDateTo', e.target.value)}
                                className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl px-3 py-2.5 text-[12px] font-bold outline-none focus:border-primary transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Promo */}
            <div className="bg-gradient-to-br from-[#103e68] to-[#0a2f4c] rounded-2xl p-6 text-white relative overflow-hidden group">
                <div className="relative z-10">
                    <h4 className="font-black text-lg leading-tight uppercase tracking-tight mb-2">Join Premium</h4>
                    <p className="text-white/80 text-xs font-bold leading-relaxed mb-4">Get AI-powered suitability checks & early access.</p>
                    <button className="bg-white text-primary px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all">Upgrade Now</button>
                </div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
            </div>
        </div>
    );
}
