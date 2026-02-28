'use client';

import { useState, useEffect } from 'react';
import { Search, User, ChevronDown, Globe, Menu, X, LogOut, FileText, Settings, Star, MessageSquare, Briefcase, Bell, Phone, MapPin, ArrowRight, LayoutDashboard, PlusCircle, Headphones, Newspaper, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, signOut } from '@/services/auth';
import { getSavedTenders } from '@/services/tenderService';

interface NavItem {
    label: string;
    path: string;
    icon?: React.ReactNode;
    badge?: string;
    dropdown?: {
        label: string;
        path: string;
        subItems?: { label: string; path: string }[]
    }[];
}

const navItems: NavItem[] = [
    {
        label: 'Tenders',
        path: '/active-tenders',
        icon: <Briefcase size={20} />,
        dropdown: [
            { label: 'Latest Tenders', path: '/active-tenders/latest' },
            { label: 'Active Tenders', path: '/active-tenders' },
            { label: 'Tenders by Value', path: '/active-tenders/high-value' },
            {
                label: 'Tenders by State',
                path: '/active-tenders',
                subItems: [
                    { label: 'Uttar Pradesh', path: '/tenders/state/uttar-pradesh' },
                    { label: 'Maharashtra', path: '/tenders/state/maharashtra' },
                    { label: 'Delhi', path: '/tenders/state/delhi' },
                    { label: 'Madhya Pradesh', path: '/tenders/state/madhya-pradesh' },
                    { label: 'View All States', path: '/active-tenders' },
                ]
            },
            {
                label: 'Tenders by Dept/Authority',
                path: '/active-tenders',
                subItems: [
                    { label: 'NHAI', path: '/tenders/authority/nhai' },
                    { label: 'CPWD', path: '/tenders/authority/cpwd' },
                    { label: 'MES', path: '/tenders/authority/mes' },
                    { label: 'Railways', path: '/tenders/authority/railways' },
                    { label: 'View All Depts', path: '/active-tenders' },
                ]
            },
            {
                label: 'Tenders by Category',
                path: '/active-tenders',
                subItems: [
                    { label: 'Construction', path: '/tenders/category/construction' },
                    { label: 'Electrical', path: '/tenders/category/electrical' },
                    { label: 'Transport', path: '/tenders/category/transport' },
                    { label: 'Consultancy', path: '/tenders/category/consultancy' },
                    { label: 'View All Categories', path: '/active-tenders' },
                ]
            },
        ]
    },
    {
        label: 'Archive Tenders',
        path: '/archive-tenders',
        icon: <FileText size={20} />,
        dropdown: [
            { label: '2026 Tenders', path: '/archive-tenders?year=2026' },
            { label: '2025 Tenders', path: '/archive-tenders?year=2025' },
            { label: '2024 Tenders', path: '/archive-tenders?year=2024' },
            { label: '2023 Tenders', path: '/archive-tenders?year=2023' },
        ]
    },
    {
        label: 'Results',
        path: '/tender-results',
        icon: <Trophy size={20} />,
        badge: 'NEW'
    },
    {
        label: 'Post Tender',
        path: '/post-tender',
        icon: <PlusCircle size={20} />,
        dropdown: [
            { label: 'Post New Tender', path: '/post-tender' },
            { label: 'My Tenders', path: '/my-tenders' },
            { label: 'Drafts', path: '/my-drafts' },
        ]
    },
    {
        label: 'Bid Support',
        path: '/bid-support',
        icon: <Headphones size={20} />,
        dropdown: [
            { label: 'Consultancy', path: '/support/consultancy' },
            { label: 'Financing', path: '/support/financing' },
            { label: 'Joint Ventures', path: '/support/jv' },
            { label: 'Contact Us', path: '/contact' },
        ]
    },
    { label: 'News & Updates', path: '/news', icon: <Newspaper size={20} /> },
];

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [savedCount, setSavedCount] = useState(0);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        checkUser();
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobileMenuOpen]);

    const checkUser = async () => {
        const { user } = await getCurrentUser();
        setCurrentUser(user);
        setIsLoadingUser(false);

        if (user) {
            const { data } = await getSavedTenders(user.id);
            setSavedCount(data?.length || 0);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        setCurrentUser(null);
        router.push('/');
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/active-tenders?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsMobileMenuOpen(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const toggleMobileDropdown = (label: string) => {
        setActiveMobileDropdown(activeMobileDropdown === label ? null : label);
    };

    const isHomePage = pathname === '/';
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (pathname?.startsWith('/dashboard')) return null;

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 font-sans ${isHomePage
                ? scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
                : 'bg-white shadow-sm sticky py-3'
                }`}>
                {/* Top Main Row */}
                <div className="container mx-auto px-4 flex items-center justify-between gap-4">
                    {/* Mobile Menu Toggle */}
                    <button
                        className={`md:hidden p-2.5 -ml-2 rounded-xl transition-colors group ${isHomePage && !scrolled ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:text-primary hover:bg-slate-100'
                            }`}
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Open Menu"
                    >
                        <div className="flex flex-col justify-center items-start gap-[5px] w-[22px]">
                            <span className="block h-[2px] w-full bg-current rounded-full transition-all duration-300 group-hover:w-[70%]"></span>
                            <span className="block h-[2px] w-[70%] bg-current rounded-full transition-all duration-300 group-hover:w-full"></span>
                            <span className="block h-[2px] w-[85%] bg-current rounded-full transition-all duration-300 group-hover:w-[85%] group-hover:translate-x-[15%]"></span>
                        </div>
                    </button>

                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 cursor-pointer hover:opacity-90 transition">
                        <div className="text-xl md:text-2xl font-black flex items-center tracking-tighter">
                            <span className="text-tj-yellow">Tender</span>
                            <span className={`${isHomePage && !scrolled ? 'text-white' : 'text-primary'}`}>Saarthi</span>
                        </div>
                    </Link>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {/* Get Support Button - Yellow */}
                        <Link href="/support" className="hidden lg:flex items-center bg-tj-yellow text-black px-4 py-1.5 rounded-md cursor-pointer relative font-extrabold text-sm shadow-sm hover:translate-y-0.5 hover:shadow-none transition-all tracking-tight border-b-2 border-[#e5ac00] active:border-b-0 active:mt-[2px]">
                            <span className="text-[10px] bg-white/20 px-1 rounded mr-2 font-black">PRO</span>
                            GET SUPPORT
                        </Link>

                        {/* Notifications / Alerts */}
                        <div className="relative group hidden md:block">
                            <button className="p-2.5 text-slate-500 hover:text-primary hover:bg-slate-50 rounded-xl transition-all relative border border-transparent hover:border-slate-100 shadow-sm hover:shadow-none active:scale-95">
                                <Bell size={20} strokeWidth={2.5} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                            </button>

                            {/* Notification Dropdown */}
                            <div className="absolute right-0 top-full mt-3 pt-0 opacity-0 invisible translate-y-3 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-50 min-w-[320px]">
                                <div className="bg-white border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] rounded-[20px] overflow-hidden">
                                    <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                                            <span className="font-black text-[11px] uppercase tracking-widest text-slate-800">Alert Center</span>
                                        </div>
                                        <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-tj-blue transition-colors">
                                            Mark all as read
                                        </button>
                                    </div>

                                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                                        {/* Notification Items */}
                                        <div className="p-1">
                                            {[
                                                { title: 'New Tender Alert', desc: 'NHAI just posted a new construction tender in Uttar Pradesh.', time: '2 mins ago', type: 'new' },
                                                { title: 'Bid Closing Soon', desc: 'The tender for Smart City Project Jaipur closes in 24 hours.', time: '1 hour ago', type: 'urgent' },
                                                { title: 'Price Update', desc: 'Tender value updated for Delhi Metro Expansion Phase 4.', time: '5 hours ago', type: 'info' }
                                            ].map((item, i) => (
                                                <div key={i} className="p-4 hover:bg-slate-50 rounded-xl cursor-pointer transition-all border border-transparent hover:border-slate-100 relative group/item">
                                                    <div className="flex gap-4">
                                                        <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${item.type === 'new' ? 'bg-emerald-50 text-emerald-500' :
                                                            item.type === 'urgent' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                                                            }`}>
                                                            {item.type === 'new' ? <PlusCircle size={18} /> :
                                                                item.type === 'urgent' ? <Headphones size={18} /> : <FileText size={18} />}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[13px] font-black text-slate-800 leading-tight mb-0.5">{item.title}</p>
                                                            <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{item.desc}</p>
                                                            <p className="text-[9px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">{item.time}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Empty State (Hidden if items exist) */}
                                        {/* <div className="p-10 text-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                                <Bell size={24} className="text-slate-300" />
                                            </div>
                                            <p className="text-sm font-black text-slate-700">All Quiet Here</p>
                                            <p className="text-xs text-slate-400 mt-1 px-4">We'll let you know when new tenders match your profile.</p>
                                        </div> */}
                                    </div>

                                    <Link href="/dashboard" className="block py-4 text-center text-[10px] font-black uppercase tracking-widest text-[#103e68] bg-slate-50/50 hover:bg-primary hover:text-white border-t border-slate-100 transition-all">
                                        View All Alerts & Notifications
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Sign In / User Profile */}
                        {!isLoadingUser && (
                            currentUser ? (
                                /* User Profile Dropdown */
                                <div className="relative group hidden md:block">
                                    <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-full pl-1.5 pr-4 py-1.5 cursor-pointer hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:border-primary/30 transition-all duration-300">
                                        <div className="w-8 h-8 rounded-full bg-[#103e68] text-white flex items-center justify-center text-[12px] font-black shadow-sm uppercase ring-2 ring-white">
                                            {currentUser.user_metadata?.full_name?.[0]?.toUpperCase() || currentUser.email?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-[13px] font-black text-slate-800 leading-none tracking-tight">
                                                {currentUser.user_metadata?.full_name?.split(' ')[0] || currentUser.email?.split('@')[0]}
                                            </p>
                                        </div>
                                        <ChevronDown size={14} className="text-slate-400 group-hover:rotate-180 transition-transform duration-300" />
                                    </div>

                                    {/* Dropdown Menu */}
                                    <div className="absolute right-0 top-full mt-3 pt-0 opacity-0 invisible translate-y-3 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-50 min-w-[260px]">
                                        <div className="bg-white border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] rounded-[20px] overflow-hidden">
                                            {/* User Header */}
                                            <div className="px-5 py-5 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-[14px] bg-[#103e68] text-white flex items-center justify-center text-xl font-black shadow-lg shadow-[#103e68]/10 uppercase">
                                                    {currentUser.user_metadata?.full_name?.[0]?.toUpperCase() || currentUser.email?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div className="min-w-0 flex flex-col justify-center">
                                                    <p className="font-extrabold text-[#103e68] truncate tracking-tight text-[15px] leading-tight mb-0.5">
                                                        {currentUser.user_metadata?.full_name || 'User Account'}
                                                    </p>
                                                    <div className="flex flex-col gap-1.5 mt-0.5">
                                                        <p className="text-[10px] text-slate-400 font-semibold truncate tracking-tight">
                                                            {currentUser.email}
                                                        </p>
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-[9px] font-black text-[#103e68]/40 uppercase tracking-tighter">Profile Mastery</span>
                                                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">85%</span>
                                                            </div>
                                                            <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                                                                <div className="h-full bg-emerald-500 rounded-full w-[85%] shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-2">
                                                {[
                                                    { href: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard', color: 'text-primary' },
                                                    { href: '/dashboard/watchlist', icon: <Star size={18} />, label: 'Saved Tenders', color: 'text-tj-yellow', count: savedCount },
                                                    { href: '/post-tender', icon: <PlusCircle size={18} />, label: 'Post Tender', color: 'text-emerald-500' },
                                                    { href: '/dashboard/settings', icon: <Settings size={18} />, label: 'Account Settings', color: 'text-slate-500' },
                                                ].map((item, i) => {
                                                    const isActive = pathname === item.href;
                                                    return (
                                                        <Link
                                                            key={i}
                                                            href={item.href}
                                                            className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all group/item ${isActive ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`${item.color} transition-transform group-hover/item:scale-110 ${isActive ? 'scale-110' : ''}`}>
                                                                    {item.icon}
                                                                </div>
                                                                <span className={`text-[11px] uppercase tracking-widest transition-colors ${isActive ? 'text-[#103e68] font-black' : 'text-slate-600 font-bold'}`}>
                                                                    {item.label}
                                                                </span>
                                                            </div>
                                                            {item.count !== undefined && (
                                                                <span className="bg-tj-yellow/10 text-tj-blue text-[10px] font-black px-2 py-0.5 rounded-full ring-1 ring-tj-yellow/20">
                                                                    {item.count}
                                                                </span>
                                                            )}
                                                        </Link>
                                                    );
                                                })}
                                            </div>

                                            <div className="p-3 border-t border-slate-50 bg-slate-50/50">
                                                <button
                                                    onClick={handleSignOut}
                                                    className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl hover:bg-red-50 text-[#ef4444] transition-all font-extrabold uppercase text-[11px] tracking-[0.05em] group/logout"
                                                >
                                                    <LogOut size={18} className="transition-transform group-hover/logout:-translate-x-1" />
                                                    SIGN OUT
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Sign In Button */
                                <Link href="/login" className={`hidden md:flex items-center gap-2 border rounded-lg px-6 py-2 cursor-pointer transition-all uppercase tracking-tight font-black text-[13px] group ${isHomePage && !scrolled ? 'border-white/30 text-white hover:bg-white hover:text-[#103e68]' : 'border-slate-200 text-[#103e68] hover:bg-[#103e68] hover:text-white'}`}>
                                    <User size={18} className="font-bold group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                                    Sign In
                                </Link>
                            )
                        )}

                        {/* Mobile User Icon/Search is distinct, handled in mobile nav below */}
                        <button
                            className={`md:hidden ${isHomePage && !scrolled ? 'text-white' : 'text-gray-700'}`}
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            {currentUser ? (
                                <div className="w-8 h-8 rounded-full bg-tj-yellow text-tj-blue flex items-center justify-center text-xs font-black ring-2 ring-white/20 uppercase">
                                    {currentUser.user_metadata?.full_name?.[0]?.toUpperCase() || currentUser.email?.[0]?.toUpperCase() || 'U'}
                                </div>
                            ) : (
                                <User size={24} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Navigation Menu - Second Row (Desktop Only) */}
                <nav className="hidden md:block">
                    <div className="container mx-auto px-4">
                        <ul className={`flex items-center gap-8 text-[13px] font-bold py-3 uppercase tracking-tight ${isHomePage && !scrolled ? 'text-white/90' : 'text-gray-700'
                            }`}>
                            {navItems.map((item) => (
                                <li key={item.label} className="relative group">
                                    <Link
                                        href={item.path}
                                        className={`flex items-center gap-1 cursor-pointer py-2 transition-colors duration-200 ${isHomePage && !scrolled ? 'hover:text-tj-yellow' : 'hover:text-primary'
                                            }`}
                                    >
                                        {item.label}
                                        {item.badge && (
                                            <span className="bg-tj-yellow text-tj-blue text-[9px] px-1 rounded-sm ml-1 animate-pulse">{item.badge}</span>
                                        )}
                                        {item.dropdown && <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-200" />}
                                    </Link>

                                    {/* Dropdown Menu */}
                                    {item.dropdown && (
                                        <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                            <div className="bg-white border-t-2 border-primary shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] rounded-b-2xl py-4 min-w-[240px] animate-in fade-in slide-in-from-top-4 duration-300">
                                                {item.dropdown.map((subItem) => (
                                                    <div key={subItem.label} className="relative group/sub">
                                                        <Link
                                                            href={subItem.path}
                                                            className="flex items-center justify-between px-6 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-all font-bold group/item"
                                                        >
                                                            <span className="relative">
                                                                {subItem.label}
                                                                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary transition-all group-hover/item:w-full"></span>
                                                            </span>
                                                            {subItem.subItems && <ArrowRight size={14} className="opacity-40 group-hover/sub:translate-x-1 group-hover/sub:opacity-100 transition-all" />}
                                                        </Link>

                                                        {/* Level 2 Submenu (SubItems) */}
                                                        {subItem.subItems && (
                                                            <div className="absolute left-full top-0 ml-0.5 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-300 z-[60]">
                                                                <div className="bg-white border border-slate-100 shadow-[20px_20px_40px_-15px_rgba(0,0,0,0.1)] rounded-2xl py-4 min-w-[220px] animate-in fade-in slide-in-from-left-4 duration-300">
                                                                    <div className="px-6 pb-2 mb-2 border-b border-slate-50">
                                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{subItem.label}</span>
                                                                    </div>
                                                                    {subItem.subItems.map((deepItem) => (
                                                                        <Link
                                                                            key={deepItem.label}
                                                                            href={deepItem.path}
                                                                            className="block px-6 py-2.5 text-[13px] text-slate-600 hover:text-primary hover:bg-slate-50/80 transition-all font-bold"
                                                                        >
                                                                            {deepItem.label}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu Overlay - Persistent for Animations */}
            <div
                className={`fixed inset-0 z-[100] transition-visibility duration-300 ${isMobileMenuOpen ? 'visible' : 'invisible'}`}
            >
                {/* Backdrop with Blur */}
                <div
                    className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Sidebar Drawer */}
                <div className={`absolute left-0 top-0 h-full w-[85%] max-w-[320px] bg-[#F8FAFC] shadow-[20px_0_50px_rgba(0,0,0,0.2)] transition-transform duration-300 ease-in-out transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
                    {/* Header Profile Area (Gradient Dark) */}
                    <div className="bg-gradient-to-br from-[#0a2742] via-[#103e68] to-[#144f85] p-6 relative overflow-hidden shrink-0">
                        {/* Decorative background patterns */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-tj-yellow/10 rounded-full blur-xl pointer-events-none"></div>

                        <div className="flex justify-between items-start relative z-10 mb-6">
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                                <div className="text-xl font-black flex items-center tracking-tighter shadow-sm">
                                    <span className="text-tj-yellow">Tender</span>
                                    <span className="text-white">Saarthi</span>
                                </div>
                            </Link>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-white/70 hover:text-white bg-white/10 p-2 rounded-full backdrop-blur-md border border-white/10 transition-all active:scale-95"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* User Info Block */}
                        <div className="relative z-10">
                            {currentUser ? (
                                <div className="flex items-center gap-3.5 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shadow-lg">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-tj-yellow to-yellow-400 text-[#0a2742] flex items-center justify-center text-lg font-black shadow-inner shadow-white/20 uppercase">
                                        {currentUser.user_metadata?.full_name?.[0]?.toUpperCase() || currentUser.email?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-white text-[15px] truncate leading-tight mb-0.5">
                                            {currentUser.user_metadata?.full_name?.split(' ')[0] || 'Hello User'}
                                        </p>
                                        <p className="text-[11px] text-blue-200/80 font-medium truncate">
                                            {currentUser.email}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-blue-200/80 text-[10px] font-black uppercase tracking-widest mb-1">Welcome to</p>
                                        <h3 className="text-white font-black text-lg tracking-tight leading-tight">India's #1 Portal</h3>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href="/login"
                                            className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold py-2.5 px-3 rounded-xl text-center active:scale-95 transition-all outline-none"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="flex-1 bg-tj-yellow text-[#0a2742] text-xs font-black py-2.5 px-3 rounded-xl text-center shadow-[0_5px_15px_rgba(255,183,0,0.3)] active:scale-95 transition-all outline-none"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Join Now
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#F8FAFC]">
                        <div className="py-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-5 mb-3">Main Exploration</h4>
                            <div className="space-y-1.5 px-3">
                                {navItems.map((item) => {
                                    const isActive = activeMobileDropdown === item.label;
                                    return (
                                        <div key={item.label} className="overflow-hidden bg-white rounded-2xl border border-slate-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.015)]">
                                            <div
                                                className={`flex items-center justify-between px-4 py-3.5 cursor-pointer transition-all ${isActive ? 'bg-blue-50/20' : 'hover:bg-slate-50'}`}
                                                onClick={() => item.dropdown ? toggleMobileDropdown(item.label) : (router.push(item.path), setIsMobileMenuOpen(false))}
                                            >
                                                <div className="flex items-center gap-3.5">
                                                    <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-[#103e68]/10 text-[#103e68]' : 'bg-slate-50 text-slate-400'}`}>
                                                        {item.icon || <FileText size={18} strokeWidth={2.5} />}
                                                    </div>
                                                    <span className={`text-[14px] font-bold tracking-tight ${isActive ? 'text-[#103e68]' : 'text-slate-700'}`}>
                                                        {item.label}
                                                    </span>
                                                </div>
                                                {item.dropdown && (
                                                    <ChevronDown
                                                        size={16}
                                                        strokeWidth={2.5}
                                                        className={`text-slate-400 transition-transform duration-300 ${isActive ? 'rotate-180 text-[#103e68]' : ''}`}
                                                    />
                                                )}
                                            </div>

                                            {/* Submenu */}
                                            {item.dropdown && (
                                                <div
                                                    className={`bg-slate-50/50 overflow-hidden transition-all duration-300 ease-in-out ${isActive ? 'max-h-[500px] opacity-100 border-t border-slate-100/50' : 'max-h-0 opacity-0'}`}
                                                >
                                                    <div className="py-2 pl-14 pr-4 space-y-0.5">
                                                        {item.dropdown.map((subItem) => (
                                                            <Link
                                                                key={subItem.label}
                                                                href={subItem.path}
                                                                className="flex items-center justify-between py-2.5 text-[13px] font-medium text-slate-500 hover:text-[#103e68] transition-colors group outline-none"
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                            >
                                                                {subItem.label}
                                                                <div className="w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                                                                    <ArrowRight size={14} className="text-[#103e68]" />
                                                                </div>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Extra Links (Account) */}
                        {currentUser && (
                            <div className="px-3 pb-8 mt-2">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-3">Account</h4>
                                <div className="space-y-1.5">
                                    <Link href="/dashboard" className="flex items-center gap-3.5 p-3.5 bg-white rounded-2xl border border-slate-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.015)] active:scale-[0.98] transition-transform outline-none" onClick={() => setIsMobileMenuOpen(false)}>
                                        <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                                            <LayoutDashboard size={18} strokeWidth={2.5} />
                                        </div>
                                        <span className="text-[14px] font-bold text-slate-700">My Dashboard</span>
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-100/50 shadow-[0_2px_10px_rgba(0,0,0,0.015)] active:scale-[0.98] transition-all group outline-none"
                                    >
                                        <div className="flex items-center gap-3.5 text-red-500">
                                            <div className="p-1.5 rounded-lg bg-red-50 group-hover:bg-red-500 group-hover:text-white transition-colors">
                                                <LogOut size={18} strokeWidth={2.5} />
                                            </div>
                                            <span className="text-[14px] font-bold">Sign Out</span>
                                        </div>
                                        <ArrowRight size={16} className="text-red-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Sticky Action Bar */}
                    <div className="p-3 bg-white border-t border-slate-200/60 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] pb-[env(safe-area-inset-bottom)] relative z-10 shrink-0">
                        <div className="grid grid-cols-2 gap-2.5">
                            <Link
                                href="/bid-support"
                                className="flex items-center justify-center gap-2 bg-[#fffcf5] text-amber-600 border border-amber-200/50 py-3 rounded-[14px] active:scale-95 transition-transform shadow-sm outline-none"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Headphones size={18} strokeWidth={2.5} className="opacity-90" />
                                <span className="text-[11px] font-black uppercase tracking-wider">Support</span>
                            </Link>

                            <Link
                                href="/post-tender"
                                className="flex items-center justify-center gap-2 bg-[#103e68] text-white py-3 rounded-[14px] shadow-[0_5px_15px_rgba(16,62,104,0.3)] active:scale-95 transition-transform outline-none"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <PlusCircle size={18} strokeWidth={2.5} />
                                <span className="text-[11px] font-black uppercase tracking-wider">Post Tender</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
