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
    Loader2
} from 'lucide-react';
import { getCurrentUser } from '@/services/auth';
import { dashboardService } from '@/services/dashboardService';

export default function ProfilePage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to dashboard as this feature is currently hidden
        router.push('/dashboard');
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="animate-spin text-primary" size={32} />
        </div>
    );
}

// Original code commented out to allow easy restoration later
// export function ProfilePageContent() {
//     const [profile, setProfile] = useState<any>(null);
//     const [projects, setProjects] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [isSaving, setIsSaving] = useState(false);
//
//     // Form states
//     const [firmName, setFirmName] = useState('');
//     const [regClass, setRegClass] = useState('Class A (Unlimited)');
//     const [turnover, setTurnover] = useState('');
//     const [netWorth, setNetWorth] = useState('');
//     const [highestProject, setHighestProject] = useState('');
//
//     useEffect(() => {
//         const load = async () => {
//             setLoading(true);
//             const { user } = await getCurrentUser();
//             if (user) {
//                 setUser(user);
//                 const result = await dashboardService.getProfile(user.id);
//                 if (result.success && result.data) {
//                     setProfile(result.data);
//                     setProjects(result.data.contractor_projects || []);
//                     setFirmName(result.data.firm_name || '');
//                     setRegClass(result.data.registration_class || 'Class A (Unlimited)');
//                     setTurnover(result.data.turnover_fy_current?.toString() || '');
//                     setNetWorth(result.data.net_worth?.toString() || '');
//                     setHighestProject(result.data.highest_project_value?.toString() || '');
//                 }
//             }
//             setLoading(false);
//         };
//         load();
//     }, []);
//
//     const handleSave = async () => {
//         if (!user) return;
//         setIsSaving(true);
//         const result = await dashboardService.updateProfile(user.id, {
//             firm_name: firmName,
//             registration_class: regClass,
//             turnover_fy_current: parseFloat(turnover) || 0,
//             net_worth: parseFloat(netWorth) || 0,
//             highest_project_value: parseFloat(highestProject) || 0,
//         });
//         if (result.success) {
//             setProfile(result.data);
//         }
//         setIsSaving(false);
//     };
//
//     if (loading) {
//         return (
//             <div className="h-[60vh] flex items-center justify-center">
//                 <Loader2 className="animate-spin text-primary" size={40} />
//             </div>
//         );
//     }
//
//     const financialMetrics = [
//         { label: 'FY 2024-25 Turnover', value: `₹ ${parseFloat(turnover || '0').toLocaleString('en-IN')} Cr`, icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
//         { label: 'Net Worth', value: `₹ ${parseFloat(netWorth || '0').toLocaleString('en-IN')} Cr`, icon: LineChart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
//         { label: 'Highest Project Value', value: `₹ ${parseFloat(highestProject || '0').toLocaleString('en-IN')} Cr`, icon: Trophy, color: 'text-tj-yellow', bg: 'bg-yellow-50' },
//     ];
//
//     return (
//         <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
//             {/* Header -- fixed comment nested issue */}
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                 <div>
//                     <h1 className="text-3xl font-black text-slate-800 tracking-tight">Contractor Intelligence Profile</h1>
//                     <p className="text-slate-500 font-medium">Define your capabilities for real-time eligibility matching.</p>
//                 </div>
//                 <button
//                     onClick={handleSave}
//                     disabled={isSaving}
//                     className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50"
//                 >
//                     {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
//                     {isSaving ? 'Saving Changes...' : 'Save Capability Profile'}
//                 </button>
//             </div>
//
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 {/* Left: General Info & Business Category */}
//                 <div className="lg:col-span-2 space-y-8">
//                     {/* Basic Info */}
//                     <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
//                         <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
//                             <Building2 className="text-primary" size={20} />
//                             Organization Details
//                         </h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div className="space-y-2">
//                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Firm Name</label>
//                                 <input
//                                     type="text"
//                                     value={firmName}
//                                     onChange={(e) => setFirmName(e.target.value)}
//                                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
//                                     placeholder="e.g. Sharma Construction Pvt Ltd"
//                                 />
//                             </div>
//                             <div className="space-y-2">
//                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Class of Registration</label>
//                                 <select
//                                     value={regClass}
//                                     onChange={(e) => setRegClass(e.target.value)}
//                                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
//                                 >
//                                     <option>Class A (Unlimited)</option>
//                                     <option>Class B (Up to 25Cr)</option>
//                                     <option>Class C (Up to 5Cr)</option>
//                                 </select>
//                             </div>
//                             <div className="space-y-2">
//                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Annual Turnover (Cr)</label>
//                                 <input
//                                     type="number"
//                                     value={turnover}
//                                     onChange={(e) => setTurnover(e.target.value)}
//                                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
//                                     placeholder="12.5"
//                                 />
//                             </div>
//                             <div className="space-y-2">
//                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Net Worth (Cr)</label>
//                                 <input
//                                     type="number"
//                                     value={netWorth}
//                                     onChange={(e) => setNetWorth(e.target.value)}
//                                     className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
//                                     placeholder="4.2"
//                                 />
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Work Experience Builder */}
//                     <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
//                         <div className="flex items-center justify-between mb-8">
//                             <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
//                                 <History className="text-primary" size={20} />
//                                 Past Performance History
//                             </h3>
//                             <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-[10px] font-black uppercase text-primary tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all">
//                                 <Plus size={14} /> Add Project
//                             </button>
//                         </div>
//
//                         <div className="space-y-4">
//                             {projects.length === 0 ? (
//                                 <div className="py-12 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
//                                     <Briefcase size={40} className="mx-auto text-slate-200 mb-4" />
//                                     <p className="text-slate-400 text-xs font-bold">No projects added yet.</p>
//                                 </div>
//                             ) : (
//                                 projects.map((project, i) => (
//                                     <div key={i} className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50/50 border border-transparent hover:border-slate-100 hover:bg-white transition-all group">
//                                         <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
//                                             <Briefcase size={22} />
//                                         </div>
//                                         <div className="flex-1">
//                                             <h4 className="text-sm font-extrabold text-slate-800">{project.project_name}</h4>
//                                             <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{project.department} • {project.completion_year}</p>
//                                         </div>
//                                         <div className="text-right">
//                                             <p className="text-sm font-black text-[#103e68]">₹ {project.project_value} Cr</p>
//                                             <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter bg-emerald-50 px-2 py-0.5 rounded">{project.status}</span>
//                                         </div>
//                                     </div>
//                                 ))
//                             )}
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* Right: Key Capacity Signals */}
//                 <div className="space-y-8">
//                     {/* Metrics Dashboard */}
//                     <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
//                         <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
//                         <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 mb-8">Capacity Metrics</h3>
//
//                         <div className="space-y-8">
//                             {financialMetrics.map((m, i) => (
//                                 <div key={i} className="flex items-start gap-4">
//                                     <div className={`p-2.5 rounded-xl ${m.bg} ${m.color}`}>
//                                         <m.icon size={20} />
//                                     </div>
//                                     <div>
//                                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{m.label}</p>
//                                         <p className="text-xl font-black">{m.value}</p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//
//                     {/* Eligibility Score Card */}
//                     <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
//                         <div className="text-center">
//                             <div className="relative inline-flex mb-4">
//                                 <svg className="w-32 h-32 transform -rotate-90">
//                                     <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
//                                     <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="364.4" strokeDashoffset={364.4 - (364.4 * 0.85)} className="text-primary" />
//                                 </svg>
//                                 <div className="absolute inset-0 flex items-center justify-center">
//                                     <span className="text-3xl font-black text-slate-800">85%</span>
//                                 </div>
//                             </div>
//                             <h4 className="text-sm font-black text-slate-800 mb-2">Technical Strength Score</h4>
//                             <p className="text-xs text-slate-400 font-bold px-4 leading-relaxed">
//                                 Our AI calculates this based on your turnover and past project complexity.
//                             </p>
//                             <button className="mt-8 w-full py-4 bg-primary/5 text-primary rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all">
//                                 View Detailed Breakdown
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div >
//     );
// }
