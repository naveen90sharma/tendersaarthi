export interface Tender {
    id: number;
    slug: string;
    title: string;
    authority?: string;
    location?: string;
    tender_id?: string;
    reference_no?: string;
    tender_value?: string;
    emd_amount?: string;
    tender_fee?: string;
    tender_type?: string;
    tender_category?: string;
    description?: string;
    published_date?: string;
    bid_submission_end?: string;
    bid_opening_date?: string;
    period_of_work?: string;
    bid_validity?: string;
    official_link?: string;
    organisation_chain?: string;
    state?: string;
    status?: string;
    summary?: string;
    // UI compatibility fields
    date?: string;
    value?: string;
    referenceNo?: string;
    category?: string;
    tenderFee?: string;
}
