
import { supabase } from '@/services/supabase';
import { redirect } from 'next/navigation';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function TenderRedirectPage({ params }: Props) {
    const { id } = await params;

    const { data: tender } = await supabase
        .from('tenders')
        .select('slug')
        .eq('id', id)
        .single();

    if (tender?.slug) {
        redirect(`/tenders/${tender.slug}`);
    }

    // Fallback if not found or no slug
    redirect('/active-tenders');
}
