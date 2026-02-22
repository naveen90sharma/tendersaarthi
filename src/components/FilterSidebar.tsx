'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getFilterMetadata } from '@/services/tenderService';
import { X, SlidersHorizontal, ChevronDown, ChevronUp, Search, Calendar, Check } from 'lucide-react';
import {
    Drawer,
    Fab,
    Slider,
    Box,
    Typography,
    TextField,
    InputAdornment,
    Button,
    IconButton,
    Chip,
    useMediaQuery,
    Collapse,
    Badge,
} from '@mui/material';

// ─── Theme ────────────────────────────────────────────────────────────────────
const PRIMARY = '#103e68';
const ACCENT = '#FFC212';

const scrollbarStyle = {
    '&::-webkit-scrollbar': { width: '4px' },
    '&::-webkit-scrollbar-track': { background: 'transparent' },
    '&::-webkit-scrollbar-thumb': { background: '#e2e8f0', borderRadius: '10px' },
};

interface FilterSidebarProps {
    open?: boolean;
    onClose?: () => void;
}

// ─── FilterSection Sub-component ─────────────────────────────────────────────
function FilterSection({
    title,
    icon,
    selectedCount = 0,
    children,
    defaultOpen = true,
}: {
    title: string;
    icon?: React.ReactNode;
    selectedCount?: number;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="rounded-2xl border border-slate-100 overflow-hidden bg-white">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    {icon && <span className="text-slate-400">{icon}</span>}
                    <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">{title}</span>
                    {selectedCount > 0 && (
                        <span className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black text-white"
                            style={{ background: PRIMARY }}>
                            {selectedCount}
                        </span>
                    )}
                </div>
                {open ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
            </button>

            <Collapse in={open}>
                <div className="px-4 pb-4">
                    {children}
                </div>
            </Collapse>
        </div>
    );
}

// ─── CheckItem Sub-component ──────────────────────────────────────────────────
function CheckItem({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <button
            onClick={onChange}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all duration-150 group ${checked
                ? 'bg-blue-50 border border-blue-100'
                : 'hover:bg-slate-50 border border-transparent'
                }`}
        >
            <span className={`flex items-center justify-center w-4.5 h-4.5 rounded-md border-2 shrink-0 transition-all ${checked
                ? 'border-[#103e68] bg-[#103e68]'
                : 'border-slate-300 group-hover:border-slate-400'
                }`}
                style={{ width: 18, height: 18, borderRadius: 5 }}>
                {checked && <Check size={11} className="text-white" strokeWidth={3} />}
            </span>
            <span className={`text-sm transition-colors truncate leading-tight ${checked ? 'text-[#103e68] font-semibold' : 'text-slate-600 font-medium'
                }`}>
                {label}
            </span>
        </button>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FilterSidebar({ open, onClose }: FilterSidebarProps = {}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isDesktop = useMediaQuery('(min-width:1024px)');

    const [internalOpen, setInternalOpen] = useState(false);
    const isMobileOpen = open !== undefined ? open : internalOpen;
    const handleClose = () => { if (onClose) onClose(); else setInternalOpen(false); };

    const [metadata, setMetadata] = useState<{
        categories: string[]; states: string[]; authorities: string[]; types: string[]; minPrice: number; maxPrice: number;
    }>({ categories: [], states: [], authorities: [], types: [], minPrice: 0, maxPrice: 10000000000 });

    const [searchQueries, setSearchQueries] = useState<Record<string, string>>({
        category: '', state: '', authority: '',
    });

    const [filters, setFilters] = useState<{
        category: string[]; state: string[]; location: string[]; authority: string[]; value: string[]; tender_type: string[];
    }>({ category: [], state: [], location: [], authority: [], value: [], tender_type: [] });

    const [dateRanges, setDateRanges] = useState({
        publishDateFrom: '', publishDateTo: '', submissionDateFrom: '', submissionDateTo: '',
    });

    const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);

    // Fetch Metadata
    useEffect(() => {
        const fetchMeta = async () => {
            const res = await getFilterMetadata();
            if (res.success && res.data) setMetadata(res.data);
        };
        fetchMeta();
    }, []);

    // Sync from URL
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

        setFilters(prev => {
            const n = { category: cat, state: st, location: loc, authority: auth, value: val, tender_type: typ };
            return JSON.stringify(n) !== JSON.stringify(prev) ? n : prev;
        });
        setDateRanges(prev => {
            const n = { publishDateFrom: pubFrom, publishDateTo: pubTo, submissionDateFrom: subFrom, submissionDateTo: subTo };
            return JSON.stringify(n) !== JSON.stringify(prev) ? n : prev;
        });
        if (metadata.maxPrice > 0) {
            const urlMin = Number(searchParams.get('minPrice')) || 0;
            const urlMax = Number(searchParams.get('maxPrice')) || metadata.maxPrice;
            setPriceRange([
                Math.round((urlMin / metadata.maxPrice) * 1000),
                Math.round((urlMax / metadata.maxPrice) * 1000),
            ]);
        }
    }, [searchParams, metadata.maxPrice]);

    // Auto-apply debounced
    useEffect(() => {
        const timer = setTimeout(() => applyFilters(), 800);
        return () => clearTimeout(timer);
    }, [filters, dateRanges]);

    // Helpers
    const getActualValue = (v: number) => Math.round((v / 1000) * (metadata.maxPrice || 10000000000));
    const formatPrice = (num: number) => {
        if (num === 0) return '₹0';
        if (num >= 10000000) { const cr = num / 10000000; return `₹${cr >= 100 ? Math.round(cr) : cr.toFixed(1)}Cr`; }
        return `₹${Math.round(num / 100000)}L`;
    };

    const handleCheck = (section: keyof typeof filters, item: string) => {
        setFilters(prev => {
            const cur = prev[section];
            return { ...prev, [section]: cur.includes(item) ? cur.filter(i => i !== item) : [...cur, item] };
        });
    };

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', '1');
        Object.entries(filters).forEach(([key, val]) => {
            if (val.length > 0) params.set(key, val.join(',')); else params.delete(key);
        });
        if (dateRanges.publishDateFrom) params.set('publishDateFrom', dateRanges.publishDateFrom); else params.delete('publishDateFrom');
        if (dateRanges.publishDateTo) params.set('publishDateTo', dateRanges.publishDateTo); else params.delete('publishDateTo');
        if (dateRanges.submissionDateFrom) params.set('submissionDateFrom', dateRanges.submissionDateFrom); else params.delete('submissionDateFrom');
        if (dateRanges.submissionDateTo) params.set('submissionDateTo', dateRanges.submissionDateTo); else params.delete('submissionDateTo');
        router.push(`?${params.toString()}`);
    };

    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('minPrice', getActualValue(priceRange[0]).toString());
        params.set('maxPrice', getActualValue(priceRange[1]).toString());
        params.set('page', '1');
        router.push(`?${params.toString()}`);
        if (!isDesktop) handleClose();
    };

    const clearAll = () => {
        const params = new URLSearchParams(searchParams.toString());
        ['category', 'state', 'location', 'authority', 'value', 'tender_type',
            'publishDateFrom', 'publishDateTo', 'submissionDateFrom', 'submissionDateTo',
            'minPrice', 'maxPrice'].forEach(p => params.delete(p));
        params.set('page', '1');
        router.push(`?${params.toString()}`);
        setFilters({ category: [], state: [], location: [], authority: [], value: [], tender_type: [] });
        setDateRanges({ publishDateFrom: '', publishDateTo: '', submissionDateFrom: '', submissionDateTo: '' });
        setPriceRange([0, 1000]);
        if (!isDesktop) handleClose();
    };

    const totalActive = Object.values(filters).flat().length +
        Object.values(dateRanges).filter(Boolean).length;

    // ─── Active Filter Chips ──────────────────────────────────────────────────
    const allSelectedChips: { label: string; section: keyof typeof filters }[] = [];
    (['category', 'state', 'authority'] as const).forEach(sec => {
        filters[sec].forEach(item => allSelectedChips.push({ label: item, section: sec }));
    });

    // ─── Filter List Render ───────────────────────────────────────────────────
    const renderFilterList = (
        items: string[],
        section: keyof typeof filters,
        searchKey: string,
        placeholder: string
    ) => {
        const filtered = items
            .filter(i => i.toLowerCase().includes((searchQueries[searchKey] || '').toLowerCase()));
        const selected = filters[section];
        const sorted = [...selected.filter(i => filtered.includes(i)), ...filtered.filter(i => !selected.includes(i))];

        return (
            <div>
                {/* Search */}
                <div className="relative mb-3">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={searchQueries[searchKey] || ''}
                        onChange={e => setSearchQueries(p => ({ ...p, [searchKey]: e.target.value }))}
                        className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-200 focus:bg-white transition-all placeholder:text-slate-300"
                    />
                </div>

                {/* Items */}
                <div className="space-y-1 max-h-[180px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                    {sorted.length > 0 ? sorted.slice(0, 12).map(item => (
                        <CheckItem
                            key={item}
                            label={item}
                            checked={selected.includes(item)}
                            onChange={() => handleCheck(section, item)}
                        />
                    )) : (
                        <p className="text-xs text-slate-400 py-3 text-center">No results found</p>
                    )}
                </div>
            </div>
        );
    };

    // ─── Main Content ─────────────────────────────────────────────────────────
    const FilterContent = (
        <div style={{ fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal size={16} className="text-[#103e68]" />
                    <span className="font-black text-slate-800 uppercase tracking-wide text-sm">Filters</span>
                    {totalActive > 0 && (
                        <span className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black text-white"
                            style={{ background: PRIMARY }}>
                            {totalActive}
                        </span>
                    )}
                </div>
                <button
                    onClick={clearAll}
                    className="text-xs font-bold text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                >
                    <X size={12} />
                    Clear All
                </button>
            </div>

            {/* Active Chips */}
            {allSelectedChips.length > 0 && (
                <div className="flex flex-wrap gap-1.5 px-4 py-3 border-b border-slate-50 shrink-0">
                    {allSelectedChips.map(({ label, section }) => (
                        <button
                            key={`${section}-${label}`}
                            onClick={() => handleCheck(section, label)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-100 text-[#103e68] rounded-full text-[11px] font-semibold hover:bg-red-50 hover:border-red-100 hover:text-red-600 transition-all group"
                        >
                            <span className="truncate max-w-[100px]">{label}</span>
                            <X size={10} className="shrink-0 opacity-50 group-hover:opacity-100" />
                        </button>
                    ))}
                </div>
            )}

            {/* Scrollable sections */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: 'thin' }}>

                {/* ── Price Range ─────────────────────────────────────────── */}
                <FilterSection title="Tender Value" defaultOpen={true}>
                    <div className="pt-2">
                        {/* Value labels */}
                        <div className="flex justify-between items-center mb-1">
                            <div className="text-center">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Min</span>
                                <span className="text-sm font-bold text-slate-700">{formatPrice(getActualValue(priceRange[0]))}</span>
                            </div>
                            <div className="text-center">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Max</span>
                                <span className="text-sm font-bold text-slate-700">{formatPrice(getActualValue(priceRange[1]))}</span>
                            </div>
                        </div>

                        {/* Slider */}
                        <Box sx={{ px: 1, mt: 1 }}>
                            <Slider
                                value={priceRange}
                                onChange={(_, v) => setPriceRange(v as number[])}
                                valueLabelDisplay="auto"
                                valueLabelFormat={x => formatPrice(getActualValue(x))}
                                min={0}
                                max={1000}
                                sx={{
                                    color: PRIMARY,
                                    height: 4,
                                    '& .MuiSlider-thumb': {
                                        height: 18, width: 18,
                                        bgcolor: '#fff',
                                        border: `2px solid ${PRIMARY}`,
                                        boxShadow: '0 2px 8px rgba(16,62,104,0.3)',
                                        '&:hover': { boxShadow: '0 0 0 8px rgba(16,62,104,0.1)' }
                                    },
                                    '& .MuiSlider-track': { border: 'none' },
                                    '& .MuiSlider-rail': { bgcolor: '#e2e8f0', opacity: 1 },
                                    '& .MuiSlider-valueLabel': {
                                        bgcolor: PRIMARY, borderRadius: '8px',
                                        fontSize: '0.7rem', fontWeight: 800
                                    }
                                }}
                            />
                        </Box>

                        {/* Quick preset chips */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {[
                                { label: '< 10L', min: 0, max: 1000000 },
                                { label: '10L–1Cr', min: 1000000, max: 10000000 },
                                { label: '1Cr–50Cr', min: 10000000, max: 500000000 },
                                { label: '50Cr+', min: 500000000, max: metadata.maxPrice },
                            ].map(preset => {
                                const max = metadata.maxPrice || 10000000000;
                                const isActive = getActualValue(priceRange[0]) === preset.min && getActualValue(priceRange[1]) === preset.max;
                                return (
                                    <button
                                        key={preset.label}
                                        onClick={() => {
                                            setPriceRange([
                                                Math.round((preset.min / max) * 1000),
                                                Math.round((preset.max / max) * 1000),
                                            ]);
                                        }}
                                        className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold border transition-all ${isActive
                                            ? 'bg-[#103e68] text-white border-[#103e68]'
                                            : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-blue-200 hover:text-[#103e68]'
                                            }`}
                                    >
                                        {preset.label}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={applyPriceFilter}
                            className="mt-3 w-full py-2 bg-[#103e68] hover:bg-[#0a2742] text-white font-bold text-xs rounded-xl transition-colors uppercase tracking-wide"
                        >
                            Apply Range
                        </button>
                    </div>
                </FilterSection>

                {/* ── Category ────────────────────────────────────────────── */}
                <FilterSection
                    title="Category"
                    selectedCount={filters.category.length}
                    defaultOpen={true}
                >
                    {renderFilterList(
                        metadata.categories.length > 0 ? metadata.categories : [],
                        'category', 'category', 'Search categories...'
                    )}
                </FilterSection>

                {/* ── State ───────────────────────────────────────────────── */}
                <FilterSection
                    title="State"
                    selectedCount={filters.state.length}
                    defaultOpen={true}
                >
                    {renderFilterList(
                        metadata.states.length > 0 ? metadata.states : [],
                        'state', 'state', 'Search states...'
                    )}
                </FilterSection>

                {/* ── Authority ───────────────────────────────────────────── */}
                <FilterSection
                    title="Authority / Department"
                    selectedCount={filters.authority.length}
                    defaultOpen={false}
                >
                    {renderFilterList(
                        metadata.authorities.length > 0 ? metadata.authorities : [],
                        'authority', 'authority', 'Search departments...'
                    )}
                </FilterSection>

                {/* ── Deadline / Timeline ─────────────────────────────────── */}
                <FilterSection title="Deadline" icon={<Calendar size={14} />} defaultOpen={false}>
                    <div className="space-y-3 pt-1">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                                Submission Deadline Before
                            </label>
                            <input
                                type="date"
                                value={dateRanges.submissionDateTo}
                                onChange={e => setDateRanges(p => ({ ...p, submissionDateTo: e.target.value }))}
                                className="w-full text-sm bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 outline-none focus:border-blue-200 transition-all text-slate-600"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                                Published After
                            </label>
                            <input
                                type="date"
                                value={dateRanges.publishDateFrom}
                                onChange={e => setDateRanges(p => ({ ...p, publishDateFrom: e.target.value }))}
                                className="w-full text-sm bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 outline-none focus:border-blue-200 transition-all text-slate-600"
                            />
                        </div>
                    </div>
                </FilterSection>

                {/* ── Promo card ──────────────────────────────────────────── */}
                <div
                    className="p-4 rounded-2xl text-white relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, #071e33 100%)` }}
                >
                    <div className="relative z-10">
                        <div className="font-black text-sm mb-1 tracking-tight">🔔 SAVE THIS SEARCH</div>
                        <p className="text-[11px] text-blue-200/70 leading-relaxed mb-3">
                            Get email alerts when new tenders match your filters.
                        </p>
                        <button
                            className="text-[11px] font-bold px-4 py-1.5 rounded-lg transition-all"
                            style={{ background: ACCENT, color: PRIMARY }}
                        >
                            Set Alert
                        </button>
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white opacity-5" />
                </div>

            </div>
        </div>
    );

    // ─── Return ───────────────────────────────────────────────────────────────
    return (
        <>
            {/* Desktop Sticky */}
            <Box sx={{
                display: { xs: 'none', lg: 'flex' },
                flexDirection: 'column',
                position: 'sticky',
                top: 88,
                height: 'calc(100vh - 108px)',
                width: '100%',
                overflow: 'hidden',
                borderRadius: 4,
                border: '1px solid #f1f5f9',
                bgcolor: '#fff',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
            }}>
                {FilterContent}
            </Box>

            {/* Mobile FAB */}
            {open === undefined && (
                <Box sx={{ position: 'fixed', bottom: 20, left: 20, zIndex: 1200, display: { xs: 'block', lg: 'none' } }}>
                    <button
                        onClick={() => setInternalOpen(true)}
                        className="flex items-center gap-2 px-4 py-3 rounded-2xl text-white font-bold text-sm shadow-2xl"
                        style={{ background: PRIMARY, boxShadow: '0 8px 25px rgba(16,62,104,0.4)' }}
                    >
                        <SlidersHorizontal size={17} />
                        Filters
                        {totalActive > 0 && (
                            <span className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black" style={{ background: ACCENT, color: PRIMARY }}>
                                {totalActive}
                            </span>
                        )}
                    </button>
                </Box>
            )}

            {/* Mobile Drawer */}
            <Drawer
                anchor="left"
                open={isMobileOpen}
                onClose={handleClose}
                sx={{
                    display: { xs: 'block', lg: 'none' },
                    '& .MuiDrawer-paper': { width: '100%', maxWidth: 360 },
                }}
            >
                {FilterContent}
            </Drawer>
        </>
    );
}
