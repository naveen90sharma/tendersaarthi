'use client';

import { useEffect, useState } from 'react';

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
    slug?: string;
    authority_name?: string;
}

export function useLatestTenders(limit = 5) {
    const [tenders, setTenders] = useState<Tender[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTenders() {
            try {
                const response = await fetch(`/api/tenders?limit=${limit}`);
                const data = await response.json();

                if (data.error) {
                    console.error('Error fetching latest tenders:', data.error);
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
