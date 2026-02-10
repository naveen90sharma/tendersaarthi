'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export interface Tender {
    id: number;
    title: string;
    authority: string;
    organisation_chain?: string;
    location: string;
    tender_value: string;
    value?: string;
    endDate?: string;
    bid_submission_end?: string;
    date?: string;
    referenceNo?: string;
    status: string;
    tenderFee?: string;
    category?: string;
    published_date?: string;
    bid_end_ts?: string;
}

export function useLatestTenders(limit = 5) {
    const [tenders, setTenders] = useState<Tender[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTenders() {
            try {
                const now = new Date().toISOString();
                const { data, error } = await supabase
                    .from('tenders')
                    .select('*')
                    .gt('bid_end_ts', now)
                    .order('created_at', { ascending: false })
                    .limit(limit);

                if (error) {
                    console.error('Error fetching latest tenders:', error);
                } else {
                    setTenders(data || []);
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchTenders();
    }, [limit]);

    return { tenders, loading };
}
