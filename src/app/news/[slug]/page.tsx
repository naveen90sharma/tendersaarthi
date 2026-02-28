import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, BookOpen, Clock } from 'lucide-react';
import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import NewsImage from '@/components/NewsImage';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SITE_URL = 'https://tendersaarthi.com';
const SITE_NAME = 'TenderSaarthi';

const getBadgeStyle = (cat: string) => {
    const c = (cat || '').toLowerCase();
    if (c.includes('news')) return 'bg-[#2b507f] text-white';
    if (c.includes('article')) return 'bg-[#f48a3d] text-white';
    if (c.includes('press')) return 'bg-[#b8312f] text-white';
    return 'bg-primary text-white';
};

const readingTime = (text: string) => Math.max(1, Math.round((text?.split(' ').length || 0) / 200));

// Fetch by slug, fall back to ID for backward compatibility
async function getNewsItem(slug: string) {
    let { data } = await supabase.from('news').select('*').eq('slug', slug).single();
    if (!data) {
        // Fallback: try by UUID id (for any old links)
        const res = await supabase.from('news').select('*').eq('id', slug).single();
        data = res.data;
    }
    return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const data = await getNewsItem(slug);
    if (!data) return { title: 'News Not Found | TenderSaarthi' };

    const description = (data.content?.substring(0, 160).trim() || '') + '...';
    const canonicalUrl = `${SITE_URL}/news/${data.slug || data.id}`;
    const imageUrl = data.image_url || `${SITE_URL}/og-image.png`;

    return {
        title: `${data.title} | TenderSaarthi News`,
        description,
        keywords: `${data.category}, government tender news, India tender update, infrastructure news, TenderSaarthi`,
        alternates: { canonical: canonicalUrl },
        openGraph: {
            type: 'article',
            title: data.title,
            description,
            url: canonicalUrl,
            siteName: SITE_NAME,
            publishedTime: data.created_at,
            modifiedTime: data.updated_at || data.created_at,
            section: data.category,
            images: [{ url: imageUrl, width: 1200, height: 630, alt: data.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title: data.title,
            description,
            images: [imageUrl],
            site: '@TenderSaarthi',
        },
        robots: {
            index: true,
            follow: true,
            googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
        },
    };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const item = await getNewsItem(slug);
    if (!item) notFound();

    const { data: related } = await supabase
        .from('news')
        .select('id, title, slug, category, image_url, created_at')
        .eq('category', item.category)
        .eq('is_active', true)
        .neq('id', item.id)
        .limit(3);

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

    const canonicalUrl = `${SITE_URL}/news/${item.slug || item.id}`;
    const description = (item.content?.substring(0, 160).trim() || '') + '...';
    const estReadTime = readingTime(item.content || '');

    const newsArticleSchema = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: item.title,
        description,
        image: [item.image_url],
        datePublished: item.created_at,
        dateModified: item.updated_at || item.created_at,
        author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
        publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
            logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
        articleSection: item.category,
        keywords: `government tender, ${item.category}, India, infrastructure, procurement`,
        inLanguage: 'en-IN',
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'News', item: `${SITE_URL}/news` },
            { '@type': 'ListItem', position: 3, name: item.title, item: canonicalUrl },
        ],
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

            <div className="min-h-screen bg-slate-50">
                {/* ── Cinematic Hero ── */}
                <div className="relative h-[55vh] min-h-[420px] w-full overflow-hidden bg-[#0B2C4A]">
                    <NewsImage src={item.image_url} alt={item.title} className="w-full h-full object-cover opacity-55" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B2C4A] via-[#0B2C4A]/40 to-black/20" />

                    <div className="absolute top-6 left-0 w-full">
                        <div className="container mx-auto px-4">
                            <Link href="/news" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all backdrop-blur-sm">
                                <ArrowLeft size={14} /> All News
                            </Link>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full pb-12">
                        <div className="container mx-auto px-4">
                            <div className="max-w-4xl">
                                <div className="flex flex-wrap items-center gap-3 mb-5">
                                    <span className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest shadow-lg ${getBadgeStyle(item.category)}`}>
                                        {item.category}
                                    </span>
                                    <time dateTime={item.created_at} className="flex items-center gap-1.5 text-white/60">
                                        <Calendar size={12} />
                                        <span className="text-[11px] font-bold uppercase tracking-wider">{formatDate(item.created_at)}</span>
                                    </time>
                                    <span className="flex items-center gap-1.5 text-white/40">
                                        <Clock size={12} />
                                        <span className="text-[11px] font-bold">{estReadTime} min read</span>
                                    </span>
                                </div>
                                <h1 className="text-2xl md:text-4xl lg:text-[2.8rem] font-black text-white leading-tight tracking-tight max-w-3xl">
                                    {item.title}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 max-w-6xl mx-auto">

                        <article itemScope itemType="https://schema.org/NewsArticle">
                            <meta itemProp="headline" content={item.title} />
                            <meta itemProp="datePublished" content={item.created_at} />
                            <meta itemProp="dateModified" content={item.updated_at || item.created_at} />
                            <meta itemProp="image" content={item.image_url} />
                            <meta itemProp="author" content={SITE_NAME} />

                            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12">
                                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
                                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                                    <span>/</span>
                                    <Link href="/news" className="hover:text-primary transition-colors">News</Link>
                                    <span>/</span>
                                    <span className="text-slate-600 line-clamp-1 max-w-[200px]">{item.title}</span>
                                </nav>

                                <div className="border-l-4 border-primary pl-6 mb-8 bg-primary/5 py-4 pr-4 rounded-r-xl">
                                    <p className="text-base font-bold text-slate-700 leading-relaxed italic" itemProp="description">
                                        {description}
                                    </p>
                                </div>

                                <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-[1.9]" itemProp="articleBody">
                                    {item.content?.split('\n').map((para: string, i: number) => (
                                        para.trim() ? <p key={i} className="mb-5 text-[15px]">{para}</p> : null
                                    ))}
                                </div>

                                <div className="mt-10 pt-8 border-t border-slate-100 flex flex-wrap items-center gap-3">
                                    <Tag size={14} className="text-slate-400" />
                                    {['Government Tender', 'India', 'Infrastructure', item.category].map((tag: string) => (
                                        <span key={tag} className="px-3 py-1 bg-slate-100 hover:bg-primary/10 hover:text-primary text-slate-500 text-[10px] font-black rounded-full uppercase tracking-wider transition-colors cursor-default">
                                            #{tag.replace(/ /g, '')}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-8">
                                    <Link href="/news" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary font-bold text-sm transition-colors">
                                        <ArrowLeft size={16} /> All Stories
                                    </Link>
                                </div>

                                <div className="mt-8 pt-8 border-t border-slate-100 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center font-black text-primary text-lg">T</div>
                                    <address className="not-italic">
                                        <p className="text-sm font-black text-slate-800">TenderSaarthi Editorial</p>
                                        <p className="text-xs text-slate-400 font-medium">India's #1 Tender Intelligence Platform</p>
                                        <time className="text-[10px] text-slate-400 font-bold uppercase tracking-wider" dateTime={item.created_at}>
                                            Published: {formatDate(item.created_at)}
                                        </time>
                                    </address>
                                </div>
                            </div>
                        </article>

                        <aside className="space-y-6" aria-label="Sidebar">
                            <div className="bg-[#0B2C4A] text-white rounded-3xl p-8 relative overflow-hidden">
                                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-yellow-400/20 rounded-2xl flex items-center justify-center mb-5">
                                        <BookOpen className="text-yellow-400" size={24} />
                                    </div>
                                    <h2 className="text-lg font-black mb-2">Find Related Tenders</h2>
                                    <p className="text-blue-200/70 text-sm mb-6 leading-relaxed">Browse thousands of active tenders related to this topic across India.</p>
                                    <Link href="/active-tenders" className="block w-full text-center bg-yellow-400 text-[#0B2C4A] font-black py-3 rounded-xl text-sm uppercase tracking-widest hover:bg-yellow-300 transition-colors">
                                        Browse Tenders →
                                    </Link>
                                </div>
                            </div>

                            {related && related.length > 0 && (
                                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="h-1 w-6 bg-primary rounded-full" />
                                        <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Related Stories</h2>
                                    </div>
                                    <nav aria-label="Related articles">
                                        <div className="space-y-5">
                                            {related.map((r: any) => (
                                                <Link key={r.id} href={`/news/${r.slug || r.id}`} className="group flex gap-4 items-start">
                                                    <div className="w-20 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                                                        <NewsImage src={r.image_url} alt={r.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest mb-1 ${getBadgeStyle(r.category)}`}>{r.category}</span>
                                                        <h3 className="text-xs font-bold text-slate-700 line-clamp-2 group-hover:text-primary transition-colors leading-snug">{r.title}</h3>
                                                        <time dateTime={r.created_at} className="text-[9px] text-slate-400 font-bold mt-1 block">{formatDate(r.created_at)}</time>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </nav>
                                </div>
                            )}

                            <div className="bg-green-50 border border-green-200 rounded-3xl p-6 text-center">
                                <p className="text-sm font-black text-green-800 mb-3">Get Instant Tender Alerts on WhatsApp</p>
                                <Link href="/whatsapp-alerts" className="inline-block bg-green-600 text-white font-black px-6 py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-green-700 transition-colors">
                                    📲 Subscribe Free
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}
