'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Bookmark,
    User,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    Briefcase,
    TrendingUp,
    FileText,
    ChevronRight,
    Headphones,
    Globe,
    ExternalLink
} from 'lucide-react';
import { getCurrentUser, signOut } from '@/services/auth';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { user } = await getCurrentUser();
            if (!user) {
                router.push('/login?redirect=/dashboard');
                return;
            }
            setUser(user);
        };
        checkUser();
    }, [router]);

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    const navItems = [
        { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { label: 'My Watchlist', path: '/dashboard/watchlist', icon: Bookmark },
        { label: 'My Tenders', path: '/dashboard/tenders', icon: Briefcase },
        { label: 'Analytics', path: '/dashboard/analytics', icon: TrendingUp },
        { label: 'Documents', path: '/dashboard/documents', icon: FileText },
    ];

    const bottomNavItems = [
        { label: 'Support', path: '/dashboard/support', icon: Headphones },
        { label: 'Settings', path: '/dashboard/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] flex overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-[#0F172A] text-white z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
                {/* Sidebar Header */}
                <div className="p-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-tj-yellow rounded-lg flex items-center justify-center text-primary font-black">TS</div>
                        <span className="text-xl font-black tracking-tighter">
                            Tender<span className="text-tj-yellow font-bold">Saarthi</span>
                        </span>
                    </Link>
                    <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                    <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Main Menu</p>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <Icon size={20} className={isActive ? 'text-white' : 'group-hover:text-tj-yellow'} />
                                <span className="text-sm font-bold">{item.label}</span>
                                {isActive && <ChevronRight size={14} className="ml-auto" />}
                            </Link>
                        );
                    })}

                    <div className="my-8 border-t border-slate-800 mx-4" />

                    <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Account & Support</p>
                    {bottomNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <Icon size={20} className={isActive ? 'text-white' : 'group-hover:text-tj-yellow'} />
                                <span className="text-sm font-bold">{item.label}</span>
                            </Link>
                        );
                    })}

                    {/* Exit to Website in Sidebar */}
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-tj-yellow hover:bg-white/5 transition-all mt-4 font-bold border border-tj-yellow/20 mx-2"
                    >
                        <Globe size={18} />
                        <span className="text-sm italic">Visit Main Website</span>
                        <ExternalLink size={12} className="ml-auto opacity-50" />
                    </Link>
                </nav>

                {/* User Section Bottom */}
                <div className="p-4 bg-[#1e293b]/50 border-t border-slate-800">
                    <div className="flex items-center gap-3 p-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-tj-yellow to-yellow-300 text-tj-blue flex items-center justify-center font-black">
                            {user?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-black truncate">{user?.user_metadata?.full_name || 'My Account'}</p>
                            <p className="text-[10px] text-slate-400 truncate tracking-tight">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Bar */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 relative z-30">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-black text-slate-800 lg:block hidden">
                            {navItems.find(item => item.path === pathname)?.label || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                        {/* Exit Link in Top Bar */}
                        <Link
                            href="/"
                            className="hidden sm:flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-primary hover:bg-primary/5 rounded-xl transition-all font-black text-[11px] uppercase tracking-widest border border-slate-200 shadow-sm"
                        >
                            <Globe size={16} />
                            Exit Dashboard
                        </Link>

                        {/* Search Bar (Desktop) */}
                        <div className="hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 w-64 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <Search size={18} className="text-slate-400" />
                            <input
                                type="text"
                                placeholder="Quick search..."
                                className="bg-transparent border-none outline-none px-3 text-sm font-medium w-full"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <button className="p-2.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all relative">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                            </button>
                            <button
                                onClick={handleSignOut}
                                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                title="Sign Out"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Reality: Sticky Content Wrapper */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    {children}
                </main>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #334155;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}
