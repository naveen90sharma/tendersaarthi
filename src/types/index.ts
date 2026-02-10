export interface Tender {
    id: number;
    title: string;
    authority: string;
    location: string;
    // UI specific fields
    date: string;       // Mapped from bid_submission_end
    value: string;      // Mapped from tender_value
    referenceNo: string; // Mapped from reference_no
    tenderFee?: string; // New
    category?: string;  // New
    // Raw fields from DB (optional)
    organisation_chain?: string;
    tender_value?: string;
    bid_submission_end?: string;
    reference_no?: string;
    status?: string;
}
