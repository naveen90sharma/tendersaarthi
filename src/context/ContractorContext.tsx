'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '@/services/auth';
import { dashboardService } from '@/services/dashboardService';

interface ContractorContextType {
    user: any;
    profile: any;
    loading: boolean;
    refreshProfile: () => Promise<void>;
    checkEligibility: (tenderValue: string | number | undefined, tenderCategory?: string) => { eligible: string; score: number };
}

const ContractorContext = createContext<ContractorContextType | undefined>(undefined);

export function ContractorProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const refreshProfile = async () => {
        const { user: currentUser } = await getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            const result = await dashboardService.getProfile(currentUser.id);
            if (result.success) {
                setProfile(result.data);
            }
        }
    };

    useEffect(() => {
        refreshProfile().finally(() => setLoading(false));
    }, []);

    const checkEligibility = (tenderValue: string | number | undefined, tenderCategory?: string) => {
        if (!profile) return { eligible: 'Profile Missing', score: 0 };

        // 1. Value Normalization to Rupees
        let tenderValRupees = 0;
        const numeric = typeof tenderValue === 'string' ? parseFloat(tenderValue.replace(/[^0-9.]/g, '')) || 0 : tenderValue || 0;

        const stringVal = tenderValue?.toString().toLowerCase() || '';
        if (stringVal.includes('cr')) tenderValRupees = numeric * 10000000;
        else if (stringVal.includes('lakh')) tenderValRupees = numeric * 100000;
        else if (numeric < 1000) tenderValRupees = numeric * 100000; // Assume Lakhs if small number
        else tenderValRupees = numeric;

        // Ensure comparisons are made against Rupee values
        const maxExperience = profile.contractor_projects?.reduce((max: number, p: any) => Math.max(max, p.value || 0), 0) || 0;
        const turnover = profile.turnover || 0;

        let score = 0;

        // Experience Score (Up to 40 points) - Compare Rupees to Rupees
        if (maxExperience >= tenderValRupees * 0.7) score += 40;
        else if (maxExperience >= tenderValRupees * 0.4) score += 25;
        else if (maxExperience >= tenderValRupees * 0.1) score += 10;

        // Turnover Score (Up to 40 points)
        if (turnover >= tenderValRupees * 3) score += 40;
        else if (turnover >= tenderValRupees * 1) score += 25;
        else if (turnover >= tenderValRupees * 0.3) score += 10;

        // Category Match (Up to 20 points)
        if (tenderCategory && profile.main_category) {
            const tenderCatLower = tenderCategory.toLowerCase();
            const profileCatLower = profile.main_category.toLowerCase();

            if (tenderCatLower.includes(profileCatLower) || profileCatLower.includes(tenderCatLower)) {
                score += 20;
            } else if (profile.other_categories?.some((c: string) => tenderCatLower.includes(c.toLowerCase()))) {
                score += 10;
            }
        } else if (profile.main_category) {
            score += 10; // Neutral if tender category unknown
        }

        let status = 'Not Recommended';
        if (score > 70) status = 'Highly Eligible';
        else if (score > 40) status = 'Moderate Match';
        else if (score > 20) status = 'Low Match';

        return { eligible: status, score };
    };

    return (
        <ContractorContext.Provider value={{ user, profile, loading, refreshProfile, checkEligibility }}>
            {children}
        </ContractorContext.Provider>
    );
}

export function useContractor() {
    const context = useContext(ContractorContext);
    if (context === undefined) {
        throw new Error('useContractor must be used within a ContractorProvider');
    }
    return context;
}
