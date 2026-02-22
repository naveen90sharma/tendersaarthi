import Link from 'next/link';
import { supabase } from '@/services/supabase';

async function getLinkGroups() {
    const [statesRes, categoriesRes, authoritiesRes] = await Promise.all([
        supabase.from('states').select('name, slug').eq('is_active', true).order('name').limit(20),
        supabase.from('tender_categories').select('name, slug').eq('status', true).order('name').limit(10),
        supabase.from('authorities').select('authority_name, slug').eq('status', true).order('authority_name').limit(8),
    ]);

    return {
        states: (statesRes.data || []).map(s => ({ name: s.name, slug: s.slug })),
        categories: (categoriesRes.data || []).map(c => ({ name: c.name, slug: c.slug })),
        authorities: (authoritiesRes.data || []).map(a => ({ name: a.authority_name, slug: a.slug })),
    };
}

export default async function QuickLinks() {
    const { states, categories, authorities } = await getLinkGroups();

    const linkGroups = [
        {
            title: 'TENDER BY STATES',
            viewAllPath: '/states',
            links: states,
            baseUrl: '/tenders/state'
        },
        {
            title: 'TENDER BY CATEGORIES',
            viewAllPath: '/active-tenders',
            links: categories,
            baseUrl: '/tenders/category'
        },
        {
            title: 'TENDER BY AUTHORITIES',
            viewAllPath: '/authorities',
            links: authorities,
            baseUrl: '/tenders/authority'
        }
    ];

    return (
        <section className="bg-white py-12 border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                    {linkGroups.map((group, index) => (
                        <div key={index} className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800 border-l-4 border-primary pl-3 uppercase">
                                {group.title}
                            </h3>
                            <div className="flex flex-wrap gap-2 text-[13px] leading-relaxed text-gray-600">
                                {group.links.map((link: any, idx) => (
                                    <span key={idx} className="inline-block">
                                        <Link
                                            href={`${group.baseUrl}/${link.slug}`}
                                            className="hover:text-primary hover:underline transition-colors font-medium"
                                        >
                                            {link.name} Tenders
                                        </Link>
                                        <span className="text-gray-400 mx-1.5 font-light">|</span>
                                    </span>
                                ))}
                                <span className="inline-block">
                                    <Link
                                        href={group.viewAllPath}
                                        className="text-primary font-bold hover:underline transition-colors"
                                    >
                                        View All
                                    </Link>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
