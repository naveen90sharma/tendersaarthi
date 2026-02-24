'use client';

import { useState, useEffect } from 'react';
import {
    Bell,
    MessageSquare,
    Smartphone,
    ShieldCheck,
    Clock,
    Filter,
    Save,
    CheckCircle2,
    Zap,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { getCurrentUser } from '@/services/auth';
import { dashboardService } from '@/services/dashboardService';

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('notifications');

    // WhatsApp Form State
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(['new_tenders', 'deadline', 'correction']);

    const [alertCategories, setAlertCategories] = useState([
        { id: 'new_tenders', label: 'New Tender Alerts', desc: 'When a tender matching your criteria is published' },
        { id: 'deadline', label: 'Deadline Reminders', desc: '48 hours before the bid submission ends' },
        { id: 'correction', label: 'Corrigendum Updates', desc: 'When any changes are made to a saved tender' },
    ]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const { user } = await getCurrentUser();
            if (user) {
                setUser(user);
                const result = await dashboardService.getWhatsAppSettings(user.id);
                if (result.success && result.data) {
                    setPhoneNumber(result.data.phone_number || '');
                    setIsActive(result.data.is_active ?? true);
                    setSelectedCategories(result.data.categories || ['new_tenders', 'deadline', 'correction']);
                }
            }
            setLoading(false);
        };
        load();
    }, []);

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        await dashboardService.updateWhatsAppSettings(user.id, {
            phone_number: phoneNumber,
            is_active: isActive,
            categories: selectedCategories
        });
        setIsSaving(false);
    };

    const toggleCategory = (id: string) => {
        setSelectedCategories(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Account Settings</h1>
                    <p className="text-slate-500 font-medium">Manage your preferences and smart notification signals.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {isSaving ? 'Updating...' : 'Sync Preferences'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Preferences Menu */}
                <div className="space-y-3">
                    {[
                        { id: 'notifications', label: 'Smart Alerts', icon: Bell },
                        { id: 'security', label: 'Privacy & Security', icon: ShieldCheck },
                        { id: 'billing', label: 'Subscription Plan', icon: Zap },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100 shadow-sm'}`}
                        >
                            <item.icon size={20} />
                            <span className="text-sm">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Right: Detailed Settings Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* WhatsApp Gateway Section */}
                    <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800">WhatsApp Dispatch Center</h3>
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">Recommended for instant updates</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                                            <Smartphone size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">WhatsApp Number</label>
                                            <input
                                                type="text"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                placeholder="+91 9876543210"
                                                className="block w-full bg-transparent border-none outline-none text-lg font-black text-slate-800 tracking-tight p-0"
                                            />
                                        </div>
                                    </div>
                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-colors ${isActive ? 'text-emerald-500 bg-emerald-50 border-emerald-100' : 'text-slate-400 bg-slate-50 border-slate-100'}`}>
                                        <CheckCircle2 size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{isActive ? 'Active' : 'Paused'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                                <AlertCircle className="text-blue-600 mt-0.5" size={18} />
                                <p className="text-[11px] text-blue-700 font-bold leading-relaxed">
                                    Note: We only send 1 daily summary for new tenders and 1 critical alert for deadlines to keep your inbox clutter-free.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Notification Toggles */}
                    <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
                        <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2">
                            <Filter className="text-primary" size={20} />
                            Alert Subscriptions
                        </h3>

                        <div className="space-y-4">
                            {alertCategories.map((cat) => (
                                <div key={cat.id} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50/30 border border-slate-100/50 hover:bg-slate-50 transition-colors">
                                    <div className="flex-1 pr-4">
                                        <h4 className="text-sm font-black text-slate-800">{cat.label}</h4>
                                        <p className="text-xs text-slate-400 font-medium mt-0.5">{cat.desc}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(cat.id)}
                                            onChange={() => toggleCategory(cat.id)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Auto-Refresh Settings */}
                    <div className="bg-[#0a2742] rounded-[32px] p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-50" />
                        <div className="flex items-center gap-4 mb-6">
                            <Clock className="text-tj-yellow" size={24} />
                            <h3 className="text-lg font-black italic tracking-tight leading-none">Intelligence Auto-Sync</h3>
                        </div>
                        <p className="text-slate-400 text-sm font-medium mb-8 max-w-sm leading-relaxed">
                            Automatically update your Capability Profile using your latest GST returns and financial statements via API.
                        </p>
                        <button className="flex items-center gap-2 text-[10px] font-black uppercase text-tj-yellow tracking-[0.2em] hover:translate-x-1 transition-transform">
                            Enable Auto-Sync <Zap size={14} className="fill-current" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
