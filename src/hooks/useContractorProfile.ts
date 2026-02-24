'use client';

import { useContractor } from '@/context/ContractorContext';

/**
 * Legacy wrapper for useContractor context.
 * Use useContractor() directly in new components.
 */
export function useContractorProfile() {
    const { user, profile, loading, refreshProfile, checkEligibility } = useContractor();
    return { user, profile, loading, refreshProfile, checkEligibility };
}
