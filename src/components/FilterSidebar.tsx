'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, Calendar, Filter, X, Check, ArrowRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getFilterMetadata } from '@/services/tenderService';
import {
    Drawer,
    Fab,
    Slider,
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    Checkbox,
    FormControlLabel,
    InputAdornment,
    Button,
    IconButton,
    Paper,
    Divider,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// --- Custom Styles & Theme Overrides for "Shaandaar" Look ---
const primaryColor = '#103e68'; // Brand Primary
const accentColor = '#e11d48'; // Brand Accent (Reddish)

// Custom scrollbar style
const scrollbarStyle = {
    '&::-webkit-scrollbar': { width: '6px' },
    '&::-webkit-scrollbar-track': { background: '#f1f5f9' },
    '&::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: '10px' },
    '&::-webkit-scrollbar-thumb:hover': { background: '#94a3b8' },
};

interface FilterSidebarProps {
    open?: boolean;
    onClose?: () => void;
}

export default function FilterSidebar({ open, onClose }: FilterSidebarProps = {}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const theme = useTheme();
    // Using MUI useMediaQuery for responsive checks (sm/md/lg)
    // Note: Tailwind uses 'lg' as 1024px. MUI 'lg' default is 1200px.
    // We'll align with Tailwind 'lg' breakpoint (1024px) approx for consistency
    const isDesktop = useMediaQuery('(min-width:1024px)');

    // --- State ---
    const [internalOpen, setInternalOpen] = useState(false);

    // Derived state: Use prop if available, otherwise internal
    const isMobileOpen = open !== undefined ? open : internalOpen;

    const handleClose = () => {
        if (onClose) onClose();
        else setInternalOpen(false);
    };


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

    // Default expanded sections
    const [expanded, setExpanded] = useState<string[]>(['value', 'category', 'state', 'authority']);

    const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? [...expanded, panel] : expanded.filter(p => p !== panel));
    };

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

    const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);


    // --- Effects ---

    // Fetch Metadata
    useEffect(() => {
        const fetchMeta = async () => {
            const res = await getFilterMetadata();
            if (res.success && res.data) {
                setMetadata(res.data);
            }
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

        // Only update if different
        setFilters(prev => {
            const newFilters = { category: cat, state: st, location: loc, authority: auth, value: val, tender_type: typ };
            return JSON.stringify(newFilters) !== JSON.stringify(prev) ? newFilters : prev;
        });

        setDateRanges(prev => {
            const newDates = { publishDateFrom: pubFrom, publishDateTo: pubTo, submissionDateFrom: subFrom, submissionDateTo: subTo };
            return JSON.stringify(newDates) !== JSON.stringify(prev) ? newDates : prev;
        });

        // Price Sync
        if (metadata.maxPrice > 0) {
            const urlMin = Number(searchParams.get('minPrice')) || 0;
            const urlMax = Number(searchParams.get('maxPrice')) || metadata.maxPrice;
            const sliderMin = Math.round((urlMin / metadata.maxPrice) * 1000);
            const sliderMax = Math.round((urlMax / metadata.maxPrice) * 1000);
            if (!isNaN(sliderMin) && !isNaN(sliderMax)) {
                setPriceRange([sliderMin, sliderMax]);
            }
        }
    }, [searchParams, metadata.maxPrice]);


    // Auto-apply logic (debounced)
    useEffect(() => {
        const timer = setTimeout(() => {
            applyFilters();
        }, 800);
        return () => clearTimeout(timer);
    }, [filters, dateRanges]); // Price applied manually via button for better UX

    // --- Helpers ---

    const getActualValue = (sliderVal: number) => {
        const maxValue = metadata.maxPrice || 10000000000;
        // Simple linear mapping for now, can implement logarithmic if needed
        return Math.round((sliderVal / 1000) * maxValue);
    };

    const formatPrice = (num: number) => {
        if (num === 0) return '0';
        if (num >= 10000000) {
            const cr = num / 10000000;
            return cr >= 100 ? `${Math.round(cr)}Cr` : `${cr.toFixed(1)}Cr`;
        }
        return `${Math.round(num / 100000)}L`;
    };

    const handlePriceSliderChange = (event: Event, newValue: number | number[]) => {
        setPriceRange(newValue as number[]);
    };

    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        const minVal = getActualValue(priceRange[0]);
        const maxVal = getActualValue(priceRange[1]);
        params.set('minPrice', minVal.toString());
        params.set('maxPrice', maxVal.toString());
        params.set('page', '1');
        router.push(`?${params.toString()}`);
        if (!isDesktop) handleClose();
    };

    const handleCheck = (section: keyof typeof filters, item: string) => {
        setFilters(prev => {
            const current = prev[section];
            const exists = current.includes(item);
            const updated = exists ? current.filter(i => i !== item) : [...current, item];
            return { ...prev, [section]: updated };
        });
    };

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', '1');

        Object.entries(filters).forEach(([key, val]) => {
            if (val.length > 0) params.set(key, val.join(','));
            else params.delete(key);
        });

        if (dateRanges.publishDateFrom) params.set('publishDateFrom', dateRanges.publishDateFrom); else params.delete('publishDateFrom');
        if (dateRanges.publishDateTo) params.set('publishDateTo', dateRanges.publishDateTo); else params.delete('publishDateTo');
        if (dateRanges.submissionDateFrom) params.set('submissionDateFrom', dateRanges.submissionDateFrom); else params.delete('submissionDateFrom');
        if (dateRanges.submissionDateTo) params.set('submissionDateTo', dateRanges.submissionDateTo); else params.delete('submissionDateTo');

        router.push(`?${params.toString()}`);
    };

    const clearAll = () => {
        const params = new URLSearchParams(searchParams.toString());
        ['category', 'state', 'location', 'authority', 'value', 'tender_type', 'publishDateFrom', 'publishDateTo', 'submissionDateFrom', 'submissionDateTo', 'minPrice', 'maxPrice']
            .forEach(p => params.delete(p));
        params.set('page', '1');
        router.push(`?${params.toString()}`);
        setFilters({ category: [], state: [], location: [], authority: [], value: [], tender_type: [] });
        setDateRanges({ publishDateFrom: '', publishDateTo: '', submissionDateFrom: '', submissionDateTo: '' });
        setPriceRange([0, 1000]);
        if (!isDesktop) handleClose();
    };


    // --- Render Content ---
    const FilterContent = (
        <Box sx={{
            height: '100%',
            overflowY: 'auto',
            pb: 10,
            ...scrollbarStyle
        }}>
            {/* Header */}
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9' }}>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', textTransform: 'uppercase', fontSize: '1.1rem' }}>
                    Filters
                </Typography>
                <Button
                    onClick={clearAll}
                    size="small"
                    startIcon={<X size={14} />}
                    sx={{
                        color: '#ef4444',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        '&:hover': { bgcolor: '#fee2e2' }
                    }}
                >
                    Clear All
                </Button>
            </Box>

            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>

                {/* --- Price Range --- */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#103e68', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        VALUE (INR)
                    </Typography>

                    <Box sx={{ px: 1 }}>
                        <Slider
                            value={priceRange}
                            onChange={handlePriceSliderChange}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(x) => formatPrice(getActualValue(x))}
                            min={0}
                            max={1000}
                            sx={{
                                color: '#103e68',
                                '& .MuiSlider-thumb': {
                                    height: 20, width: 20, bgcolor: '#fff', border: '2px solid currentColor',
                                    '&:hover': { boxShadow: '0 0 0 8px rgba(16, 62, 104, 0.16)' }
                                },
                                '& .MuiSlider-rail': { opacity: 0.3, bgcolor: '#cbd5e1' }
                            }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, alignItems: 'center' }}>
                        <Box>
                            <Typography variant="caption" display="block" sx={{ fontWeight: 700, color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Min</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>{formatPrice(getActualValue(priceRange[0]))}</Typography>
                        </Box>
                        <Button
                            onClick={applyPriceFilter}
                            variant="contained"
                            size="small"
                            sx={{
                                bgcolor: '#0f172a',
                                color: '#fff',
                                borderRadius: 3,
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                px: 3,
                                boxShadow: 'none',
                                '&:hover': { bgcolor: '#000' }
                            }}
                        >
                            Apply
                        </Button>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="caption" display="block" sx={{ fontWeight: 700, color: '#94a3b8', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Max</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>{formatPrice(getActualValue(priceRange[1]))}</Typography>
                        </Box>
                    </Box>
                </Paper>

                {/* --- Categories --- */}
                <FilterAccordion
                    title="Industry"
                    panel="category"
                    expanded={expanded.includes('category')}
                    onChange={handleAccordionChange('category')}
                    icon={<Search size={16} />}
                >
                    <SearchInput
                        value={searchQueries.category}
                        onChange={(e) => setSearchQueries(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="Search Industry..."
                    />
                    <FilterList>
                        {(metadata.categories.length > 0 ? metadata.categories : ['Construction', 'IT & Services', 'Healthcare', 'Power'])
                            .filter(i => i.toLowerCase().includes(searchQueries.category.toLowerCase()))
                            .slice(0, 10)
                            .map(item => (
                                <FormControlLabel
                                    key={item}
                                    control={
                                        <Checkbox
                                            checked={filters.category.includes(item)}
                                            onChange={() => handleCheck('category', item)}
                                            size="small"
                                            sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#103e68' } }}
                                        />
                                    }
                                    label={<Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: filters.category.includes(item) ? '#0f172a' : '#64748b' }}>{item}</Typography>}
                                    sx={{ ml: 0, mr: 0, width: '100%' }}
                                />
                            ))}
                    </FilterList>
                </FilterAccordion>

                {/* --- State --- */}
                <FilterAccordion
                    title="State"
                    panel="state"
                    expanded={expanded.includes('state')}
                    onChange={handleAccordionChange('state')}
                    icon={<ArrowRight size={16} />} // Using generic icon
                >
                    <SearchInput
                        value={searchQueries.state}
                        onChange={(e) => setSearchQueries(prev => ({ ...prev, state: e.target.value }))}
                        placeholder="Search State..."
                    />
                    <FilterList>
                        {(metadata.states.length > 0 ? metadata.states : ['Delhi', 'Maharashtra', 'Karnataka'])
                            .filter(i => i.toLowerCase().includes(searchQueries.state.toLowerCase()))
                            .slice(0, 10)
                            .map(item => (
                                <FormControlLabel
                                    key={item}
                                    control={
                                        <Checkbox
                                            checked={filters.state.includes(item)}
                                            onChange={() => handleCheck('state', item)}
                                            size="small"
                                            sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#103e68' } }}
                                        />
                                    }
                                    label={<Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: filters.state.includes(item) ? '#0f172a' : '#64748b' }}>{item}</Typography>}
                                    sx={{ ml: 0, mr: 0, width: '100%' }}
                                />
                            ))}
                    </FilterList>
                </FilterAccordion>


                {/* --- Authority --- */}
                <FilterAccordion
                    title="Authority"
                    panel="authority"
                    expanded={expanded.includes('authority')}
                    onChange={handleAccordionChange('authority')}
                    icon={<Check size={16} />} // Generic icon
                >
                    <SearchInput
                        value={searchQueries.authority}
                        onChange={(e) => setSearchQueries(prev => ({ ...prev, authority: e.target.value }))}
                        placeholder="Search Authority..."
                    />
                    <FilterList>
                        {(metadata.authorities.length > 0 ? metadata.authorities : ['PWD', 'Railways', 'NHAI'])
                            .filter(i => i.toLowerCase().includes(searchQueries.authority.toLowerCase()))
                            .slice(0, 10)
                            .map(item => (
                                <FormControlLabel
                                    key={item}
                                    control={
                                        <Checkbox
                                            checked={filters.authority.includes(item)}
                                            onChange={() => handleCheck('authority', item)}
                                            size="small"
                                            sx={{ color: '#cbd5e1', '&.Mui-checked': { color: '#103e68' } }}
                                        />
                                    }
                                    label={<Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: filters.authority.includes(item) ? '#0f172a' : '#64748b' }}>{item}</Typography>}
                                    sx={{ ml: 0, mr: 0, width: '100%' }}
                                />
                            ))}
                    </FilterList>
                </FilterAccordion>


                {/* --- Dates --- */}
                <FilterAccordion
                    title="Timeline"
                    panel="dates"
                    expanded={expanded.includes('dates')}
                    onChange={handleAccordionChange('dates')}
                    icon={<Calendar size={16} />}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Publish Date From"
                            type="date"
                            size="small"
                            InputLabelProps={{ shrink: true, sx: { fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' } }}
                            value={dateRanges.publishDateFrom}
                            onChange={(e) => setDateRanges(prev => ({ ...prev, publishDateFrom: e.target.value }))}
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc', '& fieldset': { borderColor: '#e2e8f0' } }
                            }}
                        />
                        <TextField
                            label="Submission Deadline"
                            type="date"
                            size="small"
                            InputLabelProps={{ shrink: true, sx: { fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' } }}
                            value={dateRanges.submissionDateTo}
                            onChange={(e) => setDateRanges(prev => ({ ...prev, submissionDateTo: e.target.value }))}
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc', '& fieldset': { borderColor: '#e2e8f0' } }
                            }}
                        />
                    </Box>
                </FilterAccordion>

                {/* Promo Card */}
                <Box sx={{
                    background: 'linear-gradient(135deg, #103e68 0%, #0f172a 100%)',
                    borderRadius: 4,
                    p: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    mt: 2
                }}>
                    <Box sx={{ position: 'relative', zIndex: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#fff', mb: 0.5, letterSpacing: '-0.5px' }}>
                            UPGRADE TO PRO
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, display: 'block', mb: 2, lineHeight: 1.4 }}>
                            Get unlimited access and AI recommendations.
                        </Typography>
                        <Button size="small" variant="contained" sx={{ bgcolor: '#fff', color: '#103e68', fontWeight: 800, borderRadius: 2, textTransform: 'uppercase', fontSize: '0.7rem', '&:hover': { bgcolor: '#f1f5f9' } }}>
                            Try Free
                        </Button>
                    </Box>
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white opacity-5 rounded-full blur-2xl pointer-events-none" />
                </Box>

            </Box>
        </Box>
    );

    return (
        <>
            {/* Desktop View: Sticky Sidebar */}
            <Box sx={{ display: { xs: 'none', lg: 'block' }, position: 'sticky', top: 96, maxHeight: 'calc(100vh - 120px)', width: '100%' }}>
                <Paper elevation={0} sx={{ borderRadius: 4, bgcolor: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
                    {FilterContent}
                </Paper>
            </Box>

            {/* Mobile View: Floating Action Button (Bottom Left) - ONLY if uncontrolled */}
            {open === undefined && (
                <Box sx={{ position: 'fixed', bottom: 24, left: 24, zIndex: 1200, display: { xs: 'block', lg: 'none' } }}>
                    <Fab
                        onClick={() => setInternalOpen(true)}
                        variant="extended"
                        sx={{
                            bgcolor: '#103e68',
                            color: '#fff',
                            fontWeight: 800,
                            px: 3,
                            py: 3,
                            borderRadius: '16px', // Rounded look like standard button
                            boxShadow: '0 20px 25px -5px rgba(16, 62, 104, 0.3)',
                            '&:hover': { bgcolor: '#0a2742' },
                            gap: 1
                        }}
                    >
                        <Filter size={18} />
                        <Typography sx={{ fontWeight: 800, fontSize: '0.875rem' }}>Filters</Typography>
                    </Fab>
                </Box>
            )}

            {/* Mobile View: Drawer (Full Screen / Bottom Sheet) */}
            <Drawer
                anchor="left"
                open={isMobileOpen}
                onClose={handleClose}
                sx={{
                    display: { xs: 'block', lg: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '100%', maxWidth: '380px' },
                }}
            >
                {FilterContent}
            </Drawer>
        </>
    );
}

// Custom Sub-components for cleaner code
function FilterAccordion({ title, panel, expanded, onChange, children, icon }: any) {
    return (
        <Accordion
            expanded={expanded}
            onChange={onChange}
            disableGutters
            elevation={0}
            sx={{
                borderRadius: '16px !important',
                border: '1px solid #f1f5f9',
                mb: 2,
                '&:before': { display: 'none' },
                '&.Mui-expanded': { border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }
            }}
        >
            <AccordionSummary
                expandIcon={<ChevronDown size={18} className="text-gray-400" />}
                sx={{
                    px: 3,
                    py: 1,
                    minHeight: 56,
                    '& .MuiAccordionSummary-content': { my: 1, display: 'flex', alignItems: 'center', gap: 1.5 }
                }}
            >
                <div className="text-gray-400 opacity-60">{icon}</div>
                <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>{title}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                {children}
            </AccordionDetails>
        </Accordion>
    );
}

function SearchInput({ value, onChange, placeholder }: any) {
    return (
        <TextField
            fullWidth
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            size="small"
            InputProps={{
                startAdornment: <InputAdornment position="start"><Search size={14} className="text-gray-400" /></InputAdornment>,
            }}
            sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: '#f8fafc',
                    '& fieldset': { borderColor: 'transparent' },
                    '&:hover fieldset': { borderColor: '#e2e8f0' },
                    '&.Mui-focused fieldset': { borderColor: '#e2e8f0' }
                },
                '& input': { fontSize: '0.8rem', fontWeight: 600 }
            }}
        />
    );
}

function FilterList({ children, className }: any) {
    return (
        <Box className={className} sx={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0.5, ...scrollbarStyle }}>
            {children}
        </Box>
    );
}
