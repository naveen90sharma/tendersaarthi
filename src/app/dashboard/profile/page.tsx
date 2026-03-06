'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    User,
    Briefcase,
    Building2,
    Wallet,
    LineChart,
    Plus,
    Save,
    CheckCircle2,
    Trophy,
    History,
    Loader2,
    ShieldCheck,
    MapPin,
    Tags
} from 'lucide-react';
import { getCurrentUser } from '@/services/auth';
import { dashboardService } from '@/services/dashboardService';

const getCurrentFinancialYearStart = () => {
    const today = new Date();
    const currentMonth = today.getMonth(); // 0 = Jan, 2 = Mar, 3 = Apr
    const currentYear = today.getFullYear();
    // If before April, current FY started last year. Thus last completed FY started 2 years ago.
    // If April or later, current FY started this year. Thus last completed FY started 1 year ago.
    return currentMonth < 3 ? currentYear - 2 : currentYear - 1;
};

const getFYLabel = (offset: number) => {
    const baseYear = getCurrentFinancialYearStart() - offset;
    return `FY ${baseYear.toString().slice(-2)}-${(baseYear + 1).toString().slice(-2)}`;
};

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form states
    const [firmName, setFirmName] = useState('');
    const [regClass, setRegClass] = useState('Class A (Unlimited)');
    const [turnoverFY1, setTurnoverFY1] = useState(''); // FY 23-24
    const [turnoverFY2, setTurnoverFY2] = useState(''); // FY 22-23
    const [turnoverFY3, setTurnoverFY3] = useState(''); // FY 21-22
    const [turnoverFY4, setTurnoverFY4] = useState(''); // FY 20-21
    const [turnoverFY5, setTurnoverFY5] = useState(''); // FY 19-20
    const [netWorth, setNetWorth] = useState('');
    const [highestProject, setHighestProject] = useState('');

    // New Eligibility Form States
    const [isMsme, setIsMsme] = useState(false);
    const [isStartup, setIsStartup] = useState(false);
    const [isoCertified, setIsoCertified] = useState(false);
    const [businessCategory, setBusinessCategory] = useState('');
    const [preferredStates, setPreferredStates] = useState('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const { user } = await getCurrentUser();
            if (user) {
                setUser(user);
                const result = await dashboardService.getProfile(user.id);
                if (result.success && result.data) {
                    setProfile(result.data);
                    setProjects(result.data.contractor_projects || []);
                    setFirmName(result.data.firm_name || '');
                    setRegClass(result.data.registration_class || 'Class A (Unlimited)');
                    setTurnoverFY1(result.data.turnover_fy_1?.toString() || '');
                    setTurnoverFY2(result.data.turnover_fy_2?.toString() || '');
                    setTurnoverFY3(result.data.turnover_fy_3?.toString() || '');
                    setTurnoverFY4(result.data.turnover_fy_4?.toString() || '');
                    setTurnoverFY5(result.data.turnover_fy_5?.toString() || '');
                    setNetWorth(result.data.net_worth?.toString() || '');
                    setHighestProject(result.data.highest_project_value?.toString() || '');

                    setIsMsme(result.data.is_msme || false);
                    setIsStartup(result.data.is_startup || false);
                    setIsoCertified(result.data.iso_certified || false);
                    setBusinessCategory(result.data.business_category || '');
                    setPreferredStates((result.data.preferred_states || []).join(', '));
                }
            }
            setLoading(false);
        };
        load();
    }, []);

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        const result = await dashboardService.updateProfile(user.id, {
            firm_name: firmName,
            registration_class: regClass,
            turnover_fy_1: parseFloat(turnoverFY1) || 0,
            turnover_fy_2: parseFloat(turnoverFY2) || 0,
            turnover_fy_3: parseFloat(turnoverFY3) || 0,
            turnover_fy_4: parseFloat(turnoverFY4) || 0,
            turnover_fy_5: parseFloat(turnoverFY5) || 0,
            net_worth: parseFloat(netWorth) || 0,
            highest_project_value: parseFloat(highestProject) || 0,
            is_msme: isMsme,
            is_startup: isStartup,
            iso_certified: isoCertified,
            business_category: businessCategory,
            preferred_states: preferredStates.split(',').map(s => s.trim()).filter(Boolean),
        });
        if (result.success) {
            setProfile(result.data);
        }
        setIsSaving(false);
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#103e68]" size={40} />
            </div>
        );
    }

    const avgTurnover = ((parseFloat(turnoverFY1) || 0) + (parseFloat(turnoverFY2) || 0) + (parseFloat(turnoverFY3) || 0) + (parseFloat(turnoverFY4) || 0) + (parseFloat(turnoverFY5) || 0)) / 5;

    const financialMetrics = [
        { label: 'Avg Annual Turnover (5 Yrs)', value: `₹ ${avgTurnover.toLocaleString('en-IN', { maximumFractionDigits: 2 })} Cr`, icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Net Worth', value: `₹ ${parseFloat(netWorth || '0').toLocaleString('en-IN')} Cr`, icon: LineChart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Highest Project Value', value: `₹ ${parseFloat(highestProject || '0').toLocaleString('en-IN')} Cr`, icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-[#103e68]/10 rounded-xl text-[#103e68]">
                            <User size={24} />
                        </div>
                        Capability Profile
                    </h1>
                    <p className="text-slate-500 font-medium mt-2">Define your capabilities for real-time eligibility matching.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-[#103e68] text-white rounded-2xl font-black text-sm shadow-xl shadow-[#103e68]/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {isSaving ? 'Saving Changes...' : 'Save Capability Profile'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: General Info & Business Category */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                        <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                            <Building2 className="text-[#103e68]" size={20} />
                            Organization Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Firm Name</label>
                                <input
                                    type="text"
                                    value={firmName}
                                    onChange={(e) => setFirmName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-[#103e68]/20 outline-none transition-all"
                                    placeholder="e.g. Sharma Construction"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Class of Registration</label>
                                <select
                                    value={regClass}
                                    onChange={(e) => setRegClass(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-[#103e68]/20 outline-none transition-all"
                                >
                                    <option>Class A (Unlimited)</option>
                                    <option>Class B (Up to 25Cr)</option>
                                    <option>Class C (Up to 5Cr)</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 bg-slate-50 border border-slate-100 rounded-2xl p-6">
                                <label className="text-xs font-black text-[#103e68] uppercase tracking-widest pl-1 mb-4 block flex items-center gap-2">
                                    <Wallet size={16} /> Annual Turnover History (Last 5 Yrs)
                                </label>
                                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400">{getFYLabel(0)}</label>
                                        <input
                                            type="number"
                                            value={turnoverFY1}
                                            onChange={(e) => setTurnoverFY1(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:ring-2 focus:ring-[#103e68]/20 outline-none transition-all placeholder:text-slate-300"
                                            placeholder="15.5"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400">{getFYLabel(1)}</label>
                                        <input
                                            type="number"
                                            value={turnoverFY2}
                                            onChange={(e) => setTurnoverFY2(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:ring-2 focus:ring-[#103e68]/20 outline-none transition-all placeholder:text-slate-300"
                                            placeholder="12.0"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400">{getFYLabel(2)}</label>
                                        <input
                                            type="number"
                                            value={turnoverFY3}
                                            onChange={(e) => setTurnoverFY3(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:ring-2 focus:ring-[#103e68]/20 outline-none transition-all placeholder:text-slate-300"
                                            placeholder="10.2"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400">{getFYLabel(3)}</label>
                                        <input
                                            type="number"
                                            value={turnoverFY4}
                                            onChange={(e) => setTurnoverFY4(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:ring-2 focus:ring-[#103e68]/20 outline-none transition-all placeholder:text-slate-300"
                                            placeholder="8.5"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400">{getFYLabel(4)}</label>
                                        <input
                                            type="number"
                                            value={turnoverFY5}
                                            onChange={(e) => setTurnoverFY5(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:ring-2 focus:ring-[#103e68]/20 outline-none transition-all placeholder:text-slate-300"
                                            placeholder="6.0"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Net Worth (Cr)</label>
                                <input
                                    type="number"
                                    value={netWorth}
                                    onChange={(e) => setNetWorth(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-[#103e68]/20 outline-none transition-all"
                                    placeholder="4.2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Certifications and Exemptions */}
                    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                        <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                            <ShieldCheck className="text-[#103e68]" size={20} />
                            Certifications & Preferences (AI Matching Signals)
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${isMsme ? 'bg-[#103e68] border-[#103e68]' : 'bg-slate-50 border-slate-200 group-hover:border-[#103e68]/50'}`}>
                                        {isMsme && <CheckCircle2 size={16} className="text-white" />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={isMsme} onChange={(e) => setIsMsme(e.target.checked)} />
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">MSME / Udyam Registered</p>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">EMD & Turnover Exemption</p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${isStartup ? 'bg-[#103e68] border-[#103e68]' : 'bg-slate-50 border-slate-200 group-hover:border-[#103e68]/50'}`}>
                                        {isStartup && <CheckCircle2 size={16} className="text-white" />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={isStartup} onChange={(e) => setIsStartup(e.target.checked)} />
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Startup India Recognized</p>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Fee Exemptions Allowed</p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${isoCertified ? 'bg-[#103e68] border-[#103e68]' : 'bg-slate-50 border-slate-200 group-hover:border-[#103e68]/50'}`}>
                                        {isoCertified && <CheckCircle2 size={16} className="text-white" />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={isoCertified} onChange={(e) => setIsoCertified(e.target.checked)} />
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">ISO 9001 / Similar Certified</p>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Quality Assurance Validated</p>
                                    </div>
                                </label>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1">
                                        <Tags size={12} /> Primary Business Category
                                    </label>
                                    <input
                                        type="text"
                                        value={businessCategory}
                                        onChange={(e) => setBusinessCategory(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-[#103e68]/20 outline-none transition-all placeholder:font-medium placeholder:text-slate-400"
                                        placeholder="e.g. Civil Construction, IT Services, Manpower..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1">
                                        <MapPin size={12} /> Preferred Locations (States)
                                    </label>
                                    <input
                                        type="text"
                                        value={preferredStates}
                                        onChange={(e) => setPreferredStates(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-[#103e68]/20 outline-none transition-all placeholder:font-medium placeholder:text-slate-400"
                                        placeholder="e.g. Maharashtra, Delhi, Pan India"
                                    />
                                    <p className="text-[10px] text-slate-400 font-bold px-1">Separate multiples with commas</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Work Experience Builder */}
                    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                                <History className="text-[#103e68]" size={20} />
                                Past Performance History
                            </h3>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-[10px] font-black uppercase text-[#103e68] tracking-widest rounded-xl hover:bg-[#103e68] hover:text-white transition-all">
                                <Plus size={14} /> Add Project
                            </button>
                        </div>

                        <div className="space-y-4">
                            {projects.length === 0 ? (
                                <div className="py-12 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                                    <Briefcase size={40} className="mx-auto text-slate-200 mb-4" />
                                    <p className="text-slate-400 text-xs font-bold">No projects added yet.</p>
                                </div>
                            ) : (
                                projects.map((project, i) => (
                                    <div key={i} className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50/50 border border-transparent hover:border-slate-100 hover:bg-white transition-all group">
                                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-[#103e68] group-hover:scale-110 transition-transform">
                                            <Briefcase size={22} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-extrabold text-slate-800">{project.project_name}</h4>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{project.department} • {project.completion_year}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-[#103e68]">₹ {project.project_value} Cr</p>
                                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter bg-emerald-50 px-2 py-0.5 rounded">{project.status}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div >

                {/* Right: Key Capacity Signals */}
                < div className="space-y-8" >
                    {/* Metrics Dashboard */}
                    < div className="bg-gradient-to-br from-[#103e68] to-[#0a2742] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-[#103e68]/10" >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-tj-yellow/10 rounded-full blur-3xl pointer-events-none" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50 mb-8">Capacity Metrics</h3>

                        <div className="space-y-8 relative z-10">
                            {financialMetrics.map((m, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className={`p-2.5 rounded-xl ${m.bg} ${m.color} shadow-sm`}>
                                        <m.icon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">{m.label}</p>
                                        <p className="text-xl font-black text-white">{m.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div >

                    {/* Eligibility Score Card */}
                    < div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm" >
                        <div className="text-center">
                            <div className="relative inline-flex mb-4">
                                <svg className="w-32 h-32 transform -rotate-90">
                                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="364.4" strokeDashoffset={364.4 - (364.4 * 0.85)} className="text-green-500" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-3xl font-black text-slate-800">85%</span>
                                </div>
                            </div>
                            <h4 className="text-sm font-black text-slate-800 mb-2">Technical Strength Score</h4>
                            <p className="text-xs text-slate-400 font-bold px-4 leading-relaxed">
                                Our AI calculates this score based on your annual turnover and past project complexity.
                            </p>
                            <button className="mt-8 w-full py-4 bg-slate-50 text-[#103e68] border border-slate-200 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#103e68] hover:text-white transition-all shadow-sm">
                                View Detailed Breakdown
                            </button>
                        </div>
                    </div >
                </div >
            </div >
        </div >
    );
}
