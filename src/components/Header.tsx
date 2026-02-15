'use client';

import { useState, useEffect } from 'react';
import { Search, User, ChevronDown, Globe, Menu, X, LogOut, FileText, Settings, Star, MessageSquare, Briefcase, Bell, Phone, MapPin, ArrowRight, LayoutDashboard, PlusCircle, Headphones, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, signOut } from '@/services/auth';

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
            { label: '2025 Tenders', path: '/archive/2025' },
            { label: '2024 Tenders', path: '/archive/2024' },
            { label: '2023 Tenders', path: '/archive/2023' },
        ]
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

    return (
        <>
            <header className="bg-white shadow-sm sticky top-0 z-40 font-sans">
                {/* Top Main Row */}
                <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-gray-700 hover:text-primary p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Open Menu"
                    >
                        <Menu size={24} />
                    </button>

                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 cursor-pointer hover:opacity-90 transition">
                        <div className="text-2xl font-black flex items-center tracking-tighter">
                            <span className="text-tj-yellow">Tender</span>
                            <span className="text-slate-800">Saarthi</span>
                        </div>
                    </Link>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {/* Get Support Button - Yellow */}
                        <Link href="/support" className="hidden lg:flex items-center bg-tj-yellow text-black px-4 py-1.5 rounded-md cursor-pointer relative font-extrabold text-sm shadow-sm hover:translate-y-0.5 hover:shadow-none transition-all tracking-tight border-b-2 border-[#e5ac00] active:border-b-0 active:mt-[2px]">
                            <span className="text-[10px] bg-white/20 px-1 rounded mr-2 font-black">PRO</span>
                            GET SUPPORT
                        </Link>

                        {/* Language */}
                        <div className="relative group hidden md:flex items-center gap-1 text-sm text-slate-600 cursor-pointer hover:text-primary font-bold h-full py-2">
                            <Globe size={16} />
                            <span className="hidden xl:inline">English</span>
                            <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />

                            {/* Language Dropdown */}
                            <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[120px]">
                                <div className="bg-white border text-gray-700 shadow-md rounded overflow-hidden">
                                    <div className="px-4 py-2 hover:bg-gray-50 hover:text-primary transition font-normal text-xs">English</div>
                                    <div className="px-4 py-2 hover:bg-gray-50 hover:text-primary transition font-normal text-xs">Hindi</div>
                                </div>
                            </div>
                        </div>

                        {/* Post Tender Button */}
                        <Link href="/post-tender" className="hidden md:block bg-primary text-white px-6 py-2 rounded-lg text-sm font-black hover:bg-[#0d345b] transition-all shadow-sm shadow-primary/20 tracking-tight uppercase border-b-2 border-[#0a2742] active:border-b-0 active:translate-y-0.5">
                            POST TENDER
                        </Link>

                        {/* Sign In / User Profile */}
                        {!isLoadingUser && (
                            currentUser ? (
                                /* User Profile Dropdown */
                                <div className="relative group hidden md:block">
                                    <div className="flex items-center gap-3 bg-white border border-slate-100 rounded-full px-4 py-1.5 cursor-pointer hover:shadow-md hover:border-primary/20 transition-all duration-300">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-400 text-white flex items-center justify-center text-xs font-black shadow-inner uppercase">
                                            {currentUser.email?.[0] || 'U'}
                                        </div>
                                        <div className="hidden lg:block">
                                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Account</p>
                                            <p className="text-sm font-black text-slate-800 leading-none truncate max-w-[100px]">
                                                {currentUser.user_metadata?.full_name?.split(' ')[0] || currentUser.email?.split('@')[0]}
                                            </p>
                                        </div>
                                        <ChevronDown size={14} className="text-slate-400 group-hover:rotate-180 transition-transform duration-300" />
                                    </div>

                                    {/* Dropdown Menu */}
                                    <div className="absolute right-0 top-full mt-3 pt-0 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-50 min-w-[280px]">
                                        <div className="bg-white border border-gray-100 shadow-[0_15px_50px_-12px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden">
                                            {/* User Header */}
                                            <div className="px-6 py-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-50 flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-tj-blue to-blue-400 text-white flex items-center justify-center text-xl font-black shadow-lg shadow-blue-100 uppercase">
                                                    {currentUser.email?.[0]}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-black text-gray-900 truncate uppercase tracking-tight text-base">
                                                        {currentUser.user_metadata?.full_name || 'User'}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 font-bold truncate mt-1">
                                                        {currentUser.email}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="p-2 space-y-1">
                                                {[
                                                    { href: '/my-tenders', icon: <FileText size={18} />, label: 'My Tenders', color: 'text-tj-blue', bg: 'bg-blue-50' },
                                                    { href: '/my-drafts', icon: <FileText size={18} />, label: 'My Drafts', color: 'text-gray-400', bg: 'bg-gray-50' },
                                                    { href: '/my-saved', icon: <Star size={18} />, label: 'Saved Tenders', color: 'text-tj-yellow', bg: 'bg-yellow-50' },
                                                    { href: '/alerts', icon: <MessageSquare size={18} />, label: 'WhatsApp Alerts', color: 'text-[#25D366]', bg: 'bg-green-50' },
                                                    { href: '/profile', icon: <Settings size={18} />, label: 'Profile Settings', color: 'text-gray-600', bg: 'bg-gray-50' },
                                                ].map((item, i) => (
                                                    <Link
                                                        key={i}
                                                        href={item.href}
                                                        className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all group/item"
                                                    >
                                                        <div className={`${item.color} ${item.bg} p-2 rounded-xl transition-transform group-hover/item:scale-110`}>
                                                            {item.icon}
                                                        </div>
                                                        <span className="text-sm font-black text-gray-700 uppercase tracking-tight">{item.label}</span>
                                                    </Link>
                                                ))}
                                            </div>

                                            <div className="p-2 border-t border-gray-50 bg-gray-50/50">
                                                <button
                                                    onClick={handleSignOut}
                                                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-500 transition-all font-black uppercase text-[10px] tracking-widest border border-transparent hover:border-red-100 shadow-sm"
                                                >
                                                    <LogOut size={16} />
                                                    Log Out Securely
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Sign In Button */
                                <Link href="/login" className="hidden md:flex items-center gap-2 border border-slate-200 rounded-lg px-6 py-2 cursor-pointer hover:bg-slate-50 text-primary font-black text-sm transition-all uppercase tracking-tight">
                                    <User size={18} className="text-primary font-bold" strokeWidth={2.5} />
                                    Sign In
                                </Link>
                            )
                        )}

                        {/* Mobile User Icon/Search is distinct, handled in mobile nav below */}
                        <button className="md:hidden text-gray-700" onClick={() => setIsMobileMenuOpen(true)}>
                            {currentUser ? (
                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                                    {currentUser.email?.[0] || 'U'}
                                </div>
                            ) : (
                                <User size={24} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Navigation Menu - Second Row */}
                <nav className="border-t border-gray-100 hidden md:block">
                    <div className="container mx-auto px-4">
                        <ul className="flex items-center gap-8 text-[13px] font-bold text-gray-700 py-3 uppercase tracking-tight">
                            {navItems.map((item) => (
                                <li key={item.label} className="relative group">
                                    <Link
                                        href={item.path}
                                        className="flex items-center gap-1 cursor-pointer hover:text-primary py-2 transition-colors duration-200"
                                    >
                                        {item.label}
                                        {item.badge && (
                                            <span className="bg-primary text-white text-[9px] px-1 rounded-sm ml-1 animate-pulse">{item.badge}</span>
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
                <div
                    className={`absolute left-0 top-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl transition-transform duration-300 ease-out transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}
                >
                    {/* Header */}
                    <div className="bg-[#103e68] p-8 relative overflow-hidden">
                        {/* Decorative background patterns */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-tj-yellow/10 rounded-full -ml-12 -mb-12 pointer-events-none blur-xl"></div>

                        <div className="flex justify-between items-start relative z-10 mb-8">
                            <div>
                                <h2 className="text-2xl font-black tracking-tighter text-white flex items-center gap-1">
                                    Tender<span className="text-tj-yellow">Saarthi</span>
                                </h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="h-[2px] w-6 bg-tj-yellow rounded-full"></div>
                                    <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.2em]">India's #1 Portal</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-white/60 hover:text-white bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/10 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* User Info Block */}
                        <div className="relative z-10 mt-4">
                            {currentUser ? (
                                <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-[1.5rem] border border-white/10">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-tj-yellow to-yellow-300 text-tj-blue flex items-center justify-center text-xl font-black shadow-lg">
                                        {currentUser.email?.[0] || 'U'}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-black text-white text-base truncate uppercase tracking-tight leading-none mb-1.5">
                                            {currentUser.user_metadata?.full_name?.split(' ')[0] || 'Hello User'}
                                        </p>
                                        <p className="text-[10px] text-blue-200 font-bold truncate opacity-80">
                                            {currentUser.email}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-blue-200 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Welcome Experience</p>
                                        <h3 className="text-white font-black text-2xl tracking-tight">Unlock Opportunities</h3>
                                    </div>
                                    <div className="flex gap-3">
                                        <Link
                                            href="/login"
                                            className="flex-1 bg-white text-[#103e68] text-[11px] font-black py-3 px-4 rounded-xl text-center uppercase tracking-wider shadow-xl hover:translate-y-[-2px] transition-all"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="flex-1 bg-tj-yellow text-[#103e68] text-[11px] font-black py-3 px-4 rounded-xl text-center uppercase tracking-wider shadow-xl shadow-tj-yellow/20 hover:translate-y-[-2px] transition-all"
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
                    <div className="flex-1 overflow-y-auto bg-white">
                        <div className="py-4 px-2">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-6 mb-4">Main Exploration</h4>
                            <div className="space-y-0.5">
                                {navItems.map((item) => (
                                    <div key={item.label} className="overflow-hidden">
                                        <div
                                            className={`flex items-center justify-between px-6 py-4 cursor-pointer transition-all ${activeMobileDropdown === item.label ? 'bg-slate-50 relative' : 'hover:bg-slate-50'}`}
                                            onClick={() => item.dropdown ? toggleMobileDropdown(item.label) : (router.push(item.path), setIsMobileMenuOpen(false))}
                                        >
                                            {activeMobileDropdown === item.label && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
                                            <div className="flex items-center gap-4">
                                                <div className={`transition-colors ${activeMobileDropdown === item.label ? 'text-primary' : 'text-slate-400'}`}>
                                                    {item.icon || <FileText size={20} />}
                                                </div>
                                                <span className={`text-[15px] font-black tracking-tight ${activeMobileDropdown === item.label ? 'text-primary' : 'text-slate-700'}`}>
                                                    {item.label}
                                                </span>
                                            </div>
                                            {item.dropdown && (
                                                <ChevronDown
                                                    size={16}
                                                    className={`text-slate-300 transition-transform duration-300 ${activeMobileDropdown === item.label ? 'rotate-180 text-primary' : ''}`}
                                                />
                                            )}
                                        </div>

                                        {/* Submenu */}
                                        {item.dropdown && (
                                            <div
                                                className={`bg-slate-50/50 overflow-hidden transition-all duration-300 ease-in-out ${activeMobileDropdown === item.label ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                                            >
                                                <div className="py-2 pl-12 pr-6 space-y-1">
                                                    {item.dropdown.map((subItem) => (
                                                        <Link
                                                            key={subItem.label}
                                                            href={subItem.path}
                                                            className="flex items-center justify-between py-3 text-sm font-bold text-slate-500 hover:text-primary transition-all group"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                        >
                                                            {subItem.label}
                                                            <div className="w-6 h-6 rounded-full bg-white border border-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                                                <ArrowRight size={12} className="text-primary" />
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Extra Links */}
                        <div className="px-4 pb-8 space-y-3">
                            {currentUser && (
                                <>
                                    <div className="border-t border-gray-200 my-4"></div>
                                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2 mb-2">Account</h4>
                                    <Link href="/profile" className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Settings size={18} className="text-gray-500" />
                                        <span className="text-sm font-bold text-gray-700">Settings</span>
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100 text-red-600 shadow-sm"
                                    >
                                        <LogOut size={18} />
                                        <span className="text-sm font-bold">Sign Out</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Bottom Sticky Action Bar */}
                    <div className="p-4 pb-12 bg-white border-t border-gray-100 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                href="/bid-support"
                                className="flex flex-col items-center justify-center bg-tj-yellow/10 text-tj-yellow px-4 py-3 rounded-xl border border-tj-yellow/20"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Headphones size={20} className="mb-1 text-[#d4a000]" />
                                <span className="text-[10px] font-black uppercase tracking-wider text-[#d4a000]">Support</span>
                            </Link>

                            <Link
                                href="/post-tender"
                                className="flex flex-col items-center justify-center bg-primary text-white px-4 py-3 rounded-xl shadow-lg shadow-primary/20"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <PlusCircle size={20} className="mb-1" />
                                <span className="text-[10px] font-black uppercase tracking-wider">Post Tender</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
