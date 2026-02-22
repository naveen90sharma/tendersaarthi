import Link from 'next/link';
import { Briefcase, Laptop, Heart, Truck, GraduationCap, Wrench, ShoppingBag, Zap, ArrowUpRight, Folder } from 'lucide-react';
import { supabase } from '@/services/supabase';

// Map category names to icons - top categories get specific icons, rest get Folder
const ICON_MAP: Record<string, any> = {
    'infrastructure': Briefcase,
    'civil': Briefcase,
    'construction': Briefcase,
    'technology': Laptop,
    'it': Laptop,
    'software': Laptop,
    'healthcare': Heart,
    'medical': Heart,
    'health': Heart,
    'logistics': Truck,
    'transport': Truck,
    'supply': Truck,
    'education': GraduationCap,
    'training': GraduationCap,
    'industrial': Wrench,
    'engineering': Wrench,
    'mechanical': Wrench,
    'defense': Zap,
    'aerospace': Zap,
    'security': Zap,
    'procurement': ShoppingBag,
    'goods': ShoppingBag,
};

const COLOR_PALETTE = [
    { color: 'text-blue-600', bg: 'bg-blue-50' },
    { color: 'text-purple-600', bg: 'bg-purple-50' },
    { color: 'text-red-500', bg: 'bg-red-50' },
    { color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { color: 'text-amber-600', bg: 'bg-amber-50' },
    { color: 'text-orange-600', bg: 'bg-orange-50' },
    { color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { color: 'text-rose-500', bg: 'bg-rose-50' },
    { color: 'text-teal-600', bg: 'bg-teal-50' },
    { color: 'text-cyan-600', bg: 'bg-cyan-50' },
];

function getIconForCategory(name: string) {
    const lower = name.toLowerCase();
    for (const [key, Icon] of Object.entries(ICON_MAP)) {
        if (lower.includes(key)) return Icon;
    }
    return Folder;
}

async function getCategories() {
    const { data } = await supabase
        .from('tender_categories')
        .select('name, slug, status')
        .eq('status', true)
        .order('name')
        .limit(12);
    return data || [];
}

export default async function CategoryGrid() {
    const categories = await getCategories();

    return (
        <section className="py-10 md:py-16 bg-[#F8FAFC]">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <div className="h-0.5 w-8 bg-primary rounded-full" />
                            <span className="text-[10px] font-semibold text-primary uppercase tracking-widest">Industry Mapping</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-[#0f172a] tracking-tight">Explore by Category</h2>
                        <p className="text-xs text-slate-400 mt-0.5">AI-powered classification for precision matching</p>
                    </div>

                    <Link
                        href="/active-tenders"
                        className="flex items-center gap-2 bg-white hover:bg-primary text-primary hover:text-white px-4 py-2 rounded-lg font-semibold text-xs tracking-wide transition-all border border-slate-200 shadow-sm whitespace-nowrap"
                    >
                        View All
                        <ArrowUpRight size={13} />
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
                    {categories.map((category, index) => {
                        const Icon = getIconForCategory(category.name);
                        const palette = COLOR_PALETTE[index % COLOR_PALETTE.length];
                        return (
                            <Link
                                key={category.slug}
                                href={`/tenders/category/${category.slug}`}
                                className="group bg-white rounded-xl p-4 border border-slate-100 hover:border-primary/20 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center"
                            >
                                {/* Icon */}
                                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${palette.bg} ${palette.color} mb-3 group-hover:scale-105 transition-transform duration-200`}>
                                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                                </div>

                                {/* Name */}
                                <h3 className="text-[13px] font-semibold text-[#0B2C4A] leading-tight mb-1.5 line-clamp-2">
                                    {category.name}
                                </h3>

                                {/* Live indicator */}
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-[10px] font-medium text-slate-400">Active</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
