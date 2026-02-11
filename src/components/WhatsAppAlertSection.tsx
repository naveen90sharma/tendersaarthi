'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Bell, CheckCircle2, AlertCircle, Loader2, X, Phone } from 'lucide-react';
import { getWhatsAppPreference, updateWhatsAppPreference } from '@/services/whatsappService';
import { getCurrentUser } from '@/services/auth';
import { getFilterMetadata } from '@/services/tenderService';

export default function WhatsAppAlertSection() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [prefs, setPrefs] = useState({
        phone_number: '',
        categories: [] as string[],
        states: [] as string[],
        is_active: true
    });
    const [metadata, setMetadata] = useState<{ categories: string[], states: string[] }>({
        categories: [],
        states: []
    });
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [{ user }, metaRes] = await Promise.all([
                getCurrentUser(),
                getFilterMetadata()
            ]);

            if (user) {
                setUser(user);
                const prefRes = await getWhatsAppPreference(user.id);
                if (prefRes.success && prefRes.data) {
                    setPrefs({
                        phone_number: prefRes.data.phone_number || '',
                        categories: prefRes.data.categories || [],
                        states: prefRes.data.states || [],
                        is_active: prefRes.data.is_active ?? true
                    });
                }
            }

            if (metaRes.success && metaRes.data) {
                setMetadata({
                    categories: metaRes.data.categories,
                    states: metaRes.data.states
                });
            }
        } catch (error) {
            console.error('Error loading whatsapp data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        if (!prefs.phone_number || prefs.phone_number.length < 10) {
            alert('Please enter a valid phone number');
            return;
        }

        setSaving(true);
        const res = await updateWhatsAppPreference(user.id, prefs);
        if (res.success) {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } else {
            alert('Failed to update preferences: ' + res.error);
        }
        setSaving(false);
    };

    const toggleItem = (list: 'categories' | 'states', item: string) => {
        setPrefs(prev => ({
            ...prev,
            [list]: prev[list].includes(item)
                ? prev[list].filter(i => i !== item)
                : [...prev[list], item]
        }));
    };

    if (loading) return (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={32} />
        </div>
    );

    if (!user) return (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <MessageSquare className="mx-auto text-gray-200 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-800 mb-2 font-black uppercase tracking-tight">WhatsApp Alerts</h3>
            <p className="text-gray-500 mb-6 font-medium">Log in to receive tender alerts directly on your WhatsApp.</p>
        </div>
    );

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden font-sans">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] p-6 text-white relative">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                        <MessageSquare size={28} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight">WhatsApp Alerts</h3>
                        <p className="text-white/80 text-sm font-bold uppercase tracking-widest">Get Tenders directly in your inbox</p>
                    </div>
                </div>
                <div className="absolute top-4 right-4 animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                </div>
            </div>

            <div className="p-8 space-y-8">
                {/* Phone Number Input */}
                <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Phone size={14} className="text-[#25D366]" />
                        WhatsApp Number
                    </label>
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold border-r pr-3">+91</span>
                        <input
                            type="text"
                            placeholder="98765-43210"
                            value={prefs.phone_number}
                            onChange={(e) => setPrefs({ ...prefs, phone_number: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-4 pl-16 pr-4 outline-none focus:border-[#25D366] focus:bg-white transition-all font-black tracking-widest text-[#128C7E]"
                        />
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase italic">* We never spam. Only relevant tenders will be sent.</p>
                </div>

                {/* Categories */}
                <div className="space-y-4">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Bell size={14} className="text-primary" />
                        Preferred Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {metadata.categories.slice(0, 12).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => toggleItem('categories', cat)}
                                className={`px-4 py-2 rounded-full text-xs font-black transition-all border-2 uppercase tracking-tight ${prefs.categories.includes(cat)
                                    ? 'bg-primary text-white border-primary shadow-lg shadow-blue-100'
                                    : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* States */}
                <div className="space-y-4">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Bell size={14} className="text-primary" />
                        Target States
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {metadata.states.slice(0, 12).map((state) => (
                            <button
                                key={state}
                                onClick={() => toggleItem('states', state)}
                                className={`px-4 py-2 rounded-full text-xs font-black transition-all border-2 uppercase tracking-tight ${prefs.states.includes(state)
                                    ? 'bg-primary text-white border-primary shadow-lg shadow-blue-100'
                                    : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                                    }`}
                            >
                                {state}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Footer */}
                <div className="pt-6 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setPrefs({ ...prefs, is_active: !prefs.is_active })}
                            className={`w-12 h-6 rounded-full transition-colors relative ${prefs.is_active ? 'bg-[#25D366]' : 'bg-gray-200'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${prefs.is_active ? 'left-7' : 'left-1'}`} />
                        </button>
                        <span className="text-sm font-black text-gray-700 uppercase tracking-tight">
                            {prefs.is_active ? 'ALERTS ACTIVE' : 'ALERTS DISABLED'}
                        </span>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full md:w-auto bg-[#128C7E] text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:brightness-110 shadow-xl shadow-green-100 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        {saving ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : showSuccess ? (
                            <>
                                <CheckCircle2 size={20} />
                                UPDATED!
                            </>
                        ) : (
                            'SAVE PREFERENCES'
                        )}
                    </button>
                </div>

                {showSuccess && (
                    <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                        <CheckCircle2 size={20} />
                        <span className="text-sm font-bold uppercase tracking-tight">Your WhatsApp alert settings have been saved successfully!</span>
                    </div>
                )
                }
            </div>
        </div>
    );
}
