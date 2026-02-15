
import { MetadataRoute } from 'next';
import { supabase } from '@/services/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://tendersaarthi.in';

    // 1. Fetch all tenders slugs
    const { data: tenders } = await supabase
        .from('tenders')
        .select('slug, created_at')
        .order('created_at', { ascending: false })
        .limit(1000); // Google limit per sitemap is 50k, but we keep it reasonable for now

    // 2. Fetch all state slugs
    const { data: states } = await supabase
        .from('states')
        .select('slug');

    // 3. Fetch all category slugs
    const { data: categories } = await supabase
        .from('tender_categories')
        .select('slug');

    // 4. Fetch all authority slugs
    const { data: authorities } = await supabase
        .from('authorities')
        .select('slug');

    const tenderEntries: MetadataRoute.Sitemap = (tenders || []).map((t) => ({
        url: `${baseUrl}/tenders/${t.slug}`,
        lastModified: t.created_at,
        changeFrequency: 'daily',
        priority: 0.8,
    }));

    const stateEntries: MetadataRoute.Sitemap = (states || []).map((s) => ({
        url: `${baseUrl}/tenders/state/${s.slug}`,
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    const categoryEntries: MetadataRoute.Sitemap = (categories || []).map((c) => ({
        url: `${baseUrl}/tenders/category/${c.slug}`,
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    const authorityEntries: MetadataRoute.Sitemap = (authorities || []).map((a) => ({
        url: `${baseUrl}/tenders/authority/${a.slug}`,
        changeFrequency: 'weekly',
        priority: 0.6,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'always',
            priority: 1,
        },
        {
            url: `${baseUrl}/active-tenders`,
            changeFrequency: 'always',
            priority: 0.9,
        },
        ...tenderEntries,
        ...stateEntries,
        ...categoryEntries,
        ...authorityEntries,
    ];
}
