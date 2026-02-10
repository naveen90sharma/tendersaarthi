'use client';

import { useState, useEffect } from 'react';
import { Search, User, ChevronDown, Globe, Menu, X, LogOut, FileText, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser, signOut } from '@/services/auth';

interface NavItem {
    label: string;
    path: string;
    badge?: string;
    dropdown?: { label: string; path: string }[];
}

const navItems: NavItem[] = [
    {
        label: 'Active Tenders',
        path: '/active-tenders',
        dropdown: [
            { label: 'Latest Tenders', path: '/active-tenders/latest' },
            { label: 'Closing Soon', path: '/active-tenders/closing-soon' },
            { label: 'High Value', path: '/active-tenders/high-value' },
            { label: 'State-wise', path: '/active-tenders/state' },
        ]
    },
    {
        label: 'Archive Tenders',
        path: '/archive-tenders',
        dropdown: [
            { label: '2025 Tenders', path: '/archive/2025' },
            { label: '2024 Tenders', path: '/archive/2024' },
            { label: '2023 Tenders', path: '/archive/2023' },
        ]
    },
    {
        label: 'Post Tender',
        path: '/post-tender',
        dropdown: [
            { label: 'Post New Tender', path: '/post-tender' },
            { label: 'My Tenders', path: '/my-tenders' },
            { label: 'Drafts', path: '/my-drafts' },
        ]
    },
    {
        label: 'By Category',
        path: '/categories',
        dropdown: [
            { label: 'Construction', path: '/category/construction' },
            { label: 'IT & Software', path: '/category/it' },
            { label: 'Electrical', path: '/category/electrical' },
            { label: 'Transport', path: '/category/transport' },
            { label: 'View All', path: '/categories' },
        ]

    },
    {
        label: 'Bid Support',
        path: '/bid-support',
        dropdown: [
            { label: 'Consultancy', path: '/support/consultancy' },
            { label: 'Financing', path: '/support/financing' },
            { label: 'Joint Ventures', path: '/support/jv' },
        ]
    },
    { label: 'News & Updates', path: '/news' },
];

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkUser();
    }, []);

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
        <header className="bg-white shadow-sm sticky top-0 z-50 font-sans">
            {/* Top Main Row */}
            <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-gray-700 hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu size={24} />
                </button>

                {/* Logo */}
                <Link href="/" className="flex-shrink-0 cursor-pointer hover:opacity-90 transition">
                    <div className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-primary text-3xl">Tender</span>Saarthi
                    </div>
                </Link>

                {/* Search Bar - Wide and Grey */}
                <div className="hidden md:flex flex-1 max-w-2xl px-4">
                    <div className="w-full relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-tj-blue transition-colors">
                            <Search size={18} strokeWidth={2.5} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for Tenders by title, location or authority..."
                            className="w-full bg-[#f1f5f9] border-2 border-transparent rounded-full py-2.5 pl-12 pr-4 text-sm focus:bg-white focus:border-tj-blue/30 focus:ring-4 focus:ring-tj-blue/5 outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        {searchQuery && (
                            <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-tj-blue text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest hover:brightness-110 transition-all shadow-sm"
                                onClick={handleSearch}
                            >
                                Search
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {/* Get Support Button - Yellow */}
                    <Link href="/support" className="hidden lg:flex items-center bg-tj-yellow text-black px-4 py-1.5 rounded-[4px] cursor-pointer relative font-extrabold text-sm shadow-sm hover:brightness-95 transition tracking-tight">
                        <span className="text-xs absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-white px-1.5 py-0.5 rounded-[2px] text-[9px] font-black leading-none">GET</span>
                        SUPPORT
                    </Link>

                    {/* Language */}
                    <div className="relative group hidden md:flex items-center gap-1 text-sm text-gray-600 cursor-pointer hover:text-tj-blue font-medium h-full py-2">
                        <Globe size={16} />
                        English
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
                    <Link href="/post-tender" className="hidden md:block bg-tj-blue text-white px-6 py-2 rounded-[4px] text-sm font-extrabold hover:brightness-110 transition mb-0 tracking-tight">
                        POST TENDER
                    </Link>

                    {/* Sign In / User Profile */}
                    {!isLoadingUser && (
                        currentUser ? (
                            /* User Profile Dropdown */
                            <div className="relative group">
                                <div className="flex items-center gap-2 border border-gray-300 rounded px-4 py-2 cursor-pointer hover:bg-gray-50 text-tj-blue font-bold text-sm">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                                        {currentUser.email?.[0]?.toUpperCase() || currentUser.user_metadata?.full_name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="hidden lg:block max-w-[120px] truncate">
                                        {currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0]}
                                    </span>
                                    <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                                </div>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 top-full mt-2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[220px]">
                                    <div className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden">
                                        {/* User Info */}
                                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                            <p className="font-bold text-sm text-gray-800 truncate">
                                                {currentUser.user_metadata?.full_name || 'User'}
                                            </p>
                                            <p className="text-xs text-gray-600 truncate">{currentUser.email}</p>
                                        </div>

                                        {/* Menu Items */}
                                        <Link
                                            href="/my-tenders"
                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 hover:text-primary transition text-sm"
                                        >
                                            <FileText size={16} />
                                            My Tenders
                                        </Link>
                                        <Link
                                            href="/my-drafts"
                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 hover:text-primary transition text-sm"
                                        >
                                            <FileText size={16} />
                                            My Drafts
                                        </Link>
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-gray-700 hover:text-primary transition text-sm"
                                        >
                                            <Settings size={16} />
                                            Profile Settings
                                        </Link>
                                        <div className="border-t border-gray-100">
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 hover:text-red-700 transition text-sm font-medium"
                                            >
                                                <LogOut size={16} />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Sign In Button */
                            <Link href="/login" className="flex items-center gap-2 border border-[#d1d5db] rounded-[4px] px-6 py-2 cursor-pointer hover:bg-gray-50 text-tj-blue font-extrabold text-sm transition">
                                <User size={18} className="text-tj-blue font-bold" strokeWidth={2.5} />
                                Sign In
                            </Link>
                        )
                    )}
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
                                    className="flex items-center gap-1 cursor-pointer hover:text-primary py-2"
                                >
                                    {item.label}
                                    {item.badge && (
                                        <span className="bg-primary text-white text-[9px] px-1 rounded-sm ml-1">{item.badge}</span>
                                    )}
                                    {item.dropdown && <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-200" />}
                                </Link>

                                {/* Dropdown Menu */}
                                {item.dropdown && (
                                    <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[200px]">
                                        <div className="bg-white border-t-2 border-primary shadow-lg rounded-b-md py-2 px-1">
                                            {item.dropdown.map((subItem) => (
                                                <Link
                                                    key={subItem.label}
                                                    href={subItem.path}
                                                    className="block px-4 py-2 text-xs text-gray-600 hover:bg-gray-50 hover:text-primary rounded font-medium normal-case"
                                                >
                                                    {subItem.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* Mobile Header elements (simplified) */}
            <div className="md:hidden px-4 py-2 bg-gray-100">
                <input
                    type="text"
                    placeholder="Search for Tenders"
                    className="w-full bg-white border border-gray-300 rounded py-2 px-4 text-sm focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[60] bg-black bg-opacity-50 md:hidden flex">
                    <div className="w-4/5 max-w-sm bg-white h-full flex flex-col shadow-xl animate-in slide-in-from-left duration-200">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <span className="font-bold text-gray-800 text-lg">Menu</span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-red-500">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto py-4">
                            <ul className="space-y-1">
                                {navItems.map((item) => (
                                    <li key={item.label}>
                                        <div className="px-4">
                                            <div
                                                className="flex justify-between items-center py-3 border-b border-gray-100 cursor-pointer"
                                                onClick={() => item.dropdown ? toggleMobileDropdown(item.label) : setIsMobileMenuOpen(false)}
                                            >
                                                <Link
                                                    href={item.path}
                                                    className="flex-1 font-semibold text-gray-700 hover:text-primary"
                                                    onClick={(e) => {
                                                        if (item.dropdown) e.preventDefault();
                                                        else setIsMobileMenuOpen(false);
                                                    }}
                                                >
                                                    {item.label}
                                                    {item.badge && <span className="bg-primary text-white text-[9px] px-1 rounded-sm ml-2">{item.badge}</span>}
                                                </Link>
                                                {item.dropdown && (
                                                    <ChevronDown
                                                        size={16}
                                                        className={`text-gray-400 transition-transform ${activeMobileDropdown === item.label ? 'rotate-180' : ''}`}
                                                    />
                                                )}
                                            </div>

                                            {/* Mobile Submenu */}
                                            {item.dropdown && activeMobileDropdown === item.label && (
                                                <div className="bg-gray-50 py-2 rounded mb-2">
                                                    {item.dropdown.map(subItem => (
                                                        <Link
                                                            key={subItem.label}
                                                            href={subItem.path}
                                                            className="block px-4 py-2 text-sm text-gray-600 hover:text-primary"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                        >
                                                            {subItem.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-4 border-t bg-gray-50">
                            <Link
                                href="/post-tender"
                                className="block w-full bg-tj-blue text-white text-center py-3 rounded font-bold mb-3"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                POST TENDER
                            </Link>
                            <Link
                                href="/support"
                                className="block w-full bg-yellow-400 text-black text-center py-3 rounded font-bold"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                GET SUPPORT
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
